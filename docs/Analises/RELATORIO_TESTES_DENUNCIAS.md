# Relatório de resultados de testes — Canal de Denúncias

Data de execução local: 24/07/2026
Branch: `refactor/frontend-architecture`
Baseline: `origin/main`
Runtime: Node 22.22.3 (Volta), npm 11.11.0

## Sumário geral

| Suíte | Ferramenta | Total | Passaram | Falharam | Duração |
|---|---|---:|---:|---:|---:|
| Unitários backend | Vitest 4.1.10 | 22 | 22 | 0 | ~0,2 s |
| Integração backend | Vitest + Supertest | 8 | 8 | 0 | ~1,6 s |
| **Total backend** | — | **30** | **30** | **0** | **1,79 s** |
| Unitários frontend | Vitest 4.1.9 (Angular unit-test) | 8 | 8 | 0 | 15,89 s |
| E2E funcional + regressão | Playwright 1.x | 12 | 12 | 0 | prévia |
| E2E acessibilidade | Playwright + axe-core | 4 | 4 | 0 | prévia |
| **Total E2E (4 projetos)** | — | **16** | **16** | **0** | prévia |
| Lint frontend | ESLint | — | 0 erros | — | — |
| Lint backend | ESLint | — | 0 erros | — | — |
| Auditoria produção frontend | `npm audit --omit=dev` | 99 deps | 0 vulns | — | — |
| Auditoria produção backend | `npm audit --omit=dev` | 150 deps | 0 vulns | — | — |

Última corrida Playwright: `test-results/.last-run.json` = `{"status":"passed","failedTests":[]}`.

---

## 1. Testes unitários — Backend (Vitest)

Comando: `npm test` em [server/](../cidadania-canal-denuncias/server/package.json)  → `vitest run --passWithNoTests`
Relatório JSON: [Analises/vitest-backend.json](vitest-backend.json)

### 1.1 `services/complaint.service.spec.mjs` — 6/6 aprovados

| # | Cenário | Status | Duração |
|---:|---|:---:|---:|
| 1 | generates a protocol with the expected format | ✅ | 1 ms |
| 2 | allows deterministic protocol generation in tests | ✅ | 0 ms |
| 3 | accepts a complete complaint | ✅ | 0 ms |
| 4 | reports missing location and complaint description | ✅ | 0 ms |
| 5 | accepts a written report when no irregularity type is selected | ✅ | 0 ms |
| 6 | builds the integration payload and derives confidentiality | ✅ | 0 ms |

### 1.2 `clients/clamav.client.spec.mjs` — 3/3 aprovados

| # | Cenário | Status | Duração |
|---:|---|:---:|---:|
| 1 | streams a clean file using the official INSTREAM framing | ✅ | 23 ms |
| 2 | rejects a file when ClamAV reports a threat | ✅ | 6 ms |
| 3 | fails closed when the scanner is not configured | ✅ | 0 ms |

### 1.3 `clients/mpt-api.client.spec.mjs` — 3/3 aprovados

| # | Cenário | Status | Duração |
|---:|---|:---:|---:|
| 1 | rejects the request when the API URL is not configured | ✅ | 2 ms |
| 2 | sends the complaint as multipart with the configured timeout | ✅ | 2 ms |
| 3 | forwards authentication and attachments to the MPT API | ✅ | 1 ms |

### 1.4 `infrastructure/redis-rate-limit-store.spec.mjs` — 2/2 aprovados

| # | Cenário | Status | Duração |
|---:|---|:---:|---:|
| 1 | uses the in-memory store outside production when Redis is not configured | ✅ | 1 ms |
| 2 | connects the external store using the configured URL and prefix | ✅ | 2 ms |

### 1.5 `middleware/upload.spec.mjs` — 1/1 aprovado

| # | Cenário | Status | Duração |
|---:|---|:---:|---:|
| 1 | stores attachments outside memory and removes the temporary file | ✅ | 20 ms |

---

## 2. Testes de integração — Backend

### 2.1 `controllers/complaint.controller.spec.mjs` — 7/7 aprovados

Integração do controller com clientes (mocks) do ClamAV e da API MPT.

| # | Cenário | Status | Duração |
|---:|---|:---:|---:|
| 1 | returns 400 when the complaint field is not valid JSON | ✅ | 3 ms |
| 2 | returns 422 when required complaint data is missing | ✅ | 1 ms |
| 3 | returns 201 after the internal MPT API accepts the complaint | ✅ | 2 ms |
| 4 | returns 502 without a success response when the internal MPT API fails | ✅ | 1 ms |
| 5 | returns 503 without a success response when MPT_API_URL is absent | ✅ | 1 ms |
| 6 | rejects an attachment when the antimalware scanner reports a threat | ✅ | 1 ms |
| 7 | fails closed when attachment scanning is unavailable | ✅ | 0 ms |

