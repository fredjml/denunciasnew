# Baseline factual do Denúncias — leitura das Analises

Este arquivo consolida o que os relatórios em [`Analises/`](../../Analises) documentaram sobre o `cidadania-canal-denuncias`. Não substitui o pre-flight nem transforma histórico em evidência atual: os dados abaixo são reexecutados a cada retomada.

## Precedência

1. Fonte primária atual (`cidadania-canal-denuncias/AGENTS.md`, `planejamento.md`, `spec_design.md`, código, testes, Swagger).
2. Relatórios em `Analises/*.md` — descrevem estados observados em janelas concretas.
3. Relatórios `.docx` — publicação derivada dos scripts `build_*_docx.py`; conteúdo canônico está nos `.md` de mesma origem. Não edite o `.docx` isoladamente.
4. Kit `docs/licoesaprendidas/` — controles e templates reutilizáveis; não é fonte de fato do projeto.

Antes de qualquer alegação, reabra a fonte primária (item 1) e valide contra o commit atual.

## Índice dos relatórios

| Relatório (`.md`) | Data | Escopo | Publicação `.docx` correspondente |
| --- | --- | --- | --- |
| [RELATORIO_FINAL_SANITIZACAO_CODEBASE_DENUNCIAS.md](../../Analises/RELATORIO_FINAL_SANITIZACAO_CODEBASE_DENUNCIAS.md) | 21/07/2026 | 17 incrementos de sanitização executados sem push | [RELATORIO_EXECUTIVO_FINAL_SANITIZACAO_CODEBASE_DENUNCIAS.docx](../../Analises/RELATORIO_EXECUTIVO_FINAL_SANITIZACAO_CODEBASE_DENUNCIAS.docx) via `build_executive_docx.py` |
| [RELATORIO_ARQUIVOS_ALTERADOS_DENUNCIAS.md](../../Analises/RELATORIO_ARQUIVOS_ALTERADOS_DENUNCIAS.md) | 24/07/2026 | 56 arquivos, +6.544 / −1.308 vs `origin/main`, ligados aos 17 incrementos | — |
| [RELATORIO_TESTES_DENUNCIAS.md](../../Analises/RELATORIO_TESTES_DENUNCIAS.md) | 24/07/2026 | 30/30 backend, 8/8 frontend, 16/16 E2E (Chromium desktop/mobile, Firefox, WebKit) | [RELATORIO_EXECUTIVO_TESTES_DIRETORIA.docx](../../Analises/RELATORIO_EXECUTIVO_TESTES_DIRETORIA.docx) via `build_tests_executive_docx.py` |
| [RELATORIO_DIAGNOSTICO_FRONTEND_PRODUCAO.md](../../Analises/RELATORIO_DIAGNOSTICO_FRONTEND_PRODUCAO.md) | 26/07/2026 | Prontidão para produção; P0/P1/P2 do frontend | [RELATORIO_EXECUTIVO_DIAGNOSTICO_FRONTEND_PRODUCAO.docx](../../Analises/RELATORIO_EXECUTIVO_DIAGNOSTICO_FRONTEND_PRODUCAO.docx) via `build_executive_diagnostico_producao_docx.py` |
| [RELATORIO_SUGESTOES_MELHORIAS_UI_UX_ACESSABILIDADE.md](../../Analises/RELATORIO_SUGESTOES_MELHORIAS_UI_UX_ACESSABILIDADE.md) | 26/07/2026 | Sugestões UX/UI e WCAG 2.1 AA | [RELATORIO_EXECUTIVO_MELHORIAS_UI_UX_ACESSABILIDADE.docx](../../Analises/RELATORIO_EXECUTIVO_MELHORIAS_UI_UX_ACESSABILIDADE.docx) via `build_executive_melhorias_ui_ux_docx.py` |
| [RELATORIO_ANALISE_QA_CLEANCODE_SECURITY_REGRESSAO.md](../../Analises/RELATORIO_ANALISE_QA_CLEANCODE_SECURITY_REGRESSAO.md) | 31/07/2026 | 47 achados P0–P3 em QA/Clean Code/Security/Regressão | [RELATORIO_EXECUTIVO_ANALISE_QA_CLEANCODE_SECURITY_REGRESSAO.docx](../../Analises/RELATORIO_EXECUTIVO_ANALISE_QA_CLEANCODE_SECURITY_REGRESSAO.docx) via `build_executive_analise_qa_cleancode_security_regressao_docx.py` |

