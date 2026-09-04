# 11-IMPLEMENTATION-PLAN — Delta `denunciasnew`

> **Delta proposto.** Não substitui [`11-IMPLEMENTATION-PLAN.md`](11-IMPLEMENTATION-PLAN.md). Consolida as fatias verticais do MVP do novo leiaute, respeitando:
>
> - Requisitos `DN-*` de [`06-REQUIREMENTS.delta-denunciasnew.md`](06-REQUIREMENTS.delta-denunciasnew.md).
> - Ameaças `T-DN-*` de [`09-THREAT-MODEL.delta-denunciasnew.md`](09-THREAT-MODEL.delta-denunciasnew.md).
> - Evidências planejadas em [`10-EVIDENCE-MANIFEST.delta-denunciasnew.md`](10-EVIDENCE-MANIFEST.delta-denunciasnew.md).
> - Decisões respondidas em [`12-DECISIONS.delta-denunciasnew.md`](12-DECISIONS.delta-denunciasnew.md).
>
> **Fase:** F6.
> **Autorização vigente:** `SOMENTE_LEITURA + DOCUMENTAÇÃO`. Nenhuma fatia é executada nesta fase — cada fatia exige autorização just-in-time.

## 1. Convenções

| Coluna | Definição |
| --- | --- |
| ID | `FATIA-DN-<CP>-<seq>` para não colidir com `A1..G3` do plano original |
| Requisito | `DN-*` primário (F2) |
| Arquivos permitidos | lista exata (fora dela é ampliar escopo) |
| Teste focal | teste que **falha antes**, **passa depois** |
| Ameaça | `T-DN-*` mitigada pela fatia (quando aplicável) |
| Evidência | `SH-DN-*` de [`10-EVIDENCE-MANIFEST.delta-denunciasnew.md`](10-EVIDENCE-MANIFEST.delta-denunciasnew.md) |
| Rollback | como reverter a fatia |
| Dependências | outras fatias/pergunta/decisão bloqueadoras |
| Owner | papel responsável |
| Estado | `PRONTA-P/-AUTORIZAÇÃO`, `BLOQUEADA` (com motivo), `FORA-DO-MVP` |

Checkpoints (ordenação):

- **CP-0** — Fundação (CI, lint, axe-core, Lighthouse plumbing).
- **CP-1** — Tela Acolhimento (DN-RF-001, DN-RF-002).
- **CP-2** — Relato Guiado (DN-RF-003, DN-RF-004, DN-RS-002 mock).
- **CP-3** — Detalhamento + Evidências (DN-RF-005..009).
- **CP-4** — Sigilo + Local (DN-RG-005, DN-RF-010..012, anonimização).
- **CP-5** — Revisão + Confirmação (DN-RF-013, DN-RF-014).
- **CP-6** — Classificador + Alertas (mock) + LGPD art. 20 (DN-RS-003, DN-RS-004).
- **CP-a11y-piso** — WCAG 2.1 AA obrigatório antes do MVP público (DEC-DN-07 §Opção C).
- **CP-a11y-alvo** — WCAG 2.2 AA obrigatório antes do release público final.
- **CP-mobile-perf** — DN-RNF-002, DN-RNF-003 (Lighthouse Slow 3G).

Fluxo canônico:

```
CP-0 → CP-1 → CP-2 → CP-3 → CP-4 → CP-5 → CP-6 → CP-a11y-piso → CP-mobile-perf
                                                          │
                                                          └─▶ MVP público liberado

Depois do MVP:  CP-a11y-alvo → Release público final
```

Todas as fatias respeitam `R-INC-01` (menor mudança coerente) e `R-SCOPE-01` (sem refactor oportunista).

## 2. CP-0 — Fundação (habilita sinal automático)

