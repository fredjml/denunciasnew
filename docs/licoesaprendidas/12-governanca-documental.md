# Governança documental

Cada documento responde a uma pergunta e tem owner/atualização. Conteúdo é obrigatório quando aplicável; quantidade de arquivos não é.

| Artefato | Pergunta | Quando atualizar |
| --- | --- | --- |
| AGENTS.md | como agentes trabalham neste repo? | mudança de regra confirmada |
| REQUIREMENTS | o que e como será aceito? | escopo/decisão |
| ANALYSIS | o que sabemos e não sabemos? | nova evidência |
| PROJECT_CONTEXT | qual estado e próximo passo? | marco/retomada |
| DECISIONS | o que foi decidido e por quê? | decisão material |
| ARCHITECTURE | componentes, dados e trade-offs? | mudança arquitetural |
| TOOLS/MCP | o que funciona, com qual permissão/fallback? | tool/conector muda |
| IMPLEMENTATION | quais fatias, testes e rollback? | plano muda |
| TESTING | o que foi executado e provado? | run/resultado |
| REVIEW | quais findings/riscos/decisão? | review/resolução |
| SECURITY | quais ativos, ameaças e controles? | superfície muda |
| EVIDENCE MANIFEST | onde estão as provas e como protegê-las? | captura/versão |
| LESSONS LEARNED | o que evitar/preservar? | pós-entrega/feedback |

## Autoridade e conflito

AGENTS.md é autoridade operacional do repositório; este kit explica e propõe melhorias, não cria uma terceira cópia normativa. Fonte primária de Produto não pode ser rebaixada por requirements derivados. Conflitos entram em baseline/drift e DECISIONS.

## Regras de manutenção

- documento datado, curto e ligado a fonte/commit;
- fatos separados de hipótese e decisão;
- uma fonte canônica por informação; outros arquivos linkam;
- não copiar resultado histórico para novo projeto;
- não versionar secret, PII, log bruto ou link privado;
- estado só muda após observação;
- arquivo derivado regenerado após fonte;
- docs obsoletos marcados como históricos ou corrigidos em tarefa explícita;
- links, resíduos e placeholders validados antes de entrega.

## Ordem de leitura

Início: AGENTS → fonte primária → PROJECT_CONTEXT → REQUIREMENTS → baseline/drift.  
Antes de implementar: ANALYSIS → ARCHITECTURE → TOOLS/MCP → IMPLEMENTATION → SECURITY → TESTING.  
Antes de entregar: fonte primária novamente → matriz → TESTING → REVIEW → evidence manifest → diff/DoD.

## Decisões

Registre ID, data, contexto, decisão, alternativas, consequências, owner, evidência e gatilho de revisão. Não reescreva decisão antiga; superseda e preserve histórico.

## Limitações

Documentação pode ficar stale e gerar falsa confiança. Consolidar demais esconde owners; fragmentar demais aumenta drift/contexto. Ajuste ao tamanho da tarefa e mantenha links canônicos.
