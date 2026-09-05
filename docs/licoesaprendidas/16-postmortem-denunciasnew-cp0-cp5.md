# 16 — Post-mortem: implementação CP-0 a CP-5 do `denunciasnew`

> Preenchido a partir do [template LESSONS LEARNED](templates/lessons-learned.md). Cobre a sessão
> de implementação de 2026-09-04 a 2026-09-05 (commits `addbd7b`..`c24f910`). Detalhe operacional
> completo em [`docs/preparacao-review/`](../preparacao-review/).

## Legenda de confiança

Confirmada (evidência direta desta sessão) · parcial · inferência forte · hipótese · não foi
possível determinar. Todas as afirmações abaixo são **confirmadas** salvo indicação contrária —
esta sessão foi execução direta, não leitura estática de trabalho de terceiros.

## Resumo executivo, objetivo e resultado

**Objetivo:** continuar a implementação do MVP `denunciasnew` a partir de onde uma sessão anterior
(Codex) tinha parado, com árvore de build quebrada no meio do CP-2.

**Resultado:** wizard completo (8 telas) implementado, testado (68+22 testes unitários, 11 e2e) e
revisado (QA + segurança) de ponta a ponta, com envio real ao backend-mock e protocolo `SYN-*`
genuíno. 3 decisões do owner fechadas. 1 vulnerabilidade de segurança real encontrada e corrigida
com confirmação independente. Nenhuma publicação remota realizada — entrega fica local,
aguardando autorização.

## Timeline e evidências

| Momento | Evento | Evidência |
| --- | --- | --- |
| Início da sessão | Build quebrado herdado do Codex (erro de tipo em `audio-recorder.service.ts`) | commit `df2a03c` (mensagem descreve a correção) |
| CP-2 a CP-3 | Implementação funcional sem identidade visual (nenhum checkpoint cobria design) | commits `cc9b5ac`..`d8421aa` |
| Owner reporta "interface completamente diferente do PDF" | Gap de escopo real — nenhum CP tinha fatia de design visual | commit `a84e439` |
| Owner pede para continuar CP-4/CP-5 | Wizard completo com envio real implementado | commit `ff3db92` |
| Owner fornece logo oficial + decide 3 pendências | `DEC-DN-16`, `DEC-DN-20` fechadas; logo aplicado | commit `03a7da1` |
| Owner pede review QA/teste/segurança | `/code-review` (8 ângulos) + `/security-review` disparados | — |
| `/security-review` interrompido no meio | Owner pediu refatoração antes do pipeline terminar | ver Five Whys #2 abaixo |
| Correções aplicadas + `/security-review` re-executado até o fim | 0 achados novos confirma correção completa | commit `58b5c57`, `c24f910` |

## O que funcionou / não funcionou

**Funcionou:**
- Rodar a suíte completa (`lint`+`test`+`build`+`e2e`) depois de **cada** lote de mudança, não só
  no final — pegou regressões cedo (ex.: off-by-one em teste, quebra de seletor e2e após
  restyle).
- Verificação visual real (screenshots via Playwright do app rodando), não só "os testes
  passam" — foi o que revelou que a interface batia com o mockup de fato, e também revelou o
  logo invisível sobre fundo vermelho antes de o usuário precisar reportar.
- Perguntar ao owner antes de implementar um campo do mockup que colidia com uma decisão de
  compliance pendente (`DEC-DN-16`), em vez de assumir.
- Adaptador na fronteira (`ComplaintSubmissionService` traduzindo códigos internos da UI para os
  enums do contrato) em vez de forçar a UI a usar a nomenclatura do contrato — manteve os dois
  lados desacoplados.

**Não funcionou / exigiu retrabalho:**
- Nenhum checkpoint do plano original tinha fatia de identidade visual — isso só foi descoberto
  quando o owner comparou com o PDF, gerando uma rodada de retrabalho inteira (commit `a84e439`)
  que poderia ter sido evitada se o plano de F6 tivesse uma fatia explícita de design.
