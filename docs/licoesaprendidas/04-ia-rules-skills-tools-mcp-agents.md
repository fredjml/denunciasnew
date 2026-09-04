# IA, rules, skills, tools, MCP e agents

## Modelo operacional

| Recurso | Papel | Evidência mínima | Não autoriza |
| --- | --- | --- | --- |
| AGENTS/rules | invariantes locais verificáveis | regra + controle + owner | mudança fora do pedido |
| Skill | procedimento especializado sob demanda | entrada, saída, validação, parada | instalação, rede ou mutação externa |
| Tool | operação local ou remota delimitada | comando/chamada + resultado | acesso além do sandbox/permissão |
| MCP/app | acesso padronizado a fonte externa | autenticação, health check, escopo, fallback | escrita, envio, exclusão, deploy ou custo |
| Agent | subtrabalho independente | escopo, arquivos, saída e integrador | ampliar permissões ou decidir requisito material |

## Rules P0

- R-REQ-01 — não implementar sem IDs, fonte e aceite.
- R-REQ-02 — exclusão de escopo exige citação, contraprova e aprovação.
- R-SRC-01 — fonte primária prevalece; conflito fica visível.
- R-ENV-01 — não presumir runtime, CLI, MCP, credencial ou serviço.
- R-HUM-01 — owner de secrets, OAuth, dados, créditos e mutações é mapeado cedo.
- R-INC-01 — implementar em fatias pequenas com menor validação imediata.
- R-EVD-01 — alegação externa exige evidência externa sanitizada.
- R-LIVE-01 — offline, mock, live, UI, evidenciado e publicado são estados distintos.
- R-QA-01 — teste e review antecedem alegação de sucesso.
- R-REV-01 — review começa novamente na fonte primária e tenta refutar prontidão.
- R-SEC-01 — nunca expor denúncia, PII, anexo, segredo ou resposta interna.
- R-CTX-01 — contexto persistente curto; não reler sem pergunta/mudança nova.
- R-LOOP-01 — duas falhas iguais sem nova hipótese acionam escalonamento.
- R-GIT-01 — commit, push, PR, merge e deploy exigem autorização aplicável.
- R-SCOPE-01 — preservar mudanças do usuário e evitar refactor oportunista.

Rules boas são curtas, têm mecanismo verificável e não duplicam regras já existentes. Uma correção aprovada não autoriza produção nem ação destrutiva.

## Skill

A skill deste kit é específica para review do Denúncias e usa progressive disclosure. Antes de instalar skill externa:

- identificar origem, mantenedor e licença;
- ler SKILL.md completo;
- auditar scripts, assets, dependências, rede, secrets e telemetria;
- checar conflito com AGENTS.md;
- testar prompt positivo, negativo e caso limítrofe em workspace isolado;
- registrar decisão e rollback.

Evite skill monolítica, leitura integral automática, instalação silenciosa ou saída sem critério de conclusão.

## Tools

Comece por operação read-only e pela ferramenta de menor risco. Use busca, parser, diff e teste para fatos; não substitua observação por texto gerado. Registre comandos perigosos antes de executar e sanitize outputs.

## MCP

Estados operacionais separados: descoberto, configurado, autenticado, health check aprovado, autorizado para a ação e fallback testado.

Gates:

1. descoberta da fonte externa e necessidade;
2. autorização/OAuth e menor escopo;
3. health check read-only;
4. uso filtrado, fonte citada, sem segredos;
5. autorização just-in-time antes de mutação.

Prefira shell local quando o arquivo já está no workspace e o comando simples reduz risco. Prefira MCP quando a fonte é externa, o conector aprovado melhora rastreabilidade e o acesso é necessário. Use templates/mcp.md.

MCPs potencialmente úteis: GitHub para PR/run/artifact; browser para UI autorizada; Miro para arquitetura; Drive/Docs/Sheets ou sistema de tickets para fontes corporativas. Não crie MCP para Redis, ClamAV ou API MPT sem necessidade e threat model.

## Agents

Delegue apenas subtarefas independentes. Declare:

- pergunta e fora de escopo;
- arquivos read-only ou arquivos exclusivos de escrita;
- fontes obrigatórias;
- formato da saída e evidência;
- ações proibidas;
- critério de parada.

Um integrador revisa conflito, fonte, diff e conclusões. Dois agentes concordarem não substitui evidência. Para review independente, não envie ao revisor a conclusão desejada.

## Matriz humano × IA

| Atividade | IA | Humano/owner |
| --- | --- | --- |
| inventário, análise, implementação e testes locais | executa dentro do escopo | valida intenção/risco |
| requisitos ambíguos e risco aceito | apresenta evidência e opções | decide |
| login, MFA e secret | nunca coleta valor no chat | configura no mecanismo seguro |
| dados reais, custo e ambiente live | propõe plano | autoriza e define limites |
| commit/push/deploy | executa somente se autorizado | concede autorização específica |
| aceite final | fornece matriz e evidências | responde pelo aceite |

## Limitações

IA pode alucinar, interpretar errado uma fonte e produzir validação circular — exatamente a lição central do N3B. MCP configurado não prova autenticação; autenticação não prova autorização. Paralelismo acelera trabalho, mas aumenta risco de conflito e duplicidade.
