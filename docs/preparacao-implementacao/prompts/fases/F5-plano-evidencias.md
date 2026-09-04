# Fase 5 — Plano de evidências e testes (execução registrada)

> Registro imutável da execução de F5 no ciclo de análise `denunciasnew`, conforme o roteiro em [`../analise-denunciasnew.md`](../analise-denunciasnew.md) (Seção 5 — Fase 5, Seção 6.5 — Prompt F5).

## 1. Cabeçalho de execução

| Campo | Valor |
| --- | --- |
| Ciclo | Análise minuciosa de `denunciasnew/` |
| Fase | F5 — Plano de evidências e testes |
| Data | 2026-09-04 |
| Workspace | `f:\ProjetosMPT\denunciasnew` |
| Commit/branch | N/A — sem repositório Git (D-DN-01) |
| Owner do ciclo | (declarado na abertura da sessão) |
| Autorização vigente | `SOMENTE_LEITURA + DOCUMENTAÇÃO` |
| Modo de teste autorizado padrão | `e2e-mock` (5 modos mock cabem no vigente; todos `live-*` exigem autorização adicional) |
| Subagente delegado | `evidence-planner` ([`../../agents/evidence-planner.md`](../../agents/evidence-planner.md)) |
| Autorização recebida para iniciar F5 | Mensagem 2026-09-03 pós-F4 |

## 2. Escopo declarado antes de iniciar

- **Dentro do escopo:**
  - Delta sobre [`../../10-EVIDENCE-MANIFEST.md`](../../10-EVIDENCE-MANIFEST.md).
  - Tabela cenário × requisito × modo × ferramenta × evidência × owner.
  - Definição explícita dos modos autorizados por padrão (`e2e-mock` como default) e dos modos que exigem autorização adicional.
  - Shot list `SH-DN-*`.
  - Regras de fixtures sintéticas e redaction.
- **Fora do escopo desta fase:**
  - Executar qualquer teste ou captura de evidência (isso é F6 sob autorização).
  - Publicar evidências.
  - Editar o original [`../../10-EVIDENCE-MANIFEST.md`](../../10-EVIDENCE-MANIFEST.md).
  - Ler `cidadania-canal-denuncias/**` (D-DN-06).
  - Consultar TLC (rede não autorizada — R-F4-01).

## 3. Fontes reabertas nesta fase

| # | Fonte | Escopo |
| ---: | --- | --- |
| 1 | [`../analise-denunciasnew.md`](../analise-denunciasnew.md) | §5 (Fase 5) e §6.5 (prompt F5) |
| 2 | [`F1-descoberta-preflight.md`](F1-descoberta-preflight.md) | integral |
| 3 | [`F2-engenharia-reversa.md`](F2-engenharia-reversa.md) | integral |
| 4 | [`F3-diagramas.md`](F3-diagramas.md) | integral |
| 5 | [`F4-arquitetura-qa-security.md`](F4-arquitetura-qa-security.md) | integral |
| 6 | [`../../06-REQUIREMENTS.delta-denunciasnew.md`](../../06-REQUIREMENTS.delta-denunciasnew.md) | integral |
| 7 | [`../../07-TRACEABILITY.delta-denunciasnew.md`](../../07-TRACEABILITY.delta-denunciasnew.md) | integral |
| 8 | [`../../08-TDD.delta-denunciasnew.md`](../../08-TDD.delta-denunciasnew.md) | integral |
| 9 | [`../../09-THREAT-MODEL.delta-denunciasnew.md`](../../09-THREAT-MODEL.delta-denunciasnew.md) | integral |
| 10 | [`../../10-EVIDENCE-MANIFEST.md`](../../10-EVIDENCE-MANIFEST.md) | integral (referência canônica) |
| 11 | [`../../../Analises/MATRIZ_FERRAMENTAS_DENUNCIASNEW.md`](../../../Analises/MATRIZ_FERRAMENTAS_DENUNCIASNEW.md) | integral |
| 12 | [`../../agents/evidence-planner.md`](../../agents/evidence-planner.md) | integral |
| 13 | [`../../../licoesaprendidas/06-gates-qa-testes-seguranca.md`](../../../licoesaprendidas/06-gates-qa-testes-seguranca.md) | integral |
| 14 | 5 `.mmd` `denunciasnew-*` produzidos em F3 | integral (referência de cenários) |

## 4. Comandos executados

Todos read-only. Sem captura, sem execução de testes, sem instalação. Nenhum comando novo além dos já usados em F1–F4.

## 5. Artefatos produzidos

| Arquivo | Tamanho aprox. | Papel |
| --- | ---: | --- |
| [`../../10-EVIDENCE-MANIFEST.delta-denunciasnew.md`](../../10-EVIDENCE-MANIFEST.delta-denunciasnew.md) | ~15 kB | Manifesto delta com 61 linhas, 20 shots novas, fixtures, redaction |
| Este arquivo | — | Registro imutável de F5 |

