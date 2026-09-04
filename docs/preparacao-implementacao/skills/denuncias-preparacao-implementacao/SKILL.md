---
name: denuncias-preparacao-implementacao
description: Prepara — sem alterar código — o Canal de Denúncias (Angular/Express) para implementação. Executa os Passos 0 a 4 do kit `docs/licoesaprendidas/` (mapa/baseline, análise, engenharia reversa, arquitetura + segurança, plano incremental) e produz PRD, TDD, requisitos, matriz de rastreabilidade, threat model, evidence manifest e plano de fatias. Use ao iniciar um novo ciclo de trabalho, ao trocar de operador ou quando o pacote existente em `docs/preparacao-implementacao/` precisar ser regenerado. Não use para implementar código, executar testes reais, publicar ou operar produção sem autorização.
---

# Denúncias — Preparação para Implementação

## Escopo

Cobre **exclusivamente** os Passos 0 a 4 do fluxo canônico do kit (`DISCOVER → ANALYZE → READINESS CHECK → PLAN`) do repositório `MP-Trabalho/cidadania-canal-denuncias`. Não substitui a skill de review [`docs/licoesaprendidas/skill/denuncias-quality-review/SKILL.md`](../../licoesaprendidas/skill/denuncias-quality-review/SKILL.md); as duas convivem — review lê estado de código, preparação organiza governança antes de mudar código.

## Entradas mínimas

- Acesso read-only ao workspace `cidadania-canal-denuncias/` e a `docs/licoesaprendidas/`.
- Pedido/objetivo declarado por owner humano.
- Autorização vigente e limites (padrão: **somente leitura/documentação**).
- Commit alvo e branch (default `stg`).

Se qualquer entrada estiver ausente, pare, registre a lacuna e peça ao owner.

## Modos

- **Preparação** (padrão): produz/atualiza documentos em `docs/preparacao-implementacao/`. Nenhuma alteração em `cidadania-canal-denuncias/**`.
- **Refresh incremental**: reexecuta apenas os artefatos afetados por drift/decisão nova.
- **Read-only diagnostic**: responde perguntas sobre requisitos, arquitetura, ameaças e plano, sem escrever arquivos.

Correção de código, execução de testes reais, live-BFF, commit, push, PR, deploy, uso de dados reais e instalação de dependências **estão fora** desta skill.

## Fluxo canônico (Passos 0–4)

1. **Passo 0 — Origem e estado**: reabra `cidadania-canal-denuncias/AGENTS.md`, `planejamento.md`, `spec_design.md`, código, testes, Swagger. Cruze com [`00-mapa-origens-baseline-drift.md`](../../licoesaprendidas/00-mapa-origens-baseline-drift.md) e [`15-baseline-analises-denuncias.md`](../../licoesaprendidas/15-baseline-analises-denuncias.md). Produza [00-MAPA-ORIGENS.md](../../preparacao-implementacao/00-MAPA-ORIGENS.md).
2. **Passo 1 — Análise + pre-flight**: preencha [01-ANALYSIS.md](../../preparacao-implementacao/01-ANALYSIS.md), [02-PRE-FLIGHT.md](../../preparacao-implementacao/02-PRE-FLIGHT.md), [03-TOOLS.md](../../preparacao-implementacao/03-TOOLS.md), [04-MCP.md](../../preparacao-implementacao/04-MCP.md). Decida `GO / GO COM RISCOS / NO-GO` só após execução real do pre-flight; skill sozinha entrega leitura estática.
3. **Passo 2 — Engenharia reversa**: gere PRD executivo em [05-PRD.md](../../preparacao-implementacao/05-PRD.md), requisitos atômicos com aceite em [06-REQUIREMENTS.md](../../preparacao-implementacao/06-REQUIREMENTS.md), matriz em [07-TRACEABILITY.md](../../preparacao-implementacao/07-TRACEABILITY.md). Classifique cada requisito como `CONF / PART / INF / HIP / ND`.
4. **Passo 3 — Arquitetura + segurança + evidência**: preencha [08-TDD.md](../../preparacao-implementacao/08-TDD.md), [09-THREAT-MODEL.md](../../preparacao-implementacao/09-THREAT-MODEL.md), [10-EVIDENCE-MANIFEST.md](../../preparacao-implementacao/10-EVIDENCE-MANIFEST.md). Nenhum ativo, ameaça ou evidência é fechado por leitura — apenas classificado.
5. **Passo 4 — Plano incremental**: [11-IMPLEMENTATION-PLAN.md](../../preparacao-implementacao/11-IMPLEMENTATION-PLAN.md) por fatia vertical + [12-DECISIONS.md](../../preparacao-implementacao/12-DECISIONS.md) para decisões materiais pendentes.
6. **Passo 12 — Diagramas (extensão)**: sincronizar os 10 `.mmd` em [`docs/diagramas-mermaid/`](../../diagramas-mermaid/) e o `docs/DiagramaDenuncias-sobreposto.drawio` com o commit atual, executando `node docs/diagramas-mermaid/validate-diagrams.js` ao final. Autoridade editorial: [`docs/diagramas-mermaid/README.md`](../../diagramas-mermaid/README.md). Delegar ao subagente `diagram-curator`.

