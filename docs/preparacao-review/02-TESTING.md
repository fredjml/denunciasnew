# 02-TESTING — Passo 6 (Testar por modo)

> Preenchido a partir do template `licoesaprendidas/templates/testing.md`.

## Versão e ambiente

- Node ≥ 22 (backend-mock declara `engines.node >= 22.0.0`); Angular 22.1; Express 4.21.
- SO de execução: Windows 11 (Git Bash). CI (`​.github/workflows/ci.yml`) roda em `ubuntu-latest`.
- Modo de teste: **`unit-front`, `unit-back`, `integ-sim`, `e2e-mock`, `a11y-mock`** (ver
  `10-EVIDENCE-MANIFEST.delta-denunciasnew.md` §2 para definição de cada modo). Nenhum modo
  `live-*` foi executado — não há ambiente `live-BFF`/`live-STT`/`live-MPT` autorizado.

## Matriz

| Requisito | Nível/modo | Caso/fixture | Comando | Esperado | Resultado | Evidência | Limitação |
| --- | --- | --- | --- | --- | --- | --- | --- |
| DN-RF-001..014 (fluxo completo) | e2e-mock | `frontend/e2e/fluxo-completo.spec.ts` | `npx playwright test e2e/fluxo-completo.spec.ts` | Acolhimento→Confirmação com protocolo `SYN-*`; protocolo sobrevive a reload | ✅ aprovado | commit `c24f910`, log local | API sempre mockada (`backend-mock`) |
| DN-RNF-001 (WCAG 2.1 AA) | a11y-mock | `frontend/e2e/accessibility.spec.ts` | `npx playwright test e2e/accessibility.spec.ts` | 0 violações `serious`/`critical` em todas as 8 telas | ✅ aprovado (0 violações) | idem | axe-core não prova conformidade legal completa |
| T-DN-04 (upload malicioso) | integ-sim | `backend-mock/test/denuncias.spec.mjs`, `evidencias.spec.mjs` | `npx vitest run` (backend-mock) | extensão bloqueada/MIME/magic-bytes/EICAR → 422 nas duas rotas | ✅ aprovado (9 casos) | commit `58b5c57` | ClamAV é mock por assinatura, não scanner real |
| T-DN-18 (auto-save) | e2e-mock | `frontend/e2e/acolhimento.spec.ts` (+ manual) | reload em qualquer etapa | texto/seleção/etapa atual restaurados | ✅ aprovado | `shared/persisted-signal.ts` + testes unitários | anexos de evidência não persistem entre reloads (limitação de `File`/Blob) |
| DN-RF-004 (áudio) | e2e-mock | `frontend/e2e/relato-guiado.spec.ts` | `--use-fake-device-for-media-stream` | grava, transcreve (mock), fallback se negado | ✅ aprovado (2 cenários) | commit `cc9b5ac` | fixture de áudio é ruído branco, não fala real |
| Todos os serviços de estado | unit-front | `frontend/src/app/services/*.spec.ts` | `ng test --watch=false` | comportamento isolado por serviço | ✅ aprovado | ver contagem abaixo | — |
| Rotas do backend-mock | unit-back/integ-sim | `backend-mock/test/*.spec.mjs` | `vitest run` | validação de payload, upload, STT mock | ✅ aprovado | ver contagem abaixo | — |

## Execuções

| Data | Commit | Runtime | Comando | Exit code/contagem | Duração | Artifact |
| --- | --- | --- | --- | --- | --- | --- |
| 2026-09-05 | `c24f910` | Node 22 / Windows | `npm run lint` (raiz) | 0 erros (frontend + backend-mock) | ~5 s | log de terminal (não persistido) |
| 2026-09-05 | `c24f910` | Node 22 / Windows | `npm test` (raiz) | frontend 68/68 · backend-mock 22/22 | ~20 s | idem |
| 2026-09-05 | `c24f910` | Node 22 / Windows | `npm run build` (raiz) | build Angular sem erros, bundle 330,75 kB | ~3 s | `frontend/dist/frontend/` (não versionado) |
| 2026-09-05 | `c24f910` | Node 22 / Windows / Chromium (Pixel 5) | `npx playwright test` | 11/11 | ~7 s | `frontend/playwright-report/` (não versionado) |
| 2026-09-05 | `c24f910` | — | `git diff --check` | 0 avisos | instantâneo | — |

**Progressão da contagem de testes ao longo da sessão** (evidência de que a suíte cresceu junto
com o código, não foi escrita depois):

| Momento | Frontend (Vitest) | Backend-mock (Vitest) | E2E (Playwright) |
| --- | --- | --- | --- |
| Fim do CP-2 | 24 | 13 | 6 |
| Fim do CP-3 | 37 | 13 | 10 |
| Fim do CP-4/CP-5 | 64 | 18 | 11 |
| Fim (após DEC-DN-16 + review de segurança) | **68** | **22** | **11** |

## Manual/a11y/live

- Verificação visual manual: screenshots reais capturados via Playwright (não mockup) para as 8
  telas, comparados lado a lado com o PDF `Documento externo-outros 010970.2026.pdf` — ver
  `03-EVIDENCE-MANIFEST.md`.
- Nenhum teste `live` executado (sem autorização/ambiente para BFF real, IBGE real, STT real,
  classificador real).
- Teste manual com tecnologia assistiva real (NVDA/VoiceOver) **não executado** — apenas
  axe-core automatizado.

## Não executado/inconclusivo

- `npm run lighthouse:ci` (Slow 3G) — não executado nesta sessão; bloqueado por `DEC-DN-08`
  (SLA de performance não definido).
- Testes de carga/rate-limit — fora do escopo do MVP (`R-DN-04` aplica rate limit compartilhado,
  mas não foi testado sob carga).
- `npm audit` — não executado nesta sessão; recomendado antes de qualquer publicação externa.

## Falhas conhecidas e severidade

Nenhuma falha aberta ao final da sessão. Falhas encontradas **durante** a sessão foram corrigidas
antes do commit seguinte (ver `04-REVIEW.md` para o achado de severidade HIGH e sua correção).

## Decisão Gate 4 (Testing)

**APROVADO.** Cobertura de requisitos do fluxo principal (CP-0..CP-5) completa com evidência
executada nesta sessão; nenhuma falha obrigatória pendente. Gate 4 do kit
(`licoesaprendidas/06-gates-qa-testes-seguranca.md`) considerado satisfeito para o escopo
implementado — não cobre CP-6 (não implementado) nem modos `live-*` (fora de escopo do MVP).
