# Passo 1 — ANALYSIS

Template original: [`templates/analysis.md`](../licoesaprendidas/templates/analysis.md). Este preenchimento é **estático e read-only** (não executou comandos). Reexecute o pre-flight ([02-PRE-FLIGHT.md](02-PRE-FLIGHT.md)) para atualizar em `EVIDÊNCIA CONFIRMADA`.

## Objetivo / fonte / commit

- **Objetivo**: reconstruir baseline verificável do Canal de Denúncias antes de propor qualquer implementação; decidir GO / GO COM RISCOS / NO-GO para os próximos Gates.
- **Fonte primária**: `cidadania-canal-denuncias/AGENTS.md` (raiz), `frontend/AGENTS.md`, `planejamento.md`, `spec_design.md`, código, testes, Swagger.
- **Commit/data**: branch `stg`; leitura estática em 2026-08-27. Hash e árvore de arquivos devem ser capturados pelo pre-flight executável.

## Inventário e documentos lidos

| Fonte | Versão/local | Papel | Confiança/drift |
| --- | --- | --- | --- |
| `cidadania-canal-denuncias/AGENTS.md` (raiz) | não localizado nesta compilação | fonte primária esperada | **NÃO FOI POSSÍVEL DETERMINAR** — pre-flight deve confirmar existência/versão |
| `cidadania-canal-denuncias/frontend/AGENTS.md` | presente | governança frontend | EVIDÊNCIA CONFIRMADA (14 guardrails; menciona Multer em memória — drift D-01) |
| `cidadania-canal-denuncias/planejamento.md` | presente | roadmap | EVIDÊNCIA PARCIAL — divergência com manifest (D-03) |
| `cidadania-canal-denuncias/spec_design.md` | presente | design system | EVIDÊNCIA PARCIAL — não reexaminado por rodada de a11y |
| `docs/Analises/RELATORIO_FINAL_SANITIZACAO_CODEBASE_DENUNCIAS.md` | 21/07/2026 | 17 incrementos executados sem push | EVIDÊNCIA HISTÓRICA datada |
| `docs/Analises/RELATORIO_ARQUIVOS_ALTERADOS_DENUNCIAS.md` | 24/07/2026 | 56 arquivos, +6.544/−1.308 vs `origin/main` | EVIDÊNCIA HISTÓRICA datada |
| `docs/Analises/RELATORIO_TESTES_DENUNCIAS.md` | 24/07/2026 | 30/30 back, 8/8 front, 16/16 E2E | EVIDÊNCIA HISTÓRICA — não vale como estado atual |
| `docs/Analises/RELATORIO_DIAGNOSTICO_FRONTEND_PRODUCAO.md` | 26/07/2026 | prontidão frontend | EVIDÊNCIA HISTÓRICA datada |
| `docs/Analises/RELATORIO_SUGESTOES_MELHORIAS_UI_UX_ACESSABILIDADE.md` | 26/07/2026 | UX/WCAG 2.1 AA | EVIDÊNCIA HISTÓRICA datada |
| `docs/Analises/RELATORIO_ANALISE_QA_CLEANCODE_SECURITY_REGRESSAO.md` | 31/07/2026 | 47 achados P0–P3 | EVIDÊNCIA HISTÓRICA datada |
| `docs/licoesaprendidas/**` | kit versão 26/08/2026 | controles/templates | referencial |

## Arquitetura e fluxo de dados (síntese observada)

```
[Cidadão / Navegador]
       │  HTTPS
       ▼
[Angular 22 SPA]  ── standalone components, signals, ComplaintService, ComplaintApiClient
       │  fetch + FormData (multipart) → /api/denuncias
       ▼
[Angular dev proxy]  (dev)  ── proxy.conf.json → :3000
       │
       ▼
[BFF Express 4.22]  server/index.js
       │
       ├─ routes/complaint.routes.js
       │      └─ middleware/upload.js (Multer diskStorage, MIME allowlist, MAX_FILES/MAX_FILE_SIZE)
       │              └─ controllers/complaint.controller.js
       │                      └─ services/complaint.service.js
       │                              ├─ clients/clamav.client.js  ── INSTREAM TCP → [ClamAV]
       │                              └─ clients/mpt-api.client.js ── Axios → [API MPT]
       │
       ├─ Redis (rate-limit compartilhado; obrigatório em prod)
       ├─ Helmet, CORS, express-rate-limit, morgan (logs sanitizados)
       └─ Swagger JSDoc / /api-docs (desabilitado por padrão em prod)
```

Zonas de confiança relevantes: navegador → SPA → BFF → armazenamento temporário → ClamAV → API MPT; observabilidade lateral (logs/métricas).

## Requisitos e aceite extraídos

Ver [06-REQUIREMENTS.md](06-REQUIREMENTS.md) para a lista completa com IDs, Dado/Quando/Então e origem. Aqui, catálogo mínimo confirmado:

