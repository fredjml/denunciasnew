# Preparação para Implementação — Canal de Denúncias

Status: **PRÉ-IMPLEMENTAÇÃO** (Passos 0 a 4 do [kit de lições aprendidas](../licoesaprendidas/README.md)).
Escopo: apenas documentação. **Nenhum código de produção foi alterado** para gerar este pacote.
Repositório inspecionado: `cidadania-canal-denuncias/` (branch `stg`, commit vigente na leitura).
Data da compilação: 2026-08-27.
Autor da compilação: GitHub Copilot (leitura estática do workspace).
Owner humano (a preencher antes de Passo 5): _pendente_.

> ⚠️ Este pacote **não autoriza** implementação, commit, push, deploy, uso de dados reais nem ambiente live. As autorizações ficam explícitas nas fatias do plano em [11-IMPLEMENTATION-PLAN.md](11-IMPLEMENTATION-PLAN.md) e devem ser concedidas por owner competente **just-in-time**.

## Como este pacote se conecta ao kit

O kit define o fluxo canônico
**DISCOVER → ANALYZE → READINESS CHECK → PLAN → IMPLEMENT → TEST → REVIEW → SECURITY/QA → ACCEPTANCE → DELIVER → LESSONS LEARNED**
e agrupa os passos em três momentos:

| Momento | Passos | Cobertura neste pacote |
| --- | --- | --- |
| **Antes do trabalho** | 0–4 | ✅ coberto integralmente |
| **Durante** | 5–8 | 🟡 apenas prompts + skill para executar |
| **Depois** | 9–11 | 🟡 apenas prompts + templates |
| **Diagramas (extensão)** | 12 | ✅ prompts + subagente `diagram-curator` para curar `docs/diagramas-mermaid/` |

## Mapa de artefatos por Passo

| Passo do kit | Objetivo | Artefato produzido aqui | Prompt operacional |
| --- | --- | --- | --- |
| 0 — Entender origem e estado | consolidar drift/baseline | [00-MAPA-ORIGENS.md](00-MAPA-ORIGENS.md) (re-síntese) | [13-PROMPTS.md#passo-0](13-PROMPTS.md#passo-0) |
| 1 — Análise inicial e pre-flight | baseline verificável + GO/NO-GO | [01-ANALYSIS.md](01-ANALYSIS.md), [02-PRE-FLIGHT.md](02-PRE-FLIGHT.md), [03-TOOLS.md](03-TOOLS.md), [04-MCP.md](04-MCP.md) | [13-PROMPTS.md#passo-1](13-PROMPTS.md#passo-1) |
| 2 — Engenharia reversa | reconstruir requisitos com aceite | [05-PRD.md](05-PRD.md), [06-REQUIREMENTS.md](06-REQUIREMENTS.md), [07-TRACEABILITY.md](07-TRACEABILITY.md) | [13-PROMPTS.md#passo-2](13-PROMPTS.md#passo-2) |
| 3 — Arquitetura, segurança e evidência | modelar antes de mudar | [08-TDD.md](08-TDD.md), [09-THREAT-MODEL.md](09-THREAT-MODEL.md), [10-EVIDENCE-MANIFEST.md](10-EVIDENCE-MANIFEST.md) | [13-PROMPTS.md#passo-3](13-PROMPTS.md#passo-3) |
| 4 — Planejar correções | fatias verticais aprováveis | [11-IMPLEMENTATION-PLAN.md](11-IMPLEMENTATION-PLAN.md), [12-DECISIONS.md](12-DECISIONS.md) | [13-PROMPTS.md#passo-4](13-PROMPTS.md#passo-4) |
| 5–11 (fora do pacote) | executar/entregar/aprender | apenas prompts em [13-PROMPTS.md](13-PROMPTS.md) | ver seções internas |
| 12 — Diagramas de engenharia reversa | sincronizar 10 `.mmd` + `.drawio` com o commit | [`docs/diagramas-mermaid/`](../diagramas-mermaid/) (10 `.mmd` + `README.md` + `validate-diagrams.js`) | [13-PROMPTS.md#passo-12](13-PROMPTS.md#passo-12--diagramas-de-engenharia-reversa-mermaid--drawio) |

## Recursos de automação

- **Skill**: [skills/denuncias-preparacao-implementacao/SKILL.md](skills/denuncias-preparacao-implementacao/SKILL.md). Segue a convenção Anthropic Claude Skills (mesmo padrão já usado em [`docs/licoesaprendidas/skill/denuncias-quality-review/SKILL.md`](../licoesaprendidas/skill/denuncias-quality-review/SKILL.md)). Ela **não** é auto-instalada; instale/expono conforme sua plataforma (`~/.claude/skills/`, `.copilot/skills/`, etc.) só após auditoria.
- **Agents/subtarefas**: definições em [agents/](agents/) seguem o [template do kit](../licoesaprendidas/templates/agents.md). São propostas de subagentes — **não substituem `AGENTS.md`** do projeto, que continua sendo autoridade.
- **Prompts prontos por Passo**: [13-PROMPTS.md](13-PROMPTS.md). Cada prompt tem escopo, entradas, restrições e critério de parada.
- **Prompts integrados com os diagramas**: [14-PROMPTS-EXECUCAO-COM-DIAGRAMAS.md](14-PROMPTS-EXECUCAO-COM-DIAGRAMAS.md). Consolida os Passos 0–11, gates, autorizações e manutenção dos diagramas Mermaid após cada fatia.

## Precedência de fontes (regra do kit)

1. Fonte primária atual do projeto (`cidadania-canal-denuncias/AGENTS.md`, `planejamento.md`, `spec_design.md`, código, testes, Swagger).
2. Relatórios em `docs/Analises/*.md` (data declarada).
3. Publicações `.docx` derivadas dos scripts `build_*_docx.py`.
4. Kit `docs/licoesaprendidas/` — controles reutilizáveis, **não é fonte de fato**.
5. Este pacote em `docs/preparacao-implementacao/` — leitura consolidada; **não substitui** a fonte primária.

Qualquer alegação materializada em fatia do plano exige **reabertura da fonte primária** e reexecução dos comandos de baseline antes da execução.

## Limitações desta compilação

- Leitura **estática** do workspace na data indicada. Não executou lint, testes, `npm audit`, ClamAV, Redis ou API MPT.
- Alertas P0–P3 herdados dos relatórios em `docs/Analises/` foram catalogados como **candidatos a requisito**; ainda exigem reexecução para virar evidência do commit atual.
- Nenhum owner humano foi confirmado; todos os campos `Owner:` aparecem como `pendente` propositalmente.
- Instalar a skill em plataforma de IA aumenta superfície de risco; siga a auditoria descrita no próprio [SKILL.md](skills/denuncias-preparacao-implementacao/SKILL.md).
- Prompts em [13-PROMPTS.md](13-PROMPTS.md) assumem que o operador humano lerá o Passo correspondente do kit antes de executar.
