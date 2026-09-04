# Próximas ações — Implementação `denunciasnew`

> **Documento executivo de handoff.** Traduz o planejamento entregue no ciclo `denunciasnew` (F1–F7) em ações concretas para o owner + prompts prontos para o Codex.
>
> **Data:** 2026-09-04.
> **Status do ciclo de planejamento:** ✅ CONCLUÍDO — `ENTREGAR COM RESSALVAS` (ver [RELATORIO_PLANEJAMENTO_DENUNCIASNEW.md](../../Analises/RELATORIO_PLANEJAMENTO_DENUNCIASNEW.md) §11).
> **Status da implementação:** 🟡 AGUARDANDO PRÉ-REQUISITOS (ver §1).

## 0. Sumário deste playbook

| Você quer... | Vá para |
| --- | --- |
| Saber o que **impede** iniciar a implementação | §1 (pré-requisitos críticos) |
| Ver decisões pendentes ordenadas por prioridade | §2 |
| Ver perguntas abertas agrupadas por owner | §3 |
| Ver o **roadmap** por semana | §4 |
| Ver **tasks** por fase com IDs `FATIA-DN-*` | §5 (MVP), §6 (pós-MVP) |
| Ver os **prompts prontos** para o Codex | §7 |
| Ver a **sequência de execução** passo a passo | §8 |
| Ver os **comandos** operacionais essenciais | §9 |
| Ver onde cada artefato de referência está | §10 |

## 1. Pré-requisitos críticos que impedem QUALQUER implementação

Estes 3 pontos são **bloqueadores absolutos**. Nada abaixo pode começar sem eles.

### 1.1 Reabrir o código do produto no workspace

- **O quê:** disponibilizar `cidadania-canal-denuncias/` ao lado de `denunciasnew/` (ou dentro dele), com estrutura frontend + server + testes + Swagger.
- **Por que:** 9 fatias de CP-6 e 5 fatias em CP-0/CP-4/CP-5 estão BLOQUEADAS por `D-DN-06` (código ausente). Sem código, nenhum teste focal roda, nenhum rollback pode ser validado.
- **Como:** clonar/copiar o repositório do produto para dentro do workspace do Codex antes do próximo ciclo.
- **Owner responsável:** owner técnico do produto.

### 1.2 Adotar controle de versão (Git)

- **O quê:** inicializar Git em `denunciasnew/` (ou no workspace unificado) com branch base para trabalho por fatia.
- **Por que:** o modelo "fatia reversível" exige `git checkout` para rollback. Sem Git, cada fatia precisa desenhar rollback manual (backup de arquivo por arquivo).
- **Como:**
  ```powershell
  git init
  git remote add origin <URL>
  git checkout -b feat/denunciasnew-mvp
  ```
- **Owner responsável:** owner técnico + SRE.

### 1.3 Nomear owners humanos

Cada fatia exige **owner nomeado antes de executar** (autorização just-in-time). Papéis pendentes:

| Papel | Necessário para |
| --- | --- |
| Owner do ciclo | qualquer autorização |
| Owner de Frontend | 31 fatias UI |
| Owner de Backend | 18 fatias BFF |
| Owner de Segurança | 8 fatias de perímetro + LGPD |
| Owner de DPO | 6 fatias LGPD (aviso AAA, anonimização, testemunhas, retenção) |
| Owner de A11y | 8 fatias axe/AT |
| Owner de SRE | 4 fatias CI/observabilidade |
| Owner de Produto | 12 decisões (`DEC-DN-*`) e taxonomias |

## 2. Decisões pendentes por prioridade

### 2.1 Bloqueiam MVP público (5)

| ID | Assunto | Owner | Fatia bloqueada | Sugestão |
| --- | --- | --- | --- | --- |
| **D-DN-01** | Modelo de versionamento | Owner técnico | rollback de TODAS | Adotar Git com branch `feat/denunciasnew-mvp` |
| **D-DN-06** | Código do produto ausente | Owner do produto | 9 fatias CP-6 + CP0-06/CP4-05/CP5-04 | Reabrir `cidadania-canal-denuncias/` |
| **DEC-DN-08** | SLA performance mobile (LCP/TTI) | Frontend + Arquitetura | `FATIA-DN-MOBILE-03` | Sugerir default LCP ≤ 4 s / TTI ≤ 6 s (`Slow 3G`) |
| **DEC-DN-16** | LGPD de testemunhas | DPO + Jurídico | `FATIA-DN-CP3-07` | Sugerir consentimento explícito + retenção 30 d |
| **DEC-DN-19** | Formato oficial do protocolo real | Produto | `FATIA-DN-CP5-04` | MVP usa `SYN-*` mock; real precisa ser definido antes do release |

### 2.2 Bloqueiam qualidade do MVP mas não a implementação (3)

| ID | Assunto | Owner | Impacto | Sugestão |
| --- | --- | --- | --- | --- |
| **T-DN-20** | Cookies do vídeo institucional | DPO + Frontend | `FATIA-DN-CP1-04/05` | Auto-hospedar vídeo; evitar YouTube embed com cookies |
| **P-F4-sec-3** | Interface admin para revisão humana URGENTE | Produto + Legal | `FATIA-DN-CP6-07` | Escopo separado; fora do MVP |
| **DEC-DN-25** | Instalação de LibreOffice (`.doc`) | Owner técnico | Geração de documentos executivos | Owner executa `winget install --id TheDocumentFoundation.LibreOffice` em pwsh elevado |

### 2.3 Não bloqueiam (podem usar defaults) (12)

Deixadas com default sugerido; owner refina em ciclo posterior sem retrabalho.