| ID | Requisito | Arquivos permitidos | Teste focal | Ameaça | Evidência | Rollback | Depend. | Owner | Estado |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| FATIA-DN-CP0-01 | Setup CI para axe-core | `.github/workflows/ci.yml` | job `a11y-axe` executa `@axe-core/playwright` e falha em violação `serious+` | RA-01 histórico + DN-RNF-001 | log workflow | reverter YAML | — | Infra + QA | IMPLEMENTADA — gate local detectou contraste 3,88:1 |
| FATIA-DN-CP0-02 | Setup CI para Lighthouse mobile | `.github/workflows/ci.yml` | job `lighthouse-mobile` executa `--preset=perf --form-factor=mobile --throttling.cpuSlowdownMultiplier=4` | DN-RNF-003 | JSON Lighthouse | reverter YAML | CP0-01 | Infra + SRE | IMPLEMENTADA — coleta local inconclusiva; validar no CI Linux |
| FATIA-DN-CP0-03 | Setup CI para ESLint com regras a11y | `frontend/eslint.config.mjs`, `.github/workflows/ci.yml` | job `lint` aplica regras Angular e template-a11y | RA-01 | log workflow | reverter config | — | Infra + Frontend | IMPLEMENTADA — lint aprovado |
| FATIA-DN-CP0-04 | Setup `msw` como mock server padrão | `frontend/src/test/mocks/handlers.ts`, `frontend/src/test/mocks/server.ts` | test suite carrega `msw` e intercepta `/api/*` | Cobertura geral | log Vitest | reverter setup | — | Frontend + Backend | IMPLEMENTADA — teste focal aprovado |
| FATIA-DN-CP0-05 | Fixtures sintéticas centrais | `frontend/src/test/fixtures/fixtures.ts` (`SYN-*`, `@example.com`) | test suite carrega fixtures | R-SEC-01 kit | log Vitest | reverter fixtures | — | QA | IMPLEMENTADA — teste focal aprovado |
| FATIA-DN-CP0-06 | Setup `pino-noir` para redaction | `backend-mock/src/logger.js`, `backend-mock/test/logger.spec.mjs` | 4 testes rejeitam campos PII em log de saída | T-DN-05, T-DN-09 | trace/log sanitizado | reverter logger | — | Backend + DPO | IMPLEMENTADA — 4/4 testes aprovados |

## 3. CP-1 — Tela Acolhimento (DN-RF-001, DN-RF-002)

| ID | Requisito | Arquivos permitidos | Teste focal | Ameaça | Evidência | Rollback | Depend. | Owner | Estado |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| FATIA-DN-CP1-01 | Componente `StepAcolhimento` | `frontend/src/app/steps/step-acolhimento/*` | unit-front: renderiza 3 CTAs + botão Avançar desabilitado sem escolha | DN-RF-001 | SH-DN-01, SH-DN-02 | reverter arquivos | CP0-01, CP0-03 | Frontend + Produto | IMPLEMENTADA — unit + E2E aprovados |
| FATIA-DN-CP1-02 | Registro da escolha como metadado da sessão | `frontend/src/app/services/acolhimento-state.service.ts` | unit-front: `origem_acolhimento` persiste em `sessionStorage` | DN-RF-001 | log Vitest | reverter serviço | CP1-01 | Frontend | IMPLEMENTADA — persistência/restauração aprovadas |
| FATIA-DN-CP1-03 | Redirect para Ouvidoria | `step-acolhimento` | e2e-mock: clique em "Fale com a Ouvidoria" chama `window.open` (mockado) para URL a definir | DN-RF-001 | trace Playwright | reverter componente | CP1-01, DEC-DN-19 (URL Ouvidoria) | Frontend + Produto | BLOQUEADA — URL da Ouvidoria não definida |
| FATIA-DN-CP1-04 | Componente vídeo institucional | `frontend/src/app/steps/step-acolhimento/video-institucional.*` | unit-front: player sem autoplay-com-som; captions ativas; transcrição visível | DN-RF-002, T-DN-20 | SH-DN-01 | reverter subcomp | CP1-01 | Frontend + A11y | IMPLEMENTADA — placeholder sintético; unit + E2E + axe aprovados |
| FATIA-DN-CP1-05 | Provider do vídeo sem cookies de terceiros | `angular.json`, `styles.css`, `index.html` | e2e-mock: inspeção de cookies confirma set-cookie externo = 0 | T-DN-20 | log Playwright | reverter config | CP1-04, DEC-DN-25 (hosting decision) | Frontend + DPO | BLOQUEADA — hosting do vídeo pendente |

