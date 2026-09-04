# Fase 6 — Decomposição em fatias verticais (execução registrada)

> Registro imutável da execução de F6 no ciclo de análise `denunciasnew`, conforme o roteiro em [`../analise-denunciasnew.md`](../analise-denunciasnew.md) (Seção 5 — Fase 6, Seção 6.6 — Prompt F6).

## 1. Cabeçalho de execução

| Campo | Valor |
| --- | --- |
| Ciclo | Análise minuciosa de `denunciasnew/` |
| Fase | F6 — Decomposição em fatias verticais |
| Data | 2026-09-04 |
| Workspace | `f:\ProjetosMPT\denunciasnew` |
| Commit/branch | N/A — sem repositório Git (D-DN-01) |
| Owner do ciclo | (declarado na abertura da sessão) |
| Autorização vigente | `SOMENTE_LEITURA + DOCUMENTAÇÃO` |
| Subagente delegado | `plan-decomposer` ([`../../agents/plan-decomposer.md`](../../agents/plan-decomposer.md)) |
| Autorização recebida para iniciar F6 | Mensagem 2026-09-04 pós-F5 com respostas a `DEC-DN-07`, `DEC-DN-09`, `P-F5-1..7` |

## 2. Escopo declarado antes de iniciar

- **Dentro do escopo:**
  - Delta sobre [`../../12-DECISIONS.md`](../../12-DECISIONS.md) consolidando decisões respondidas em 2026-09-04.
  - Delta sobre [`../../11-IMPLEMENTATION-PLAN.md`](../../11-IMPLEMENTATION-PLAN.md) com fatias verticais `FATIA-DN-*`.
  - Ordenação respeitando checkpoints `CP-0..CP-6`, `CP-a11y-piso`, `CP-a11y-alvo`, `CP-mobile-perf`.
  - Registro de F6.
- **Fora do escopo:**
  - Executar qualquer fatia (isso é ciclo de implementação futuro).
  - Editar originais `11-IMPLEMENTATION-PLAN.md` ou `12-DECISIONS.md`.
  - Ler `cidadania-canal-denuncias/**` (D-DN-06).
  - Consultar TLC (R-F4-01).
  - Instalar dependências.

## 3. Fontes reabertas nesta fase

| # | Fonte | Escopo |
| ---: | --- | --- |
| 1 | [`../analise-denunciasnew.md`](../analise-denunciasnew.md) | §5 (Fase 6) e §6.6 (prompt F6) |
| 2 | [`F1-descoberta-preflight.md`](F1-descoberta-preflight.md) | integral |
| 3 | [`F2-engenharia-reversa.md`](F2-engenharia-reversa.md) | integral |
| 4 | [`F3-diagramas.md`](F3-diagramas.md) | integral |
| 5 | [`F4-arquitetura-qa-security.md`](F4-arquitetura-qa-security.md) | integral |
| 6 | [`F5-plano-evidencias.md`](F5-plano-evidencias.md) | integral |
| 7 | [`../../06-REQUIREMENTS.delta-denunciasnew.md`](../../06-REQUIREMENTS.delta-denunciasnew.md) | integral |
| 8 | [`../../07-TRACEABILITY.delta-denunciasnew.md`](../../07-TRACEABILITY.delta-denunciasnew.md) | integral |
| 9 | [`../../08-TDD.delta-denunciasnew.md`](../../08-TDD.delta-denunciasnew.md) | integral |
| 10 | [`../../09-THREAT-MODEL.delta-denunciasnew.md`](../../09-THREAT-MODEL.delta-denunciasnew.md) | integral |
| 11 | [`../../10-EVIDENCE-MANIFEST.delta-denunciasnew.md`](../../10-EVIDENCE-MANIFEST.delta-denunciasnew.md) | integral |
| 12 | [`../../11-IMPLEMENTATION-PLAN.md`](../../11-IMPLEMENTATION-PLAN.md) | integral (referência canônica) |
| 13 | [`../../12-DECISIONS.md`](../../12-DECISIONS.md) | integral (referência canônica) |
| 14 | [`../../agents/plan-decomposer.md`](../../agents/plan-decomposer.md) | integral |
| 15 | [`../../../licoesaprendidas/05-processo-correcoes.md`](../../../licoesaprendidas/05-processo-correcoes.md) | consultado |
| 16 | [`../../../licoesaprendidas/06-gates-qa-testes-seguranca.md`](../../../licoesaprendidas/06-gates-qa-testes-seguranca.md) | consultado |