| ID | Default sugerido |
| --- | --- |
| DEC-DN-10 | taxonomia mock (`docs/preparacao-implementacao/prompts/fases/F6-taxonomia-mock.json` a criar) |
| DEC-DN-11 | STT em mock; retomar quando contratar provedor |
| DEC-DN-12 | classificador em mock determinístico |
| DEC-DN-13 | nº trabalhadores opcional |
| DEC-DN-14 | modalidade genérica (presencial/remoto/híbrido/informal/terceirizado/outra) |
| DEC-DN-15 | 10 arquivos × 20 MiB (herdado) |
| DEC-DN-17 | KPI de negócio, sem impacto técnico |
| DEC-DN-18 | 30 d PII / 90 d RNF (default P-F5-1) |
| DEC-DN-20 | SLA análise inicial: copy do infográfico |
| DEC-DN-21 | baseline pós-MVP |
| DEC-DN-22 | mock no MVP; canal Slack/e-mail em fase 2 |
| DEC-DN-23 | patch no validador de diagramas (aceitar `denunciasnew-*` extras) |
| DEC-DN-24 | TLC: consultar quando autorizar rede |

### 2.4 Arquivadas para pós-MVP (2)

- `DEC-DN-09B` — chatbot WhatsApp (fase 2).
- `DEC-DN-P-F5-7` — Meta sandbox (derivada).

## 3. Perguntas abertas agrupadas por owner (27 pendentes)

### 3.1 Owner do ciclo (7)

| ID | Pergunta |
| --- | --- |
| P-F1-1 | Confirma sem Git ou próximo ciclo cria versionamento? |
| P-F1-2 | Promover PDF a Ordem 1 de precedência (`DEC-DN-03`)? |
| P-F1-3 | Precedência entre `docs/docs/` e `docs/preparacao-implementacao/`? |
| P-F1-4 | Assets extras em diagramas-mermaid: catalogar ou EXC? |
| P-F1-5 | Confirma requisitos de código como `ND`? |
| P-F1-6 | Uso de `Analises/backups/**` como INF em ciclos futuros? |
| P-F5-3 | Prefixo `SYN-*` na captura final (confirmado); alguém precisa validar em fase de release? |

### 3.2 Produto (7)

| ID | Pergunta |
| --- | --- |
| P-F2-3 | Taxonomia oficial de irregularidades? |
| P-F2-4 | Chatbot WhatsApp entra em pós-MVP? Quando? |
| P-F2-7 | Formato oficial do protocolo `SYN-*` → produção? |
| P-F2-8 | SLA de análise inicial e alerta urgente? |
| P-F2-9 | Baseline pré-implantação para KPIs? |
| P-F4-4 | Retenção de áudio no BFF (descartar imediato × N horas)? |
| P-F4-5 | Prioridade URGENTE por ML sem revisão humana prévia — permitido? |

### 3.3 Segurança / DPO (7)

| ID | Pergunta |
| --- | --- |
| P-F2-5 | Provedor STT e política de retenção do áudio? |
| P-F2-6 | Categorização determinística vs ML + revisão humana obrigatória? |
| P-F2-10 | Tratamento LGPD de dados de testemunhas? |
| P-F4-sec-1 | SIEM disponível ou canal próprio para alertas? |
| P-F4-sec-2 | Consentimento LGPD do áudio: separado ou junto? |
| P-F4-sec-4 | Termo LGPD do WhatsApp precisa passar por Jurídico? |
| P-F4-sec-5 | STT on-prem: Ops tem capacidade? |

### 3.4 Arquitetura / Backend (4)

| ID | Pergunta |
| --- | --- |
| P-F2-1 | Limites de áudio (duração, tamanho, formatos)? |
| P-F4-1 | BotIngress: reuso do controller ou próprio? |
| P-F4-2 | Chave HMAC do bot: vault ou env? |
| P-F4-3 | `applyAnonimizationRules()`: síncrono ou pipeline? |

### 3.5 A11y (2)

| ID | Pergunta |
| --- | --- |
| P-F2-2 | Confirma WCAG 2.2 AA como alvo (2.1 AA piso)? — **Respondida (DEC-DN-07 = Opção C)** |
| P-F4-sec-3 | Interface admin de revisão humana URGENTE — escopo separado? |

## 4. Roadmap de implementação

```
Ciclo 0 (esta semana) — Pré-requisitos:
    ├─ Reabrir cidadania-canal-denuncias/ no workspace
    ├─ Inicializar Git com branch feat/denunciasnew-mvp
    ├─ Nomear owners humanos (§1.3)
    └─ Owner responde 3 decisões críticas (DEC-DN-08, 16, 19)

Ciclo 1 (semana 1) — CP-0 + CP-1:
    ├─ Setup CI (axe-core, Lighthouse, ESLint, msw, fixtures)
    └─ Tela Acolhimento (StepAcolhimento + vídeo + estado)

Ciclo 2 (semana 2) — CP-2:
    └─ Relato Guiado (checklist + textarea + AudioRecorder + STT mock + preview)

Ciclo 3 (semana 3) — CP-3:
    └─ Detalhamento + Evidências (uploads + ClamAV mock + testemunhas se DEC-DN-16 respondida)

Ciclo 4 (semana 4) — CP-4 + CP-5:
    ├─ Sigilo + Anonimização + Local
    └─ Revisão + Confirmação com protocolo SYN-* + infográfico

Ciclo 5 (semana 5) — CP-a11y-piso + CP-mobile:
    ├─ WCAG 2.1 AA em CI + correções batch 1-3
    └─ Mobile-first multi-viewport + target size

MVP público liberado ✅

Ciclos pós-MVP:
    ├─ CP-a11y-alvo (WCAG 2.2 AA)
    ├─ CP-6 (Classificador/Alertas mock — se código destravado)
    ├─ DEC-DN-09B (chatbot WhatsApp reativado)
    └─ Auditoria TLC (DEC-DN-24)
```

