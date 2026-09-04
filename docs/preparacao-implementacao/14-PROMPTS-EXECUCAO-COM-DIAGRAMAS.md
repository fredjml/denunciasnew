# Prompts de execução — preparação, implementação e diagramas

Este arquivo consolida os passos descritos em [`README.md`](README.md) com as visões de engenharia reversa catalogadas em [`../diagramas-mermaid/README.md`](../diagramas-mermaid/README.md).

Os prompts são roteiros operacionais. **Eles não concedem autorização** para instalar dependências, alterar código, usar dados reais, fazer commit, push, PR, deploy ou acessar ambientes live. Antes de cada prompt, substitua os campos entre `<...>` e registre a autorização just-in-time do owner competente.

## Regras para todos os prompts

Inclua este bloco no início de toda execução:

```prompt
Projeto: Canal de Denúncias MPT.
Workspace: <CAMINHO_DO_WORKSPACE>.
Commit/branch sob análise: <COMMIT_E_BRANCH>.
Owner do ciclo: <NOME_OU_PENDENTE>.
Autorização vigente: <SOMENTE_LEITURA | DOCUMENTAÇÃO | FATIA_ID | TESTES_LOCAIS | OUTRA>.

Antes de agir:
1. Leia integralmente os AGENTS.md aplicáveis e obedeça à fonte primária.
2. Leia docs/preparacao-implementacao/README.md e docs/diagramas-mermaid/README.md.
3. Verifique git status e preserve alterações locais não relacionadas.
4. Reabra as fontes primárias citadas; documentação derivada não substitui o código atual.
5. Use somente dados e fixtures sintéticos. Não exponha PII, denúncias, anexos, tokens ou URLs internas.
6. Não faça commit, push, PR, deploy, instalação ou acesso live sem autorização específica.
7. Pare se faltar owner, autorização, fonte material ou se a próxima ação ampliar o escopo.
8. Após duas falhas iguais sem hipótese nova, interrompa e registre o bloqueio.

Em toda saída, informe: fontes consultadas, comandos executados, alterações realizadas,
evidências, limitações, riscos, decisão do gate e próximo passo autorizado.
```

---

## Prompt mestre — conduzir o ciclo sem ultrapassar gates

Use este prompt quando um agente coordenador precisar conduzir o processo completo. Ele deve parar em cada gate que dependa de aprovação humana.

```prompt
Atue como coordenador do ciclo DISCOVER → ANALYZE → READINESS CHECK → PLAN → IMPLEMENT →
TEST → REVIEW → SECURITY/QA → ACCEPTANCE → DELIVER → LESSONS LEARNED.

Fontes obrigatórias:
- docs/preparacao-implementacao/README.md;
- docs/preparacao-implementacao/00-MAPA-ORIGENS.md até 14-PROMPTS-EXECUCAO-COM-DIAGRAMAS.md;
- docs/diagramas-mermaid/README.md e os dez arquivos .mmd;
- docs/licoesaprendidas/README.md e o capítulo do passo em execução;
- AGENTS.md, planejamento.md, spec_design.md, código, testes e Swagger atuais.

Modo de execução:
1. Execute somente um passo por vez.
2. No início do passo, declare escopo, autorização e artefatos que podem ser alterados.
3. Compare a documentação e os diagramas com a fonte primária atual.
4. Ao final, apresente PASSOU, PASSOU COM RISCOS ou BLOQUEADO.
5. Não avance quando houver gate humano, decisão DEC-* ou autorização pendente.
6. Se o código mudar em passo autorizado, atualize testes, contrato e diagramas afetados na mesma fatia.
7. Trate os .mmd como fontes editáveis; não substitua por imagens rasterizadas.

Comece pelo Passo <0_A_11>. Não execute passos posteriores nesta sessão sem autorização explícita.
```

---

## Passo 0 — descobrir origem, baseline e drift

```prompt
Autorização: SOMENTE LEITURA, com edição apenas de 00-MAPA-ORIGENS.md se autorizada.

Objetivo:
- Confirmar origem, branch, commit, estado do worktree, precedência das fontes e drift atual.
- Verificar se os diagramas ainda representam o codebase.

Leia:
- docs/preparacao-implementacao/00-MAPA-ORIGENS.md;
- docs/diagramas-mermaid/*.mmd;
- fontes primárias indicadas nos AGENTS.md.

Execute verificações read-only e produza:
1. identificação do commit e do estado local;
2. tabela fonte → data → confiança → divergência;
3. drift novo com arquivo e linha;
4. lista dos diagramas impactados;
5. decisão APTO PARA ANÁLISE ou BLOQUEADO.

Não corrija drift nem atualize números históricos silenciosamente.
Pare diante de segredo suspeito, fonte primária ausente ou conflito material sem owner.
```

