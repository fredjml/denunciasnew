# Matriz de rastreabilidade — Canal de Denúncias

Template base: [`templates/rastreabilidade.md`](../licoesaprendidas/templates/rastreabilidade.md).

Legenda:

- **Resultado**: `NE` (não executado), `INC` (inconclusivo), `FAIL` (falhou), `OK` (aprovado).
- **Modo**: `estático`, `unit-front`, `unit-back`, `integ-sim` (integração simulada BFF), `E2E-mock` (Playwright com API interceptada), `live-BFF` (BFF real com doubles de MPT/ClamAV), `live-MPT` (integração autorizada), `UI-manual`.
- **Entrega**: `local`, `empacotada`, `publicada`, `verificada`.

## Requisitos funcionais

| ID | Fonte/local | Requisito | Artefato | Implementação | Teste/modo | Resultado | Evidência | Entrega | Owner | Risco residual |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| RF-01 | Wizard | Fluxo em 7 etapas | Componentes standalone | `components/**` | E2E-mock + UI-manual | NE | — | local | Produto | UX pode divergir do spec_design |
| RF-02 | `complaint.service.ts` | Estado via signals | `services/complaint.service.ts` | idem | unit-front | NE | — | local | Frontend | vazamento entre etapas |
| RF-03 | `complaint-api.client.ts` | Multipart para `/api/denuncias` | `clients/complaint-api.client.ts` | idem | unit-front + integ-sim | NE | — | local | Frontend | serialização inconsistente |
| RF-04 | `services/complaint.service.js` | Valida UF/município/irregularidade OU relato | BFF | idem | unit-back + integ-sim | NE | — | local | Backend | mensagens sanitizadas |
| RF-05 | UI + serviço | Falha visível mantém retry | Componentes + serviço | idem | unit-front + E2E-mock | NE | — | local | Frontend/QA | duplo envio |
| RF-06 | `complaint-api.client.ts` | Só 2xx com protocolo string não vazio | Cliente HTTP | idem | unit-front + integ-sim | NE | — | local | Frontend | edge-cases MPT |
| RF-07 | `services/complaint.service.js` | Protocolo local no BFF | Service backend | idem | unit-back | NE | — | local | Backend + Integração MPT | **D-04** ownership |
| RF-08 | `middleware/upload.js` | 10 arquivos × 20 MiB, allowlist, disco temporário, cleanup | Middleware | idem | unit-back + integ-sim | NE | — | local | Backend | concorrência 100 uploads |
| RF-09 | `clients/clamav.client.js` | ClamAV INSTREAM; ameaça → 422 | Cliente + service | idem | integ-sim + live-BFF (EICAR) | NE | — | local | Backend + Infra | timeout/indisponibilidade |
| RF-10 | `index.js` | Rate limit + Redis + CORS + MPT URL + ClamAV em prod | Perímetro | idem | integ-sim + live-BFF | NE | — | local | Infra + Backend | topologia real |
| RF-11 | `index.js` + `swagger.config.js` | `/health` público; Swagger off em prod | Perímetro | idem | integ-sim | NE | — | local | Infra | rota exposta |
| RF-12 | `index.js` | dev aceita ausência MPT/ClamAV | Config | idem | integ-sim | NE | — | local | Segurança | **D-05** aberto |
| RF-13 | Wizard | Não avança sem obrigatórios | Steps + validação | ausente/parcial | unit-front + E2E-mock | NE | — | local | Frontend | QA-01 |
| RF-14 | Serviço + BFF | Anônimo remove PII | Serviço + validação | ausente | unit-front + unit-back + integ-sim | NE | — | local | Frontend + Backend + DPO | **P0 LGPD** |
| RF-15 | Cliente | Áudio como multipart nomeado | Client + service | ausente | unit-front + integ-sim | NE | — | local | Frontend + Backend | QA-03 |
| RF-16 | Serviço | Rascunho `sessionStorage` | Serviço | ausente | unit-front + E2E-mock | NE | — | local | Frontend | QA-04 |
| RF-17 | Cliente | Timeout + offline | Cliente HTTP | ausente | unit-front + E2E-mock | NE | — | local | Frontend | QA-05 |
| RA-01 | Wizard | Foco/aria-live/labels | Components + templates | parcial | E2E-mock (axe) + UI-manual | NE | — | local | Frontend + A11Y | WCAG 2.2 AA |
| RP-01 | Wizard | Consentimento LGPD | Componente Revisão | ausente | unit-front + E2E-mock | NE | — | local | Frontend + DPO | SEC-10 |

## Requisitos de segurança