## 5. Tasks por fase — MVP

Cada task = 1 fatia `FATIA-DN-*` de [11-IMPLEMENTATION-PLAN.delta-denunciasnew.md](../11-IMPLEMENTATION-PLAN.delta-denunciasnew.md).

### Ciclo 0 — Pré-requisitos (owner)

- [ ] **T-C0-01** Reabrir `cidadania-canal-denuncias/` (owner técnico).
- [ ] **T-C0-02** Inicializar Git (owner técnico + SRE).
- [ ] **T-C0-03** Instalar LibreOffice em pwsh elevado se `.doc` for necessário (owner).
- [ ] **T-C0-04** Responder DEC-DN-08 (SLA mobile), DEC-DN-16 (LGPD testemunhas), DEC-DN-19 (formato protocolo).
- [ ] **T-C0-05** Nomear owners humanos (§1.3).
- [ ] **T-C0-06** Autorizar Codex a executar Ciclo 1 sob `SOMENTE_LEITURA + CÓDIGO_FATIA_ID`.

### Ciclo 1 — CP-0 (fundação CI) + CP-1 (Acolhimento)

**CP-0:**
- [x] **T-CP0-01** `FATIA-DN-CP0-01` — CI job `a11y-axe` (`@axe-core/playwright wcag21aa`). Implementada; gate detecta 3 ocorrências sérias de contraste no template inicial.
- [x] **T-CP0-02** `FATIA-DN-CP0-02` — CI job Lighthouse mobile. Implementada; execução local Windows inconclusiva após 90 s, validação pendente no runner Linux.
- [x] **T-CP0-03** `FATIA-DN-CP0-03` — CI job ESLint com regras a11y Angular. Implementada; lint agregado aprovado.
- [x] **T-CP0-04** `FATIA-DN-CP0-04` — `msw` setup + handlers padrão. Implementada; teste focal aprovado.
- [x] **T-CP0-05** `FATIA-DN-CP0-05` — Fixtures sintéticas centrais. Implementada; teste focal aprovado.
- [x] **T-CP0-06** `FATIA-DN-CP0-06` — `pino-noir` para redaction. Implementada no `backend-mock`; 4/4 testes aprovados.

**CP-1:**
- [x] **T-CP1-01** `FATIA-DN-CP1-01` — `StepAcolhimento` com 3 CTAs. Implementada; unit e E2E aprovados.
- [x] **T-CP1-02** `FATIA-DN-CP1-02` — Registro da escolha em sessão. Implementada; restauração e valor inválido testados.
- [ ] **T-CP1-03** `FATIA-DN-CP1-03` — Redirect Ouvidoria *(bloqueada — precisa URL)*.
- [x] **T-CP1-04** `FATIA-DN-CP1-04` — Player vídeo institucional acessível. Implementada com placeholder sintético, captions e transcrição.
- [ ] **T-CP1-05** `FATIA-DN-CP1-05` — Vídeo self-hosted sem cookies *(bloqueada — T-DN-20)*.

### Ciclo 2 — CP-2 (Relato Guiado)

- [x] **T-CP2-01** `FATIA-DN-CP2-01` — `ChecklistIrregularidades` com taxonomia mock. Implementada; unit aprovado.
- [x] **T-CP2-02** `FATIA-DN-CP2-02` — Textarea com contador. Implementada; contador e sanitização de caracteres de controle testados.
- [x] **T-CP2-03** `FATIA-DN-CP2-03` — `AudioRecorderService` (MediaRecorder API). Implementada; adaptador sobre `MediaRecorder` nativo, unit aprovado.
- [x] **T-CP2-04** `FATIA-DN-CP2-04` — Componente gravador in-app. Implementada; unit aprovado (start/stop emite Blob). Evidência e2e com dispositivo de mídia falso (SH-DN-04) pendente.
- [x] **T-CP2-05** `FATIA-DN-CP2-05` — Fallback texto quando mic negado. Implementada; unit aprovado (`microphoneDenied` + alerta).
- [x] **T-CP2-06** `FATIA-DN-CP2-06` — `SttProxy` mock com `msw`. Implementada; 3 cenários (CONCLUIDA/FALHA/TIMEOUT) testados.
- [x] **T-CP2-07** `FATIA-DN-CP2-07` — Preview de transcrição editável. Implementada; `EDITADA_MANUALMENTE` testado.
- [x] **T-CP2-08** `FATIA-DN-CP2-08` — Fixture de áudio sintética + script reprodutível. Implementada como ruído branco via Node puro (`espeak-ng`/`edge-tts` indisponíveis; ver nota em `DEC-DN-P-F5-4`).
- [x] **T-CP2-09** `FATIA-DN-CP2-09` — Consentimento explícito para áudio. Implementada; unit aprovado (modal antes de habilitar o gravador).

### Ciclo 3 — CP-3 (Detalhamento + Evidências)

