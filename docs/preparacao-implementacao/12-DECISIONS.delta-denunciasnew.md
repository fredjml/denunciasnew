# 12-DECISIONS — Delta `denunciasnew`

> **Delta proposto.** Não substitui [`12-DECISIONS.md`](12-DECISIONS.md). Consolida as **decisões respondidas pelo owner em 2026-09-04** e mantém as remanescentes explicitamente abertas.
>
> **Fase:** F6 — Decomposição em fatias verticais.
> **Autorização:** `SOMENTE_LEITURA + DOCUMENTAÇÃO`.
> **Fonte primária das respostas:** mensagem do owner de 2026-09-04 (após F5) + respostas via `vscode_askQuestions` (P-F5-7, defaults, autorização de F6).
> **Convenção:** `DEC-DN-*` para decisões deste ciclo (não colidem com `DEC-01..10` originais).

## 1. Decisões respondidas nesta rodada

### DEC-DN-07 — Versão WCAG-alvo

- **Contexto:** o PDF (pág. 3) declara WCAG 2.1; o pacote existente adota WCAG 2.2 AA.
- **Decisão do owner (2026-09-04):** **Opção C — WCAG 2.2 AA como alvo, WCAG 2.1 AA como piso obrigatório antes do MVP.** Estratégia progressiva: 2.1 antes do MVP público, 2.2 antes do release definitivo.
- **Consequência:**
  - Duas checkpoints de a11y: `CP-a11y-piso` (2.1 AA obrigatório antes do MVP) e `CP-a11y-alvo` (2.2 AA antes do release público).
  - `axe-core` roda `wcag21aa` no CI de MVP e passa a `wcag22aa` na segunda etapa.
  - Fatias `FATIA-DN-A11Y-PISO-*` viram bloqueio de release do MVP.
  - Fatias `FATIA-DN-A11Y-ALVO-*` viram bloqueio do release público final.
- **Owner:** UX + Acessibilidade.
- **Status:** **FECHADA** — vigente.

### DEC-DN-09 — Chatbot WhatsApp no MVP?

- **Contexto:** PDF pág. 5 propõe chatbot como porta de entrada alternativa; requer BSP contratado, HMAC, sandbox, Jurídico.
- **Decisão do owner (2026-09-04):** **Opção A — Chatbot FORA DO MVP.** Owner optou por adiar setup do Meta sandbox. Escopo fica para `DEC-DN-09B` (ciclo futuro).
- **Consequência:**
  - Elementos `«NOVO · PART»` `BotIngress`, `BotIngressController`, `WhatsApp Bot Adapter`, `POST /api/denuncias/bot`, `HMAC` ficam **fora do MVP**.
  - 8 ameaças `T-DN-12..17` + `T-DN-23` ficam registradas em `09-THREAT-MODEL.delta-denunciasnew.md` como "escopo futuro (DEC-DN-09B)".
  - Camada 8 da matriz de ferramentas (WhatsApp BSP, framework de bot) fica **congelada** para ciclo futuro.
  - 4 fatias esperadas de chatbot ficam **excluídas** do plano de F6.
  - `P-F5-7` (sandbox Meta) fica arquivada até `DEC-DN-09B`.
- **Owner:** Produto (dono da decisão de escopo).
- **Status:** **FECHADA** — vigente.

### DEC-DN-09B (nova) — Chatbot como fase 2 pós-MVP

- **Contexto:** derivada de DEC-DN-09 = Opção A.
- **Decisão:** **ABERTA** — a ser tomada após MVP estabilizado, com owner de Produto.
- **Consequência:** todos os itens de chatbot ficam parqueados neste registro; retomar em ciclo próprio quando decisão for tomada.
- **Owner:** Produto + Segurança + Jurídico (BSP + termo LGPD).
- **Status:** **aberta — parqueada para pós-MVP**.

### DEC-DN-P-F5-1 — Retenção de evidências

- **Decisão do owner:** híbrida — **30 d** para artefatos com PII/logs sensíveis, **90 d** para RNFs e a11y sem PII.
- **Consequência:** aplicado a todo o manifesto de F5 sem revisão adicional. Coluna "Retenção" das linhas com PII lê `30 d`; sem PII lê `90 d`.
- **Owner:** DPO (revisão futura opcional).
- **Status:** **FECHADA** (default aceito).

### DEC-DN-P-F5-2 — Local de publicação de evidências

