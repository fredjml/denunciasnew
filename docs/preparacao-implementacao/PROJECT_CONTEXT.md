# PROJECT_CONTEXT — Canal de Denúncias

> Regra do kit: manter em até duas páginas. Não reler, salvo mudança.

- **Objetivo/fonte**: canal digital de denúncias (Angular 22 + BFF Express) que recebe denúncia + anexos, gera protocolo local no BFF e encaminha multipart à API MPT. Fonte primária: `cidadania-canal-denuncias/AGENTS.md`, `planejamento.md`, `spec_design.md`, código, testes e Swagger.
- **Commit/ambiente**: branch `stg` do repo `MP-Trabalho/cidadania-canal-denuncias`; leitura estática em 2026-08-27. Runtime declarado no `package.json`: Node `^24.15` ou `>=26`; CI observado em relatórios usa Node 22.22.3 (drift D-07).
- **Requisito/fatia ativa**: pré-implementação — Passos 0 a 4 do [kit](../licoesaprendidas/README.md). Nenhuma fatia de código autorizada.
- **Estado probatório**: **offline/estático**. Nenhum comando executado. Todos os números citados vêm de relatórios em `docs/Analises/` com data explícita.
- **Decisão vigente e motivo**: gerar PRD, TDD, requisitos, threat model, evidence plan, plano incremental e prompts **antes** de qualquer implementação, pois o usuário exigiu "não altere nada" e o kit exige Gates 0–2 fechados antes do Gate 3.
- **Arquivos alterados**: apenas dentro de `docs/preparacao-implementacao/` (documentação de preparação). Nenhum arquivo de `cidadania-canal-denuncias/` foi modificado.
- **Último comando/resultado**: `list_dir` e `read_file` (estáticos). Nenhum `npm`/`git` executado nesta compilação.
- **Evidência**: leitura direta dos arquivos do kit e do AGENTS.md do projeto. Sanitizada por natureza (sem PII, secrets ou logs).
- **Bloqueio/owner**:
  - Owner de Produto: **pendente**.
  - Owner de Segurança/DPO: **pendente**.
  - Owner de Integração MPT (contrato oficial + protocolo): **pendente** (conflito D-04 ainda aberto).
  - Owner de Infra (Redis, ClamAV, CI): **pendente**.
- **Autorização vigente e limites**: **somente leitura/documentação**. Vetado: instalação, alteração de código, execução de testes, ambiente live, commit/push/PR, uso de dado real. Fica claro em `README.md` deste pacote.
- **Próximo passo único**: submeter este pacote a revisão humana (Passos 0–4). Após aprovação e atribuição de owners, o operador pode executar os prompts do Passo 1 (pre-flight real com comandos) para atualizar o baseline.
- **Links para detalhes**: [ANALYSIS](01-ANALYSIS.md), [PRD](05-PRD.md), [REQUIREMENTS](06-REQUIREMENTS.md), [TDD](08-TDD.md), [THREAT MODEL](09-THREAT-MODEL.md), [IMPLEMENTATION PLAN](11-IMPLEMENTATION-PLAN.md), [PROMPTS](13-PROMPTS.md).
- **Não reler, salvo mudança**: fontes citadas em [00-MAPA-ORIGENS.md](00-MAPA-ORIGENS.md).