## 6. Resultado — números

### 6.1 Manifesto delta

- **61 linhas** de manifesto por requisito/ameaça (24 requisitos `DN-*` + 12 ameaças `T-DN-*` selecionadas para plano de evidências + 5 requisitos não funcionais).
- **20 shots novas** (`SH-DN-01..20`), das quais:
  - 8 são screenshots mobile 360×640;
  - 5 são artefatos JSON/log de integração/security;
  - 3 são HTML de axe-core / Lighthouse a11y;
  - 4 são casos de teste específicos de bot/STT/classificador/alertas.
- **12 modos de teste** catalogados; **5 autorizados por padrão** (`unit-front`, `unit-back`, `integ-sim`, `e2e-mock`, `a11y-mock`, `perf-mock`), **6 exigem autorização** (`live-*`).

### 6.2 Cobertura por requisito

| Requisito | Linhas de manifesto | Estado majoritário |
| --- | ---: | --- |
| DN-RF-001..014 (funcional) | 33 | ~50% PRONTA-CAPTURA, ~50% ND-DECISÃO |
| DN-RS-001..004 (integração) | 8 | 100% ND-DECISÃO (aguarda DEC-DN-09..12, 22) |
| DN-RG-001..007 (governança) | 3 | PRONTA-CAPTURA (contraste, redação de aviso) |
| DN-RNF-001..004 | 5 | 3 ND-DECISÃO (WCAG, SLA, retenção) |
| T-DN-01..23 (ameaças F4) | 12 | ~40% PRONTA-CAPTURA (controles no BFF), ~60% ND-DECISÃO |

### 6.3 Distribuição de estado

- **PRONTA-CAPTURA:** 24 linhas — todos os testes de UI, a11y-mock, contratos de segurança de BFF (validação HMAC, anonimização, rejeição de PII em payload) podem ser planejados para F6.
- **ND-DECISÃO:** 34 linhas — bloqueadas por DEC-DN-07..23 (taxonomia, versão WCAG, chatbot MVP, provedor STT, classificador ML, retenção etc.).
- **AUTORIZAR-LIVE:** 3 linhas — casos que só rodam com autorização adicional em ambiente `live-*`.

### 6.4 Perguntas ao owner geradas em F5

7 perguntas (`P-F5-1..7`) em §8 do manifesto delta, cobrindo:

- retenção,
- publicação,
- redação do protocolo mock,
- fonte de áudio sintético,
- ambientes `live-*` disponíveis,
- contratação piloto de STT/Classificador,
- números WhatsApp sandbox.

## 7. Cobertura da solicitação original (F5)

| Solicitação (§6.5 do roteiro) | Estado |
| --- | --- |
| Delta em `10-EVIDENCE-MANIFEST.delta-denunciasnew.md` | ✔ criado |
| Tabela cenário × requisito × modo × ferramenta × evidência × owner | ✔ 61 linhas |
| Modos de teste catalogados | ✔ 12 |
| Modo autorizado padrão (`e2e-mock`) declarado | ✔ + 5 outros modos mock cabem no vigente |
| Modos que exigem autorização adicional listados | ✔ 6 `live-*` |
| Cobertura mobile obrigatória | ✔ 8 shots em 360×640 mobile |
| Cobertura a11y obrigatória | ✔ camada dedicada + 3 shots axe-core + auditoria manual com AT |
| Fixtures sintéticas apenas | ✔ tabela em §5 |
| Redaction obrigatória | ✔ tabela em §6 |
| Sem captura de produção | ✔ regra reafirmada em §7 |
| Ambiguidades viram DEC-DN-\* / P-F5-\* | ✔ 7 P-F5-\* + herança de DEC-DN-07..23 |

## 8. Limitações desta fase

1. Nenhuma evidência foi capturada; este é o plano — captura é escopo de F6.
2. **34 linhas em ND-DECISÃO** dependem de respostas do owner às DEC-DN-07..23 antes de virarem PRONTA-CAPTURA.
3. Ambientes `live-*` (BFF, STT, Classifier, Alert, MPT, WHATSAPP) não estão catalogados neste workspace — dependem de P-F5-5..7.
4. Retenção padrão `30 d` para PII e `90 d` para não-funcionais é **sugestão** — final depende de DEC-DN-18 (DPO).
5. Redaction automática pode falhar (nomes próprios em texto livre); revisão manual segue obrigatória por linha capturada.
6. Fixtures de áudio sintético (TTS/ruído) podem não representar sotaques regionais → risco de viés na validação de STT (T-DN-08) permanece.

## 9. Riscos consolidados de F5