## Passo 1 — análise inicial e readiness check

```prompt
Autorização: comandos locais read-only definidos em 02-PRE-FLIGHT.md. Sem instalação e sem rede.

Objetivo:
- Reexecutar o pre-flight do commit atual.
- Classificar evidência como CONFIRMADA, PARCIAL ou NÃO FOI POSSÍVEL DETERMINAR.

Leia 01-ANALYSIS.md, 02-PRE-FLIGHT.md, 03-TOOLS.md e 04-MCP.md.
Use 01-arquitetura-geral.mmd e 09-implantacao-seguranca.mmd para conferir runtimes,
fronteiras, dependências e ferramentas realmente necessárias.

Saída:
- comandos, versões, exit codes e limitações;
- resultado por gate;
- ferramentas/MCP necessários, opcionais ou proibidos;
- GO, GO COM RISCOS ou NO-GO;
- arquivos documentais atualizados somente se autorizados.

Não trate ferramenta configurada como autenticada ou autorizada.
Pare se um comando exigir rede, credencial, serviço real ou mutação não autorizada.
```

## Passo 2 — engenharia reversa e requisitos

```prompt
Autorização: SOMENTE LEITURA; edição apenas de 05-PRD.md, 06-REQUIREMENTS.md,
07-TRACEABILITY.md e diagramas .mmd explicitamente autorizados.

Objetivo:
- Reconstruir requisitos atômicos e critérios Dado/Quando/Então a partir do código atual.
- Garantir rastreabilidade entre requisito, componente, teste, evidência e risco.

Use os diagramas:
- 02-contexto.mmd para atores e sistemas externos;
- 03-classes.mmd e 07-componentes.mmd para responsabilidades;
- 04-atividade-envio.mmd e 05-sequencia-envio.mmd para caminhos feliz e de erro;
- 06-jornada-demandante.mmd para linguagem de negócio;
- 08-estados-wizard.mmd para navegação;
- 10-fluxo-dados.mmd para contrato, PII e anexos.

Saída:
1. requisitos RF, RS, RG e RNF atômicos;
2. aceite Dado/Quando/Então;
3. classificação CONF, PART, INF, HIP ou ND;
4. matriz de rastreabilidade completa;
5. ambiguidades e decisões DEC-* sem decisão autônoma;
6. delta necessário em cada diagrama.

Não transforme hipótese em fato nem introduza feature sem fonte.
Pare diante de conflito material sem owner.
```

## Passo 3 — arquitetura, ameaça e evidência

```prompt
Autorização: DOCUMENTAÇÃO, restrita a 08-TDD.md, 09-THREAT-MODEL.md,
10-EVIDENCE-MANIFEST.md e arquivos .mmd afetados.

Objetivo:
- Atualizar arquitetura, modelo de ameaças e plano de evidências de forma consistente.

Procedimento:
1. Compare código e testes com todos os diagramas técnicos.
2. Confirme fronteiras navegador/BFF/rede privada/API MPT.
3. Modele upload temporário, ClamAV, Redis, CORS, rate limit, secrets, logs e cleanup.
4. Diferencie desenvolvimento de produção.
5. Relacione cada ameaça a controle, teste, evidência, risco residual e owner.
6. Planeje evidências somente com fixtures sintéticas e redaction.
7. Atualize .mmd quando a fonte primária contrariar o desenho.
8. Valide os diagramas com docs/diagramas-mermaid/validate-diagrams.js.

Saída:
- TDD com delta e referências de arquivo/linha;
- threat model com decisão APROVADO, APROVADO COM RISCO ou BLOQUEADO;
- manifesto e shot list;
- diagramas Mermaid consistentes e editáveis no draw.io.

Não execute DAST, pentest ou serviços live.
Pare diante de possível vazamento de PII/segredo ou ausência de owner de Segurança/DPO.
```

## Passo 4 — planejar fatias e decisões

