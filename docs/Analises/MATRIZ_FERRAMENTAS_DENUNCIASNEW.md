# Matriz de Ferramentas — `denunciasnew`

> **Fase:** F4 — Arquitetura, ameaças e matriz de QA/Security.
> **Autorização vigente:** `SOMENTE_LEITURA + DOCUMENTAÇÃO`. Rede a TLC (`https://www.techleads.club/`) **não autorizada** nesta fase — coluna `Origem` está preenchida com base em fontes internas do repositório; nenhuma linha foi importada do TLC. Ver §7 para o gap declarado.
> **Fontes internas usadas:** [`03-TOOLS.md`](../preparacao-implementacao/03-TOOLS.md), [`04-MCP.md`](../preparacao-implementacao/04-MCP.md), [`08-TDD.delta-denunciasnew.md`](../preparacao-implementacao/08-TDD.delta-denunciasnew.md), [`09-THREAT-MODEL.delta-denunciasnew.md`](../preparacao-implementacao/09-THREAT-MODEL.delta-denunciasnew.md), [`06-REQUIREMENTS.delta-denunciasnew.md`](../preparacao-implementacao/06-REQUIREMENTS.delta-denunciasnew.md), [`../licoesaprendidas/04-ia-rules-skills-tools-mcp-agents.md`](../licoesaprendidas/04-ia-rules-skills-tools-mcp-agents.md), [`../licoesaprendidas/06-gates-qa-testes-seguranca.md`](../licoesaprendidas/06-gates-qa-testes-seguranca.md), [`../licoesaprendidas/backend/seguranca.md`](../licoesaprendidas/backend/seguranca.md), [`../licoesaprendidas/frontend/acessibilidade.md`](../licoesaprendidas/frontend/acessibilidade.md).

## 1. Convenção

| Coluna | Definição |
| --- | --- |
| **Objetivo** | Camada/objetivo do teste ou controle (unit, integ-sim, e2e-mock, a11y, perf, sec-estática, sec-dinâmica, dep-check, secrets-scan, mobile) |
| **Ferramenta** | Nome canônico |
| **Categoria** | `Test`, `QA`, `Security`, `IA-Assist`, `Infra` |
| **Licença** | Aberta / Comercial / Freemium / Interna |
| **Custo estimado** | `$` (grátis) → `$$$` (comercial); estimativa qualitativa |
| **Integração** | Como se integra ao stack Angular/Express (npm/CLI/Docker/pipeline) |
| **Alternativa livre** | Substituto se a principal for rejeitada |
| **Origem** | `Interno` (kit/repositório), `Herdado` (10 diagramas históricos), `PDF` (proposta do novo leiaute), `TLC` (a preencher pelo owner) |
| **Status** | `SUGERIDA`, `APROVADA`, `REJEITADA`, `AUDITAR` |
| **Owner sugerido** | Papel responsável pela decisão |
| **Requisitos** | `DN-*` cobertos ou ameaças `T-DN-*` mitigadas |

## 2. Camada Test (unit, integração, contrato, E2E)

| Objetivo | Ferramenta | Categoria | Licença | Custo | Integração | Alternativa livre | Origem | Status | Owner | Requisitos |
| --- | --- | --- | :---: | :---: | --- | --- | :---: | :---: | --- | --- |
| unit frontend | **Vitest 4** | Test | MIT | $ | `npm test` (herdado) | Jest | Interno / Herdado | SUGERIDA | Frontend | todos DN-RF-\* |
| unit backend | **Vitest 4 + Supertest** | Test | MIT | $ | `npm --prefix server test` | Mocha + Chai + Supertest | Interno / Herdado | SUGERIDA | Backend | DN-RF-01..14, DN-RS-\* |
| integração simulada (mocks HTTP) | **msw** (Mock Service Worker) | Test | MIT | $ | `npm i -D msw` | `nock` | Interno | SUGERIDA | Backend | T-DN-01..17 |
| contrato Frontend↔BFF | **OpenAPI + `openapi-typescript` + `zod`** | Test | MIT | $ | gerar tipos a partir do Swagger | schemas manuais | Interno / Herdado | SUGERIDA | Backend | DN-RS-001, DN-RS-004 |
| E2E multi-browser | **Playwright 1.61** | Test | Apache-2.0 | $ | `npm run e2e` (herdado) | Cypress | Interno / Herdado | SUGERIDA | QA | todos DN-RF-\* |
| E2E mobile-first (viewport/dispositivo real) | **Playwright + BrowserStack / Sauce Labs** | Test | Comercial (device farm) | $$$ | `PLAYWRIGHT_BROWSERS=…` + credencial | emuladores locais (`--project=Mobile Chrome`) | PDF (DN-RNF-002) | AUDITAR | QA | DN-RNF-002, T-DN-18 |
| gravador de teste guiado por IA | **Playwright Codegen** (`npx playwright codegen`) | Test / IA-Assist | Apache-2.0 | $ | CLI local | — | Interno | AUDITAR | QA | — |