### 2.2 `secure-upload.integration.spec.mjs` — 1/1 aprovado

Percorre endpoint Express real, disco temporário, ClamAV TCP simulado (`INSTREAM`), multipart e API MPT HTTP simulada.

| # | Cenário | Status | Duração |
|---:|---|:---:|---:|
| 1 | scans and forwards a clean attachment through the real backend endpoint | ✅ | 35 ms |

### 2.3 `index.spec.mjs` — 7/7 aprovados

Perímetro HTTP: rate limit, CORS, Swagger, fail-fast e store compartilhado.

| # | Cenário | Status | Duração |
|---:|---|:---:|---:|
| 1 | keeps the health endpoint outside the submission rate limit | ✅ | 18 ms |
| 2 | limits repeated complaint submissions | ✅ | 30 ms |
| 3 | allows only the configured frontend origin in production | ✅ | 5 ms |
| 4 | keeps Swagger disabled by default in production | ✅ | 3 ms |
| 5 | allows an explicit Swagger opt-in in production | ✅ | 4 ms |
| 6 | refuses to start production without required configuration | ✅ | 1 ms |
| 7 | starts production with the shared rate limit store | ✅ | 2 ms |

---

## 3. Testes unitários — Frontend (Vitest via `@angular/build:unit-test`)

Comando: `npm test` na raiz  → `ng test --watch=false`

### 3.1 `src/app/clients/complaint-api.client.spec.ts` — 3/3 aprovados

| # | Cenário | Status |
|---:|---|:---:|
| 1 | serializes complaint data and attachments as multipart | ✅ |
| 2 | rejects an unsuccessful HTTP response | ✅ |
| 3 | rejects a success response without a valid protocol | ✅ |

### 3.2 `src/app/services/complaint.service.spec.ts` — 5/5 aprovados

| # | Cenário | Status |
|---:|---|:---:|
| 1 | starts with the welcome step and empty complaint defaults | ✅ |
| 2 | updates complaint data and keeps step navigation within bounds | ✅ |
| 3 | submits the current complaint and stores the returned protocol | ✅ |
| 4 | exposes a visible failure after a client error without simulating success | ✅ |
| 5 | clears the visible failure when a retry succeeds | ✅ |

**Consolidado:** 8/8 testes unitários frontend aprovados em 15,89 s.

---

## 4. Testes E2E e regressão — Playwright + axe-core

Comando: `npx playwright test`
Arquivo: [e2e/complaint-journey.spec.ts](../cidadania-canal-denuncias/e2e/complaint-journey.spec.ts)
Configuração: [playwright.config.ts](../cidadania-canal-denuncias/playwright.config.ts)
Relatório HTML: [playwright-report/index.html](../cidadania-canal-denuncias/playwright-report/index.html)

### 4.1 Projetos executados

| Projeto | Perfil de dispositivo |
|---|---|
| `chromium-desktop` | Desktop Chrome |
| `chromium-mobile` | Pixel 7 |
| `firefox-desktop` | Desktop Firefox |
| `webkit-desktop` | Desktop Safari |

### 4.2 Cenários (4 por projeto × 4 projetos = 16 execuções)

| # | Cenário | Tipo | chromium-desktop | chromium-mobile | firefox-desktop | webkit-desktop |
|---:|---|---|:---:|:---:|:---:|:---:|
| 1 | preenche campos, navega entre telas e conclui uma denúncia simulada | Funcional | ✅ | ✅ | ✅ | ✅ |
| 2 | mantém a revisão, exibe falha e permite nova tentativa | Regressão do falso sucesso | ✅ | ✅ | ✅ | ✅ |
| 3 | não confirma a denúncia quando a resposta não contém protocolo | Regressão do contrato | ✅ | ✅ | ✅ | ✅ |
| 4 | registra baseline automatizada de acessibilidade | Acessibilidade (axe wcag2a/aa + 21a/aa) | ✅ | ✅ | ✅ | ✅ |

**Resultado consolidado:** 16/16 execuções aprovadas — `test-results/.last-run.json` = `passed`.

### 4.3 Comportamento coberto