Relatórios `.docx` sem `.md` associado (`RELATORIO_EXECUTIVO_DIRETORIA.docx`, `RELATORIO_REQUISITOS_DIRETORIA*.docx`, `RELATORIO_EXECUTIVO_REQUISITOS_DENUNCIAS_V2.docx`) são publicações executivas geradas por `build_executive_docx.py`, `build_requirements_executive_docx.py`, `build_requirements_executive_v2_docx.py` e `build_requirements_executive_v3_docx.py`. Revalide o conteúdo com a versão atual do repositório antes de citar números.

## Parâmetros de produção informados

Do relatório de sanitização (21/07/2026), parâmetros usados para dimensionar controles:

- volume: 100 denúncias/hora e 500 usuários simultâneos;
- upload: 100 uploads simultâneos, limite atual 20 MiB por arquivo, até 10 anexos;
- topologia: 3 réplicas do BFF, rate limit compartilhado em Redis;
- navegadores: Chromium desktop/mobile, Firefox, WebKit; Safari real obrigatório em homologação;
- antimalware: ClamAV externo obrigatório em produção, protocolo INSTREAM;
- logs: retenção sugerida de 10 dias, sem PII, anexo, token ou payload MPT;
- disponibilidade sugerida: 99,5%.

Estes parâmetros são premissas do trabalho, não SLA/SLO homologados. Devem virar requisitos com owner e critério verificável no `REQUIREMENTS.md` do projeto.

## Baseline técnica declarada

Do relatório de sanitização e do relatório de testes, valores relatados na janela 21–24/07/2026:

| Dimensão | Valor relatado | Fonte |
| --- | --- | --- |
| Backend Vitest | 30/30 aprovados, ~1,79 s | RELATORIO_TESTES §1–2 |
| Frontend Vitest | 8/8 aprovados, ~15,89 s | RELATORIO_TESTES §3 |
| E2E Playwright + axe | 16/16 execuções (4 projetos × 4 cenários) | RELATORIO_TESTES §4 |
| Bundle inicial bruto | 601,09 kB → 384,38 kB | RELATORIO_FINAL §10 |
| Transferência estimada | 85,26 kB | RELATORIO_FINAL §10 |
| `npm audit --omit=dev` frontend | 99 deps, 0 vulnerabilidades | RELATORIO_TESTES §5.2 |
| `npm audit --omit=dev` backend | 150 deps, 0 vulnerabilidades | RELATORIO_TESTES §5.2 |
| ESLint frontend/backend | 0 erros / 0 avisos | RELATORIO_TESTES §5.1 |
| Runtime declarado no CI | Node 22.22.3, npm 11.11.0 (Volta) | RELATORIO_TESTES cabeçalho |

Volumetria adicional (SLOC) registrada em 31/07/2026 pelo `RELATORIO_ANALISE_QA_CLEANCODE_SECURITY_REGRESSAO`:

| Linguagem/formato | Arquivos | Linhas | SLOC |
| --- | ---: | ---: | ---: |
| TypeScript (frontend/specs) | 20 | 1.450 | 1.245 |
| JavaScript/ESM (backend/specs) | 19 | 1.486 | 1.196 |
| CSS/SCSS | 11 | 1.860 | 1.477 |
| HTML | 10 | 782 | 697 |
| JSON | 7 | 302 | 302 |
| **Total** | **67** | **5.875** | **4.917** |

Todos os números pertencem à janela declarada. Reexecute antes de citar.

## Histórico de sanitização — 17 incrementos

Cada incremento tem justificativa e testes de regressão associados (ver `RELATORIO_ARQUIVOS_ALTERADOS_DENUNCIAS.md` §1–8 e `RELATORIO_TESTES_DENUNCIAS.md` §6).