- [ ] **T-CP3-01** `FATIA-DN-CP3-01` — `StepDetalhamento` (nº + modalidade + grupos).
- [ ] **T-CP3-02** `FATIA-DN-CP3-02` — Contrato de payload atualizado.
- [ ] **T-CP3-03** `FATIA-DN-CP3-03` — `EvidenceUploader`.
- [ ] **T-CP3-04** `FATIA-DN-CP3-04` — Validação MIME + magic bytes.
- [ ] **T-CP3-05** `FATIA-DN-CP3-05` — Rejeitar `.exe` e `.bat`.
- [ ] **T-CP3-06** `FATIA-DN-CP3-06` — ClamAV mock (INSTREAM).
- [ ] **T-CP3-07** `FATIA-DN-CP3-07` — Subformulário testemunhas *(bloqueada — DEC-DN-16)*.

### Ciclo 4 — CP-4 (Sigilo + Local) + CP-5 (Revisão + Confirmação)

**CP-4:**
- [ ] **T-CP4-01** `FATIA-DN-CP4-01` — Aviso destacado AAA.
- [ ] **T-CP4-02** `FATIA-DN-CP4-02` — Confirmação explícita do aviso.
- [ ] **T-CP4-03** `FATIA-DN-CP4-03` — Toggle "anônima".
- [ ] **T-CP4-04** `FATIA-DN-CP4-04` — Frontend zera PII quando anônimo.
- [ ] **T-CP4-05** `FATIA-DN-CP4-05` — `applyAnonimizationRules()` *(bloqueada — código)*.
- [ ] **T-CP4-06** `FATIA-DN-CP4-06` — `StepLocal` UF/município obrigatório.
- [ ] **T-CP4-07** `FATIA-DN-CP4-07` — Fallback `municipios-ibge.json`.
- [ ] **T-CP4-08** `FATIA-DN-CP4-08` — Empresa opcional com hint.

**CP-5:**
- [ ] **T-CP5-01** `FATIA-DN-CP5-01` — `StepRevisao` com sumário editável.
- [ ] **T-CP5-02** `FATIA-DN-CP5-02` — Confirmação explícita para envio.
- [ ] **T-CP5-03** `FATIA-DN-CP5-03` — Auto-save `sessionStorage`.
- [ ] **T-CP5-04** `FATIA-DN-CP5-04` — Gerador protocolo `SYN-XXXXXXXX` *(bloqueada — código)*.
- [ ] **T-CP5-05** `FATIA-DN-CP5-05` — `StepConfirmacao`.
- [ ] **T-CP5-06** `FATIA-DN-CP5-06` — `InfograficoFluxo` SVG acessível.
- [ ] **T-CP5-07** `FATIA-DN-CP5-07` — Copy do infográfico com SLA *(bloqueada — DEC-DN-20)*.

### Ciclo 5 — CP-a11y-piso + CP-mobile-perf

**CP-a11y-piso (WCAG 2.1 AA, obrigatório antes do MVP público):**
- [ ] **T-A11Y-01** `FATIA-DN-A11Y-PISO-01` — `axe-core wcag21aa` em CI.
- [ ] **T-A11Y-02** `FATIA-DN-A11Y-PISO-02` — Correções labels/descritores.
- [ ] **T-A11Y-03** `FATIA-DN-A11Y-PISO-03` — Correções foco/aria-live.
- [ ] **T-A11Y-04** `FATIA-DN-A11Y-PISO-04` — Correções contraste ≥ 4.5:1.

**CP-mobile-perf:**
- [ ] **T-MOB-01** `FATIA-DN-MOBILE-01` — Playwright multi-viewport ≤ 360 px.
- [ ] **T-MOB-02** `FATIA-DN-MOBILE-02` — Área de toque ≥ 44×44 px.
- [ ] **T-MOB-03** `FATIA-DN-MOBILE-03` — Lighthouse Slow 3G *(bloqueada — DEC-DN-08)*.

## 6. Tasks Pós-MVP

### CP-a11y-alvo (WCAG 2.2 AA)

- [ ] `FATIA-DN-A11Y-ALVO-01..06` — 6 fatias (migração para `wcag22aa`, Focus Not Obscured, Dragging Movements, Target Size, Consistent Help, Redundant Entry).

### CP-6 (Classificador + Alertas mock + LGPD art. 20)

- [ ] `FATIA-DN-CP6-01..07` — 7 fatias, todas dependentes do código do produto (CP0-06 destravado).

### Chatbot (`DEC-DN-09B`)

- [ ] `FATIA-DN-BOT-01..04` — reintroduzir BotIngress + HMAC + WhatsApp Adapter + termo LGPD.

## 7. Prompts prontos para o Codex

Cada prompt abaixo é **autocontido**. Inicie sempre com o **bloco de contexto obrigatório** da Seção 3 do roteiro-mestre, substituindo `<...>`.

### 7.1 Prompt Ciclo 0 — Pré-requisitos (não vai ao Codex; é humano)

> Este ciclo é executado pelo owner humano, não pelo Codex. Verifique os checkboxes em §5 (Ciclo 0) antes de prosseguir.

### 7.2 Prompt Ciclo 1 — CP-0 (fundação CI)