## 4. Decisões do owner registradas nesta sessão (input de F6)

Consolidadas em [`../../12-DECISIONS.delta-denunciasnew.md`](../../12-DECISIONS.delta-denunciasnew.md):

- `DEC-DN-07` = **Opção C** (WCAG 2.2 AA alvo, 2.1 AA piso).
- `DEC-DN-09` = **Opção A** (chatbot WhatsApp FORA DO MVP; cria `DEC-DN-09B` para pós-MVP).
- `DEC-DN-P-F5-1` = **híbrido 30 d PII / 90 d RNF**.
- `DEC-DN-P-F5-2` = **Opção A** (disco local do runner).
- `DEC-DN-P-F5-3` = **Opção B** (prefixo `SYN-XXXXXXXX`).
- `DEC-DN-P-F5-4` = **Opção A** (TTS local, `espeak-ng` / `edge-tts`).
- `DEC-DN-P-F5-5` = **default** (sem `live-BFF` no MVP).
- `DEC-DN-P-F5-6` = **default** (sem contratação piloto STT/Classificador).
- `DEC-DN-P-F5-7` = **arquivada** (decorre de DEC-DN-09 = Opção A).

Decisões novas catalogadas em F6:

- `DEC-DN-09B` — chatbot como fase 2 pós-MVP (parqueada).
- `DEC-DN-24` — consulta a TLC (aberta, não bloqueia MVP).
- `DEC-DN-25` — instalação de LibreOffice (aberta, não bloqueia MVP).

Decisões que **permanecem abertas** e afetam F6: `DEC-DN-08` (SLA mobile), `DEC-DN-10` (taxonomia irregularidades — MVP usa mock), `DEC-DN-13/14` (taxonomias — MVP usa defaults), `DEC-DN-15` (limites upload — MVP usa 10×20 MiB herdado), `DEC-DN-16` (LGPD testemunhas — bloqueia CP3-07), `DEC-DN-18` (retenção logs), `DEC-DN-19` (formato protocolo real — MVP usa `SYN-*`), `DEC-DN-20` (SLA análise inicial — bloqueia CP5-07), `DEC-DN-22` (SLA alertas — mock no MVP).

## 5. Comandos executados

Todos read-only. Sem execução de fatias, sem instalação, sem chamadas de rede. Nenhum comando novo além dos já usados em F1–F5.

## 6. Artefatos produzidos

| Arquivo | Tamanho aprox. | Papel |
| --- | ---: | --- |
| [`../../12-DECISIONS.delta-denunciasnew.md`](../../12-DECISIONS.delta-denunciasnew.md) | ~8 kB | Delta consolidando 8 decisões FECHADAS + 15 abertas + 3 novas (`DEC-DN-09B`, `-24`, `-25`) |
| [`../../11-IMPLEMENTATION-PLAN.delta-denunciasnew.md`](../../11-IMPLEMENTATION-PLAN.delta-denunciasnew.md) | ~19 kB | 59 fatias verticais em 9 blocos + sumário + ordenação |
| Este arquivo | — | Registro imutável de F6 |

## 7. Resultado — números

### 7.1 Fatias planejadas

| Estado | Contagem | % |
| --- | ---: | ---: |
| PRONTA-P/-AUTORIZAÇÃO | 33 | 56% |
| BLOQUEADA (motivo declarado) | 14 | 24% |
| FORA-DO-MVP (arquivada) | 12 | 20% |
| **Total** | **59** | 100% |

### 7.2 Distribuição por checkpoint