## 4. CP-2 — Relato Guiado (DN-RF-003, DN-RF-004, DN-RS-002 mock)

| ID | Requisito | Arquivos permitidos | Teste focal | Ameaça | Evidência | Rollback | Depend. | Owner | Estado |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| FATIA-DN-CP2-01 | Componente `ChecklistIrregularidades` (mock taxonomia) | `step-relato-guiado/*`, `assets/taxonomia-mock.json` | unit-front: seleção múltipla; chip removível; obrigatório ≥ 1 | DN-RF-003 | SH-DN-03 | reverter arquivos | CP0-04, DEC-DN-10 (default mock) | Frontend + Produto | PRONTA-P/-AUTORIZAÇÃO (taxonomia mock; migração futura para taxonomia oficial) |
| FATIA-DN-CP2-02 | Textarea "do seu jeito" | `step-relato-guiado` | unit-front: sem limite artificial baixo; contador; sanitização client | DN-RF-004 | trace | reverter arquivos | CP2-01 | Frontend | PRONTA-P/-AUTORIZAÇÃO |
| FATIA-DN-CP2-03 | `AudioRecorderService` (MediaRecorder API) | `services/audio-recorder.service.ts` | unit-front: `start/stop` retorna Blob de fixture TTS | DN-RF-004 | log Vitest | reverter serviço | CP0-05 | Frontend | PRONTA-P/-AUTORIZAÇÃO |
| FATIA-DN-CP2-04 | Componente gravador in-app | `step-relato-guiado` (subcomponente) | e2e-mock: `--use-fake-device-for-media-stream` grava 3 s + player | DN-RF-004 | SH-DN-04 | reverter subcomp | CP2-03 | Frontend + A11y | PRONTA-P/-AUTORIZAÇÃO |
| FATIA-DN-CP2-05 | Fallback texto quando mic negado | `step-relato-guiado` | e2e-mock: permissão negada → UI mostra fallback textual | DN-RF-004 | trace | reverter comp | CP2-04 | Frontend + A11y | PRONTA-P/-AUTORIZAÇÃO |
| FATIA-DN-CP2-06 | `SttProxy` mock com `msw` | `test/mocks/handlers.ts`, `server/proxies/stt-proxy.js` (stub) | integ-sim: 3 casos (CONCLUIDA, FALHA, TIMEOUT) via `msw` | DN-RS-002, T-DN-02 | SH-DN-15 | reverter handler | CP0-04 | Backend + QA | PRONTA-P/-AUTORIZAÇÃO |
| FATIA-DN-CP2-07 | Preview de transcrição editável pelo usuário | `step-relato-guiado` | unit-front + e2e-mock: usuário edita antes do envio; `TranscricaoStatus.EDITADA_MANUALMENTE` persiste | DN-RS-002, T-DN-02 | trace | reverter comp | CP2-06 | Frontend | PRONTA-P/-AUTORIZAÇÃO |
| FATIA-DN-CP2-08 | Fixture TTS (`espeak-ng`) | `test/fixtures/audio/`, script `scripts/generate-tts-fixtures.js` | script gera 3 `.wav` sintéticos | DEC-DN-P-F5-4 | log CI | remover fixtures | — | QA | PRONTA-P/-AUTORIZAÇÃO |
| FATIA-DN-CP2-09 | Consentimento explícito antes de habilitar áudio | `step-relato-guiado` | unit-front: toggle "usar áudio" mostra modal LGPD; recusa mantém fluxo texto | T-DN-01, DN-RS-002 | trace | reverter comp | CP2-04 | Frontend + DPO | PRONTA-P/-AUTORIZAÇÃO |

## 5. CP-3 — Detalhamento + Evidências (DN-RF-005..009)