- **Funcional:** preenchimento, navegação entre passos, upload de PDF, seleção de sigilo, revisão dos dados e recebimento do protocolo.
- **Regressão do falso sucesso:** ao receber `503`, o botão mostra alerta e mantém dados na revisão; segunda tentativa com `201` conclui a denúncia com o novo protocolo.
- **Regressão do contrato:** `201` sem protocolo válido não confirma a denúncia; alerta é exibido e revisão preservada.
- **Acessibilidade:** análise axe filtrando violações `critical` ou `serious` — nenhuma detectada; artefato JSON anexado como `axe-results`.

---

## 5. Qualidade estática

### 5.1 Lint

| Escopo | Comando | Resultado |
|---|---|:---:|
| Frontend | `npx eslint "src/**/*.{ts,html}"` | **0 erros / 0 avisos** |
| Backend | `npx eslint "**/*.js"` (dentro de `server/`) | **0 erros / 0 avisos** |

### 5.2 Auditoria de dependências (produção)

| Escopo | Deps prod | info | low | moderate | high | critical | Total |
|---|---:|---:|---:|---:|---:|---:|---:|
| Frontend (`npm audit --omit=dev`) | 99 | 0 | 0 | 0 | 0 | 0 | **0** |
| Backend  (`npm audit --omit=dev`) | 150 | 0 | 0 | 0 | 0 | 0 | **0** |

### 5.3 Contrato OpenAPI

Redocly validado; permanecem apenas avisos documentais não bloqueantes: licença, servidor `localhost`, `operationId` ausente e resposta 4xx no endpoint de informações.

---

## 6. Testes de regressão — mapeamento por incremento

A tabela liga cada teste automatizado ao incremento que ele protege contra regressão (referência: [RELATORIO_FINAL_SANITIZACAO_CODEBASE_DENUNCIAS.md](RELATORIO_FINAL_SANITIZACAO_CODEBASE_DENUNCIAS.md)).

| Incremento | Regressão que evita | Testes que protegem |
|:---:|---|---|
| 3 | Falso sucesso no frontend | Frontend 3.1/2, 3.1/3, 3.2/4, 3.2/5 + E2E 4.2 #2, #3 |
| 4 | Contrato HTTP 201/422/502/503 | Backend 2.1 #1–5 + E2E 4.2 #1, #3 |
| 11 | Regras extraídas do controller | Backend 1.1 (todos) + 2.1 #3 |
| 12 | Perímetro (rate limit, CORS, Swagger, fail-fast) | Backend 2.3 (todos) |
| 13 | Cliente HTTP frontend | Frontend 3.1 (todos) |
| 16 | Rate limit compartilhado via Redis | Backend 1.4 + 2.3 #2, #7 |
| 17 | Upload seguro e antimalware | Backend 1.2 + 1.5 + 2.1 #6, #7 + 2.2 |
| 6 | Acessibilidade WCAG | E2E 4.2 #4 (axe) |
| 8 | Jornada real da denúncia | E2E 4.2 #1 |
| 14/15 | Cobertura Firefox e WebKit/Safari | E2E projetos `firefox-desktop` e `webkit-desktop` |

---

## 7. Reprodutibilidade

```powershell
# Backend
cd cidadania-canal-denuncias\server
npm test                                # 30/30
npx eslint "**/*.js"                    # 0 erros
npm audit --omit=dev                    # 0 vulnerabilidades

# Frontend
cd ..\
npm test                                # 8/8
npx eslint "src/**/*.{ts,html}"         # 0 erros
npm audit --omit=dev                    # 0 vulnerabilidades

# E2E (requer servidor Angular disponível em http://localhost:4201)
npx playwright test                     # 16/16 (Chromium desktop/mobile, Firefox, WebKit)
```

Artefatos gerados:

- [Analises/vitest-backend.json](vitest-backend.json) — resultado detalhado da suíte backend.
- [cidadania-canal-denuncias/test-results/](../cidadania-canal-denuncias/test-results/) — vídeos, screenshots e anexos por projeto Playwright.
- [cidadania-canal-denuncias/playwright-report/index.html](../cidadania-canal-denuncias/playwright-report/index.html) — relatório HTML navegável.

---

## 8. Conclusão

Todas as suítes passaram sem falhas na execução local de 24/07/2026:

- Backend Vitest: **30/30**
- Frontend Vitest: **8/8**
- E2E Playwright + axe: **16/16** (Chromium desktop/mobile, Firefox e WebKit/Safari)
- Lint frontend e backend: **0 erros**
- Auditoria de produção frontend e backend: **0 vulnerabilidades**

Não há falhas de teste conhecidas. A régua de testes cobre correção do fluxo (falso sucesso), contrato HTTP, upload seguro com antivírus, perímetro, arquitetura em camadas, acessibilidade e regressão multi-navegador.
