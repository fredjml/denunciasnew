# Métricas, scorecard e plano de ação

Meça para aprender, não para fabricar precisão.

## Métricas futuras

| Métrica | Método | Frequência |
| --- | --- | --- |
| requisitos cobertos antes de código | matriz no Gate 1 | por iniciativa |
| conflitos/fontes stale | baseline/drift | por review |
| dependências descobertas após pre-flight | novos bloqueios | por fase |
| intervenções humanas não previstas | log de escalonamento | por projeto |
| falhas pós-entrega | incidents/bugs | por release |
| ciclos e arquivos refeitos | diffs/tarefas | por requisito |
| testes por modo | TESTING | por entrega |
| evidências rejeitadas | review do manifest | por entrega |
| tempo código→evidência | timestamps confiáveis | por fatia |
| tentativas iguais/releituras | contexto/log | por fase |
| tokens/custo | fonte oficial, se existir | por fase/projeto |

Sem baseline, registre qualitativamente baixo/médio/alto; não invente percentuais.

## Plano de ação

| ID | Problema | Causa raiz | Correção | Prevenção | Prioridade | Owner | Prazo | Evidência de conclusão |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |

Prioridade: P0 imediata; P1 antes da próxima entrega; P2 curto prazo; P3 otimização.

## Quick wins candidatos — não executados

- alinhar AGENTS, planejamento, arquitetura e server README ao código atual;
- decidir ownership/aceite do protocolo;
- alinhar Node do CI ao manifesto;
- adicionar lint/test backend/E2E conforme política de CI;
- criar scripts para Redocly/coverage se aprovados;
- revisar dependências no manifesto frontend;
- classificar server_log.txt;
- documentar E2E mockado versus integração/live;
- decidir comportamento fail-open de development.

Cada item requer tarefa, owner e validação; esta lista não autoriza a mudança.

## Scorecard

Use 0–10 somente com critérios definidos; caso contrário, N/A — evidência insuficiente.

| Dimensão | Nota/N-A | Evidência | Risco/ação |
| --- | --- | --- | --- |
| requisitos |  |  |  |
| análise/pre-flight |  |  |  |
| arquitetura/contrato |  |  |  |
| implementação |  |  |  |
| testes/QA/a11y |  |  |  |
| segurança/privacidade |  |  |  |
| ferramentas/MCP/IA |  |  |  |
| evidência/review |  |  |  |
| entrega/operação |  |  |  |
| eficiência/contexto |  |  |  |

## Limitações

Métrica vira alvo e pode ser manipulada. Contagem de testes, cobertura, commits, tokens ou velocidade não mede valor isoladamente. Scorecard histórico não prova maturidade atual.
