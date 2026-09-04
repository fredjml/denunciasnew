# Subagentes propostos — Preparação do Canal de Denúncias

Cada arquivo segue [`templates/agents.md`](../../licoesaprendidas/templates/agents.md).
Regras do kit:

- Subagente **não amplia permissão**.
- Review independente **não recebe** a conclusão desejada.
- Um integrador humano revisa conflito, fonte, diff e conclusões.

| Subagente | Missão | Read-only | Escrita exclusiva | Ações proibidas |
| --- | --- | --- | --- | --- |
| [analyst-preflight](analyst-preflight.md) | executar pre-flight read-only e atualizar `01-ANALYSIS.md`/`02-PRE-FLIGHT.md`/`03-TOOLS.md`/`04-MCP.md` | `cidadania-canal-denuncias/**`, `docs/licoesaprendidas/**` | `docs/preparacao-implementacao/01-ANALYSIS.md`, `02-PRE-FLIGHT.md`, `03-TOOLS.md`, `04-MCP.md` | instalar, alterar código, chamar rede |
| [requirements-engineer](requirements-engineer.md) | reengenharia detalhada; produzir requisitos atômicos com aceite | fonte primária + Swagger + testes | `docs/preparacao-implementacao/06-REQUIREMENTS.md`, `07-TRACEABILITY.md` | decidir conflito material |
| [security-architect](security-architect.md) | atualizar threat model quando muda fluxo/upload/integração/trust boundary | código de perímetro + upload + clientes | `docs/preparacao-implementacao/09-THREAT-MODEL.md` | executar DAST/pentest, expor secret |
| [evidence-planner](evidence-planner.md) | manter shot list, retenção e redaction alinhadas | evidence manifest + requisitos | `docs/preparacao-implementacao/10-EVIDENCE-MANIFEST.md` | capturar produção sem autorização |
| [plan-decomposer](plan-decomposer.md) | quebrar fatias grandes em micro-fatias reversíveis | plano atual + requisitos | `docs/preparacao-implementacao/11-IMPLEMENTATION-PLAN.md` | conceder autorização de execução |
| [diagram-curator](diagram-curator.md) | sincronizar 10 `.mmd` + `.drawio` com o commit; rodar `validate-diagrams.js` | `docs/diagramas-mermaid/README.md`, `08-TDD.md`, `09-THREAT-MODEL.md`, diff da fatia | `docs/diagramas-mermaid/*.mmd`, `docs/DiagramaDenuncias-sobreposto.drawio` | alterar código do produto, substituir Mermaid por imagem |

Integrador padrão: **owner do ciclo em curso** (humano). Dois subagentes concordando **não** substituem evidência.