| # | Incremento | Testes de regressão que protegem |
| ---: | --- | --- |
| 1 | planejamento brownfield e proteção do trabalho existente | — |
| 2 | toolchain reproduzível (Volta, Node 22.22.3, npm 11.11.0) | — |
| 3 | falhas visíveis no frontend (sem falso sucesso) | `complaint.service.spec.ts` #4/#5; `complaint-api.client.spec.ts`; E2E cenários 2 e 3 |
| 4 | contrato de sucesso backend (201/422/502/503) | `complaint.controller.spec.mjs` #1–5; E2E cenários 1 e 3 |
| 5 | qualidade estática e testes backend (ESLint + Vitest + Supertest + Redocly) | ESLint, `npm audit`, 30/30 backend |
| 6 | acessibilidade sem alterar UI/UX | E2E cenário 4 (axe) |
| 7 | privacidade, tipagem e padronização Angular (`inject()`) | ESLint + specs frontend |
| 8 | QA real de interface via Playwright | E2E cenários 1–4 |
| 9 | segurança de dependências (Axios 1.18.1, Morgan 1.11.0, overrides) | `npm audit --omit=dev` |
| 10 | bundle frontend proporcional (Bootstrap modular) | build output ≤ 500 kB bruto |
| 11 | modularidade backend (`complaint.service.js`, `mpt-api.client.js`) | `complaint.service.spec.mjs`; `mpt-api.client.spec.mjs` |
| 12 | perímetro backend (rate limit, CORS, Swagger, `trust proxy`, fail‑fast) | `index.spec.mjs` #1–7 |
| 13 | modularidade frontend (`complaint-api.client.ts`) | `complaint-api.client.spec.ts`; `complaint.service.spec.ts` |
| 14 | cobertura Firefox (12/12) | E2E project `firefox-desktop` |
| 15 | cobertura WebKit/Safari (16/16) | E2E project `webkit-desktop` |
| 16 | rate limit compartilhado via Redis | `redis-rate-limit-store.spec.mjs`; `index.spec.mjs` #2, #7 |
| 17 | upload seguro e antimalware (disco temporário, ClamAV INSTREAM, cleanup) | `upload.spec.mjs`; `clamav.client.spec.mjs`; `complaint.controller.spec.mjs` #6, #7; `secure-upload.integration.spec.mjs` |

## Achados abertos (leitura de 31/07/2026)

O RELATORIO_ANALISE_QA_CLEANCODE_SECURITY_REGRESSAO relatou **47 achados** ainda abertos após a sanitização. Os P0/P1 mais críticos que devem virar requisitos com aceite verificável antes de qualquer promoção a produção:

### P0 — bloqueadores

| ID | Camada | Achado | Referência |
| --- | --- | --- | --- |
| QA‑01 | Frontend | Wizard permite avançar sem preencher campos obrigatórios | §3.1 |
| QA‑02 / SEC‑01 | Frontend + BFF | Dados pessoais persistem no payload após trocar para "anônimo" — vazamento LGPD | §3.1 + §5.1 |
| QA‑03 | Frontend | Áudio `Blob` do relato é descartado pelo `JSON.stringify` e nunca vai ao BFF | §3.1 |
| SEC‑02 | BFF | Protocolo gerado com `Math.random()` (não criptográfico) | §5.1 |
| REG‑01 | CI/CD | E2E não roda no pipeline; regressão silenciosa | §6.1 |
| REG‑02 | E2E | `ui-audit.spec.ts` não falha em achados críticos | §6.1 |

### P1 — antes da produção