```prompt
Autorização: DOCUMENTAÇÃO, restrita a 11-IMPLEMENTATION-PLAN.md e 12-DECISIONS.md.

Objetivo:
- Decompor a execução em fatias verticais pequenas, reversíveis e aprováveis.

Para cada fatia, informe:
- ID e requisito;
- arquivos permitidos;
- menor mudança coerente;
- diagrama potencialmente afetado;
- teste focal que deve falhar antes e passar depois;
- gates ampliados;
- ameaça/controle relacionado;
- evidência esperada;
- rollback;
- dependências, owner, autorização e estado.

Respeite a sequência A → B/C/D/E → F → G e os checkpoints CP-0 a CP-6 do plano atual,
ajustando-a somente com evidência. Não misture requisitos independentes.

Saída: plano atualizado, decisões abertas e próximo gate humano.
Pare em dependência circular, teste focal impossível ou DEC-* bloqueadora.
```

## Passo 5 — implementar uma única fatia

```prompt
Fatia autorizada: <ID_DA_FATIA>.
Owner/autorização: <REGISTRO_DA_AUTORIZACAO>.
Arquivos permitidos: <LISTA_EXATA_DO_PLANO>.

Objetivo:
- Implementar somente a fatia indicada com a menor mudança coerente.

Antes de editar:
1. Reabra requisito, aceite, TDD, ameaça, evidência, decisão e diagramas relacionados.
2. Verifique git status e alterações do usuário.
3. Execute o teste focal e confirme que falha pela razão esperada.

Durante:
- mantenha contrato frontend/modelo/FormData/validação/Swagger alinhado quando aplicável;
- preserve privacidade, limites de upload, acessibilidade e tratamento explícito de erros;
- não faça refatoração oportunista;
- atualize o .mmd afetado se a arquitetura ou o fluxo mudarem.

Depois:
- execute teste focal, testes da camada e validação dos diagramas;
- mostre diff, evidência sanitizada, riscos e rollback;
- não faça commit/push sem nova autorização.

Pare se a mudança exigir arquivo fora da lista, decisão nova, dependência não aprovada,
serviço real ou dado real.
```

## Passo 6 — testar por modo

```prompt
Autorização de teste: <UNIT | INTEG_SIM | E2E_MOCK | LIVE_BFF | LIVE_MPT>.
Fatia/commit: <ID_E_COMMIT>.

Objetivo:
- Executar testes na ordem: focal → camada → lint/type/build → integração/contrato →
E2E → segurança/acessibilidade/performance, somente até o modo autorizado.

Use 04-atividade-envio.mmd, 05-sequencia-envio.mmd e 08-estados-wizard.mmd para derivar
casos felizes, alternativas e falhas. Use 09-implantacao-seguranca.mmd para não confundir
teste mockado com integração live.

Registre por comando: diretório, ambiente, commit, modo, exit code, contagem,
resultado, artefato, requisito coberto e limitação.

Atualize 07-TRACEABILITY.md com NE, INC, FAIL ou OK quando autorizado.
Não alegue cobertura live a partir de mock. Falha inconclusiva não é aprovação.
Pare antes de qualquer modo não autorizado.
```

## Passo 7 — capturar evidências

```prompt
Autorização: captura dos itens <IDS_DA_SHOT_LIST> de 10-EVIDENCE-MANIFEST.md.

Objetivo:
- Capturar apenas evidências previstas, após content freeze.

Regras:
- fixtures sintéticas;
- redaction de PII, tokens, IPs, URLs internas e caminhos sensíveis;
- nomes, formato, retenção e destino conforme o manifesto;
- nenhuma captura de produção sem autorização específica.

Use 06-jornada-demandante.mmd para evidência de negócio e os diagramas técnicos para
legendar evidências de arquitetura sem revelar detalhes sigilosos.

Saída: arquivos capturados, hashes quando exigidos e status capturado/aprovado/publicado.
Pare se redaction, content freeze, owner ou destino aprovado estiver ausente.
```

## Passo 8 — review adversarial, segurança e aceite

```prompt
Autorização: SOMENTE LEITURA. Atue como revisor independente.

Objetivo:
- Tentar refutar a prontidão da fatia <ID>.

Reabra código, testes, requisitos, rastreabilidade, TDD, threat model, manifesto,
plano, decisões e os dez diagramas Mermaid.

Procure:
- requisito sem prova;
- teste mais fraco que a alegação;
- caminho de erro ausente no diagrama ou no teste;
- drift entre código, Swagger, modelo, FormData e diagramas;
- expansão de escopo;
- controle de segurança incompleto;
- evidência com PII/segredo;
- diferença dev/prod não tratada.

Saída: findings P0–P3 com fonte e linha, contraprova e decisão ENTREGAR, CORRIGIR ou BLOQUEAR.
Bloqueie diante de P0/P1 sem aceite, requisito crítico sem evidência ou suspeita de vazamento.
```