## 3. Camada Acessibilidade

| Objetivo | Ferramenta | Categoria | Licença | Custo | Integração | Alternativa livre | Origem | Status | Owner | Requisitos |
| --- | --- | --- | :---: | :---: | --- | --- | :---: | :---: | --- | --- |
| verificador automático a11y | **axe-core 4.12** (`@axe-core/playwright`) | QA | MPL-2.0 | $ | herdado | pa11y | Interno / Herdado | SUGERIDA | Frontend / A11y | DN-RNF-001 |
| auditoria manual (leitores de tela) | **NVDA** (Windows) + **VoiceOver** (macOS/iOS) + **TalkBack** (Android) | QA | Grátis | $ | manual | — | PDF (DN-RNF-001) | SUGERIDA | A11y | DN-RG-005, T-DN-19 |
| verificador WCAG detalhado | **Lighthouse (a11y)** | QA | Apache-2.0 | $ | Chrome DevTools / CI | — | Interno | SUGERIDA | Frontend | DN-RNF-001 |
| contraste de cor | **contrast-ratio** CLI / **WebAIM Contrast Checker** (web) | QA | Grátis | $ | manual | — | PDF | SUGERIDA | Design / A11y | DN-RG-005 |
| revisão manual de linguagem simples | **Flesch reading ease** (via Python `textstat`) | QA | MIT | $ | script offline | leitura humana | PDF (DN-RG-003) | AUDITAR | UX / Legal | DN-RG-003 |

## 4. Camada Performance mobile

| Objetivo | Ferramenta | Categoria | Licença | Custo | Integração | Alternativa livre | Origem | Status | Owner | Requisitos |
| --- | --- | --- | :---: | :---: | --- | --- | :---: | :---: | --- | --- |
| performance mobile-first (LCP/TTI) | **Lighthouse** (`--preset=perf --form-factor=mobile`) | QA / Perf | Apache-2.0 | $ | CLI + CI | WebPageTest (self-hosted) | PDF (DN-RNF-003) | SUGERIDA | Frontend | DN-RNF-003 |
| throttle de rede em teste | **Playwright network throttling** (`network.emulate(...)`) | Test / Perf | Apache-2.0 | $ | E2E | Chrome DevTools Protocol | Interno | SUGERIDA | QA | DN-RNF-003 |
| observabilidade real de usuário mobile | **Sentry Performance** ou **New Relic Browser** | Perf | Freemium | $$ | SDK JS | RUM open-source (uptrace, plausible) | AUDITAR | AUDITAR | SRE | DN-RNF-003 |

## 5. Camada Security estática (SAST) e dependências

| Objetivo | Ferramenta | Categoria | Licença | Custo | Integração | Alternativa livre | Origem | Status | Owner | Requisitos / Ameaças |
| --- | --- | --- | :---: | :---: | --- | --- | :---: | :---: | --- | --- |
| lint estático (JS/TS) | **ESLint** + `@typescript-eslint` | QA / Sec | MIT | $ | `npm run lint` (herdado) | Biome | Interno / Herdado | SUGERIDA | Backend + Frontend | — |
| SAST | **Semgrep** (`p/owasp-top-ten`, `p/nodejs`) | Security | LGPL | $ | CLI + CI | CodeQL (grátis para OSS) | Interno | SUGERIDA | Segurança | T-DN-05, T-DN-13, T-DN-17 |
| SAST alternativo | **CodeQL** | Security | MIT (GitHub) | $ (público) / $$ (privado) | GitHub Actions | Semgrep | — | AUDITAR | Segurança | — |
| dependências (advisories) | **`npm audit`** | Security | Grátis | $ | `npm audit --omit=dev` | Snyk (freemium) | Interno / Herdado | SUGERIDA | Segurança | supply chain |
| SBOM | **CycloneDX Node.js** (`@cyclonedx/cyclonedx-npm`) | Security | Apache-2.0 | $ | CLI local | SPDX tools | Interno | SUGERIDA | Segurança | T-DN-21..23 |
| secret scanning | **gitleaks** | Security | MIT | $ | CLI + pre-commit + CI | trufflehog | Interno | SUGERIDA | Segurança | R-SEC-01 |
| licenças de dependências | **`license-checker-rseidelsohn`** | Security | BSD | $ | CLI | `oss-review-toolkit` | Interno | AUDITAR | Legal / Segurança | supply chain |