| ID | Camada | Achado | Referência |
| --- | --- | --- | --- |
| QA‑04 | Frontend | Sem persistência de rascunho (`sessionStorage`) — recarga apaga tudo | §3.2 |
| QA‑05 | Frontend | `fetch` sem `AbortController`/timeout — UI trava em rede lenta | §3.2 |
| QA‑06 | Frontend | Botão de acessibilidade, vídeo institucional e cards "Órgão"/"Ouvidoria" sem função | §3.2 |
| QA‑07 / SEC‑03 | Middleware | `upload.any()` aceita campos arbitrários — deveria ser `upload.array('arquivo', MAX)` | §3.2 + §5.2 |
| QA‑08 | Frontend | Stepper permite pular para qualquer etapa | §3.2 |
| SEC‑04 | Middleware | MIME verificado apenas por cabeçalho; sem magic bytes | §5.2 |
| SEC‑05 | Middleware | CSP não configurada explicitamente no Helmet | §5.2 |
| SEC‑06 | BFF | `mpt-api.client.js` lê `process.env` direto — quebra injeção de dependência | §5.2 |
| REG‑03 | E2E | Fluxo anônimo nunca é testado end‑to‑end | §6.2 |
| REG‑04 | Frontend | Zero testes unitários para componentes Angular | §6.2 |
| REG‑05 | E2E | axe roda apenas no Acolhimento, não nos steps | §6.2 |
| REG‑06 | CI/CD | Backend não executa `npm run test` no CI | §6.2 |

Os demais P2/P3 (validação de CNPJ com DV, formato de email/telefone, `<label>` para inputs, TCP/consentimento LGPD, `X-Request-ID`, sanitização de texto livre, CSS modularizado, `parsePositiveInteger` duplicado, deps não usadas, `express-validator` instalado sem uso, teste de arquivo oversized, teste de rede lenta) estão catalogados nas seções §3.3, §4, §5.3, §5.4 e §6.3–6.4 do relatório e devem ser priorizados no plano de ação (ver [14-metricas-plano-acao.md](14-metricas-plano-acao.md)).

## Pendências para produção (do RELATORIO_FINAL §"Pendências")

1. Provisionar Managed Redis (ou compatível) e testar `REDIS_URL` real com as 3 réplicas.
2. Provisionar ClamAV com assinaturas atualizadas em rede privada; ajustar `StreamMaxLength > 20 MiB`, `MaxThreads`, `MaxQueue` para a concorrência esperada.
3. Executar teste de carga em staging com 100 uploads simultâneos e arquivos representativos.
4. Homologar a API MPT real (timeout, indisponibilidade, idempotência).
5. Homologar as jornadas em Safari real (macOS e/ou iPhone).
6. Configurar plataforma de logs com retenção de 10 dias e mascaramento.
7. Definir hospedagem, certificados, DNS, secrets, health/readiness probes, monitoramento e alertas.
8. Homologação funcional pelos responsáveis pelo negócio e DPO.

## Como usar este baseline

- Ao abrir uma tarefa, cite este arquivo em `ANALYSIS.md` e reexecute os comandos que sustentam os números (`npm ci`, `npm run lint`, `npm test`, `npm run build`, `npm run e2e`, `npm audit --omit=dev` nos dois lockfiles).
- Ao registrar risco no [`threat-model`](templates/threat-model.md), referencie o achado por ID (`SEC-02`, `QA-03`, `REG-01`, etc.).
- Ao popular o [`REQUIREMENTS`](templates/requisitos.md), converta cada P0/P1 aberto em requisito com aceite Dado/Quando/Então e ligue à matriz de rastreabilidade.
- Ao concluir um lote, atualize o [`drift`](00-mapa-origens-baseline-drift.md) e o plano em [`14-metricas-plano-acao.md`](14-metricas-plano-acao.md).

## Limitações

- Datas dos relatórios são de 21–31/07/2026; o código pode ter mudado depois. Reexecute antes de citar números.
- Os `.docx` são derivados; edições diretas quebram reprodutibilidade dos `build_*.py`.
- Auditoria e testes descritos foram executados localmente sem push; nenhum indicador prova produção.
- Volumetria e SLOC excluem `node_modules`, `dist`, `test-results`, `playwright-report`; verifique o escopo antes de comparar.
- P0/P1 são achados no estado observado; alguns podem já ter sido corrigidos ou reclassificados após a leitura da fonte primária.