```prompt
Projeto: Canal de Denúncias MPT — novo leiaute (denunciasnew).
Workspace: <CAMINHO_DO_WORKSPACE>.
Commit/branch: feat/denunciasnew-mvp @ <SHA>.
Owner do ciclo: <NOME>.
Owner de Infra: <NOME>.
Owner de QA: <NOME>.
Autorização vigente: CÓDIGO_FATIA CP-0 (apenas .github/workflows/*, test/mocks/*, test/fixtures/*, .eslintrc.*).

Assuma a persona da Seção 4.0 de docs/preparacao-implementacao/prompts/analise-denunciasnew.md.

Fontes obrigatórias:
- docs/preparacao-implementacao/11-IMPLEMENTATION-PLAN.delta-denunciasnew.md §2 (CP-0)
- docs/preparacao-implementacao/10-EVIDENCE-MANIFEST.delta-denunciasnew.md §2 (modos autorizados)
- docs/diagramas-mermaid/denunciasnew-*.mmd
- código do produto em cidadania-canal-denuncias/ (workflow atual, scripts npm, playwright.config)

Execute UMA FATIA POR VEZ, na ordem:
1. FATIA-DN-CP0-01 (axe-core wcag21aa em CI)
2. FATIA-DN-CP0-02 (Lighthouse mobile)
3. FATIA-DN-CP0-03 (ESLint a11y)
4. FATIA-DN-CP0-04 (msw setup)
5. FATIA-DN-CP0-05 (fixtures sintéticas SYN-*)
6. FATIA-DN-CP0-06 (pino-noir) — se código do BFF permitir

Para cada fatia:
- Reabra o bloco correspondente em 11-IMPLEMENTATION-PLAN.delta.
- Verifique arquivos permitidos; não edite fora dessa lista.
- Escreva o teste focal ANTES; confirme que falha pela razão esperada.
- Implemente a fatia.
- Rode o teste focal; confirme que passa.
- Rode toda a suíte da camada (lint + unit + integ-sim).
- Apresente diff, evidência sanitizada (SYN-*, e-mails @example.com), riscos e rollback.
- NÃO faça commit/push sem nova autorização.
- Assine com o bloco §4.0.9 do roteiro-mestre.

Pare se:
- teste focal impossível de escrever;
- arquivo fora da lista permitida;
- dependência não aprovada;
- serviço real necessário;
- duas iterações repetindo a mesma hipótese sem nova evidência.
```

### 7.3 Prompt Ciclo 1 — CP-1 (Tela Acolhimento)

```prompt
Projeto: Canal de Denúncias MPT — novo leiaute.
Workspace: <CAMINHO>. Branch: feat/denunciasnew-mvp.
Owner do ciclo: <NOME>. Owner Frontend: <NOME>. Owner A11y: <NOME>.
Autorização vigente: CÓDIGO_FATIA CP-1 (frontend/src/app/steps/step-acolhimento/**, styles.css).

Assuma a persona Seção 4.0 de docs/preparacao-implementacao/prompts/analise-denunciasnew.md.
Cumpra §4.0.3.1 (fonte primária vence), §4.0.3.5 (evidência textual), §4.0.6 (anti-padrões).

Fontes primárias:
- Página 6 do PDF externo (transcrita em prompts/fases/F2-pdf-transcript.md)
- 06-REQUIREMENTS.delta-denunciasnew.md: DN-RF-001, DN-RF-002
- 09-THREAT-MODEL.delta-denunciasnew.md: T-DN-20 (cookies vídeo)
- 11-IMPLEMENTATION-PLAN.delta-denunciasnew.md §3 (CP-1)
- 10-EVIDENCE-MANIFEST.delta-denunciasnew.md §3.1

Ordem de execução (uma por vez):
1. FATIA-DN-CP1-01 (StepAcolhimento com 3 CTAs)
2. FATIA-DN-CP1-02 (registro da escolha em sessionStorage)
3. FATIA-DN-CP1-04 (player vídeo acessível)

PULE:
- FATIA-DN-CP1-03 (URL Ouvidoria não decidida — precisa DEC-DN-Ouvidoria)
- FATIA-DN-CP1-05 (hosting do vídeo — precisa DEC-DN-25 e decisão de auto-hospedar vs YouTube-nocookie)

Para cada fatia:
- Escreva testes Vitest (unit-front) + spec Playwright (e2e-mock) ANTES.
- Confirme falha pela razão esperada.
- Implemente componente Angular standalone + signals.
- Rode axe-core (wcag21aa) no componente.
- Capture SH-DN-01 e SH-DN-02 conforme 10-EVIDENCE-MANIFEST.delta §4.
- Publique evidência em disco local do runner (30 d PII, 90 d RNF).

Pare em desvio de escopo, falta de owner, ou necessidade de rede/instalação não autorizada.
Assine com §4.0.9.
```

### 7.4 Prompt Ciclo 2 — CP-2 (Relato Guiado)

```prompt
Projeto: denunciasnew. Workspace: <CAMINHO>. Branch: feat/denunciasnew-mvp.
Owners: Frontend <NOME>, Backend <NOME>, DPO <NOME>, A11y <NOME>.
Autorização: CÓDIGO_FATIA CP-2 (frontend/steps/step-relato-guiado/**, services/audio-recorder.service.ts, server/proxies/stt-proxy.js, test/mocks/handlers.ts, test/fixtures/audio/**).

Assuma a persona Seção 4.0. Aplique R-DN-01 (envelope sem PII no classificador) e R-SEC-01 (nunca expor denúncia real).

Fontes primárias:
- PDF pág. 7 (Relato Guiado)
- DN-RF-003 (checklist), DN-RF-004 (texto ou áudio), DN-RS-002 (STT), T-DN-01..04, T-DN-20
- 11-IMPLEMENTATION-PLAN.delta §4 (CP-2)
- 10-EVIDENCE-MANIFEST.delta §3.2

Fixtures obrigatórias:
- Taxonomia mock em docs/preparacao-implementacao/prompts/fases/F6-taxonomia-mock.json (a criar por Produto se ainda não existir)
- Áudio TTS gerado por espeak-ng ou edge-tts em test/fixtures/audio/*.wav

Execute na ordem:
1. FATIA-DN-CP2-01 (ChecklistIrregularidades com taxonomia mock)
2. FATIA-DN-CP2-02 (textarea)
3. FATIA-DN-CP2-03 (AudioRecorderService)
4. FATIA-DN-CP2-04 (componente gravador)
5. FATIA-DN-CP2-05 (fallback texto sem mic)
6. FATIA-DN-CP2-08 (script scripts/generate-tts-fixtures.js)
7. FATIA-DN-CP2-06 (SttProxy mock com msw — 3 estados)
8. FATIA-DN-CP2-07 (preview transcrição editável)
9. FATIA-DN-CP2-09 (consentimento LGPD antes de habilitar áudio)

Regras:
- Nunca chame STT real (mock apenas).
- Áudio de teste deve ser sintético (TTS).
- Redija transcrição antes de logar.
- Playwright usa --use-fake-device-for-media-stream.

Assine com §4.0.9 após cada fatia. Pare em falta de autorização ou ambiguidade material.
```

