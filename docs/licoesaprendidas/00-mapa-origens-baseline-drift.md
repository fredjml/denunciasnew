# Mapa de origens, baseline e drift

Este arquivo prova como N1B, N3B e o Denúncias foram consolidados e impede que documentação antiga seja tratada como estado atual.

## O que foi herdado

| Origem | Conteúdo incorporado | O que não foi herdado |
| --- | --- | --- |
| N1B | fluxo completo, pre-flight, Gates 0–7, DoR/DoD, matrizes, Five Whys, rules, skills, MCP, AGENTS, governança Markdown, contexto/tokens e escalonamento | fatos ou resultados de projeto anterior |
| N3B | fonte primária, contraprova, review adversarial, evidence plan, estados offline/live/UI/evidenciado/publicado, owners/autorização, reutilização, telemetria e content freeze | Calmaria, Python/Langfuse, commits, traces, custos, métricas e estados FEITO |
| Denúncias | Angular/Express, signals, multipart, BFF, Redis, ClamAV, API MPT, Playwright/axe, WCAG, privacidade e contratos | conclusões históricas sem reexecução |

## Cobertura N1B

| N1B | Novo destino |
| --- | --- |
| 00 processo + 02 checklist | README, 05-processo-correcoes, templates/checklist-ciclo.md |
| 01 relatório forense | 11-postmortem-rca, templates/lessons-learned.md |
| 03 pre-flight | 01-analise-inicial, 07-preflight, script read-only |
| 04 gates | 06-gates-qa-testes-seguranca |
| 05 matrizes | templates/matrizes-operacionais.md |
| 06 RCA/Five Whys | 11-postmortem-rca |
| 07 contexto/tokens | 09-contexto-tokens-telemetria |
| 08 escalonamento | 10-escalonamento |
| 09 framework | README e 12-governanca-documental |
| 10 AGENTS | 04-ia-rules-skills-tools-mcp-agents e templates/agents.md |
| 11 skills + 15 pesquisa | skill local e 04 |
| 12 rules | 04 e templates/rules.md |
| 13 governança MD | 12 e templates de fase |
| 14 MCP | 04 e templates/mcp.md |

## Cobertura N3B

| Aprendizado | Novo destino |
| --- | --- |
| falha por requisitos e validação circular | 02, 06 e 11 |
| implementado ≠ executado ≠ comprovado | 08 e rastreabilidade |
| pre-flight externo/humano | 07 |
| evidência/shot list/redaction/content freeze | 08 e evidence-manifest |
| contexto até duas páginas e leitura seletiva | 09 e project-context |
| duas falhas iguais acionam escalonamento | 10 |
| copiar controles, reconstruir fatos | 13-reutilizacao |
| telemetria sem números inventados | 09 e 14 |

## Baseline técnica observada em 26/08/2026

- aplicação em cidadania-canal-denuncias;
- Angular 22.0.5 e TypeScript 6.0.2; Node declarado ^24.15 ou >=26;
- BFF Express 4.22 em server, com lockfile próprio;
- frontend usa fetch, FormData, components standalone e signals;
- BFF gera protocolo local, encaminha multipart à API MPT, limita POST e usa Redis em produção;
- upload em disco temporário, MIME allowlist, ClamAV INSTREAM e cleanup;
- Vitest/Angular test, Supertest, Playwright multi-browser com API mockada e axe;
- Swagger/Redocly, ESLint e npm audit disponíveis nos manifests.

Baseline é datada. Reexecute o pre-flight antes de qualquer afirmação atual.

## Registro inicial de drift e lacunas

| ID | Evidência em conflito/lacuna | Estado | Ação recomendada |
| --- | --- | --- | --- |
| D-01 | AGENTS diz Multer em memória; código usa diskStorage | aberto | atualizar governança em tarefa própria |
| D-02 | AGENTS cita sucesso simulado frontend; código atual expõe falha | histórico obsoleto | retirar pitfall após decisão |
| D-03 | planejamento cita Angular 21.2/HttpClient; manifest usa 22/fetch | aberto | alinhar decisão e documentação |
| D-04 | documentação sugere protocolo/aceite retornado pelo MPT; BFF gera protocolo e cliente ignora corpo | alto | decidir ownership e contrato oficial |
| D-05 | development aceita indisponibilidade MPT e ClamAV | intencional ou dívida a decidir | rotular e impedir uso como evidência live |
| D-06 | E2E intercepta API e sobe só Angular | confirmado | nunca alegar integração BFF/live |
| D-07 | CI usa Node 22.22.3; manifest atual exige ^24.15 ou >=26 | aberto | alinhar CI/runtime |
| D-08 | CI frontend não roda lint/E2E; backend executa apenas audit | aberto | definir gates de CI |
| D-09 | Redocly/Prettier sem scripts; test backend aceita ausência de testes; sem coverage script | aberto | decidir comandos e thresholds |
| D-10 | multer e opencode-ai aparecem no manifesto frontend sem uso observado em src | investigar | confirmar e mover/remover em tarefa autorizada |
| D-11 | server_log.txt está versionado apesar da regra contra logs gerados | aberto | classificar necessidade e sanitizar/remover com autorização |
| D-12 | MCP Miro local e oficial sobrepostos; Playwright MCP fallback desabilitado | investigar | justificar superfície e fallback |

Este documento não corrige esses itens. Ele evita que sejam ocultados.

## Como atualizar

1. registre commit, data e fontes;
2. acrescente drift com evidência e impacto;
3. não altere estado para resolvido sem diff/teste/decisão;
4. atualize requisitos, arquitetura e testes afetados;
5. preserve histórico em vez de reescrever retrospectivamente.

## Limitações

O inventário não executou as suítes nem acessou produção. Ausência de uso encontrada por busca não prova que uma dependência nunca é necessária em build/tooling. Configuração de MCP não prova autenticação, saúde ou autorização.