| ID | Requisito | Arquivos permitidos | Teste focal | Ameaça | Evidência | Rollback | Depend. | Owner | Estado |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| FATIA-DN-CP3-01 | `StepDetalhamento` (nº + modalidade + grupos) | `step-detalhamento/*` | unit-front: valores persistem; grupos multi-select acessível | DN-RF-005..007 | SH-DN-05 | reverter arquivos | CP0-03 | Frontend | PRONTA-P/-AUTORIZAÇÃO (defaults DEC-DN-13/14 opcionais) |
| FATIA-DN-CP3-02 | Contrato do payload (novos campos) | `models/complaint.model.ts`, contrato Swagger | unit-back: schema Zod aceita `numero_prejudicados`, `modalidade_trabalho`, `grupos_vulneraveis` | DN-RF-005..007 | log Vitest | reverter model | CP3-01 | Backend + Frontend | PRONTA-P/-AUTORIZAÇÃO |
| FATIA-DN-CP3-03 | Componente `EvidenceUploader` | `step-evidencias/*` | unit-front + e2e-mock: upload de PDF/JPG/PNG dentro do limite | DN-RF-008 | trace + SH-DN-06 | reverter comp | CP0-04, DEC-DN-15 (default 10×20MiB) | Frontend + Backend | PRONTA-P/-AUTORIZAÇÃO |
| FATIA-DN-CP3-04 | Validação MIME + magic bytes no BFF | `server/middleware/upload.js` (extensão) | integ-sim: 3 casos (allow, MIME mismatch, magic bytes divergentes → 422) | T-DN-04, RS-03 herdada | log CI | reverter middleware | CP0-05 | Backend + Segurança | PRONTA-P/-AUTORIZAÇÃO |
| FATIA-DN-CP3-05 | Rejeitar `.exe` e `.bat` | `server/middleware/upload.js` | integ-sim: 422 esperado | T-DN-04 | log CI | reverter middleware | CP3-04 | Segurança | PRONTA-P/-AUTORIZAÇÃO |
| FATIA-DN-CP3-06 | ClamAV mock (INSTREAM) | `test/mocks/handlers.ts` (novo endpoint TCP mock — via `net` stub) | integ-sim: 3 estados (clean, infected, timeout) | T-DN-04 | SH-DN-18 | reverter mock | CP0-04 | Backend + QA | PRONTA-P/-AUTORIZAÇÃO |
| FATIA-DN-CP3-07 | Subformulário Testemunhas | `step-evidencias` (subcomp) | unit-front: dados sintéticos persistem; opcional | DN-RF-009 | SH-DN-06 | reverter subcomp | CP3-03, DEC-DN-16 | Frontend + DPO | BLOQUEADA — DEC-DN-16 (LGPD testemunhas) |

## 6. CP-4 — Sigilo + Local (DN-RG-005, DN-RF-010..012)