## 6. Camada Security dinâmica (DAST) e infraestrutura

| Objetivo | Ferramenta | Categoria | Licença | Custo | Integração | Alternativa livre | Origem | Status | Owner | Requisitos / Ameaças |
| --- | --- | --- | :---: | :---: | --- | --- | :---: | :---: | --- | --- |
| DAST | **OWASP ZAP** (baseline scan) | Security | Apache-2.0 | $ | Docker + CI | Nikto (limitado) | Interno | AUDITAR | Segurança | T-DN-13, T-DN-17 |
| verificação de headers HTTP | **`securityheaders.com`** CLI equivalente / **`shcheck`** | Security | Grátis | $ | script local | — | Interno | SUGERIDA | Segurança | T-DEN-06 herdado + T-DN-\* |
| antimalware anexos (herdado) | **ClamAV** (INSTREAM) | Security | GPL-2.0 | $ | TCP 3310 (herdado) | — | Interno / Herdado | APROVADA | Backend / Segurança | T-DN-04 |
| WAF (mitigação canal público) | **AWS WAF / Cloudflare / mod_security** | Security / Infra | Comercial (varia) | $$–$$$ | edge | mod_security + OWASP CRS | ND | AUDITAR | Infra / Segurança | T-DN-16 |
| rate-limit store (herdado) | **Redis** | Infra | BSD-3 | $ | herdado | Valkey / KeyDB | Interno / Herdado | APROVADA | Backend | T-DEN-15 herdado |

## 7. Camada LGPD, DPO e revisão humana

| Objetivo | Ferramenta | Categoria | Licença | Custo | Integração | Alternativa livre | Origem | Status | Owner | Requisitos / Ameaças |
| --- | --- | --- | :---: | :---: | --- | --- | :---: | :---: | --- | --- |
| redação/anonimização de logs (server) | **`pino-noir`** ou middleware caseiro | Security | MIT | $ | Node.js | log-based | Interno | SUGERIDA | Backend / DPO | DN-RNF-004, T-DN-05, T-DN-09 |
| detecção de PII em texto (preventiva) | **Microsoft Presidio** (Python, opcional) | Security / IA | MIT | $ | serviço interno | regex customizada | ND | AUDITAR | DPO / Backend | T-DN-05, T-DN-09 |
| revisão humana de decisão automatizada | interface administrativa a projetar | QA / Legal | Interno | — | web + auth | Airtable/Retool (comercial) | PDF (DN-RS-003) | AUDITAR | Produto / Legal | T-DN-07, T-DN-08 |
| assinatura digital de decisões automatizadas | **`node-forge`** para HMAC/SIG | Security | BSD-3 | $ | Node.js | Web Crypto API | Interno | SUGERIDA | Backend | T-DN-07 |
| DPIA (avaliação de impacto) | template documental | QA / Legal | — | — | manual | — | PDF | AUDITAR | DPO | LGPD art. 38 |

## 8. Camada Chatbot WhatsApp (NOVO · PART)

