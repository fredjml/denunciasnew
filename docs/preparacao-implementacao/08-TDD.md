# Technical Design Document (TDD) — Guia do Desenvolvedor
## Canal de Denúncias — Angular 22 + BFF Express 4.22

> Escopo: descrever a arquitetura observada e os contratos internos com precisão suficiente para desenvolvedores iniciarem tarefas do plano ([11-IMPLEMENTATION-PLAN.md](11-IMPLEMENTATION-PLAN.md)) **sem** ter que reengenheirar o código do zero.
> Este documento é **derivado** da fonte primária. Nenhum trecho é a fonte de verdade — reabra o arquivo real citado antes de codar.

## 1. Topologia geral

```
┌────────────────────────────────────────────────────────────────────────────┐
│                              Ambiente do cidadão                            │
│                                                                             │
│   Navegador (Chromium/Firefox/WebKit; mobile + desktop)                     │
│      │  HTTPS / mesma origem em produção; proxy Angular em dev             │
│      ▼                                                                      │
│   Angular 22 SPA (standalone components, signals)                          │
│      • Wizard 7 etapas: Acolhimento → Irregularidades → Ocorrências         │
│        → Evidências → Identificação → Local → Revisão → Confirmação         │
│      • Estado central: `ComplaintService`                                   │
│      • HTTP: `ComplaintApiClient` (fetch + FormData)                        │
└──────────────────────────────┬─────────────────────────────────────────────┘
                               │  POST /api/denuncias (multipart/form-data)
                               ▼
┌────────────────────────────────────────────────────────────────────────────┐
│                              BFF Express 4.22                               │
│                                                                             │
│  server/index.js  (Helmet, CORS, express-rate-limit, morgan)                │
│    └─ server/routes/complaint.routes.js                                     │
│        └─ server/middleware/upload.js  (Multer diskStorage)                 │
│            └─ server/controllers/complaint.controller.js                    │
│                └─ server/services/complaint.service.js                      │
│                    ├─ server/clients/clamav.client.js  ── INSTREAM → ClamAV │
│                    └─ server/clients/mpt-api.client.js ── Axios → API MPT   │
│                                                                             │
│  Redis  (rate-limit compartilhado; obrigatório em produção)                 │
│  Swagger JSDoc / /api-docs (off por padrão em produção)                     │
└──────────────────────────────┬─────────────────────────────────────────────┘
                               │  multipart → protegido por MPT_API_TOKEN
                               ▼
                        ┌──────────────┐    ┌──────────────┐
                        │  API MPT     │    │   ClamAV     │
                        │ (institucional)│  │  (INSTREAM)  │
                        └──────────────┘    └──────────────┘
```

## 2. Runtime, dependências e execução

### 2.1 Frontend (`cidadania-canal-denuncias/`)

- **Angular 22.0.5**, TypeScript 6.0.2, RxJS 7.8, Bootstrap 5.3 (uso modular após incremento 10).
- Standalone components; **signals** para estado local/compartilhado.
- HTTP via `fetch` + `FormData` (drift D-03: `planejamento.md` menciona `HttpClient`).
- Testes: **Vitest 4** (frontend), **Playwright 1.61** com **axe-core 4.12** (E2E multi-browser).
- Scripts observados (ver [03-TOOLS.md](03-TOOLS.md)):
  - `npm start` (Angular dev server porta 4201)
  - `npm run start:proxy` (proxy → `:3000`)
  - `npm run build`, `npm test`, `npm run lint`, `npm run e2e`.

### 2.2 Backend (`cidadania-canal-denuncias/server/`)

- **Node.js** com CommonJS, Express **4.22**, Axios, Multer, Helmet, express-rate-limit, morgan, Redis client.
- Rate limit obrigatoriamente **compartilhado via Redis** em produção (incremento 16).
- Upload em **disco temporário** (drift D-01 vs. AGENTS.md que menciona memória).
- Testes: **Vitest 4** + **Supertest** (30/30 em janela histórica).

### 2.3 Runtime declarado

- `engines`: Node `^24.15` ou `>=26`; Volta Node 26.7 e npm 11.19.
- CI histórico: Node 22.22.3 / npm 11.11.0 → **drift D-07 aberto**.

### 2.4 Instalação reproduzível

```powershell
npm --prefix cidadania-canal-denuncias ci
npm --prefix cidadania-canal-denuncias/server ci
npx --prefix cidadania-canal-denuncias playwright install
```

Executar somente com autorização — download e rede envolvidos.

## 3. Contrato Frontend ↔ BFF

Referência canônica: [`docs/licoesaprendidas/contrato/README.md`](../licoesaprendidas/contrato/README.md).

### 3.1 Endpoint público

- **Método**: `POST /api/denuncias`
- **Content-Type**: `multipart/form-data`
- **Body**:
  - `denuncia`: string JSON com o objeto `Complaint` (sem anexos).
  - `arquivo_1..N`: 0..N partes de anexos (documentos).
  - `arquivo_audio` *(RF-15, candidato)*: parte com gravação em áudio.