| ID | Requisito | Arquivos permitidos | Teste focal | Ameaça | Evidência | Rollback | Depend. | Owner | Estado |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| FATIA-DN-CP4-01 | `StepSigiloAnonimato` — aviso destacado | `step-sigilo-anonimato/*`, `styles.css` | a11y-mock: contraste AAA ≥ 7:1 no aviso; foco visível | DN-RG-005, T-DN-19 | SH-DN-07 | reverter arquivos | CP0-01 | Frontend + A11y | PRONTA-P/-AUTORIZAÇÃO |
| FATIA-DN-CP4-02 | Confirmação explícita do aviso | `step-sigilo-anonimato` | e2e-mock: avanço bloqueado até clicar checkbox de confirmação; timestamp em log | DN-RG-005, T-DN-19 | trace + log | reverter comp | CP4-01 | Legal + Frontend | PRONTA-P/-AUTORIZAÇÃO |
| FATIA-DN-CP4-03 | Toggle "anônima" | `step-sigilo-anonimato`, `complaint.service.ts` | unit-front: campos identificadores ocultos; `anonimo=true` no state | DN-RF-010 | trace | reverter comp | CP4-01 | Frontend | PRONTA-P/-AUTORIZAÇÃO |
| FATIA-DN-CP4-04 | Frontend zera PII quando anônimo | `complaint.service.ts`, `complaint-api.client.ts` | unit-front: payload de saída sem `nome`/`email`/`telefone` | DN-RF-010, T-DEN-01 herdada | log Vitest | reverter arquivos | CP4-03 | Frontend + DPO | PRONTA-P/-AUTORIZAÇÃO |
| FATIA-DN-CP4-05 | BFF `applyAnonimizationRules()` | `server/services/complaint.service.js` | unit-back: 4 casos (recebe com PII, sem PII, misto, anônimo com PII → 400) | DN-RF-010, T-DEN-01 herdada, T-DN-05 | log CI | reverter service | CP0-06 | Backend + DPO | BLOQUEADA — depende de CP0-06 (pino-noir) e D-DN-06 |
| FATIA-DN-CP4-06 | `StepLocal` com UF/município obrigatório | `step-local-empresa/*`, `msw` (IBGE mock) | unit-front + e2e-mock: erro `aria-live` sem UF/mun; foco no campo inválido | DN-RF-011 | SH-DN-08 | reverter comp | CP0-04 | Frontend + A11y | PRONTA-P/-AUTORIZAÇÃO |
| FATIA-DN-CP4-07 | Fallback `municipios-ibge.json` local | `step-local-empresa`, `assets/municipios-ibge.json` | e2e-mock: IBGE 500 → carrega fallback local | DN-RF-011 | trace | reverter arquivos | CP4-06 | Frontend | PRONTA-P/-AUTORIZAÇÃO |
| FATIA-DN-CP4-08 | Empresa opcional com hint | `step-local-empresa` | unit-front: campo em branco permite avanço; hint visível | DN-RF-012 | trace | reverter comp | CP4-06 | Frontend + UX | PRONTA-P/-AUTORIZAÇÃO |

## 7. CP-5 — Revisão + Confirmação (DN-RF-013, DN-RF-014)

| ID | Requisito | Arquivos permitidos | Teste focal | Ameaça | Evidência | Rollback | Depend. | Owner | Estado |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| FATIA-DN-CP5-01 | `StepRevisao` com sumário editável | `step-revisao/*` | unit-front + e2e-mock: clique em "editar" retorna ao passo mantendo estado | DN-RF-013, T-DN-18 | SH-DN-09 | reverter comp | CP0-04 | Frontend | PRONTA-P/-AUTORIZAÇÃO |
| FATIA-DN-CP5-02 | Confirmação explícita para envio | `step-revisao` | e2e-mock: envio bloqueado até clique "Confirmar" | DN-RF-013 | trace | reverter comp | CP5-01 | Frontend | PRONTA-P/-AUTORIZAÇÃO |
| FATIA-DN-CP5-03 | Auto-save `sessionStorage` | `complaint.service.ts` | e2e-mock: reload restaura estado do passo atual | T-DN-18 | trace + SH-DN-19 | reverter serviço | CP1-02 | Frontend | PRONTA-P/-AUTORIZAÇÃO |
| FATIA-DN-CP5-04 | Gerador de protocolo `SYN-XXXXXXXX` (mock) | `server/services/complaint.service.js` | unit-back: regex `^SYN-[A-Z0-9]{8}$` + entropia mínima | DN-RF-014, DEC-DN-P-F5-3 | log Vitest | reverter serviço | CP0-06 | Backend + Segurança | BLOQUEADA — depende de D-DN-06 |
| FATIA-DN-CP5-05 | `StepConfirmacao` com protocolo + link do infográfico | `step-confirmacao/*` | e2e-mock: protocolo `SYN-*` renderizado; link ao infográfico | DN-RF-014 | SH-DN-10 | reverter comp | CP5-04 | Frontend | PRONTA-P/-AUTORIZAÇÃO |
| FATIA-DN-CP5-06 | `InfograficoFluxo` SVG acessível | `components/infografico-fluxo/*` | a11y-mock: descrição textual + landmarks acessíveis | DN-RF-014, DN-RNF-001 | SH-DN-10 | reverter comp | CP5-05 | Frontend + A11y | PRONTA-P/-AUTORIZAÇÃO |
| FATIA-DN-CP5-07 | Copy do infográfico com SLA | `components/infografico-fluxo` | unit-front: mensagem inclui prazo aproximado | DN-RF-014, DEC-DN-20 | trace | reverter comp | CP5-06, DEC-DN-20 | Produto | BLOQUEADA — DEC-DN-20 (SLA) |