| Objetivo | Ferramenta | Categoria | Licença | Custo | Integração | Alternativa livre | Origem | Status | Owner | Requisitos / Ameaças |
| --- | --- | --- | :---: | :---: | --- | --- | :---: | :---: | --- | --- |
| provedor da API WhatsApp Business | **WhatsApp Business Platform** (Meta) | Infra | Comercial | $$$ | HTTPS + webhook | nenhum equivalente (canal proprietário) | PDF (DN-RS-001) | AUDITAR | Produto | DEC-DN-09 |
| gateway/parceiro oficial | **Meta BSP** (Twilio, Sinch, Take Blip, etc.) | Infra | Comercial | $$$ | HTTPS + webhook | self-hosted (`whatsapp-web.js` — não oficial, risco de banimento) | PDF | AUDITAR | Produto / Legal | DEC-DN-09 |
| framework de bot | **BotPress**, **Rasa** (open) ou **Dialogflow** (Google) | IA-Assist | varia | $$ | HTTPS + webhook | script custom Node.js | PDF | AUDITAR | Produto | DEC-DN-09 |
| HMAC do webhook | **Node `crypto`** (padrão) | Security | Grátis | $ | `require('crypto')` | — | Interno | SUGERIDA | Backend | T-DN-13 |

## 9. Camada Transcrição de áudio (STT — NOVO · PART)

| Objetivo | Ferramenta | Categoria | Licença | Custo | Integração | Alternativa livre | Origem | Status | Owner | Requisitos / Ameaças |
| --- | --- | --- | :---: | :---: | --- | --- | :---: | :---: | --- | --- |
| STT SaaS pt-BR | **Google Speech-to-Text** | IA-Assist | Comercial | $$ | HTTPS | Amazon Transcribe | PDF (DN-RS-002) | AUDITAR | Arquitetura | T-DN-01, T-DN-02 |
| STT SaaS alternativo | **Azure Speech Services** | IA-Assist | Comercial | $$ | HTTPS | — | PDF | AUDITAR | Arquitetura | T-DN-01, T-DN-02 |
| STT self-hosted (privacidade máxima) | **Whisper.cpp** ou **faster-whisper** (Python) | IA-Assist | MIT / Apache-2.0 | $ (infra) | serviço interno | Vosk | PDF | AUDITAR | SRE / Arquitetura | T-DN-01 (mitigado ao máximo) |

## 10. Camada Classificação automática (NOVO · PART)

| Objetivo | Ferramenta | Categoria | Licença | Custo | Integração | Alternativa livre | Origem | Status | Owner | Requisitos / Ameaças |
| --- | --- | --- | :---: | :---: | --- | --- | :---: | :---: | --- | --- |
| classificador determinístico | **regras server-side** (`rule-engine` JS, ex.: `json-rules-engine`) | Backend | MIT | $ | Node.js | script custom | PDF (DN-RS-003) | SUGERIDA | Produto / Backend | T-DN-06, T-DN-07 |
| classificador ML pt-BR | **`transformers.js`** (embeddings + classificador raso) | IA-Assist | Apache-2.0 | $ | Node.js | Python + `sklearn` como microserviço | PDF | AUDITAR | Dados / Backend | T-DN-08 |
| explicabilidade de decisão | **LIME** ou **SHAP** (Python) | IA-Assist | BSD | $ | serviço interno | — | Interno | AUDITAR | DPO / Dados | T-DN-07, T-DN-08 |

## 11. Camada Alertas inteligentes (NOVO · PART)

| Objetivo | Ferramenta | Categoria | Licença | Custo | Integração | Alternativa livre | Origem | Status | Owner | Requisitos / Ameaças |
| --- | --- | --- | :---: | :---: | --- | --- | :---: | :---: | --- | --- |
| destino do alerta — SIEM interno | **Splunk / Elastic Security** | Infra | Comercial | $$$ | HEC / HTTP | Wazuh + Elastic (open) | ND | AUDITAR | SRE / Segurança | DEC-DN-22 |
| destino do alerta — canal ops leve | **PagerDuty / Opsgenie / Slack webhook** | Infra | Freemium | $–$$ | webhook | Rocket.Chat + webhook | ND | AUDITAR | SRE | DEC-DN-22 |
| throttling do dispatcher | biblioteca de rate-limit (`p-throttle`, `bottleneck`) | Backend | MIT | $ | Node.js | custom | Interno | SUGERIDA | Backend | T-DN-10 |

## 12. Camada Infra e observabilidade