### 7.5 Prompt Ciclo 3 — CP-3 (Detalhamento + Evidências)

```prompt
Projeto: denunciasnew. Branch: feat/denunciasnew-mvp.
Owners: Frontend <NOME>, Backend <NOME>, Segurança <NOME>.
Autorização: CÓDIGO_FATIA CP-3 (steps/step-detalhamento/**, steps/step-evidencias/**, server/middleware/upload.js, models/complaint.model.ts).

Persona §4.0. Aplique T-DN-04 (EICAR-in-audio) e RS-03 (magic bytes) herdadas.

Fontes primárias:
- PDF pág. 8 (Detalhamento), pág. 9 (Evidências)
- DN-RF-005..009, T-DN-04
- 11-IMPLEMENTATION-PLAN.delta §5 (CP-3)
- 10-EVIDENCE-MANIFEST.delta §3.3, §3.4

Execute na ordem:
1. FATIA-DN-CP3-01 (StepDetalhamento — nº + modalidade + grupos)
2. FATIA-DN-CP3-02 (contrato payload novos campos)
3. FATIA-DN-CP3-03 (EvidenceUploader)
4. FATIA-DN-CP3-04 (validação MIME + magic bytes)
5. FATIA-DN-CP3-05 (rejeitar .exe/.bat)
6. FATIA-DN-CP3-06 (ClamAV mock INSTREAM)

PULE:
- FATIA-DN-CP3-07 (testemunhas — BLOQUEADA por DEC-DN-16)

Limites de upload: 10 arquivos × 20 MiB (default DEC-DN-15).
Fixtures: sample.pdf 1 página branca, PNG 1×1, WAV TTS.
NUNCA teste com ClamAV real; use net.Server stub.

Assine com §4.0.9. Pare em ambiguidade material.
```

### 7.6 Prompt Ciclo 4 — CP-4 (Sigilo + Local) + CP-5 (Revisão + Confirmação)

```prompt
Projeto: denunciasnew. Branch: feat/denunciasnew-mvp.
Owners: Frontend <NOME>, Backend <NOME>, DPO <NOME>, A11y <NOME>, Legal <NOME>.
Autorização: CÓDIGO_FATIA CP-4 + CP-5 (steps/step-sigilo-anonimato/**, steps/step-local-empresa/**, steps/step-revisao/**, steps/step-confirmacao/**, components/infografico-fluxo/**, services/complaint.service.ts, complaint-api.client.ts, server/services/complaint.service.js).

Persona §4.0. Aplique DN-RG-005 (contraste AAA no aviso), DN-RF-010 (anonimato), DN-RF-013 (edição), DEC-DN-P-F5-3 (protocolo SYN-*).

Fontes primárias:
- PDF pág. 10 (Sigilo), pág. 11 (Local), pág. 12 (Revisão), pág. 13 (Confirmação)
- DN-RG-005, DN-RF-010..014, T-DN-18, T-DN-19
- 11-IMPLEMENTATION-PLAN.delta §6, §7

Execute na ordem:
1. FATIA-DN-CP4-01 (aviso AAA)
2. FATIA-DN-CP4-02 (confirmação do aviso)
3. FATIA-DN-CP4-03 (toggle anônima)
4. FATIA-DN-CP4-04 (front zera PII)
5. FATIA-DN-CP4-06 (StepLocal)
6. FATIA-DN-CP4-07 (fallback IBGE local)
7. FATIA-DN-CP4-08 (empresa opcional)
8. FATIA-DN-CP5-01 (StepRevisao)
9. FATIA-DN-CP5-02 (confirmar envio)
10. FATIA-DN-CP5-03 (auto-save sessionStorage)
11. FATIA-DN-CP5-05 (StepConfirmacao com SYN-)
12. FATIA-DN-CP5-06 (InfograficoFluxo SVG)

PULE:
- FATIA-DN-CP4-05 (applyAnonimizationRules — BLOQUEADA)
- FATIA-DN-CP5-04 (gerador SYN-* — BLOQUEADA)
- FATIA-DN-CP5-07 (copy SLA — BLOQUEADA por DEC-DN-20)

Assine com §4.0.9. Pare em falta de owner ou ambiguidade material.
```

### 7.7 Prompt Ciclo 5 — CP-a11y-piso + CP-mobile