## 8. CP-6 — Classificador + Alertas mock + LGPD art. 20

| ID | Requisito | Arquivos permitidos | Teste focal | Ameaça | Evidência | Rollback | Depend. | Owner | Estado |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| FATIA-DN-CP6-01 | `ClassifierProxy` mock determinístico | `server/proxies/classifier-proxy.js`, `test/mocks/handlers.ts` | integ-sim: envelope entra → `Classificacao` estático de teste | DN-RS-003, T-DN-05 | SH-DN-16 | reverter arquivos | CP0-06 | Backend + QA | BLOQUEADA — depende de CP0-06 e D-DN-06 |
| FATIA-DN-CP6-02 | Rejeitar PII no payload do classificador | `services/complaint.service.js` | unit-back: fixture com PII → teste bloqueia envio | T-DN-05, DN-RNF-004 | SH-DN-16 | reverter arquivos | CP6-01 | Backend + DPO | BLOQUEADA — depende de D-DN-06 |
| FATIA-DN-CP6-03 | Prioridade sempre server-side | `services/complaint.service.js`, contrato | integ-sim: request com `prioridade` no body → 400 | T-DN-06 | trace | reverter arquivos | CP3-02 | Backend | BLOQUEADA — depende de D-DN-06 |
| FATIA-DN-CP6-04 | Campos LGPD art. 20 no envelope MPT | `services/complaint.service.js`, contrato Swagger | unit-back: envelope inclui `metodo`, `versao_classificador`, `revisada_por_humano` | T-DN-07 | log Vitest | reverter arquivos | CP6-01 | Backend + DPO | BLOQUEADA — depende de D-DN-06 |
| FATIA-DN-CP6-05 | `AlertDispatcher` mock | `server/services/alert.service.js`, `msw` webhook | integ-sim: envelope urgente → alerta despachado; payload sem PII | DN-RS-004, T-DN-09 | SH-DN-17 | reverter arquivos | CP0-04, CP6-01 | Backend + SRE | BLOQUEADA — depende de D-DN-06 |
| FATIA-DN-CP6-06 | Rate limit / throttle no dispatcher | `server/services/alert.service.js` | integ-sim: rajada de 20 → throttling ativa | T-DN-10 | log | reverter arquivos | CP6-05 | Backend + SRE | BLOQUEADA — depende de D-DN-06 |
| FATIA-DN-CP6-07 | Revisão humana obrigatória para URGENTE (stub) | `server/services/alert.service.js` | integ-sim: URGENTE sem `revisada_por_humano=true` → alerta suspenso | T-DN-07, T-DN-08 | log | reverter arquivos | CP6-05, P-F4-sec-3 | Produto + DPO | BLOQUEADA — P-F4-sec-3 (interface admin) |

## 9. CP-a11y-piso (WCAG 2.1 AA — antes do MVP público)

| ID | Requisito | Arquivos permitidos | Teste focal | Ameaça | Evidência | Rollback | Depend. | Owner | Estado |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| FATIA-DN-A11Y-PISO-01 | `axe-core` `wcag21aa` em CI | `.github/workflows/ci.yml`, `e2e/*.spec.ts` | job falha se `criticalFindings > 0` sob `wcag21aa` | DN-RNF-001, DEC-DN-07 | SH-DN-11 | reverter YAML | CP0-01 | A11y + Infra | PRONTA-P/-AUTORIZAÇÃO |
| FATIA-DN-A11Y-PISO-02 | Correções batch 1 — labels e descritores | steps + `styles.css` | unit-front + a11y-mock: 0 violações `wcag2a` de `label-*` | RA-01 herdada | axe report | reverter arquivos | CP-a11y-piso-01 | A11y + Frontend | PRONTA-P/-AUTORIZAÇÃO |
| FATIA-DN-A11Y-PISO-03 | Correções batch 2 — foco e `aria-live` | steps + `complaint.service.ts` | a11y-mock: transições anunciadas | RA-01 herdada | axe report | reverter arquivos | CP-a11y-piso-01 | A11y + Frontend | PRONTA-P/-AUTORIZAÇÃO |
| FATIA-DN-A11Y-PISO-04 | Correções batch 3 — contraste | `styles.css` | a11y-mock: contraste ≥ 4.5:1 no texto normal | RA-01 herdada | axe report | reverter styles | CP-a11y-piso-01 | A11y + Design | PRONTA-P/-AUTORIZAÇÃO |