- **Decisão do owner:** **Opção A — disco local do runner + retenção via CI**.
- **Consequência:** nenhum gate humano extra por shot. Auditoria fica no log do pipeline.
- **Owner:** SRE + Segurança.
- **Status:** **FECHADA**.

### DEC-DN-P-F5-3 — Formato do protocolo mock

- **Decisão do owner:** **Opção B — prefixo neutro `SYN-XXXXXXXX`** (não `MPT-TEST-*`).
- **Consequência:**
  - Todas as fixtures do manifesto de F5 e das fatias de F6 usam `SYN-XXXXXXXX`.
  - `SH-DN-10_confirmacao_infografico.png` e o teste focal de `DN-RF-014` são atualizados para verificar prefixo `SYN-`.
  - Fatia dedicada `FATIA-DN-CONFIRMACAO-01` valida o gerador de mock produz `^SYN-[A-Z0-9]{8}$`.
- **Owner:** Produto + QA.
- **Status:** **FECHADA**.

### DEC-DN-P-F5-4 — Fonte de áudio sintético para STT

- **Decisão do owner:** **Opção A — TTS local (`espeak-ng`, `edge-tts`).**
- **Consequência:**
  - `T-DN-08` (viés STT em sotaques regionais) fica com **cobertura declaradamente parcial**.
  - Fatia dedicada `FATIA-DN-STT-MOCK-01` gera fixtures WAV com `espeak-ng` no CI.
  - Nenhuma dependência de banco de vozes externo.
- **Owner:** Backend + QA.
- **Status:** **FECHADA** (aceita limitação).
- **Nota de implementação (CP-2, 2026-09-04):** `espeak-ng` e `edge-tts` não estavam disponíveis
  no ambiente de execução do CP-2 e instalação exige autorização just-in-time (`AGENTS.md` §6).
  Owner autorizou (via pergunta no plano de execução) usar como **substituto interino**
  `frontend/scripts/generate-audio-fixtures.mjs`, que gera ruído branco WAV determinístico em
  Node puro — sem TTS, sem dependência nova. A decisão original (Opção A, TTS local) permanece
  vigente para quando `espeak-ng`/`edge-tts` forem instalados sob autorização; até lá, a fixture
  de ruído branco cobre apenas a validação estrutural do fluxo (`T-CP2-08`), não a qualidade de
  transcrição real. Reabrir esta nota antes de qualquer evidência que dependa de fala inteligível.

### DEC-DN-P-F5-5 — Ambiente `live-BFF`

- **Decisão do owner (default confirmado):** **sem `live-BFF` no MVP**.
- **Consequência:**
  - Todos os testes de segurança/integração ficam em `integ-sim` (Supertest + `msw`).
  - `T-DN-04` (EICAR-in-audio) validado por `integ-sim` com fixture ClamAV; sem execução real.
  - Ambiente Docker Compose fica para ciclo futuro se owner desejar.
- **Owner:** SRE.
- **Status:** **FECHADA** (default).

### DEC-DN-P-F5-6 — Contratação piloto STT/Classificador SaaS

- **Decisão do owner (default confirmado):** **sem contratação piloto no MVP**. STT e Classificador ficam 100% mock via `msw`.
- **Consequência:**
  - `DN-RS-002` e `DN-RS-003` validados só em mock durante o MVP.
  - Fatia `FATIA-DN-CLASSIFIER-MOCK-01` implementa `ClassifierProxy` com stub determinístico.
  - `T-DN-01` (retenção STT) fica registrada como risco assumido no MVP; retomar em ciclo futuro.
- **Owner:** Produto + Financeiro.
- **Status:** **FECHADA** (default).

### DEC-DN-P-F5-7 — Meta WhatsApp sandbox

- **Decisão do owner:** **arquivada** — decorrente de DEC-DN-09 = Opção A (chatbot fora do MVP).
- **Status:** **arquivada até DEC-DN-09B ser retomada**.

## 2. Decisões que permanecem abertas