```prompt
Projeto: denunciasnew. Branch: feat/denunciasnew-mvp.
Owners: A11y <NOME>, Frontend <NOME>, Design <NOME>, Infra <NOME>.
Autorização: CÓDIGO_FATIA CP-a11y-piso + CP-mobile-perf (.github/workflows/ci.yml, e2e/*.spec.ts, styles.css, componentes com correções pontuais).

Persona §4.0. WCAG 2.1 AA é OBRIGATÓRIO antes do MVP (DEC-DN-07 Opção C).

Fontes primárias:
- DN-RNF-001, DN-RNF-002, DEC-DN-07
- 11-IMPLEMENTATION-PLAN.delta §9, §10

Execute na ordem:
1. FATIA-DN-A11Y-PISO-01 (axe wcag21aa em CI)
2. FATIA-DN-A11Y-PISO-02 (labels/descritores)
3. FATIA-DN-A11Y-PISO-03 (foco + aria-live)
4. FATIA-DN-A11Y-PISO-04 (contraste ≥ 4.5:1)
5. FATIA-DN-MOBILE-01 (Playwright multi-viewport)
6. FATIA-DN-MOBILE-02 (target size ≥ 44×44)

PULE:
- FATIA-DN-MOBILE-03 (Lighthouse Slow 3G — precisa DEC-DN-08)

Após CP-a11y-piso-04, gere SH-DN-11 (axe report do wizard completo) — 0 violações críticas/sérias em wcag21aa.

Assine com §4.0.9. MVP público só pode ser liberado após este ciclo verde.
```

## 8. Sequência de execução recomendada (visão passo a passo)

```
Ciclo 0 — Owner humano
├─ 1. Reabrir código do produto no workspace
├─ 2. Inicializar Git
├─ 3. Responder DEC-DN-08, DEC-DN-16, DEC-DN-19
├─ 4. Nomear owners humanos
└─ 5. Autorizar Codex a executar Ciclo 1

Ciclo 1 — Codex (CP-0 + CP-1)
├─ 1. Cole o prompt §7.2 no Codex
├─ 2. Codex executa CP-0 (FATIA-DN-CP0-01..05, pula CP0-06 se código não permitir)
├─ 3. Owner autoriza avanço a CP-1 (§7.3)
├─ 4. Codex executa CP-1 (FATIA-DN-CP1-01, 02, 04)
├─ 5. Codex gera evidências SH-DN-01, 02 (30 d retenção)
└─ 6. Owner revisa antes de avançar

Ciclo 2 — Codex (CP-2)
├─ 1. Owner autoriza; Cole §7.4 no Codex
├─ 2. Codex gera taxonomia mock se não existir
├─ 3. Codex executa 9 fatias CP-2
├─ 4. Fixtures TTS geradas via espeak-ng
├─ 5. STT mockado com msw (3 estados)
└─ 6. Owner revisa transcrição preview

Ciclo 3 — Codex (CP-3)
├─ 1. Owner autoriza; Cole §7.5
├─ 2. Codex executa 6 fatias (pula CP3-07)
├─ 3. ClamAV mock via net stub
└─ 4. Owner revisa validação MIME

Ciclo 4 — Codex (CP-4 + CP-5)
├─ 1. Owner autoriza; Cole §7.6
├─ 2. Codex executa 12 fatias (pula CP4-05, CP5-04, CP5-07)
├─ 3. Contraste AAA validado no aviso de sigilo
└─ 4. Owner revisa fluxo completo em Playwright

Ciclo 5 — Codex (CP-a11y-piso + CP-mobile)
├─ 1. Owner autoriza; Cole §7.7
├─ 2. Codex executa 6 fatias
├─ 3. Codex gera SH-DN-11 (axe wcag21aa)
├─ 4. Owner revisa gate a11y
└─ 5. MVP público liberado ✅

Pós-MVP — Ciclos separados
├─ Ciclo 6 (CP-a11y-alvo) — WCAG 2.2 AA
├─ Ciclo 7 (CP-6) — Classificador/Alertas mock
└─ Ciclo 8 (DEC-DN-09B) — Chatbot WhatsApp
```

## 9. Comandos operacionais essenciais

### 9.1 Setup Git (Ciclo 0)

```powershell
Set-Location f:\ProjetosMPT\denunciasnew
git init
git config user.name "<seu nome>"
git config user.email "<seu email>"
git checkout -b main
git add docs/preparacao-implementacao docs/Analises docs/diagramas-mermaid/denunciasnew-*.mmd
git commit -m "docs(denunciasnew): planejamento entregue (F1-F7)"
git remote add origin <URL_REMOTA>
git push -u origin main
git checkout -b feat/denunciasnew-mvp
```

### 9.2 Rodar validações locais (Ciclos 1–5)

```powershell
# Antes de cada ciclo, garantir dependências instaladas (autorização do owner)
Set-Location cidadania-canal-denuncias
npm ci
npm --prefix server ci

# Rodar suíte da camada durante execução da fatia
npm run lint
npm test
npm --prefix server test
npm run e2e
node docs/diagramas-mermaid/validate-diagrams.js
```

### 9.3 Gerar fixtures TTS (Ciclo 2)

```powershell
# Se espeak-ng disponível
espeak-ng "denuncia sintetica para teste" -w test/fixtures/audio/sample.wav

# Alternativa Python edge-tts
python -m edge_tts --text "denuncia sintetica para teste" --write-media test/fixtures/audio/sample.wav
```

### 9.4 Instalar LibreOffice (se `.doc` necessário — Ciclo 0, opcional)

```powershell
# Em pwsh ELEVADO (owner executa)
winget install --id TheDocumentFoundation.LibreOffice --accept-package-agreements --accept-source-agreements
```

### 9.5 Verificar autorização vigente antes de qualquer comando de escrita

```powershell
# Checar branch
git status

# Confirmar autorização vigente registrada
Get-Content docs/preparacao-implementacao/prompts/fases/F<n>-*.md | Select-String -Pattern "Autoriza"
```

## 10. Onde estão os artefatos de referência

### 10.1 Prompts por fase (roteiros de execução)