## 10. CP-mobile-perf (DN-RNF-002, DN-RNF-003)

| ID | Requisito | Arquivos permitidos | Teste focal | Ameaça | Evidência | Rollback | Depend. | Owner | Estado |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| FATIA-DN-MOBILE-01 | Playwright multi-viewport ≤ 360 px | `playwright.config.ts`, `e2e/mobile.spec.ts` | e2e-mock: wizard completo sem overflow em 360×640 | DN-RNF-002 | SH-DN-01..10 | reverter config | CP0-01 | QA + Frontend | PRONTA-P/-AUTORIZAÇÃO |
| FATIA-DN-MOBILE-02 | Área de toque ≥ 44×44 px | `styles.css`, componentes | a11y-mock: `axe-core wcag22aa target-size` sem violação | DN-RNF-002 | axe report | reverter styles | CP-mobile-01 | A11y + Frontend | PRONTA-P/-AUTORIZAÇÃO |
| FATIA-DN-MOBILE-03 | Lighthouse mobile `Slow 3G` job | `.github/workflows/ci.yml` | job produz `SH-DN-12` com LCP ≤ 4 s e TTI ≤ 6 s (defaults; ajustar após DEC-DN-08) | DN-RNF-003 | SH-DN-12 | reverter YAML | CP0-02, DEC-DN-08 | SRE + Frontend | BLOQUEADA — DEC-DN-08 (SLA formal) |

## 11. CP-a11y-alvo (WCAG 2.2 AA — antes do release público final)

| ID | Requisito | Arquivos permitidos | Teste focal | Ameaça | Evidência | Rollback | Depend. | Owner | Estado |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| FATIA-DN-A11Y-ALVO-01 | Migrar CI para `wcag22aa` | `.github/workflows/ci.yml`, `e2e/*.spec.ts` | job passa em `wcag22aa` | DN-RNF-001, DEC-DN-07 | SH-DN-11 | reverter YAML | CP-a11y-piso-01..04 | A11y + Infra | PRONTA-P/-AUTORIZAÇÃO |
| FATIA-DN-A11Y-ALVO-02 | `Focus Not Obscured` (WCAG 2.4.11) | componentes com overlay/modal | a11y-mock: elemento focado nunca coberto por sticky | DN-RNF-001 | axe | reverter arquivos | CP-a11y-alvo-01 | Frontend + A11y | PRONTA-P/-AUTORIZAÇÃO |
| FATIA-DN-A11Y-ALVO-03 | `Dragging Movements` (WCAG 2.5.7) | qualquer drag no wizard | a11y-mock: alternativa sem drag em todos os controles | DN-RNF-001 | axe | reverter arquivos | CP-a11y-alvo-01 | Frontend + A11y | PRONTA-P/-AUTORIZAÇÃO |
| FATIA-DN-A11Y-ALVO-04 | `Target Size (Minimum)` (WCAG 2.5.8) | `styles.css` | a11y-mock: target size ≥ 24×24 (exceto exceções) | DN-RNF-001 | axe | reverter styles | CP-a11y-alvo-01 | Frontend + A11y | PRONTA-P/-AUTORIZAÇÃO |
| FATIA-DN-A11Y-ALVO-05 | `Consistent Help` (WCAG 3.2.6) | header/footer global | a11y-mock: link "ajuda" na mesma posição em todo o wizard | DN-RNF-001 | axe | reverter arquivos | CP-a11y-alvo-01 | Frontend + A11y | PRONTA-P/-AUTORIZAÇÃO |
| FATIA-DN-A11Y-ALVO-06 | `Redundant Entry` (WCAG 3.3.7) | `complaint.service.ts` | a11y-mock: valores já informados aparecem pré-preenchidos ou seletáveis | DN-RNF-001 | axe | reverter serviço | CP-a11y-alvo-01 | Frontend + A11y | PRONTA-P/-AUTORIZAÇÃO |
| FATIA-DN-A11Y-ALVO-07 | `Accessible Authentication (Minimum)` (WCAG 3.3.8) | não aplicável ao MVP (sem login) | — | — | — | — | — | A11y | FORA-DO-MVP (só se DN-RS-001 voltar) |