| ID | Fonte/local | Requisito | Artefato | Implementação | Teste/modo | Resultado | Evidência | Entrega | Owner | Risco residual |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| RS-01 | `services/complaint.service.js` | Protocolo criptográfico | Service backend | ausente (SEC-02) | unit-back | NE | — | local | Backend + Segurança | previsibilidade |
| RS-02 | `middleware/upload.js` | Campos multipart restritos | Middleware | ausente (SEC-03) | integ-sim | NE | — | local | Backend | abuso |
| RS-03 | `middleware/upload.js` | Magic bytes | Middleware | ausente (SEC-04) | integ-sim | NE | — | local | Backend + Segurança | poliglota |
| RS-04 | `index.js` + Helmet | CSP restritiva | Perímetro | ausente (SEC-05) | integ-sim + E2E-mock | NE | — | local | Segurança + Frontend | inline scripts |
| RS-05 | `clients/mpt-api.client.js` | Injeção de configuração | Cliente | ausente (SEC-06) | unit-back | NE | — | local | Backend | testabilidade |
| RS-06 | `routes/complaint.routes.js` | Rate limit em `/info` | Rota | ausente (SEC-07) | integ-sim | NE | — | local | Backend | scraping |
| RS-07 | `services/complaint.service.js` | Sanitização texto livre | Service | ausente (SEC-08) | unit-back | NE | — | local | Backend + Segurança | XSS interno |
| RS-08 | `index.js` handler 404 | Sem `originalUrl` em prod | Perímetro | ausente (SEC-09) | integ-sim | NE | — | local | Backend | info leak |
| RS-09 | Middleware + Cliente | `X-Request-ID` | Middleware novo | ausente (SEC-11) | unit-back + integ-sim | NE | — | local | Backend + QA | rastreabilidade |

## Requisitos de governança / CI

| ID | Fonte/local | Requisito | Artefato | Implementação | Teste/modo | Resultado | Evidência | Entrega | Owner | Risco residual |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| RG-01 | `.github/workflows/**` | CI executa lint + Vitest (2×) + E2E + audit | Workflows | parcial (REG-01/REG-06) | integ-sim (CI) | NE | — | local | Infra + Dev | regressão silenciosa |
| RG-02 | `e2e/ui-audit.spec.ts` | Falha em achado crítico | Spec | parcial (REG-02) | E2E-mock | NE | — | local | QA | falso verde |
| RG-03 | CI (D-07) | Node compatível com manifest | Workflow | drift | integ-sim (CI) | NE | — | local | Infra | build quebrado |
| RG-04 | CI (D-09) | Redocly lint + Prettier check | Workflow | ausente | integ-sim (CI) | NE | — | local | Dev + QA | drift de contrato |

## Requisitos não funcionais

| ID | Fonte/local | Requisito | Artefato | Implementação | Teste/modo | Resultado | Evidência | Entrega | Owner | Risco residual |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| RNF-SEC-01 | AGENTS + kit | Sem PII/secret/anexo em logs | Logging | parcial | unit-back + integ-sim + auditoria | NE | — | local | Segurança | vazamento |
| RNF-SEC-02 | kit | Upload defesa em profundidade | Middleware + client | parcial | integ-sim + live-BFF | NE | — | local | Backend + Infra | zip bomb |
| RNF-PRV-01 | RELATORIO_FINAL | LGPD (minim., retenção, sigilo) | Documentação legal | pendente | revisão DPO | NE | — | local | DPO | não conformidade |
| RNF-A11Y-01 | Sugestões UX | WCAG 2.2 AA | Componentes + templates | parcial | E2E-mock (axe) + UI-manual | NE | — | local | Frontend + A11Y | conformidade |
| RNF-REL-01 | kit | fail-closed prod, dev rotulado | Perímetro | parcial | integ-sim + live-BFF | NE | — | local | Segurança | ambiguidade |
| RNF-PERF-01 | RELATORIO_FINAL | budgets ≤ 500 kB / 120 kB | Build | mantido histórico | build report | NE | — | local | Frontend | regressão de bundle |
| RNF-MNT-01 | AGENTS #6 | contrato sincronizado | Modelo + FormData + validação + Swagger + testes | parcial | integ-sim | NE | — | local | Dev | drift silencioso |
| RNF-REP-01 | drift D-07 | `npm ci` limpo + CI compatível | Manifests + CI | parcial | pre-flight | NE | — | local | Infra | build quebrado |
| RNF-OBS-01 | SEC-11 | `X-Request-ID` + retenção aprovada | Middleware + observabilidade | ausente | integ-sim + auditoria | NE | — | local | Infra + DPO | rastreabilidade |

## Exceções (para aprovar)

| ID | Campo excluído | Fonte e justificativa | Impacto | Aprovador/data |
| --- | --- | --- | --- | --- |
| E-01 | Autenticação do cidadão | AGENTS.md — MVP mobile-first | Baixo | Produto — pendente |
| E-02 | Painel admin | AGENTS.md — responsabilidade MPT interno | Baixo | Produto — pendente |
| E-03 | Acompanhamento pós-envio | AGENTS.md — fase 2 | Médio | Produto — pendente |

## Regras aplicadas

- Requisito crítico sem prova **bloqueia** entrega.
- Estado `E2E-mock` **não** satisfaz `live-*`.
- Evidência herdada dos relatórios em `docs/Analises/` **não** vale como evidência atual.
- Publicação exige verificação do destino após mutação autorizada.