- O `/security-review` foi disparado, mas a sessão seguiu para outra tarefa antes do pipeline
  terminar — o achado de segurança real só apareceu porque o `/code-review` também o pegou por
  coincidência (ângulos sobrepostos). Se não tivesse sobreposição, o achado teria sido perdido.
- `backend-mock/src/routes/denuncias.js` foi escrito (CP-2) sem reusar o middleware de upload já
  existente (`middleware/upload.js`, criado no CP-3) — os dois evoluíram em paralelo sem
  convergir, até o review encontrar a divergência.

## Primeira entrega, feedback A–E e retrabalho

| Observação | Classe | Fonte/momento | Impacto | Controle |
| --- | --- | --- | --- | --- |
| Interface sem identidade visual | **C — requisito implícito** (o PDF sempre teve mockups visuais; o plano só extraiu texto/comportamento) | owner, após ver CP-0..CP-3 | 1 sessão inteira de retrabalho visual | Fatia explícita de design deveria existir desde o plano de F6 |
| Campo "Nomes e Dados" / "CNPJ" ausentes do contrato | **D — requisito novo** (mockup visual não foi confrontado contra o contrato antes da implementação) | esta sessão, ao comparar PDF com `contract/openapi.yaml` | 2 campos omitidos, documentados | Checklist "mockup vs. contrato" antes de implementar cada tela nova |
| `/api/denuncias` sem validação de upload | **E — falha de validação** (dois desenvolvedores/momentos diferentes escreveram rotas de upload paralelas sem convergir) | `/code-review`, pós-implementação | vulnerabilidade HIGH real, corrigida | Módulo único de validação (`attachment-validation.js`) extraído; ver Five Whys #1 |
| Build quebrado herdado do Codex | **E — falha de validação** (sessão anterior não rodou a suíte antes de parar) | início desta sessão | ~30 min de diagnóstico | Regra já existente (`R-QA-01`) reforçada: nunca pausar com build quebrado |

## Causas, Five Whys, contraprova e contrafactual

### Five Whys #1 — Upload sem validação em `/api/denuncias`

```text
Problema e impacto: rota real de envio aceitava qualquer arquivo sem checagem de conteúdo (HIGH).
Sintoma observado: /code-review encontrou multer sem fileFilter em denuncias.js.
Evidência/confiança: confirmada — código lido diretamente, 4 testes de regressão provam o antes/depois.
Por quê 1? denuncias.js (CP-2) implementou seu próprio multer em vez de importar middleware/upload.js.
Por quê 2? middleware/upload.js só foi criado no CP-3, depois de denuncias.js já existir.
Por quê 3? Não havia um passo de "revisitar rotas antigas quando um middleware compartilhado é criado".
Por quê 4? O plano de fatias (FATIA-DN-*) trata cada rota como unidade independente, sem uma fatia de "consolidação" entre checkpoints.
Por quê 5? O processo de review (QA/segurança) só foi rodado no fim de todos os checkpoints, não incrementalmente a cada novo middleware compartilhado.
Causa imediata: duas implementações paralelas de upload nunca convergiram.
Causa raiz sistêmica: ausência de um gate de review recorrente entre checkpoints (não só no fim).
Controle corretivo: middleware/upload.js e attachment-validation.js unificados; testes de regressão nas duas rotas.
Controle preventivo verificável: FRAMEWORK-REVIEW.md agora recomenda rodar /code-review após qualquer mudança que toque upload/auth/contrato, não só no fechamento de um bloco de checkpoints.
Como provar que funciona: próxima vez que um middleware compartilhado for criado, rodar /code-review antes de considerar o checkpoint fechado — critério já registrado no framework.
```

### Five Whys #2 — `/security-review` interrompido sem completar o pipeline