## 12. Fatias FORA-DO-MVP (arquivadas)

| ID | Motivo |
| --- | --- |
| FATIA-DN-BOT-01 a 04 | Chatbot WhatsApp fora do MVP (DEC-DN-09 = Opção A). Retomar em `DEC-DN-09B`. |
| FATIA-DN-LIVE-STT-01, 02 | Live STT — sem contratação piloto (DEC-DN-P-F5-6). |
| FATIA-DN-LIVE-CLASSIFIER-01, 02 | Live Classificador — idem. |
| FATIA-DN-LIVE-BFF-01..03 | `live-BFF` fora do MVP (DEC-DN-P-F5-5). |
| FATIA-DN-LIVE-MPT-01 | `live-MPT` — sem autorização; herda decisão do produto principal. |
| FATIA-DN-KPI-BASELINE-01 | Baseline pré-implantação (DEC-DN-21) — não é escopo técnico. |

## 13. Ordem de execução recomendada (linha do tempo)

```
CP-0-01..05         (setup CI + fixtures + mocks) — semana 1
   │
CP-1-01, 02, 04     (Acolhimento MVP)             — semana 1
   │
CP-2-01..09         (Relato Guiado com STT mock)  — semana 2
   │
CP-3-01..06         (Detalhamento + Uploads + ClamAV mock) — semana 3
   │
CP-4-01..04, 06..08 (Sigilo + Local, sem CP4-05 bloqueada) — semana 4
   │
CP-5-01..03, 05..06 (Revisão + Confirmação, sem CP5-04/07 bloqueadas) — semana 4
   │
CP-a11y-PISO-01..04 (WCAG 2.1 AA obrigatório)     — semana 5
   │
CP-mobile-01, 02    (mobile-first)                 — semana 5
   │
[MVP público liberado]

Depois:
CP-a11y-ALVO-01..06 (WCAG 2.2 AA)                  — ciclo seguinte
CP-mobile-03        (Lighthouse perf com DEC-DN-08 respondida)
CP-6-*              (Classificador + Alertas — depende de CP0-06 desbloqueado)
```

## 14. Sumário

| Estado | Contagem |
| --- | ---: |
| PRONTA-P/-AUTORIZAÇÃO | 33 |
| BLOQUEADA (motivo declarado) | 14 |
| FORA-DO-MVP (arquivada) | 12 |
| **Total planejado** | **59 fatias** |

Blocos com maior número de fatias `PRONTA`: **CP-a11y-piso (4)**, **CP-2 (9)**, **CP-4 (7)**, **CP-a11y-alvo (6)**.
Blocos com maior número de fatias `BLOQUEADA`: **CP-6 (7)** — todo dependendo de `D-DN-06` (código do produto) e/ou `CP0-06` (`pino-noir`).

## 15. Regras de escalonamento herdadas

Cada fatia respeita:

- **R-INC-01** — menor mudança coerente.
- **R-SRC-01** — fonte primária vence documentação.
- **R-EVD-01** — sem evidência externa, alegação externa não vale.
- **R-QA-01** — teste focal antecede alegação de sucesso.
- **R-REV-01** — review adversarial independente antes de fechar.
- **R-SCOPE-01** — preservar mudanças locais; evitar refactor oportunista.
- **§4.0.6** da persona — anti-padrões proibidos permanecem.