- RF-01 a RF-12 do kit `02-engenharia-reversa-requisitos.md` (baseline observado).
- RF-13 a RG-02 candidatos derivados dos achados abertos em `docs/Analises/`.
- RNF-SEC-01/02, RNF-PRV-01, RNF-A11Y-01, RNF-REL-01, RNF-PERF-01, RNF-MNT-01, RNF-REP-01, RNF-OBS-01.

## Ferramentas, versões e comandos

Ver [03-TOOLS.md](03-TOOLS.md). Comandos candidatos read-only (não executados nesta compilação):

```powershell
git status --short
git branch --show-current
git remote -v
git -C cidadania-canal-denuncias status --short
git -C cidadania-canal-denuncias branch --show-current
git -C cidadania-canal-denuncias remote -v

rg --files cidadania-canal-denuncias -g '!node_modules' -g '!dist'
rg -n 'TODO|FIXME|HACK|bypassSecurityTrust|innerHTML|console\.|process\.env' cidadania-canal-denuncias

node --version
npm --version
npm --prefix cidadania-canal-denuncias run
npm --prefix cidadania-canal-denuncias/server run
```

## MCPs / skills / rules

Ver [04-MCP.md](04-MCP.md) e a skill deste pacote em [skills/denuncias-preparacao-implementacao/SKILL.md](skills/denuncias-preparacao-implementacao/SKILL.md).

- Rules P0 do kit ([`04-ia-rules-skills-tools-mcp-agents.md`](../licoesaprendidas/04-ia-rules-skills-tools-mcp-agents.md)) aplicam-se integralmente. Nenhuma rule adicional é criada aqui sem owner.
- Skill de review já existente ([`docs/licoesaprendidas/skill/denuncias-quality-review/SKILL.md`](../licoesaprendidas/skill/denuncias-quality-review/SKILL.md)) fica como **skill de review**; a nova skill deste pacote é focada em **preparação**.

## Dados, segurança e privacidade

- Dados sensíveis previstos: denúncia (relato_texto), identidade opcional (nome, e-mail, telefone), anexos (documentos, áudio), metadados (UF/município, empresa).
- Em modo anônimo, PII deve ser removida antes do payload (ver ameaça **T-DEN-01**).
- Logs **não podem** conter PII, anexo, token, URL interna MPT ou payload completo.
- Retenção operacional sugerida: 10 dias (fonte: RELATORIO_FINAL). Requer aprovação DPO/jurídico antes de firmar.
- Segredos: `MPT_API_TOKEN` só no BFF; nunca em frontend, logs, artifacts, prompts ou chat.

## Dependências técnicas e humanas

Técnicas:

- Node ≥ 24.15 ou ≥ 26 (drift D-07 com CI Node 22.22.3).
- Angular 22.0.5, TypeScript 6.0.2, RxJS 7.8, Bootstrap 5.3.
- Express 4.22, Axios, Multer (diskStorage), Helmet, express-rate-limit, Redis client.
- ClamAV externo obrigatório em produção (INSTREAM TCP).
- API MPT com URL/token — contrato ainda não formalizado neste kit.

Humanas (owners pendentes — bloqueio):

- Produto (dono do aceite).
- Segurança/AppSec.
- DPO/Jurídico (LGPD, retenção, anonimato).
- Integração MPT (contrato, protocolo, aceite live).
- Infra (Redis, ClamAV, CI/CD, ambientes).
- QA / Acessibilidade.

## Hipóteses e contraprovas

| Hipótese | Evidência favorável | Evidência contrária | Teste proposto | Estado |
| --- | --- | --- | --- | --- |
| H-01: Protocolo do MPT é retornado pela API MPT | Documentação histórica sugere isso | BFF gera `MPT-XXXXXXXX` antes do envio; cliente ignora corpo (RF-07) | Decisão formal do owner de integração + teste de contrato | **conflito material — bloqueio de RF-06/07** |
| H-02: E2E atual comprova integração com BFF | Playwright roda multi-browser (16/16) | webServer do Playwright inicia apenas Angular; API é interceptada | Rodar E2E com BFF subido em ambiente controlado | **falsa** para "live" |
| H-03: Development e production têm mesma segurança | Alegação genérica de "fail-closed" | Development aceita ClamAV/MPT indisponíveis | Auditoria de configuração por ambiente | **parcial** — separar rótulos |
| H-04: PII é removida no modo anônimo | Relatos afirmam existência do modo | RELATORIO_ANALISE §5.1 SEC-01: PII persiste no payload | Teste unitário + integração + review de payload | **refutada** (bloqueia produção) |
| H-05: Protocolo é imprevisível | Existe função de geração | RELATORIO_ANALISE §5.1 SEC-02: usa `Math.random()` | Teste de aleatoriedade + revisão de fonte | **refutada** |
| H-06: `upload.any()` está restrito | Middleware existe | RELATORIO_ANALISE §5.2 SEC-03: aceita campos arbitrários | Teste com campo desconhecido | **refutada** |
| H-07: MIME validado por conteúdo | MIME allowlist declarada | RELATORIO_ANALISE §5.2 SEC-04: só header HTTP | Teste com renome de extensão | **refutada** |
| H-08: CSP restritiva ativa | Helmet presente | RELATORIO_ANALISE §5.2 SEC-05: CSP padrão | Inspecionar header CSP | **refutada** |
| H-09: `mpt-api.client.js` é injetável | Similaridade com `clamav.client.js` | RELATORIO_ANALISE §5.2 SEC-06: lê `process.env` direto | Teste com injeção falsa | **refutada** |
| H-10: CI roda todos os gates | Manifests declaram scripts | RELATORIO_ANALISE §6.1 REG-01: E2E fora do pipeline; §6.2 REG-06: `test` backend fora | Inspecionar workflows `.github/` | **refutada** |
| H-11: `ui-audit.spec.ts` falha em achado crítico | Existe spec | RELATORIO_ANALISE §6.1 REG-02: assertivas ausentes | Ler assertivas | **refutada** |

