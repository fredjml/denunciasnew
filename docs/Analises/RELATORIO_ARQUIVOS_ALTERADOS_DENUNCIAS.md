# Relatório de arquivos alterados — Canal de Denúncias

Data local: 24/07/2026
Branch: `refactor/frontend-architecture`
Baseline: `origin/main`
Total: **56 arquivos, +6.544 / −1.308 linhas**

Este relatório complementa o [RELATORIO_FINAL_SANITIZACAO_CODEBASE_DENUNCIAS.md](RELATORIO_FINAL_SANITIZACAO_CODEBASE_DENUNCIAS.md) detalhando arquivo por arquivo o que foi feito e a qual incremento da sanitização pertence.

---

## 1. Configuração, toolchain e CI

| Arquivo | Δ linhas | Melhoria | Incremento |
|---|---:|---|:---:|
| `.github/workflows/npm-audit.yml` | +2/−2 | Permissões mínimas de `GITHUB_TOKEN` e pin de actions por SHA. | pré-1 |
| `.gitignore` | +5 | Ignora `test-results/`, `playwright-report/` e temporários de upload. | 8, 17 |
| `.npmrc` | −23 | Removido: engine-strict com Node fixo, substituído pelo Volta. | 2 |
| `angular.json` | +2/−2 | Ajuste de assets/scripts para bootstrap Sass modular. | 10 |
| `package.json` / `package-lock.json` | +24 / +2.611−… | Axios/YAML/overrides seguros; Playwright, axe e ESLint adicionados. | 5, 8, 9 |
| `eslint.config.js` | +25 (novo) | Lint do frontend. | 5 |
| `playwright.config.ts` | +40 (novo) | Projetos Chromium desktop/mobile, Firefox, WebKit. | 8, 14, 15 |
| `docs/architecture/baseline.md` | +54 (novo) | Baseline arquitetural documentado. | — |

---

## 2. Backend — perímetro e integração

| Arquivo | Δ linhas | Melhoria | Incremento |
|---|---:|---|:---:|
| `server/index.js` | 254 alteradas | Rate limit só em `POST /api/denuncias`; CORS restrito a `FRONTEND_URL`; Swagger off em produção; `trust proxy` configurável; fail-fast em envs faltantes; store Redis compartilhado. | 12, 16 |
| `server/routes/complaint.routes.js` | +6 | Rota isolada, middleware de upload seguro plugado. | 12, 17 |
| `server/middleware/upload.js` | 46 alteradas | Troca `memoryStorage()` por disco temporário com nomes aleatórios e limpeza em erro. | 17 |
| `server/swagger.config.js` | +10/−… | Documentação alinhada aos status reais (201/422/502/503). | 4 |
| `server/env.template` | +24 | Documenta `REDIS_URL`, `CLAMAV_HOST`, `FRONTEND_URL`, etc. | 12, 16, 17 |
| `server/README.md` | +54 | Descreve contrato de sucesso, dependências externas e execução. | 4 |
| `server/eslint.config.js` | +20 (novo) | Lint do backend. | 5 |
| `server/package.json` / `server/package-lock.json` | +31 / +2.682−… | Vitest, Supertest, Redocly, `redis@6.1.0` e `rate-limit-redis@6.0.0` fixados. | 5, 9, 16 |

---

## 3. Backend — arquitetura em camadas

| Arquivo | Δ linhas | Melhoria | Incremento |
|---|---:|---|:---:|
| `server/controllers/complaint.controller.js` | 152 alteradas | Reduzido à coordenação HTTP; regra e integração extraídas. | 11 |
| `server/services/complaint.service.js` | +50 (novo) | Protocolo, montagem de payload e validação da denúncia. | 11 |
| `server/clients/mpt-api.client.js` | +52 (novo) | Cliente da API interna do MPT com multipart via stream. | 11, 17 |
| `server/clients/clamav.client.js` | +105 (novo) | Cliente ClamAV via `INSTREAM` TCP com timeout configurável. | 17 |
| `server/infrastructure/redis-rate-limit-store.js` | +57 (novo) | Store de rate limit compartilhado entre réplicas. | 16 |

---

## 4. Backend — testes automatizados

