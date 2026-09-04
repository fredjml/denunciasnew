[CmdletBinding()]
param(
  [string]$KitPath = ''
)

$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

if ([string]::IsNullOrWhiteSpace($KitPath)) {
  $KitPath = Join-Path $PSScriptRoot '..'
}

try {
  $resolvedKit = (Resolve-Path -LiteralPath $KitPath).Path
} catch {
  Write-Error ('Kit não encontrado: ' + $KitPath)
  exit 2
}

$requiredFiles = @(
  'README.md',
  '00-mapa-origens-baseline-drift.md',
  '01-analise-inicial.md',
  '02-engenharia-reversa-requisitos.md',
  '06-gates-qa-testes-seguranca.md',
  '07-preflight.md',
  '08-evidencias-estados-rastreabilidade.md',
  'backend\README.md',
  'frontend\README.md',
  'contrato\README.md',
  'templates\rastreabilidade.md',
  'skill\denuncias-quality-review\SKILL.md'
)

$errors = [System.Collections.Generic.List[string]]::new()
$warnings = [System.Collections.Generic.List[string]]::new()

foreach ($relativePath in $requiredFiles) {
  if (-not (Test-Path -LiteralPath (Join-Path $resolvedKit $relativePath) -PathType Leaf)) {
    $errors.Add(('missing_required:' + $relativePath))
  }
}

$allFiles = @(Get-ChildItem -LiteralPath $resolvedKit -Recurse -File)
foreach ($file in $allFiles) {
  if ($file.Length -eq 0) {
    $errors.Add(('empty:' + $file.FullName.Substring($resolvedKit.Length + 1)))
  }
}

$markdownFiles = @($allFiles | Where-Object Extension -eq '.md')
foreach ($file in $markdownFiles) {
  $content = Get-Content -Raw -LiteralPath $file.FullName
  foreach ($match in [regex]::Matches($content, '\[[^\]]+\]\(([^)]+)\)')) {
    $target = $match.Groups[1].Value.Split('#')[0]
    if ($target -and $target -notmatch '^(https?://|mailto:)') {
      $candidate = Join-Path $file.DirectoryName ([uri]::UnescapeDataString($target))
      if (-not (Test-Path -LiteralPath $candidate)) {
        $relativeFile = $file.FullName.Substring($resolvedKit.Length + 1)
        $errors.Add(('broken_link:' + $relativeFile + '->' + $target))
      }
    }
  }
  if ($content -match '(?im)^\s*(TODO|TBD|PLACEHOLDER)\s*$') {
    $warnings.Add(('unfinished_marker:' + $file.FullName.Substring($resolvedKit.Length + 1)))
  }
}

$skillPath = Join-Path $resolvedKit 'skill\denuncias-quality-review\SKILL.md'
if (Test-Path -LiteralPath $skillPath) {
  $skillContent = Get-Content -Raw -LiteralPath $skillPath
  if ($skillContent -notmatch '(?s)^---\s*\r?\nname: denuncias-quality-review\r?\ndescription: .+?\r?\n---') {
    $errors.Add('skill_frontmatter_invalid')
  }
}

[ordered]@{
  valid = $errors.Count -eq 0
  root = $resolvedKit
  files = $allFiles.Count
  markdown = $markdownFiles.Count
  errors = @($errors)
  warnings = @($warnings)
  limitations = @(
    'External links are not fetched.',
    'This check does not validate technical truth, Markdown rendering or skill behavior.',
    'Use the official skill validator separately when available.'
  )
} | ConvertTo-Json -Depth 6

if ($errors.Count -gt 0) { exit 2 }
exit 0