## Riscos, ambiguidades e bloqueios

Bloqueadores (P0) mapeados como requisitos em [06-REQUIREMENTS.md](06-REQUIREMENTS.md):

1. **T-DEN-01 / QA-02 / SEC-01** — PII persiste em modo anônimo (LGPD).
2. **T-DEN-02 / QA-03** — Áudio `Blob` descartado pelo `JSON.stringify`.
3. **QA-01** — Wizard avança sem obrigatórios.
4. **T-DEN-03 / SEC-02** — Protocolo com `Math.random()`.
5. **REG-01 / REG-06** — CI não roda E2E nem test backend.
6. **REG-02** — `ui-audit.spec.ts` sem assertivas críticas.

Ambiguidades:

- Ownership do protocolo e do aceite (D-04).
- Política oficial de retenção de logs e anexos.
- Browser matrix corporativa vs. Angular Baseline.
- Comportamento fail-open/fail-closed por ambiente.

## Plano de testes / evidência

Ver [10-EVIDENCE-MANIFEST.md](10-EVIDENCE-MANIFEST.md) e [`docs/licoesaprendidas/06-gates-qa-testes-seguranca.md`](../licoesaprendidas/06-gates-qa-testes-seguranca.md).

Estratégia por nível (reiterando o kit):

| Nível | Prova | Não prova |
| --- | --- | --- |
| Unitário frontend | signals, estado, validação, FormData, erros | BFF ou browser real |
| Unitário backend | regras, protocolo, clientes/doubles | infraestrutura live |
| Integração BFF (Supertest) | rota/middleware/status + doubles | Redis/ClamAV/MPT reais |
| Integração secure upload | endpoint com scanner controlado | ClamAV de produção |
| E2E Playwright atual | wizard multi-browser com API interceptada | BFF, Redis, ClamAV, MPT |
| axe | subset de violações | conformidade WCAG completa |
| Live autorizado | integração real no ambiente nomeado | produção inteira / resiliência |
| UI/manual | experiência observada | todos usuários / AT |

## Pre-flight e decisão

Ver [02-PRE-FLIGHT.md](02-PRE-FLIGHT.md).

**Decisão vigente (com base em leitura estática, sem executar comandos)**: `NO-GO` para implementação até que:

1. Owners humanos estejam atribuídos (Produto, Segurança, DPO, Integração MPT, Infra, QA).
2. Pre-flight executável seja rodado ([13-PROMPTS.md#passo-1](13-PROMPTS.md#passo-1)) para confirmar runtime, dependências, ferramentas e Git.
3. Requisitos P0 (RF-13, RF-14, RF-15, RS-01, RG-01, RG-02) estejam aprovados por Produto/Segurança/QA.
4. Decisão material sobre ownership do protocolo (D-04) esteja registrada.

Assim que 1–4 forem atendidos, esta análise pode ser promovida a `GO COM RISCOS` para as fatias P0 do plano.

## Definition of Ready — estado atual

- [ ] fonte primária e objetivo — parcial (kit lido; código não reexecutado)
- [ ] IDs, tipos, aceite e escopo negativo — parcial (candidatos em [06-REQUIREMENTS.md](06-REQUIREMENTS.md))
- [ ] conflitos, hipóteses e exclusões decididos — **não** (D-04 aberto)
- [ ] ambiente, versões, Git/branch/target e lockfiles — **não** (drift D-07)
- [ ] tools/MCPs validados ou fallback — parcial ([03-TOOLS.md](03-TOOLS.md), [04-MCP.md](04-MCP.md))
- [ ] secrets/dados/custos identificados sem valores e com owner — **não** (owners pendentes)
- [ ] arquitetura, fluxo de dados, contrato e threat model — parcial ([08-TDD.md](08-TDD.md), [09-THREAT-MODEL.md](09-THREAT-MODEL.md))
- [ ] plano incremental, testes, evidência e rollback — parcial ([11-IMPLEMENTATION-PLAN.md](11-IMPLEMENTATION-PLAN.md))
- [ ] dependências humanas e autorizações no momento certo — **não**
- [ ] mudanças locais reconhecidas — pendente (pre-flight executável)

## Limitações

- Análise **estática**. Não substitui runtime.
- Datas de relatórios não representam commit atual.
- Ausência de owner impede assinatura do Gate 1.
