[CmdletBinding()]
param(
  [string]$ProjectPath = ''
)

$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

if ([string]::IsNullOrWhiteSpace($ProjectPath)) {
  $ProjectPath = Join-Path $PSScriptRoot '..\..\..\cidadania-canal-denuncias'
}

function Get-CommandStatus {
  param([Parameter(Mandatory)][string]$Name)
  $commandInfo = Get-Command $Name -ErrorAction SilentlyContinue
  [ordered]@{
    name = $Name
    available = $null -ne $commandInfo
    source = if ($commandInfo) { $commandInfo.Source } else { $null }
  }
}

try {
  $resolvedProject = (Resolve-Path -LiteralPath $ProjectPath).Path
} catch {
  [ordered]@{
    ready = $false
    blocked = @('project_path_not_found')
    project = $ProjectPath
    error = $_.Exception.Message
  } | ConvertTo-Json -Depth 6
  exit 2
}

$rootPackagePath = Join-Path $resolvedProject 'package.json'
$serverPackagePath = Join-Path $resolvedProject 'server\package.json'
$rootLockPath = Join-Path $resolvedProject 'package-lock.json'
$serverLockPath = Join-Path $resolvedProject 'server\package-lock.json'
$agentPath = Join-Path $resolvedProject 'AGENTS.md'
$envTemplatePath = Join-Path $resolvedProject 'server\env.template'
$envPath = Join-Path $resolvedProject 'server\.env'

$blockedItems = [System.Collections.Generic.List[string]]::new()
$warningItems = [System.Collections.Generic.List[string]]::new()

foreach ($requiredPath in @($rootPackagePath, $serverPackagePath, $rootLockPath, $serverLockPath, $agentPath)) {
  if (-not (Test-Path -LiteralPath $requiredPath -PathType Leaf)) {
    $blockedItems.Add(('missing:' + $requiredPath))
  }
}

$toolStatus = @('git', 'node', 'npm', 'npx', 'rg') | ForEach-Object {
  Get-CommandStatus -Name $_
}

foreach ($tool in $toolStatus) {
  if (-not $tool.available) {
    $blockedItems.Add(('tool_missing:' + $tool.name))
  }
}

$rootPackage = if (Test-Path -LiteralPath $rootPackagePath) {
  Get-Content -Raw -LiteralPath $rootPackagePath | ConvertFrom-Json
} else { $null }
$serverPackage = if (Test-Path -LiteralPath $serverPackagePath) {
  Get-Content -Raw -LiteralPath $serverPackagePath | ConvertFrom-Json
} else { $null }

$gitStatus = $null
$branch = $null
$hasOrigin = $false
if ((Get-Command git -ErrorAction SilentlyContinue) -and (Test-Path -LiteralPath (Join-Path $resolvedProject '.git'))) {
  $gitStatus = @(& git -C $resolvedProject status --short 2>&1)
  $branch = (& git -C $resolvedProject branch --show-current 2>$null)
  $hasOrigin = $null -ne (& git -C $resolvedProject config --get remote.origin.url 2>$null)
} else {
  $warningItems.Add('project_git_metadata_not_found_or_git_unavailable')
}

$nodeVersion = if (Get-Command node -ErrorAction SilentlyContinue) { (& node --version) } else { $null }
$npmVersion = if (Get-Command npm -ErrorAction SilentlyContinue) { (& npm --version) } else { $null }

$nodeVersionParsed = if ($nodeVersion -and $nodeVersion -match 'v?(\d+)\.(\d+)\.(\d+)') {
  [version]::new([int]$Matches[1], [int]$Matches[2], [int]$Matches[3])
} else { $null }
$npmVersionParsed = if ($npmVersion -and $npmVersion -match '(\d+)\.(\d+)\.(\d+)') {
  [version]::new([int]$Matches[1], [int]$Matches[2], [int]$Matches[3])
} else { $null }

# Regras específicas dos engines atualmente versionados neste projeto.
$nodeEngineCompatible = $nodeVersionParsed -and (
  ($nodeVersionParsed.Major -eq 24 -and $nodeVersionParsed -ge [version]'24.15.0') -or
  $nodeVersionParsed.Major -ge 26
)
$npmEngineCompatible = $npmVersionParsed -and $npmVersionParsed -ge [version]'11.11.0'

if (-not $nodeEngineCompatible) {
  $blockedItems.Add('runtime_mismatch:node_engine')
}
if (-not $npmEngineCompatible) {
  $blockedItems.Add('runtime_mismatch:npm_engine')
}
if ($rootPackage -and $rootPackage.packageManager -and $npmVersion) {
  $declaredNpm = [string]$rootPackage.packageManager
  if ($declaredNpm -ne ('npm@' + $npmVersion)) {
    $warningItems.Add('package_manager_version_differs_from_manifest')
  }
}

$result = [ordered]@{
  generated_at = (Get-Date).ToString('o')
  mode = 'read_only'
  ready = $blockedItems.Count -eq 0
  blocked = @($blockedItems)
  warnings = @($warningItems)
  project = $resolvedProject
  git = [ordered]@{
    branch = $branch
    has_origin = $hasOrigin
    dirty_entries = if ($gitStatus) { $gitStatus.Count } else { 0 }
    details_omitted = $true
  }
  runtime = [ordered]@{
    node_observed = $nodeVersion
    npm_observed = $npmVersion
    node_required = if ($rootPackage) { $rootPackage.engines.node } else { $null }
    npm_required = if ($rootPackage) { $rootPackage.engines.npm } else { $null }
    package_manager = if ($rootPackage) { $rootPackage.packageManager } else { $null }
    node_engine_compatible = [bool]$nodeEngineCompatible
    npm_engine_compatible = [bool]$npmEngineCompatible
  }
  manifests = [ordered]@{
    frontend_package = Test-Path -LiteralPath $rootPackagePath
    frontend_lock = Test-Path -LiteralPath $rootLockPath
    backend_package = Test-Path -LiteralPath $serverPackagePath
    backend_lock = Test-Path -LiteralPath $serverLockPath
    frontend_scripts = if ($rootPackage) { @($rootPackage.scripts.PSObject.Properties.Name) } else { @() }
    backend_scripts = if ($serverPackage) { @($serverPackage.scripts.PSObject.Properties.Name) } else { @() }
  }
  configuration = [ordered]@{
    env_template_present = Test-Path -LiteralPath $envTemplatePath
    local_env_present = Test-Path -LiteralPath $envPath
    secret_values_read = $false
  }
  tools = $toolStatus
  tests_executed = $false
  human_actions = @(
    'review_git_changes',
    'confirm_source_and_acceptance',
    'confirm_required_services_and_owners',
    'authorize_installation_network_live_or_mutating_actions'
  )
  limitations = @(
    'Does not install dependencies or run tests.',
    'Does not authenticate or health-check Redis, ClamAV, MPT API, browsers, MCPs or production.',
    'Does not read or print environment variable values.',
    'A ready result is not product acceptance.'
  )
}

$result | ConvertTo-Json -Depth 8
if ($blockedItems.Count -gt 0) { exit 2 }
exit 0