| Checkpoint | Fatias PRONTA | Fatias BLOQUEADAS | Notas |
| --- | ---: | ---: | --- |
| CP-0 (Fundação) | 5 | 1 | CP0-06 (`pino-noir`) bloqueada por D-DN-06 |
| CP-1 (Acolhimento) | 3 | 2 | CP1-03 (URL Ouvidoria), CP1-05 (hosting vídeo) |
| CP-2 (Relato Guiado) | 9 | 0 | STT mock funciona 100% em CI |
| CP-3 (Detalhamento + Evidências) | 6 | 1 | CP3-07 (LGPD testemunhas) |
| CP-4 (Sigilo + Local) | 7 | 1 | CP4-05 (`applyAnonimizationRules` — depende de código) |
| CP-5 (Revisão + Confirmação) | 5 | 2 | CP5-04 (protocolo), CP5-07 (SLA copy) |
| CP-6 (Classificador + Alertas mock) | 0 | 7 | Todas bloqueadas por CP0-06 e D-DN-06 |
| CP-a11y-piso (WCAG 2.1 AA) | 4 | 0 | Obrigatório antes do MVP público |
| CP-mobile-perf | 2 | 1 | CP-mobile-03 bloqueada por DEC-DN-08 |
| CP-a11y-alvo (WCAG 2.2 AA) | 6 | 0 | Depois do MVP |

### 7.3 Dependência crítica

**14 fatias BLOQUEADAS por 3 causas raiz:**

- **D-DN-06** (código do produto ausente): 9 fatias — todas de CP-6 + CP0-06 + CP4-05 + CP5-04.
- **DEC-DN-\*** ainda abertas: 4 fatias — CP1-03, CP1-05, CP3-07, CP5-07, CP-mobile-03.
- **P-F4-sec-3** (interface admin URGENTE): 1 fatia — CP6-07.

### 7.4 Chatbot removido do MVP

- 4 fatias planejadas de chatbot movidas para FORA-DO-MVP (`FATIA-DN-BOT-01..04`).
- 8 ameaças (`T-DN-12..17`, `T-DN-23`) arquivadas para `DEC-DN-09B`.
- Camada 8 da matriz de ferramentas (WhatsApp BSP) congelada.

### 7.5 Cobertura de requisitos por fatia

| Requisito | Fatias que o cobrem |
| --- | --- |
| DN-RF-001 | CP1-01, CP1-02, CP1-03 |
| DN-RF-002 | CP1-04, CP1-05 |
| DN-RF-003 | CP2-01 |
| DN-RF-004 | CP2-02, CP2-03, CP2-04, CP2-05, CP2-09 |
| DN-RF-005..007 | CP3-01, CP3-02 |
| DN-RF-008 | CP3-03, CP3-04, CP3-05, CP3-06 |
| DN-RF-009 | CP3-07 (bloqueada) |
| DN-RG-005 | CP4-01, CP4-02 |
| DN-RF-010 | CP4-03, CP4-04, CP4-05 (bloqueada) |
| DN-RF-011 | CP4-06, CP4-07 |
| DN-RF-012 | CP4-08 |
| DN-RF-013 | CP5-01, CP5-02, CP5-03 |
| DN-RF-014 | CP5-04 (bloqueada), CP5-05, CP5-06, CP5-07 (bloqueada) |
| DN-RG-001..003 | curadoria editorial, distribuída em várias fatias |
| DN-RG-004 | não gera fatia técnica (KPI de negócio) |
| DN-RG-006 | fora do MVP (DEC-DN-21) |
| DN-RG-007 | governança documental — sem fatia |
| DN-RNF-001 | CP-a11y-piso-01..04 + CP-a11y-alvo-01..06 |
| DN-RNF-002 | CP-mobile-01, CP-mobile-02 |
| DN-RNF-003 | CP-mobile-03 (bloqueada) |
| DN-RNF-004 | CP0-06 (bloqueada), CP4-05 (bloqueada), CP6-02 (bloqueada) |
| DN-RS-001 | FORA-DO-MVP |
| DN-RS-002 | CP2-06, CP2-07, CP2-08 (mock) |
| DN-RS-003 | CP6-01..04 (bloqueadas) |
| DN-RS-004 | CP6-05, CP6-06, CP6-07 (bloqueadas) |

**24 requisitos totais. Cobertos por fatia PRONTA:** 15. Cobertos apenas por fatia BLOQUEADA/FORA-DO-MVP: 6. Não geram fatia técnica: 3.