| Fase | Arquivo | Uso |
| :---: | --- | --- |
| Roteiro-mestre | [analise-denunciasnew.md](analise-denunciasnew.md) | orientação do ciclo inteiro |
| F1 | [fases/F1-descoberta-preflight.md](fases/F1-descoberta-preflight.md) | histórico de descoberta |
| F2 | [fases/F2-engenharia-reversa.md](fases/F2-engenharia-reversa.md) | como o PDF virou requisitos |
| F2 (extrator) | [fases/F2-pdf-extract.py](fases/F2-pdf-extract.py) | script sanitizado do PDF |
| F2 (transcrição) | [fases/F2-pdf-transcript.md](fases/F2-pdf-transcript.md) | fonte primária redigida |
| F3 | [fases/F3-diagramas.md](fases/F3-diagramas.md) | histórico dos 5 diagramas |
| F4 | [fases/F4-arquitetura-qa-security.md](fases/F4-arquitetura-qa-security.md) | arquitetura + ameaças |
| F5 | [fases/F5-plano-evidencias.md](fases/F5-plano-evidencias.md) | plano de testes |
| F6 | [fases/F6-fatias.md](fases/F6-fatias.md) | 59 fatias |
| F7 | [fases/F7-consolidacao.md](fases/F7-consolidacao.md) | consolidação + triplo review |
| Este playbook | [PROXIMAS-ACOES-DENUNCIASNEW.md](PROXIMAS-ACOES-DENUNCIASNEW.md) | próximas ações |

### 10.2 Deltas técnicos (fontes de contrato/requisitos)

| Delta | Papel |
| --- | --- |
| [../06-REQUIREMENTS.delta-denunciasnew.md](../06-REQUIREMENTS.delta-denunciasnew.md) | 24 requisitos com aceite |
| [../07-TRACEABILITY.delta-denunciasnew.md](../07-TRACEABILITY.delta-denunciasnew.md) | matriz rastreabilidade |
| [../08-TDD.delta-denunciasnew.md](../08-TDD.delta-denunciasnew.md) | topologia + contratos |
| [../09-THREAT-MODEL.delta-denunciasnew.md](../09-THREAT-MODEL.delta-denunciasnew.md) | 23 ameaças + controles |
| [../10-EVIDENCE-MANIFEST.delta-denunciasnew.md](../10-EVIDENCE-MANIFEST.delta-denunciasnew.md) | 20 shots + fixtures |
| [../11-IMPLEMENTATION-PLAN.delta-denunciasnew.md](../11-IMPLEMENTATION-PLAN.delta-denunciasnew.md) | **59 fatias** |
| [../12-DECISIONS.delta-denunciasnew.md](../12-DECISIONS.delta-denunciasnew.md) | 25 decisões |

### 10.3 Diagramas (fontes visuais)

| Diagrama | Uso |
| --- | --- |
| [../../diagramas-mermaid/denunciasnew-contexto.mmd](../../diagramas-mermaid/denunciasnew-contexto.mmd) | apresentar o sistema |
| [../../diagramas-mermaid/denunciasnew-c4-containers.mmd](../../diagramas-mermaid/denunciasnew-c4-containers.mmd) | reunião de arquitetura |
| [../../diagramas-mermaid/denunciasnew-c4-componentes.mmd](../../diagramas-mermaid/denunciasnew-c4-componentes.mmd) | orientar Frontend/Backend |
| [../../diagramas-mermaid/denunciasnew-classes.mmd](../../diagramas-mermaid/denunciasnew-classes.mmd) | contrato de dados |
| [../../diagramas-mermaid/denunciasnew-casos-de-uso.mmd](../../diagramas-mermaid/denunciasnew-casos-de-uso.mmd) | validar com Produto |

### 10.4 Relatório executivo

[../../Analises/RELATORIO_PLANEJAMENTO_DENUNCIASNEW.md](../../Analises/RELATORIO_PLANEJAMENTO_DENUNCIASNEW.md) — apresente ao owner + stakeholders + Comitê.

### 10.5 Matriz de ferramentas

[../../Analises/MATRIZ_FERRAMENTAS_DENUNCIASNEW.md](../../Analises/MATRIZ_FERRAMENTAS_DENUNCIASNEW.md) — 46 ferramentas em 12 camadas para SRE + QA + Segurança auditarem.

## 11. Checklist rápido antes de autorizar cada ciclo

Antes de colar um dos prompts §7.2..7.7 no Codex:

- [ ] Owner do ciclo declarado por escrito.
- [ ] Autorização vigente formalizada (`SOMENTE_LEITURA + CÓDIGO_FATIA <ID>`).
- [ ] Código do produto disponível no workspace (Ciclo 1+).
- [ ] Git inicializado com branch `feat/denunciasnew-mvp` (Ciclo 1+).
- [ ] Fatias BLOQUEADAS confirmadas como `PULE` no prompt.
- [ ] Fixtures sintéticas prontas (Ciclo 2 exige TTS instalado).
- [ ] Runner CI configurado (Ciclo 1 exige `.github/workflows/`).
- [ ] Ferramenta de captura (Playwright) instalada localmente + em CI.

## 12. Encerramento

O ciclo de **planejamento** entregou 25 artefatos, 59 fatias e 25 decisões catalogadas, sem tocar em uma linha de código do produto. A implementação depende **exclusivamente** de:

1. Owner destravar `D-DN-01` (Git) e `D-DN-06` (código do produto).
2. Owner responder 5 decisões críticas (§2.1).
3. Owner autorizar Codex ciclo por ciclo com os prompts §7.

Após esses 3 passos, o MVP público pode ser entregue em **5 semanas** (§4).

Boa implementação.