## Passo 9 — preparar e executar entrega autorizada

```prompt
Autorização vigente: <SOMENTE_RELEASE_NOTES | COMMIT | PUSH | PR | DEPLOY>.
Destino autorizado: <BRANCH_REMOTE_AMBIENTE>.

Objetivo:
- Confirmar DoD, aceite humano, target, rollback e riscos residuais antes da entrega.

Produza primeiro um checklist com:
- fatias incluídas e excluídas;
- testes por modo e evidências;
- revisão de segurança/QA;
- diagramas atualizados e validados;
- decisões e riscos residuais;
- autorização e owner;
- rollback verificável.

Execute somente a mutação explicitamente autorizada e verifique o destino depois.
Saída: release notes com o quê, onde, provas, limitações e resultado da verificação.
Pare se qualquer gate, autorização, target ou aceite estiver ausente.
```

## Passo 10 — post-mortem e RCA

```prompt
Autorização: SOMENTE LEITURA; documentação apenas no destino aprovado.

Objetivo:
- Reconstruir timeline e causas do ciclo concluído ou interrompido.

Use commits, logs sanitizados, decisões, gates, testes, evidências e deltas dos diagramas.
Produza Five Whys, contraprovas, retrabalho, fatores contribuintes e ações P0–P3.

Não estime horas a partir de commits. Quando não houver evidência, escreva
NÃO FOI POSSÍVEL DETERMINAR.

Saída: RCA com ação verificável, owner nomeado, prazo e modo de comprovação.
Pare se faltar fonte de fato para um evento material; registre a lacuna sem inventar.
```

## Passo 11 — incorporar lições e atualizar governança

```prompt
Autorização: DOCUMENTAÇÃO no escopo <ARQUIVOS_AUTORIZADOS>.

Objetivo:
- Converter lições confirmadas em controles verificáveis e reutilizáveis.

Avalie cada lição perguntando:
1. Qual falha concreta ela evita?
2. Qual regra, template, teste, skill ou gate a torna verificável?
3. Quem é o owner?
4. Como detectar regressão?
5. Quais diagramas ou READMEs precisam de atualização?

Preserve AGENTS.md como autoridade do projeto. Não instale nem exponha skills sem auditoria.
Atualize diagramas somente quando houver mudança confirmada na fonte primária.

Saída: delta documental pequeno, justificativa, owner e mecanismo de verificação.
Não transforme opinião sem evidência em regra obrigatória.
```

---

## Prompt de manutenção dos diagramas após uma fatia

```prompt
Fatia concluída: <ID>.
Autorização: editar somente docs/diagramas-mermaid/*.mmd,
docs/DiagramaDenuncias-sobreposto.drawio e documentação diretamente relacionada.

Objetivo:
- Atualizar somente os diagramas afetados pela mudança confirmada no código.

Procedimento:
1. Compare o diff da fatia com os dez .mmd.
2. Marque cada diagrama como SEM IMPACTO ou ATUALIZAR, justificando.
3. Atualize nomes, responsabilidades, fluxos felizes, exceções, estados, fronteiras e dados.
4. Preserve o BFF como unidade implantável, salvo evidência contrária.
5. Não invente infraestrutura nem persistência não presentes no repositório.
6. Mantenha Mermaid importável no draw.io como Diagrama editável.
7. Execute node docs/diagramas-mermaid/validate-diagrams.js.
8. Apresente arquivos alterados e limitações da validação.

Pare se o código e a decisão arquitetural divergirem; registre drift e peça decisão.
```

## Checklist de encerramento de qualquer prompt

- [ ] Escopo e autorização foram declarados.
- [ ] AGENTS.md e fonte primária foram reabertos.
- [ ] Alterações locais do usuário foram preservadas.
- [ ] Evidências usam dados sintéticos e estão sanitizadas.
- [ ] Requisitos, testes, ameaças e diagramas permanecem coerentes.
- [ ] O gate recebeu resultado explícito.
- [ ] Bloqueios e decisões pendentes têm owner.
- [ ] Nenhuma ação posterior foi executada sem autorização.