| Objetivo | Ferramenta | Categoria | Licença | Custo | Integração | Alternativa livre | Origem | Status | Owner | Requisitos / Ameaças |
| --- | --- | --- | :---: | :---: | --- | --- | :---: | :---: | --- | --- |
| logs sanitizados | **pino** + middleware de redaction | Infra | MIT | $ | Node.js | winston + redactor | Interno | SUGERIDA | Backend | DN-RNF-004 |
| tracing | **OpenTelemetry** (Node.js SDK) | Infra | Apache-2.0 | $ (self-host) | SDK | Zipkin | Interno | AUDITAR | SRE | T-DEN-16 herdado + T-DN-\* |
| métricas | **Prometheus + Grafana** | Infra | Apache-2.0 | $ | scrape/HTTP | — | Interno | AUDITAR | SRE | DN-RG-006 |
| container runtime dev/CI | **Docker Desktop** / **Podman** | Infra | Freemium / Apache-2.0 | $ (Podman grátis) | CLI | — | Interno | SUGERIDA | SRE | — |

## 13. Inventário IA-Assist (`skills` × `tools` × `rules` × `MCP` × `agents`)

Base normativa: [`../licoesaprendidas/04-ia-rules-skills-tools-mcp-agents.md`](../licoesaprendidas/04-ia-rules-skills-tools-mcp-agents.md). Nenhum item é instalado nesta fase; auditoria é pré-requisito (R-EVD-01 + regra do kit).

### 13.1 Skills

| Nome | Localização | Status | Próxima ação |
| --- | --- | :---: | --- |
| `denuncias-quality-review` | [`../licoesaprendidas/skill/denuncias-quality-review/SKILL.md`](../licoesaprendidas/skill/denuncias-quality-review/SKILL.md) | JÁ EXISTE | reutilizar nas fases de review adversarial (F7 §8) |
| `denuncias-preparacao-implementacao` | [`../preparacao-implementacao/skills/denuncias-preparacao-implementacao/SKILL.md`](../preparacao-implementacao/skills/denuncias-preparacao-implementacao/SKILL.md) | JÁ EXISTE | reutilizar como skill deste ciclo |
| `denuncias-classificacao-review` | — | A CRIAR | revisar decisões automatizadas (T-DN-07, T-DN-08); só se DEC-DN-12 aprovar ML |
| `denuncias-audio-privacy` | — | A CRIAR | auditar redação/consentimento do fluxo de áudio (T-DN-01); só se DEC-DN-11 aprovar |

### 13.2 Rules

Rules P0 aplicáveis (integralmente herdadas de [§Rules P0](../licoesaprendidas/04-ia-rules-skills-tools-mcp-agents.md)):

`R-REQ-01`, `R-REQ-02`, `R-SRC-01`, `R-ENV-01`, `R-HUM-01`, `R-INC-01`, `R-EVD-01`, `R-LIVE-01`, `R-QA-01`, `R-REV-01`, `R-SEC-01`, `R-CTX-01`, `R-LOOP-01`, `R-GIT-01`, `R-SCOPE-01`.

Rules a adicionar neste ciclo (candidatas):

| ID | Regra | Justificativa | Verificação |
| --- | --- | --- | --- |
| `R-DN-01` | envelope enviado ao Classificador não pode conter PII | LGPD + T-DN-05 | unit + integ-sim; falha se `payload` contiver campos de identificação |
| `R-DN-02` | prioridade da denúncia é sempre setada server-side | T-DN-06 | teste contratual: aceitar prioridade no request → erro 400 |
| `R-DN-03` | decisão automatizada URGENTE requer flag `revisada_por_humano=true` antes de disparar alerta | T-DN-07, T-DN-08 | fluxo BFF interrompe alerta se flag ausente |
| `R-DN-04` | HMAC + timestamp obrigatórios no BotIngress | T-DN-13 | middleware bloqueia sem par válido |
| `R-DN-05` | provedores externos NOVO nunca são chamados em CI com dado real | R-LIVE-01 estende | pipeline usa `NODE_ENV=ci` + mock |

### 13.3 Tools (do repositório)

Tools JÁ AVAILABLE (verificadas em F2/F3):