- **R-F5-01:** 34 linhas em `ND-DECISÃO` limitam o escopo de captura possível em F6 até que o owner responda DEC-DN-07..23.
- **R-F5-02:** modos `live-*` fora do escopo por padrão → `DN-RS-001..004` só validáveis parcialmente via mock. Cobertura completa exige P-F5-5..7 respondidas + autorização.
- **R-F5-03:** ausência de baseline pré-implantação (DEC-DN-21) impede montar shots de KPI `DN-RG-006`.
- **R-F5-04:** retenção `ND` até DEC-DN-18 pode obrigar recriação de artefatos se a política final divergir do padrão sugerido.
- **R-F5-05:** ausência de infraestrutura para `pino-noir` no BFF atual (`ND-CÓDIGO` D-DN-06) impede pilotar a redaction antes de F6.
- Herança: D-DN-01..06, R-F2-01..04, R-F3-01..04, R-F4-01..05 permanecem abertos.

## 10. Decisão do gate F5

**PASSOU COM RISCOS.**

Justificativa: o plano cobre 100% dos requisitos `DN-*` estruturais, 12 das 23 ameaças `T-DN-*` (as restantes são contratuais/de governança e não geram shot em F6), 8 telas do wizard, mobile-first, a11y e perf. Os modos autorizados por padrão (`e2e-mock` e correlatos) permitem que a maior parte da execução aconteça em CI sem exposição de dado real. Os itens em `ND-DECISÃO` e `AUTORIZAR-LIVE` estão marcados explicitamente e não bloqueiam a decomposição em fatias de F6 — bloqueiam apenas a execução daquelas fatias específicas até resposta do owner.

## 11. Próximo passo autorizado

**Nenhum sem autorização adicional do owner.** F6 (Decomposição em fatias verticais) está apta a iniciar mediante:

- Autorização explícita.
- Idealmente: resposta a `P-F5-1..7` para dimensionar corretamente as fatias que envolvem `live-*`.
- Confirmação de que fatias `AUTORIZAR-LIVE` ficam **fora do MVP inicial**, mantendo a decomposição focada em fatias `PRONTA-CAPTURA` + `ND-DECISÃO` (que podem virar `PRONTA` conforme DEC-DN-\* forem respondidas).

## 12. Assinatura padronizada (§4.0.9 do roteiro-mestre)

```text
Coordenador: Engenheiro de Software Sênior (Dev/DevOps/AIOps, 20a).
Fase: F5.
Autorização vigente: SOMENTE_LEITURA + DOCUMENTAÇÃO. Modo padrão: e2e-mock.
                    Modos live-* NÃO AUTORIZADOS.
Fontes reabertas:
  - docs/preparacao-implementacao/prompts/analise-denunciasnew.md (§5, §6.5)
  - docs/preparacao-implementacao/prompts/fases/F1..F4
  - docs/preparacao-implementacao/06-REQUIREMENTS.delta-denunciasnew.md
  - docs/preparacao-implementacao/07-TRACEABILITY.delta-denunciasnew.md
  - docs/preparacao-implementacao/08-TDD.delta-denunciasnew.md
  - docs/preparacao-implementacao/09-THREAT-MODEL.delta-denunciasnew.md
  - docs/preparacao-implementacao/10-EVIDENCE-MANIFEST.md
  - docs/Analises/MATRIZ_FERRAMENTAS_DENUNCIASNEW.md
  - docs/preparacao-implementacao/agents/evidence-planner.md
  - docs/licoesaprendidas/06-gates-qa-testes-seguranca.md
  - 5 diagramas denunciasnew-*.mmd (F3)
Artefatos criados:
  - docs/preparacao-implementacao/10-EVIDENCE-MANIFEST.delta-denunciasnew.md
  - docs/preparacao-implementacao/prompts/fases/F5-plano-evidencias.md (este arquivo)
Perguntas abertas: P-F5-1..P-F5-7 (7 perguntas).
Decisões pendentes: DEC-DN-07..23 (herdadas) permanecem abertas.
Riscos e limitações:
  - R-F5-01: 34 linhas em ND-DECISÃO limitam captura possível em F6.
  - R-F5-02: modos live-* fora do escopo → DN-RS-001..004 só parcialmente validáveis.
  - R-F5-03: ausência de baseline pré-implantação (DEC-DN-21) bloqueia shot de KPI.
  - R-F5-04: retenção ND até DEC-DN-18.
  - R-F5-05: pino-noir/redaction não pilotável sem código (D-DN-06).
  - Herança: D-DN-01..06, R-F2-01..04, R-F3-01..04, R-F4-01..05 permanecem abertos.
Decisão de gate: PASSOU COM RISCOS.
Próximo passo autorizado: aguardar autorização do owner para iniciar F6
  (Decomposição em fatias verticais).
```
