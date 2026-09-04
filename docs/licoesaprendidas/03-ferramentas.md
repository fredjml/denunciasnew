# Ferramentas e preparação do ambiente

Instale somente o que o requisito e o plano de testes exigem. Disponível não significa autenticado; instalado não significa autorizado; scanner aprovado não significa ausência de risco.

## Stack confirmada pelos manifests em 26/08/2026

| Camada | Componentes principais |
| --- | --- |
| Frontend | Angular 22.0.5, TypeScript 6.0.2, RxJS 7.8, Bootstrap 5.3 |
| Backend | Node.js, CommonJS, Express 4.22, Axios, Multer, Helmet, Redis |
| Qualidade | ESLint 10, Vitest 4, Angular test |
| E2E/a11y | Playwright 1.61, axe-core 4.12, Chromium/Firefox/WebKit |
| Contrato | Swagger JSDoc, swagger-jsdoc/UI, Redocly CLI |
| Segurança operacional | ClamAV TCP INSTREAM, Redis rate-limit, npm audit |
| Runtime declarado | Node ^24.15 ou >=26; Volta Node 26.7 e npm 11.19 |

Confirme no package.json atual e na tabela oficial de compatibilidade Angular antes de instalar.

## Runtime e budgets observados nas Analises

Baseline declarado em 24/07/2026 (`RELATORIO_TESTES_DENUNCIAS.md`) e 21/07/2026 (`RELATORIO_FINAL_SANITIZACAO_CODEBASE_DENUNCIAS.md`):

- CI/local: **Node 22.22.3, npm 11.11.0** via Volta 2.0.2.
- Bundle Angular inicial bruto: **601,09 kB → 384,38 kB** após substituir Bootstrap completo por módulos Sass. Transferência estimada: **85,26 kB**.
- Budgets alvo: 500 kB bruto / 120 kB transferido.
- `npm audit --omit=dev`: 0 vulnerabilidades em 99 deps de produção (frontend) e 150 deps (backend). Alertas moderados restantes afetam apenas dev tools.
- Volumetria (SLOC) medida em 31/07/2026: 4.917 SLOC em 67 arquivos (`RELATORIO_ANALISE_QA_CLEANCODE_SECURITY_REGRESSAO.md` §2.4).

Existe diferença entre o runtime declarado no CI (Node 22.22.3) e o exigido pelo `package.json` atual (`^24.15` ou `>=26`). Trate como drift aberto (`D-07` em [00-mapa-origens-baseline-drift.md](00-mapa-origens-baseline-drift.md)); reexecute o pre-flight antes de citar qualquer versão.

## P0 — obrigatórias para análise e desenvolvimento

| Ferramenta | Finalidade | Validação | Instalação/limite |
| --- | --- | --- | --- |
| Git | estado, diff, histórico, rollback | git --version; status; branch; remote | pacote corporativo; não publicar sem autorização |
| Node/npm | runtime e lockfiles | node --version; npm --version | usar engines/Volta; frontend e server têm lockfiles separados |
| ripgrep | inventário e busca | rg --version | não varrer/imprimir secrets |
| Editor + TS/ESLint | análise estática local | extensão ativa + npm run lint | editor aprovado |
| Browsers Playwright | UI multi-engine | npx playwright --version | npx playwright install pode exigir rede/proxy |

Para reprodutibilidade use npm ci. npm install é apropriado apenas quando a tarefa inclui mudar dependências/lockfile.

## Já presentes no projeto

- ESLint para TS, HTML e JS;
- Vitest/Angular test para unidade e integração;
- Supertest para perímetro e endpoints;
- Playwright para UI com API interceptada nos specs atuais;
- axe para baseline automatizada parcial;
- Redocly para OpenAPI;
- npm audit para advisories do grafo npm.

Importante: o webServer do Playwright inicia apenas o Angular e os testes interceptam POST /api/denuncias. O E2E atual não comprova BFF, Redis, ClamAV nem API MPT live.

## P1/P2 — adotar somente após decisão

| Categoria | Opções | Gate e limite |
| --- | --- | --- |
| SAST | CodeQL ou Semgrep | ruleset, licença, baseline e triagem antes de bloquear CI |
| Segredos | Gitleaks | achado exige validação e rotação; limpar histórico é ação destrutiva |
| DAST | OWASP ZAP | somente alvo autorizado, ambiente isolado e dados sintéticos |
| Carga | k6 | limite, janela, observação e autorização do owner |
| Performance | Lighthouse | sinal de laboratório, não SLO real |
| Supply chain | Dependabot/Renovate, CycloneDX, assinatura/proveniência | PRs pequenos, owner e política de atualização |
| Container/infra | Docker, scanners de imagem/IaC | somente se deployment usar esses artefatos |
| Observabilidade | métricas/logs/traces aprovados | proibir conteúdo da denúncia e definir retenção |

## Ferramentas de desenvolvimento com IA

Codex, Copilot ou equivalente podem auxiliar inventário, testes, revisão e documentação. Antes:

- fornecedor e plano aprovados;
- política de retenção e uso para treinamento conhecida;
- repositório e dados classificados;
- nenhuma PII, denúncia, anexo, segredo ou log bruto enviado;
- escopo de arquivos, comandos e ações externas explícito;
- saída revisada e validada por ferramenta determinística.

## Instalação reproduzível

~~~powershell
npm --prefix cidadania-canal-denuncias ci
npm --prefix cidadania-canal-denuncias/server ci
npx --prefix cidadania-canal-denuncias playwright install
~~~

Downloads, instalações globais e privilégios administrativos exigem autorização. Não rode todos os comandos automaticamente em máquina com mudanças locais ou cache que precise ser preservado.

## Registro obrigatório

Use templates/tools.md: ferramenta, finalidade, owner, versão requerida/observada, comando de health check, licença, dados acessados, telemetria, permissão, status, fallback e decisão.

## Limitações

npm audit não encontra lógica insegura, configuração cloud ou zero-day. SAST/DAST/secret scanning produzem falso positivo e negativo. Node Permission Model é cinto de segurança para código confiável, não sandbox contra código malicioso.