```text
Problema e impacto: rodada 1 do /security-review não terminou; o achado HIGH só foi capturado porque o /code-review também o encontrou (sobreposição, não garantia).
Sintoma observado: notificação de conclusão do /security-review nunca chegou antes da próxima instrução do owner.
Evidência/confiança: confirmada — histórico da conversa mostra a interrupção explícita.
Por quê 1? O owner pediu refatoração enquanto os agentes de review ainda rodavam em background.
Por quê 2? Não havia uma verificação explícita de "o /security-review chegou à notificação final?" antes de assumir que os achados de segurança estavam completos.
Por quê 3? O /code-review e o /security-review foram tratados como uma coisa só ("a review"), sem rastrear o status de cada um separadamente.
Por quê 4? Não existia, até este post-mortem, um processo documentado distinguindo "disparado" de "concluído" para skills assíncronas.
Por quê 5? É a primeira vez que os dois pipelines rodam juntos neste projeto — não havia experiência prévia registrada.
Causa imediata: falta de rastreamento de status por pipeline.
Causa raiz sistêmica: ausência de um framework de review documentado antes desta sessão.
Controle corretivo: /security-review re-executado até a conclusão real, contra o estado pós-correção.
Controle preventivo verificável: FRAMEWORK-REVIEW.md §"Nota de processo" — não considerar um /security-review "feito" sem a notificação final de conclusão.
Como provar que funciona: checklist do framework (§5) exige marcar explicitamente cada pipeline como concluído antes de fechar a rodada de review.
```

## Demora e eficiência

Não foi possível determinar tempo em horas/minutos com confiança (sem telemetria de sessão
confiável) — commits e número de rodadas de correção são o proxy disponível. 11 commits, ~8
rodadas de validação completa (lint+test+build+e2e), 2 rodadas de review formal.

## Ferramentas, autorizações e dependências humanas

- Skills usadas: `/code-review` (nível `high`), `/security-review`, `artifact-design` +
  `Artifact` (galeria visual).
- Nenhuma instalação de dependência nova fora do lockfile.
- Dependências humanas resolvidas nesta sessão: logo oficial do MPT (arquivo fornecido pelo
  owner), 3 decisões (`DEC-DN-16`, `DEC-DN-20`, `DEC-DN-26`).
- Dependências humanas **ainda pendentes**: `DEC-DN-08` (SLA performance), URL da Ouvidoria,
  decisão de hosting de vídeo, identificação da equipe do backend real (`DEC-DN-26` operacional).

## Auditoria de MCP, skills, rules e documentação

- Regras aplicadas ativamente nesta sessão: `R-DN-06` (contrato imutável — nunca violada),
  `R-DN-02` (prioridade/classificação server-side — verificada no review de segurança), `R-QA-01`
  (teste antecede alegação de sucesso — suíte completa rodada após cada lote), `R-REV-01` (review
  tenta refutar prontidão — usado para rejeitar conscientemente 1 sugestão do `/code-review`).
- `AGENTS.md` não foi modificado (proibido pela própria persona).
- `contract/openapi.yaml` não foi modificado.

## Falhas de ANALYSIS, IMPLEMENTATION, TESTING e REVIEW

- **ANALYSIS**: o plano de F6 (`11-IMPLEMENTATION-PLAN.delta-denunciasnew.md`) não previu uma
  fatia de identidade visual — falha de completude do planejamento original, não desta sessão.
- **IMPLEMENTATION**: `denuncias.js` (CP-2) e `evidencias.js`/`upload.js` (CP-3) evoluíram sem
  convergir — falha de coesão entre fatias implementadas em momentos diferentes.
- **TESTING**: nenhuma falha de teste não capturada até o fim da sessão.
- **REVIEW**: rodada 1 do `/security-review` interrompida sem rastreamento — corrigido na
  rodada 2.

## Contexto, tokens e comportamento da IA