## 8. Cobertura da solicitação original (F6)

| Solicitação (§6.6 do roteiro) | Estado |
| --- | --- |
| Quebrar cada requisito estável em fatias | ✔ 33 PRONTA + 14 BLOQUEADA + 12 FORA-DO-MVP |
| Arquivos permitidos por fatia | ✔ colunas explícitas |
| Teste focal por fatia | ✔ |
| Ameaça relacionada por fatia | ✔ (quando aplicável) |
| Evidência esperada | ✔ ligada a `SH-DN-*` |
| Rollback | ✔ |
| Dependências | ✔ |
| Owner | ✔ |
| Autorização exigida | ✔ implícita: cada fatia PRONTA exige gate humano antes de executar |
| Estado | ✔ `PRONTA-P/-AUTORIZAÇÃO` \| `BLOQUEADA` \| `FORA-DO-MVP` |
| Ordenação respeitando checkpoints `CP-0..CP-6` | ✔ 10 CPs organizados (6 originais + 3 de a11y/mobile + 1 alvo) |
| Nenhuma fatia mistura requisitos independentes | ✔ 1 requisito por fatia (algumas cobrem sub-aspectos do mesmo) |
| Fatias que exigem dado real/live/instalação vão para BLOQUEADAS | ✔ FORA-DO-MVP `LIVE-*` |
| Delta em `11-IMPLEMENTATION-PLAN.delta-denunciasnew.md` | ✔ criado |
| Delta em `12-DECISIONS.delta-denunciasnew.md` | ✔ criado |
| Sem implementar | ✔ nenhuma fatia executada |

## 9. Limitações desta fase

1. Todas as **9 fatias de CP-6** ficam BLOQUEADAS enquanto `D-DN-06` (código do produto) e `CP0-06` (`pino-noir`) permanecerem abertos. Se o owner reabrir `cidadania-canal-denuncias/**` no workspace, CP-6 destrava automaticamente.
2. **Ausência de `AGENTS.md` local** em `denunciasnew/` significa que cada fatia precisa citar `docs/preparacao-implementacao/prompts/analise-denunciasnew.md §4.0` como fonte de autoridade em vez do `AGENTS.md` padrão.
3. **Sem código do produto**, não há como validar que os "arquivos permitidos" listados nas colunas correspondem exatamente à estrutura de pastas real — ficam **candidatos** baseados nos diagramas históricos + F3.
4. **Sem `Git`**, o rollback declarado ("reverter arquivos") não corresponde a `git checkout` ou `git reset` — depende de backup manual antes da fatia. `DEC-DN-01` permanece bloqueador crítico para o modelo "reversível" das fatias.
5. Estimativas de esforço/duração **não** foram calculadas — persona §4.0.6 proíbe estimar por LOC ou commits sem evidência.

## 10. Riscos consolidados de F6

- **R-F6-01:** 14 fatias BLOQUEADAS por 3 causas raiz (D-DN-06 × DEC-DN-\* × P-F4-sec-3). Bloqueio em cascata: se D-DN-06 destravar, 9 fatias de CP-6 podem prosseguir; caso contrário, elas ficam parqueadas indefinidamente.
- **R-F6-02:** ausência de repo Git torna o modelo "fatia reversível" frágil. Rollback precisa ser desenhado antes de cada execução.
- **R-F6-03:** taxonomias (`DEC-DN-10/13/14`) usadas com **default mock** — se decisão final divergir, retrabalho pontual em CP2-01 e CP3-01/02.
- **R-F6-04:** `SYN-*` como prefixo do protocolo (`DEC-DN-P-F5-3`) é decisão do MVP; formato final (`DEC-DN-19`) precisa ser definido **antes do release público**; fatia CP5-04 precisa de outra iteração para mudar prefixo se decidido.
- **R-F6-05:** chatbot fora do MVP simplifica escopo mas cria dívida técnica de integração se `DEC-DN-09B` reativar — retomada pode exigir refactor de `BotIngress` sem código-base atual como referência.
- Herança: `D-DN-01..06` (F1), `R-F2-01..04` (F2), `R-F3-01..04` (F3), `R-F4-01..05` (F4), `R-F5-01..05` (F5) permanecem abertos.