| Arquivo | Δ linhas | Cobertura | Incremento |
|---|---:|---|:---:|
| `server/controllers/complaint.controller.spec.mjs` | +180 (novo) | Sucesso, `502` da integração e `503` sem configuração. | 5, 11 |
| `server/services/complaint.service.spec.mjs` | +71 (novo) | Protocolo, payload e validação. | 5, 11 |
| `server/clients/mpt-api.client.spec.mjs` | +79 (novo) | Cliente HTTP com mock. | 5, 11 |
| `server/clients/clamav.client.spec.mjs` | +71 (novo) | Cliente TCP simulado. | 5, 17 |
| `server/middleware/upload.spec.mjs` | +31 (novo) | Limpeza de temporários e limites. | 5, 17 |
| `server/infrastructure/redis-rate-limit-store.spec.mjs` | +50 (novo) | Comportamento do store. | 5, 16 |
| `server/index.spec.mjs` | +107 (novo) | Perímetro: CORS, rate limit e Swagger off. | 5, 12 |
| `server/secure-upload.integration.spec.mjs` | +72 (novo) | Integração ponta a ponta: HTTP → disco → ClamAV → API MPT. | 5, 17 |

**Resultado consolidado: 30/30 testes backend aprovados.**

---

## 5. Frontend — arquitetura em camadas

| Arquivo | Δ linhas | Melhoria | Incremento |
|---|---:|---|:---:|
| `src/app/services/complaint.service.ts` | +43/−… | Vira fachada de estado e navegação; remove HTTP direto e protocolo fictício. | 3, 13 |
| `src/app/clients/complaint-api.client.ts` | +39 (novo) | Isola multipart, chamada HTTP e validação do protocolo devolvido pelo backend. | 13 |
| `src/app/clients/complaint-api.client.spec.ts` | +82 (novo) | Testes do cliente HTTP. | 5, 13 |
| `src/app/services/complaint.service.spec.ts` | +67/−… | Cobre falha visível e ausência de protocolo. | 3, 13 |

---

## 6. Frontend — componentes (acessibilidade, privacidade e contrato)

Todos os componentes abaixo adotaram injeção com `inject()`, receberam ajustes de teclado, foco, ARIA, contraste e semântica e alinharam mensagens ao novo contrato de sucesso — **sem alterar UI/UX aprovada**.

| Arquivo | Δ linhas | Melhoria principal | Incremento |
|---|---:|---|:---:|
| `src/app/app.html` / `src/app/app.ts` | +21/−… | Landmarks, skip-link e `inject()`. | 6, 7 |
| `acolhimento.html` / `acolhimento.ts` | +14/−… | Foco inicial e semântica acessível. | 6, 7 |
| `confirmation.ts` | +4 | Exibe apenas protocolo validado (sem valor fictício). | 3, 7 |
| `empresa-section/step-local/step-local.ts` | +5 | `inject()` e remoção de logs. | 7 |
| `step-evidencias.html` / `.ts` / `.css` | +295/−… | Rótulos, feedback de upload e contraste; remoção de URL/logs de áudio. | 6, 7 |
| `step-identificacao.html` / `.ts` / `.css` | +24/−… | ARIA em rádios e mensagens de erro. | 6, 7 |
| `step-irregularidades.html` / `.ts` / `.css` | +43/−… | Agrupamento acessível e tipagem de erro. | 6, 7 |
| `step-ocorrencias.ts` | +5 | `inject()`. | 7 |
| `step-revisao.html` / `.ts` | +11/−… | Mensagem de falha visível e botão de nova tentativa. | 3, 6 |

---

## 7. Frontend — estilo e bundle

| Arquivo | Δ linhas | Melhoria | Incremento |
|---|---:|---|:---:|
| `src/bootstrap-required.scss` | +25 (novo) | Importa somente módulos Bootstrap usados. | 10 |
| `src/styles.css` | +19/−… | Remove import completo do Bootstrap. Bundle: **601 kB → 384 kB** (−36%). | 10 |

---

## 8. Frontend — QA de interface

| Arquivo | Δ linhas | Melhoria | Incremento |
|---|---:|---|:---:|
| `e2e/complaint-journey.spec.ts` | +161 (novo) | Jornada completa; falha com nova tentativa; resposta sem protocolo; verificação axe. | 8, 14, 15 |

**Resultado consolidado: 16/16 jornadas aprovadas em Chromium desktop/mobile, Firefox e WebKit.**

---

## Reprodutibilidade

Para conferir cada arquivo isoladamente:

```powershell
git diff origin/main...HEAD -- <caminho/do/arquivo>
git log  origin/main..HEAD  -- <caminho/do/arquivo>
```

Para reproduzir os indicadores do relatório:

```powershell
# Frontend
npm run lint
npm test
npm run build -- --configuration production
npx playwright test
npm audit --omit=dev

# Backend
cd server
npm run lint
npm test
npm audit --omit=dev
```