Sessão longa com múltiplos ciclos de implementação → verificação → documentação. Comportamento
observado: a IA manteve disciplina de não avançar checkpoint sem autorização, mas inicialmente
tratou "review disparada" como equivalente a "review concluída" (ver Five Whys #2) — corrigido
dentro da própria sessão.

## Dívida de processo e riscos residuais

- Nenhum gate de review recorrente entre checkpoints (só no fim de blocos) — ver Five Whys #1.
- `ClamAV` mock por assinatura, não scanner real — aceito para o MVP, revisitar antes de produção.
- Testes de carga/rate-limit nunca executados.

## Top lições e erros que não podem repetir

1. **Nunca considerar um `/security-review` "concluído" sem a notificação final do pipeline.**
   Evidência: Five Whys #2. Consequência: achado de segurança poderia ter sido perdido.
   Controle verificável: `FRAMEWORK-REVIEW.md` §5 (checklist). Owner: quem conduzir a próxima
   rodada de review.
2. **Quando um middleware/serviço compartilhado é extraído no meio de um projeto, revisitar
   explicitamente quem mais deveria estar usando ele.** Evidência: Five Whys #1. Controle
   verificável: incluir essa pergunta no checklist de fechamento de cada checkpoint que introduz
   um módulo compartilhado.
3. **Identidade visual precisa ser uma fatia explícita do plano, não implícita no "requisito
   funcional".** Evidência: retrabalho do commit `a84e439`. Controle verificável: ao planejar um
   próximo ciclo com mockup visual, incluir uma fatia dedicada de design desde o início.
4. **Comparar cada tela nova contra o contrato de dados antes de implementar, não depois.**
   Evidência: campos "Nomes e Dados"/"CNPJ" descobertos tarde. Controle verificável: checklist
   "mockup vs. contrato" antes de codar uma tela nova.

## Quick wins, melhorias e plano P0–P3

| Prioridade | Ação | Owner |
| --- | --- | --- |
| P0 | Nenhum item P0 aberto — HIGH desta sessão já corrigido e confirmado | — |
| P1 | Decidir `DEC-DN-08` (SLA performance) para destravar `CP-mobile-perf` | Owner/Arquitetura |
| P1 | Definir detalhe operacional de `DEC-DN-26` quando a equipe do backend real existir | Owner |
| P2 | Adicionar ao plano de próximos ciclos uma fatia explícita de "gate de review recorrente" entre checkpoints, não só no fim | Owner/Coordenador |
| P2 | Revisitar `ClamAV` mock por assinatura antes de qualquer ambiente com upload real | Segurança |
| P3 | Gerar fixture de áudio real (`espeak-ng`) quando o ambiente permitir instalação | QA |

## DoR, DoD, gates e métricas

Ver [`docs/preparacao-review/05-GATES-DOD.md`](../preparacao-review/05-GATES-DOD.md) para os
gates 4–7 preenchidos com o estado real desta sessão.

## Scorecard com evidência ou N/A

| Critério | Status | Evidência |
| --- | --- | --- |
| Requisitos do escopo (CP-0..CP-5) cobertos | ✅ | `docs/preparacao-implementacao/11-IMPLEMENTATION-PLAN.delta-denunciasnew.md` |
| Testes automatizados verdes | ✅ | `docs/preparacao-review/02-TESTING.md` |
| Review adversarial (QA + segurança) | ✅ | `docs/preparacao-review/04-REVIEW.md` |
| Acessibilidade WCAG 2.1 AA (piso) | ✅ | axe-core, 0 violações |
| Publicação remota | N/A — não solicitada | — |
| CP-6 | ❌ não iniciado (fora de escopo, decisões de arquitetura pendentes) | `06-ACCEPTANCE-DECISION.md` |

## Se começássemos amanhã

Escreveríamos a fatia de identidade visual (header, cores, ícones) **junto** com a primeira tela
funcional (CP-1), não como uma correção posterior — teria evitado uma rodada inteira de
retrabalho. Também rodaríamos `/code-review` e `/security-review` a cada 2-3 checkpoints, não só
uma vez no fim, e trataríamos "disparei a review" e "a review terminou" como dois eventos
distintos com uma verificação explícita entre eles.

## Limitações da investigação

Este post-mortem cobre apenas a sessão de implementação (CP-0 a CP-5). Não cobre o ciclo de
planejamento original (F1-F7, já documentado em `docs/preparacao-implementacao/prompts/fases/`)
nem eventuais sessões futuras (CP-6 em diante). Não há telemetria de tempo/custo confiável —
métricas quantitativas de esforço não foram inventadas, apenas contagem de commits/rodadas.