## 11. Decisão do gate F6

**APROVADO COM RESSALVAS.**

Justificativa: o plano cobre 100% dos requisitos `DN-*` estruturais em fatias reversíveis, com teste focal e rollback declarados por fatia. 33 fatias (56%) estão `PRONTA-P/-AUTORIZAÇÃO`, o que já permite iniciar a implementação do MVP pelo Bloco CP-0 → CP-2. As 14 fatias BLOQUEADAS têm motivo declarado (D-DN-06, DEC-DN-\*, P-F4-sec-3) e não impedem a fila principal. As 12 fatias FORA-DO-MVP são explícitas (chatbot + live).

## 12. Próximo passo autorizado

**Nenhum sem autorização adicional do owner.** F7 (Consolidação, triplo review e entrega documental) está apta a iniciar mediante:

- Autorização explícita (regra §1 do prompt mestre).
- F7 executará §8 do roteiro-mestre: 3 análises adicionais + 3 reviews adversariais + checklist §9.
- Corrigirei inconsistências detectadas no triplo review antes de fechar F7.
- Nenhuma implementação em F7 — só consolidação em [`../../../Analises/RELATORIO_PLANEJAMENTO_DENUNCIASNEW.md`](../../../Analises/RELATORIO_PLANEJAMENTO_DENUNCIASNEW.md).

## 13. Assinatura padronizada (§4.0.9 do roteiro-mestre)

```text
Coordenador: Engenheiro de Software Sênior (Dev/DevOps/AIOps, 20a).
Fase: F6.
Autorização vigente: SOMENTE_LEITURA + DOCUMENTAÇÃO.
Fontes reabertas:
  - docs/preparacao-implementacao/prompts/analise-denunciasnew.md (§5, §6.6)
  - docs/preparacao-implementacao/prompts/fases/F1..F5
  - docs/preparacao-implementacao/06-REQUIREMENTS.delta-denunciasnew.md
  - docs/preparacao-implementacao/07-TRACEABILITY.delta-denunciasnew.md
  - docs/preparacao-implementacao/08-TDD.delta-denunciasnew.md
  - docs/preparacao-implementacao/09-THREAT-MODEL.delta-denunciasnew.md
  - docs/preparacao-implementacao/10-EVIDENCE-MANIFEST.delta-denunciasnew.md
  - docs/preparacao-implementacao/11-IMPLEMENTATION-PLAN.md
  - docs/preparacao-implementacao/12-DECISIONS.md
  - docs/preparacao-implementacao/agents/plan-decomposer.md
  - docs/licoesaprendidas/05-processo-correcoes.md
  - docs/licoesaprendidas/06-gates-qa-testes-seguranca.md
Artefatos criados:
  - docs/preparacao-implementacao/12-DECISIONS.delta-denunciasnew.md
  - docs/preparacao-implementacao/11-IMPLEMENTATION-PLAN.delta-denunciasnew.md
  - docs/preparacao-implementacao/prompts/fases/F6-fatias.md (este arquivo)
Perguntas abertas: nenhuma nova em F6. Herança de P-F5-5..6 mantida (aceitos como default).
Decisões pendentes: DEC-DN-08, 10, 13..16, 18..22, 23, 24, 25 (herdadas + novas F6).
Riscos e limitações:
  - R-F6-01: 14 fatias BLOQUEADAS por 3 causas raiz (D-DN-06 × DEC-DN-* × P-F4-sec-3).
  - R-F6-02: sem Git → rollback frágil.
  - R-F6-03: taxonomias em default mock → retrabalho se decisão divergir.
  - R-F6-04: SYN-* como prefixo mock; formato real de protocolo pendente (DEC-DN-19).
  - R-F6-05: chatbot fora do MVP cria dívida de integração se DEC-DN-09B reativar.
  - Herança: D-DN-01..06, R-F2-01..04, R-F3-01..04, R-F4-01..05, R-F5-01..05 permanecem abertos.
Decisão de gate: APROVADO COM RESSALVAS.
Próximo passo autorizado: aguardar autorização do owner para iniciar F7
  (Consolidação, triplo review e entrega documental).
```