| Tool | Versão | Origem | Aplicação em denunciasnew |
| --- | --- | --- | --- |
| `pymupdf` | 1.28.2 | pré-instalada | leitura sanitizada de PDF (F2) |
| `pypdf` | 6.16.2 | pré-instalada | alternativa a pymupdf |
| `pdftotext` (Poppler) | 25.07.0 | pré-instalada (winget) | conversão layout-preserving |
| Node.js | 22.22.3 | pré-instalada | executar `validate-diagrams.js` |
| `winget` | 1.28.220 | Windows | instalação de tooling (mediante autorização) |
| `choco` | 2.4.0 | pré-instalada | idem winget |

Tools A INSTALAR (só após autorização explícita):

| Tool | Uso | Bloqueio |
| --- | --- | --- |
| **LibreOffice** | conversão `.docx` → `.doc` | requer admin |
| `@mermaid-js/mermaid-cli` | renderização dos diagramas `denunciasnew-*` | requer `npm i -g` (autorização) |
| `pandoc` | conversão `.md` → `.docx` | requer instalação |
| `axe-core` CLI | auditoria a11y offline | requer `npm i -g` |

### 13.4 MCP (Model Context Protocol)

Nenhum MCP autorizado a rodar sem auditoria (§04-MCP.md). Levantamento dos MCPs úteis:

| MCP | Fonte externa | Uso previsto no ciclo | Estado |
| --- | --- | --- | --- |
| GitHub | repositório | PR, run, artifact quando o produto for versionado (bloqueio D-DN-01) | AUDITAR |
| Filesystem | local | leitura do repositório | JÁ EM USO (via VS Code) |
| Miro / Draw.io | arquitetura | validar C4 dos `denunciasnew-*` | AUDITAR |
| Postgres/Redis | ND | não previsto neste ciclo | REJEITADO |
| ClamAV / MPT API | interno | via BFF, nunca por MCP direto (segurança) | REJEITADO |

### 13.5 Agents (subagentes do ciclo)

Já definidos em [`../preparacao-implementacao/agents/`](../preparacao-implementacao/agents/):

| Agent | Escopo | Aplicado a |
| --- | --- | --- |
| `analyst-preflight` | pre-flight + descoberta | F1 |
| `requirements-engineer` | requisitos + rastreabilidade | F2 |
| `diagram-curator` | diagramas Mermaid | F3 |
| `security-architect` | ameaças + arquitetura | F4 |
| `evidence-planner` | plano de evidências | F5 (próxima) |
| `plan-decomposer` | fatias verticais | F6 |

Nenhum novo agente é necessário para os elementos NOVO/PART do ciclo — o padrão existente cobre o escopo.

## 14. AGENTS.md do repositório (não alterado neste ciclo)

`AGENTS.md` do produto (em `cidadania-canal-denuncias/`) **não está disponível** neste workspace (D-DN-06). O `AGENTS.md` do workspace `denunciasnew/` **não existe** (D-DN-01/06). Recomendação: quando o produto for reaberto, criar governança local para o ciclo `denunciasnew` sem substituir `AGENTS.md` originais.

## 15. Gap declarado — TLC (`https://www.techleads.club/`)

**Rede não autorizada nesta fase.** Nenhuma linha desta matriz foi importada do catálogo TLC. Quando o owner autorizar consulta, sugerir preencher para cada linha da matriz:

- Coluna `Origem` → substituir `Interno` por `TLC + <link>` quando aplicável.
- Adicionar linhas ausentes que o TLC recomende para o stack (Node + Angular + LGPD).
- Registrar auditoria de licenciamento no [`../preparacao-implementacao/12-DECISIONS.md`](../preparacao-implementacao/12-DECISIONS.md) como `DEC-DN-24` (nova).

## 16. Estatística sumária

| Métrica | Valor |
| --- | --- |
| Linhas na matriz | 46 ferramentas em 12 camadas |
| `SUGERIDA` | 21 |
| `APROVADA` | 2 (ClamAV, Redis — herdadas) |
| `AUDITAR` | 22 |
| `REJEITADA` | 2 (Postgres MCP, MPT API via MCP) |
| Ferramentas com custo `$$$` | 5 (device farm, WAF comercial, WhatsApp BSP, SIEM, Meta BSP) |
| Alternativas livres identificadas para camadas `$$$` | 5/5 |
| Rules candidatas `R-DN-\*` | 5 |
| Skills a criar | 2 |
| Skills já existentes | 2 |