- **Sucesso**: `HTTP 201` com corpo JSON contendo `protocolo` string não vazio.
- **Erros mapeáveis**: `400` (validação), `413` (tamanho), `422` (antimalware/MIME), `429` (rate limit), `502`/`503` (falha externa MPT).
- **Consentimento LGPD** *(RP-01, candidato)*: campo obrigatório no JSON `denuncia` (ex.: `consentimentoLgpd: true`) validado no BFF.

### 3.2 Campos observados/candidatos do JSON `denuncia`

| Campo | Tipo | Origem | Notas |
| --- | --- | --- | --- |
| `uf` | string (UF válida) | UI | obrigatório (RF-04) |
| `municipio` | string | UI | obrigatório (RF-04) |
| `empresa_orgao` | string | UI | opcional |
| `irregularidades` | string[] | UI | ao menos 1 **ou** `relato_texto` (RF-04) |
| `relato_texto` | string | UI | ver acima; sanitizar server-side (RS-07) |
| `ocorrencias` | objeto | UI | data, local, período |
| `nomes_dados` | string | UI | sanitizar (RS-07) |
| `funcoes_setores` | string | UI | sanitizar (RS-07) |
| `anonimo` | boolean | UI | quando `true`, PII removida (RF-14) |
| `nome` | string | UI | omitido se `anonimo` |
| `email` | string | UI | omitido se `anonimo` |
| `telefone` | string | UI | omitido se `anonimo` |
| `consentimentoLgpd` | boolean | UI | obrigatório `true` (RP-01) |
| `relatoAudioPresente` | boolean | UI/cliente | indica que há `arquivo_audio` (RF-15) |

### 3.3 Regras do BFF

- Validar mínimos (`uf`, `municipio`, `irregularidades OU relato_texto`).
- Se `anonimo === true`, **rejeitar** payload que contenha `nome`/`email`/`telefone` (defesa em profundidade — RF-14).
- Sanitizar `relato_texto`, `nomes_dados`, `funcoes_setores`.
- Gerar `protocolo` local com fonte criptográfica (RS-01).
- Correlacionar por `X-Request-ID` (RS-09).
- Encaminhar multipart à API MPT com `MPT_API_TOKEN` (nunca vazando).

### 3.4 Restrições de upload (RF-08 / RNF-SEC-02)

- `MAX_FILES` padrão 10 · `MAX_FILE_SIZE` padrão 20 MiB.
- **Somente campos nomeados** — `upload.array('arquivo', 10)` ou `upload.fields([...])` (RS-02).
- MIME allowlist declarada; validar **magic bytes** (RS-03).
- Disco temporário com nome aleatório; cleanup obrigatório em sucesso, erro, timeout, cancelamento.
- ClamAV INSTREAM: `clean`, `infected` (→ 422), `timeout` (política fail-closed em prod), `unavailable` (fail-closed em prod).

## 4. Contrato BFF ↔ API MPT

**Conflito material D-04 aberto**. Até a decisão:

- BFF gera protocolo local; não pode alegar que o protocolo veio da API MPT.
- Sucesso na chamada Axios não equivale a "aceite MPT"; owner deve definir schema oficial.

Requisitos de robustez (independentes da decisão):

- Timeout explícito (a definir — sugere-se ≤ 15 s).
- Idempotência: propagar `X-Request-ID` como chave.
- Tratar resposta vazia, malformada, `4xx`, `5xx`, timeout, DNS/network error.
- Nenhum log com token, URL interna completa ou payload sensível.

## 5. Perímetro do BFF

- **Helmet** com CSP restritiva (RS-04); ajustar `script-src`, `style-src`, `font-src`, `img-src` conforme fontes reais.
- **CORS** exato em produção (`FRONTEND_URL`).
- **express-rate-limit** com **RedisStore** obrigatório em produção; incremento 16 já cobre.
- **trust proxy** compatível com topologia real (owner: Infra).
- Handler 404 sem `req.originalUrl` em produção (RS-08).
- `/health` público, mínimo (sem dados).
- Swagger em `/api-docs` **desabilitado por padrão** em produção (`ENABLE_SWAGGER=false`).

## 6. Frontend — pontos-chave

### 6.1 `ComplaintService` (signals)

- Fonte da verdade do wizard: passo atual, dados por etapa, flags (`isSubmitted`, `error`), rascunho.
- Após RF-14: aplicar limpeza de PII quando `anonimo` for ativado.
- Após RF-16: persistir estado por etapa em `sessionStorage`; limpar em `submitComplaint` OK e em desistência explícita.
- Após RF-15: expor `relatoAudioBlob` para o cliente HTTP.

### 6.2 `ComplaintApiClient`

- Monta `FormData`:
  - `denuncia` = `JSON.stringify(payload)`.
  - `arquivo_1..N` = anexos.
  - `arquivo_audio` = `relatoAudioBlob` (novo, RF-15).
- Envio via `fetch` com `AbortController` (RF-17): timeout de 30 s + verificação `navigator.onLine`.
- Só considera sucesso quando `response.ok` **e** `body.protocolo` for string não vazia (RF-06).
- Nunca chama `catch` silencioso (drift D-02: pitfall histórico do "sucesso simulado").