| ID | Assunto | Owner esperado | Bloqueio |
| --- | --- | --- | --- |
| DEC-DN-08 | SLA de performance mobile (LCP/TTI) | Frontend + Arquitetura | fatia `FATIA-DN-PERF-01` fica em **BLOQUEADA — aguarda DEC-DN-08** (aplica default `LCP ≤ 4 s / TTI ≤ 6 s` só quando confirmado) |
| DEC-DN-10 | Taxonomia oficial de irregularidades | Produto + Jurídico | fatia `FATIA-DN-C1` roda com taxonomia mock local (`docs/preparacao-implementacao/prompts/fases/F6-taxonomia-mock.json`) |
| DEC-DN-11 | Provedor + retenção STT | Arquitetura + DPO | não impacta o MVP (STT ficou mock por P-F5-6) |
| DEC-DN-12 | Classificador determinístico vs ML + revisão humana | Produto + Jurídico + Segurança | mesma nota; mock determinístico no MVP |
| DEC-DN-13 | Obrigatoriedade de nº estimado de trabalhadores | Produto | fatia `FATIA-DN-D1` adota opcional por default; muda para obrigatório sem retrabalho se decidido |
| DEC-DN-14 | Taxonomia oficial de modalidade de trabalho | Produto + Jurídico | fatia `FATIA-DN-D1` adota lista genérica (`presencial/remoto/híbrido/informal/terceirizado/outra`) |
| DEC-DN-15 | Limites de upload (tamanho, quantidade) | Arquitetura + Segurança | fatia `FATIA-DN-D2` adota default herdado (10 arquivos × 20 MiB) |
| DEC-DN-16 | Tratamento LGPD de testemunhas | DPO + Jurídico | fatia `FATIA-DN-D3` fica **BLOQUEADA — aguarda DEC-DN-16** (LGPD específica) |
| DEC-DN-17 | Meta quantitativa de redução de retrabalho | Produto | não bloqueia MVP (KPI de negócio) |
| DEC-DN-18 | Política de retenção de logs | DPO | `pino-noir` com retenção 30 d default; ajuste posterior sem retrabalho |
| DEC-DN-19 | Formato do protocolo local final | Produto | MVP usa prefixo `SYN-` para teste; formato real do MPT vira `DEC-DN-19` (bloqueador de release) |
| DEC-DN-20 | SLA de análise inicial | Produto | não impacta código, só copy do infográfico |
| DEC-DN-21 | Baseline pré-implantação para KPIs | Produto + Dados | não bloqueia MVP |
| DEC-DN-22 | SLA + canal de alertas | SRE + Segurança | mock no MVP; DPO revisa payload sem PII |
| DEC-DN-23 | Estratégia de coexistência dos `.mmd` `denunciasnew-*` com validador | Arquitetura | fatia `FATIA-DN-DIAG-01` propõe patch ao validador (opcional) |

## 3. Novas decisões catalogadas em F4/F6 (adicionais)

### DEC-DN-24 — Consulta ao catálogo TLC (`https://www.techleads.club/`)

- **Contexto:** rede a TLC não foi autorizada em F4; matriz de ferramentas fica sem entradas do TLC (R-F4-01).
- **Alternativas:**
  1. Autorizar consulta pontual durante F6 e complementar a matriz.
  2. Arquivar para ciclo futuro.
  3. Owner indica manualmente ferramentas TLC relevantes.
- **Decisão:** **aberta**.
- **Owner:** owner do ciclo.
- **Status:** **aberta — não bloqueia MVP**.

### DEC-DN-25 — Instalação de LibreOffice para conversão `.doc`

- **Contexto:** conversão `.md` → `.doc` requer LibreOffice; instalação requer UAC (admin).
- **Alternativas:**
  1. Owner executa `winget install --id TheDocumentFoundation.LibreOffice` em pwsh elevado.
  2. Manter apenas `.docx` (scripts `build_*_docx.py` já existentes).
  3. Não gerar `.doc` neste ciclo.
- **Decisão:** **aberta**.
- **Owner:** owner do ciclo.
- **Status:** **aberta — não bloqueia MVP**.

## 4. Resumo do dashboard de decisões

| Estado | Contagem |
| --- | ---: |
| FECHADA (respondida nesta rodada) | 8 |
| aberta — bloqueia MVP | 3 (DEC-DN-08, DEC-DN-16, DEC-DN-19) |
| aberta — não bloqueia MVP | 12 |
| arquivada (fora do escopo do MVP) | 2 (DEC-DN-09B, DEC-DN-P-F5-7) |
| Total catalogadas nesta análise | **25** |

## 5. Regra de precedência aplicada

Quando este delta conflitar com [`12-DECISIONS.md`](12-DECISIONS.md), **este delta vence apenas para o ciclo `denunciasnew`**. O original permanece autoridade para o ciclo do produto principal.