Para cada Passo, os prompts prontos estão em [13-PROMPTS.md](../../preparacao-implementacao/13-PROMPTS.md).

## Referências sob demanda

- Descoberta/drift: [`docs/licoesaprendidas/00-mapa-origens-baseline-drift.md`](../../licoesaprendidas/00-mapa-origens-baseline-drift.md).
- Análise/pre-flight: [`01-analise-inicial.md`](../../licoesaprendidas/01-analise-inicial.md), [`07-preflight.md`](../../licoesaprendidas/07-preflight.md).
- Engenharia reversa: [`02-engenharia-reversa-requisitos.md`](../../licoesaprendidas/02-engenharia-reversa-requisitos.md).
- Backend/segurança: [`backend/README.md`](../../licoesaprendidas/backend/README.md), [`backend/seguranca.md`](../../licoesaprendidas/backend/seguranca.md).
- Frontend/a11y: [`frontend/README.md`](../../licoesaprendidas/frontend/README.md), [`frontend/acessibilidade.md`](../../licoesaprendidas/frontend/acessibilidade.md).
- Contrato: [`contrato/README.md`](../../licoesaprendidas/contrato/README.md).
- Gates: [`06-gates-qa-testes-seguranca.md`](../../licoesaprendidas/06-gates-qa-testes-seguranca.md).
- IA/rules/skills/tools/MCP/agents: [`04-ia-rules-skills-tools-mcp-agents.md`](../../licoesaprendidas/04-ia-rules-skills-tools-mcp-agents.md).

## Delegação para subagentes

Subagentes possíveis (definições em [agents/](../../preparacao-implementacao/agents/)):

- **analyst-preflight** — executa comandos read-only do pre-flight quando autorizado.
- **requirements-engineer** — engenharia reversa detalhada, cruzando código e Swagger.
- **security-architect** — atualiza `09-THREAT-MODEL.md` frente a mudança de fluxo/upload/integração.
- **evidence-planner** — mantém shot list e retenção alinhadas aos requisitos.
- **plan-decomposer** — quebra fatias grandes em micro-fatias reversíveis.
- **diagram-curator** — cura os 10 `.mmd` e o `.drawio` em `docs/diagramas-mermaid/`; roda `validate-diagrams.js`.

Cada subagente segue [`templates/agents.md`](../../licoesaprendidas/templates/agents.md): objetivo, fontes obrigatórias, arquivos read-only/write, ações proibidas, saída/evidência, integrador. Dois subagentes concordando **não substituem** evidência.

## Rules aplicáveis (do kit)

R-REQ-01, R-REQ-02, R-SRC-01, R-ENV-01, R-HUM-01, R-INC-01, R-EVD-01, R-LIVE-01, R-QA-01, R-REV-01, R-SEC-01, R-CTX-01, R-LOOP-01, R-GIT-01, R-SCOPE-01.

## Ações proibidas sem autorização específica

Instalar dependência; ler/expor secret ou PII; usar dado real; atingir serviço live; DAST/carga; ampliar upload/limite; alterar arquitetura/escopo; commit, push, PR, deploy ou exclusão; instalar/mover a própria skill em local privilegiado. Aprovar plano **não** autoriza essas ações.

## Saída

Pacote em `docs/preparacao-implementacao/` com:

- README + PROJECT_CONTEXT.
- Documentos 00 a 12 conforme sequência.
- Prompts operacionais por Passo em `13-PROMPTS.md`.
- Definições de subagentes em `agents/`.
- Registro de decisões pendentes com owner explícito.

## Conclusão e parada

Concluir a preparação quando:

- Todos os documentos existem e apontam para owners identificáveis.
- Decisões materiais estão listadas em [12-DECISIONS.md](../../preparacao-implementacao/12-DECISIONS.md).
- Prompts habilitam operador humano a executar os Passos 5+.

Parar antes disso quando:

- Faltar autorização, fonte primária ou owner competente.
- Duas tentativas repetirem o mesmo erro sem nova hipótese (R-LOOP-01).
- Três diagnósticos distintos não avançarem (kit §10-escalonamento).
- Conflito material de requisito exigir decisão humana (D-04, DEC-01, etc.).

## Limitações

- Skill **não** executa código, testes, `git`, `npm` ou chamadas externas.
- Baseline é datada; reexecute o pre-flight antes de citar estado atual.
- Instalar esta skill em um ambiente de IA (Claude, Copilot, etc.) aumenta superfície de risco; siga a auditoria prevista em [`04-ia-rules-skills-tools-mcp-agents.md`](../../licoesaprendidas/04-ia-rules-skills-tools-mcp-agents.md).
- Consumo tokenizado: manter `PROJECT_CONTEXT.md` em até duas páginas conforme kit.