### 6.3 Acessibilidade (RA-01, RNF-A11Y-01)

- `<label for>` para todo campo; `aria-describedby` em erros.
- Foco no `h1` da etapa após navegação.
- Região `aria-live="polite"` para anúncio de mudança de etapa e para erros.
- Foco visível global (contraste WCAG 2.2 AA).
- Botões e links **sem função** (QA-06) devem ser removidos ou receber ação real.
- Stepper (QA-08) restringe navegação apenas para etapas já validadas.

## 7. Backend — pontos-chave

### 7.1 `services/complaint.service.js`

- Gerar protocolo com `crypto.randomUUID()` (RS-01).
- Aplicar sanitização de texto livre (RS-07).
- Rejeitar PII quando `anonimo === true` (RF-14).
- Encaminhar à API MPT via cliente injetável.

### 7.2 `clients/mpt-api.client.js`

- Refatorar para receber `{ baseUrl, token, httpClient }` via factory (RS-05).
- Não ler `process.env` diretamente.

### 7.3 `middleware/upload.js`

- Substituir `upload.any()` por `upload.array('arquivo', MAX_FILES)` ou `upload.fields([{ name: 'arquivo', maxCount: 10 }, { name: 'arquivo_audio', maxCount: 1 }])` (RS-02).
- Adicionar validação de **magic bytes** (biblioteca aprovada; ex.: `file-type`) — RS-03.
- Manter cleanup (streams fechados, arquivos temporários apagados) em sucesso e erro.

### 7.4 Middleware de rastreabilidade (RS-09)

- Adicionar middleware que:
  - Aceita `X-Request-ID` de entrada (sanitizado) ou gera um novo via `crypto.randomUUID()`.
  - Anexa ao contexto de log (morgan format personalizado).
  - Propaga ao cabeçalho da chamada à API MPT.

## 8. Testes

Ver [10-EVIDENCE-MANIFEST.md](10-EVIDENCE-MANIFEST.md) para plano de evidência. Panorama por nível:

| Nível | Ferramenta | Cobertura mínima |
| --- | --- | --- |
| Unitário frontend | Vitest 4 | signals, validação, sanitização anônima, cliente HTTP com AbortController |
| Unitário backend | Vitest 4 + Supertest | validação, sanitização, protocolo criptográfico, cliente MPT injetável, upload restrito |
| Integração BFF (simulada) | Supertest + doubles | rota completa com doubles de MPT/ClamAV/Redis |
| E2E UI (mockado) | Playwright + axe | wizard multi-browser com API interceptada |
| Live BFF autorizado | Supertest + serviços reais em ambiente controlado | EICAR, MPT sandbox, Redis real |
| UI manual | teclado, leitor de tela | WCAG 2.2 AA em fluxos completos |

## 9. Segurança operacional

- `MPT_API_TOKEN` **somente** no BFF; nunca em código do frontend, cache do browser, logs, dumps ou prompts.
- `env.template` é a fonte de config; **drift**: documentação antiga cita `.env.example`.
- Logs sanitizados: sem PII, anexos, tokens, URL interna completa, payload MPT ou trace com stack contendo dados sensíveis.
- Retenção sugerida de logs: 10 dias (a aprovar por DPO).
- 3 réplicas do BFF; rate-limit em Redis para consistência.

## 10. CI/CD (candidato — RG-01..04)

Workflow proposto (não implementar aqui — apenas descrever):

1. **preflight**: `npm ci` frontend + backend, versão Node compatível (RG-03).
2. **lint**: `npm run lint` (frontend + backend).
3. **unit**: `npm test` (frontend + backend); **sem** `passWithNoTests` (drift D-09).
4. **contract**: `npx @redocly/cli lint` (RG-04); `prettier --check` (opcional).
5. **build**: `npm run build`; validar budgets.
6. **E2E**: `npm run e2e` (RG-01), com `ui-audit.spec.ts` falhando em achado crítico (RG-02).
7. **audit**: `npm audit --omit=dev` frontend + backend.
8. Artefatos publicados (relatórios de teste, HTML axe, evidência sanitizada).

## 11. Referências primárias

- `cidadania-canal-denuncias/AGENTS.md` (raiz).
- `cidadania-canal-denuncias/frontend/AGENTS.md`.
- `cidadania-canal-denuncias/planejamento.md`.
- `cidadania-canal-denuncias/spec_design.md`.
- `docs/licoesaprendidas/backend/README.md` e `backend/seguranca.md`.
- `docs/licoesaprendidas/frontend/README.md` e `frontend/acessibilidade.md`.
- `docs/licoesaprendidas/contrato/README.md`.

## Limitações

- Diagrama de topologia é a topologia **observada**; não é homologação de infra.
- Contrato com a API MPT **não** está formalizado neste TDD.
- Nenhum trecho aqui autoriza mudança; a autorização vem por fatia em [11-IMPLEMENTATION-PLAN.md](11-IMPLEMENTATION-PLAN.md).
