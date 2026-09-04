# Contexto, tokens e telemetria

Princípio: gastar contexto com raciocínio novo, não redescoberta. Não prometer economia percentual sem baseline.

## Contexto persistente

PROJECT_CONTEXT deve caber em aproximadamente duas páginas:

- objetivo e fonte primária;
- commit/ambiente;
- requisito/fatia ativos;
- decisões vigentes e evidência;
- arquivos alterados;
- último comando e resultado;
- bloqueio, owner e autorização;
- próximo passo único;
- links para detalhes;
- itens que não precisam ser relidos.

Histórico detalhado pertence a TESTING, DECISIONS e evidências, não ao contexto ativo.

## Leitura seletiva

1. ler integralmente instruções obrigatórias e fonte primária;
2. indexar requisitos, arquivos e símbolos;
3. usar rg/diff antes de abrir arquivo grande;
4. registrar hash/data ou motivo de releitura;
5. nas retomadas, ler contexto e arquivos alterados;
6. filtrar log/JSON e guardar output grande como artifact;
7. não confiar exclusivamente na memória conversacional.

## Controles

| Desperdício | Controle | Evidência |
| --- | --- | --- |
| prompt monolítico | separar por fase/skill | só módulo aplicável carregado |
| releitura | resumo + diff/hash | motivo registrado |
| tentativa e erro | hipótese antes de repetir | escalonamento |
| output enorme | filtro/artifact | recorte e caminho |
| regeneração visual | content freeze + shot list | versão congelada |
| trabalho mecânico | script idempotente | script + teste |
| decisões dispersas | PROJECT_CONTEXT/DECISIONS | estado canônico |
| retrabalho de escopo | matriz + contraprova | Gate 1 |

## Modelos e agents

Quando a plataforma permitir: modelo leve para busca/formatação, intermediário para implementação/testes comuns e avançado para arquitetura, segurança, RCA e impasse. Registre motivo; não sacrifique risco por custo. Use agents somente em subtarefas independentes com integração final.

## Regra de loop

Duas tentativas com o mesmo erro e nenhuma mudança de hipótese: parar. Três diagnósticos distintos sem progresso: escalar. Não continue apenas porque há orçamento/contexto.

## Telemetria

Para este projeto web sem runtime LLM, não adicione Langfuse/Sentry/Logfire só para medir o trabalho do Codex. Se houver fonte oficial disponível, registre por fase:

- tempo e número de ciclos;
- requisitos descobertos tarde;
- arquivos lidos/relidos;
- comandos repetidos;
- tokens/modelo/cache, se expostos;
- retrabalho e intervenções humanas não previstas;
- status, falha e fallback.

OpenAI Usage/Costs mede API organizacional com credencial/escopo próprios; não mede automaticamente assinatura ChatGPT ou esta conversa. Custo estimado de observabilidade não é faturamento oficial.

## Privacidade

Não capture prompt/resposta que contenha denúncia, PII, anexos, segredo ou código não autorizado. Defina mascaramento, acesso, retenção e exclusão antes de instrumentar.

## Limitações

Tokens não equivalem a qualidade, esforço ou custo total. Sem telemetria histórica, use NÃO FOI POSSÍVEL DETERMINAR. Otimização agressiva de contexto pode remover informação crítica; fonte primária e instruções obrigatórias continuam integrais.

