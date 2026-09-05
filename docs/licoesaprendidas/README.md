# Lições aprendidas e kit operacional — Denúncias

Este kit consolida os controles de docs/licoesaprendidasN1B, os aprendizados forenses de docs/licoesaprendidasN3B e a stack real observada no Canal de Denúncias. Ele orienta descoberta, engenharia reversa, implementação, QA, testes, segurança, evidência, entrega e post-mortem.

Não é uma certificação. Não instala ferramentas, não altera runtime, não autoriza produção e não transforma resultados históricos em evidência atual.

## Princípios não negociáveis

1. Fonte primária vence resumo/documento derivado.
2. Fato, inferência, hipótese, decisão e resultado ficam separados.
3. Requisito liga-se a artefato, implementação, teste, evidência e estado.
4. Mock/offline, integração, live, UI, evidenciado e publicado não são equivalentes.
5. Review recomeça na fonte primária e tenta refutar prontidão.
6. Segredos, denúncias, PII e anexos não entram em logs, prompts ou artifacts.
7. Autorização é específica e just-in-time; plano aprovado não autoriza push/deploy/live.
8. Mudanças pequenas recebem a menor validação imediata.
9. Contexto importante é versionado e curto; números não são inventados.
10. Lições viram controles verificáveis, não conselhos genéricos.

## Fluxo completo

DISCOVER → ANALYZE → READINESS CHECK → PLAN → IMPLEMENT → TEST → REVIEW → SECURITY/QA → ACCEPTANCE → DELIVER → LESSONS LEARNED

Use o kit em três momentos: antes do trabalho (passos 0–4), durante (5–8) e depois (9–11).

## Passo a passo

### Passo 0 — Entender origem e estado

Leia [mapa, baseline e drift](00-mapa-origens-baseline-drift.md), AGENTS.md do projeto e a fonte primária. O mapa mostra o que veio de N1B/N3B, o que foi descartado e os conflitos atuais — inclusive protocolo gerado no BFF, diferenças development/production, CI e E2E mockado.

Saída: fontes com precedência, commit/data e conflitos visíveis.  
Limite: snapshot datado não prova runtime.

### Passo 1 — Fazer análise inicial e pre-flight

Use [análise inicial](01-analise-inicial.md), [ferramentas](03-ferramentas.md) e [pre-flight](07-preflight.md). Preencha [ANALYSIS](templates/analysis.md), [TOOLS](templates/tools.md), [MCP](templates/mcp.md) e, em trabalho longo, [PROJECT_CONTEXT](templates/project-context.md).

Opcionalmente:

~~~powershell
powershell -NoProfile -File docs/licoesaprendidas/scripts/preflight-denuncias.ps1
~~~

Revise o JSON e decida GO, GO COM RISCOS ou NO-GO. Não instale tudo: escolha ferramentas por requisito, risco, licença, telemetria, permissão e fallback.

Saída: baseline, tools/MCP/owners e decisão de prontidão.  
Limite: o script não testa serviços, autenticação, requisitos ou produção.

### Passo 2 — Fazer engenharia reversa

Use [engenharia reversa](02-engenharia-reversa-requisitos.md) e [contrato compartilhado](contrato/README.md). Preencha [REQUIREMENTS](templates/requisitos.md) e [rastreabilidade](templates/rastreabilidade.md). Cite fonte/local, classifique confiança, escreva Dado/Quando/Então e registre exclusões.

Conflito material — por exemplo, ownership do protocolo — deve receber owner e decisão, não uma suposição.

Saída: Gate 1, requisitos funcionais/não funcionais, lacunas e aceite.  
Limite: comportamento observado não é automaticamente intenção aprovada.

### Passo 3 — Modelar arquitetura, segurança e evidência

Leia os guias [backend](backend/README.md), [segurança backend](backend/seguranca.md), [frontend](frontend/README.md), [acessibilidade](frontend/acessibilidade.md) e [evidências](08-evidencias-estados-rastreabilidade.md). Preencha [threat model](templates/threat-model.md) e [evidence manifest](templates/evidence-manifest.md).

Defina dados, trust boundaries, abuso, uploads, logs, ambiente, redaction, retenção, shot list e estados probatórios antes do live.

Saída: Gate 2, threat model, contrato e evidence plan.  
Limite: checklist não substitui DPO/jurídico, pentest ou capacidade de infraestrutura.

### Passo 4 — Planejar a correção

Use [processo de correções](05-processo-correcoes.md), [Gates/DoR/DoD](06-gates-qa-testes-seguranca.md) e [IMPLEMENTATION](templates/implementation.md). Divida por requisito/fatia vertical, com teste focal, gates ampliados, rollback/fallback e owner.

Saída: plano incremental pronto, sem ação remota implícita.  
Limite: plano envelhece; atualize quando evidência ou requisito mudar.

### Passo 5 — Implementar

Trabalhe em uma fatia; preserve mudanças locais; sincronize modelo → FormData → validação → payload MPT → Swagger → testes; execute a menor validação. Registre decisões materiais em [DECISIONS](templates/decisions.md) e mantenha PROJECT_CONTEXT curto.

Se duas tentativas repetirem o erro sem nova hipótese ou três diagnósticos distintos não avançarem, use [escalonamento](10-escalonamento.md).

Saída: mudança pequena, reversível e testada.  
Limite: correção autorizada não autoriza refactor, instalação, live ou Git remoto.

### Passo 6 — Testar por modo

Use [testes backend](backend/testes.md), [testes frontend](frontend/testes.md), [gates](06-gates-qa-testes-seguranca.md) e [TESTING](templates/testing.md). Registre comando, commit, ambiente, exit code/contagem, resultado, artifact e limitação.

O Playwright atual inicia Angular e intercepta a API: é E2E UI mockado. BFF/Redis/ClamAV/MPT exigem testes separados; live apenas em ambiente autorizado.

Saída: resultado aprovado/falhou/inconclusivo/não executado por requisito e modo.  
Limite: cobertura, axe, npm audit e SAST são sinais parciais.

### Passo 7 — Capturar evidência

Use [estados/evidências](08-evidencias-estados-rastreabilidade.md) e o evidence manifest. Após content freeze, capture, sanitize, inspecione e ligue a versão. Não use screenshot para provar contrato nem arquivo local para provar publicação.

Saída: prova sanitizada, revisada, com owner/acesso/retenção.  
Limite: evidência aumenta confiança; não garante veracidade absoluta.

### Passo 8 — Review adversarial e aceite

Preencha [REVIEW](templates/review.md). Reabra a fonte primária, revise matriz, diff, untracked/ignored, contrato, testes, segurança, privacidade, acessibilidade, docs e artifacts. Tente encontrar requisito sem prova ou alegação mais forte que o teste.

Saída: findings por severidade e decisão ENTREGAR, CORRIGIR ou BLOQUEAR.  
Limite: review pela mesma análise pode manter viés; prefira passe independente para risco alto.

### Passo 9 — Entregar/publicar

Confirme DoD, target, branch/remote, rollback e autorização. Informe o que/onde, testes, estados, limitações e riscos. Após mutação remota autorizada, verifique o destino.

Saída: entrega rastreável e aceite humano.  
Limite: o kit não concede autorização para commit, push, PR, merge ou deploy.

### Passo 10 — Fazer post-mortem

Use [RCA/post-mortem](11-postmortem-rca.md), [métricas/plano](14-metricas-plano-acao.md), [matrizes](templates/matrizes-operacionais.md) e [LESSONS LEARNED](templates/lessons-learned.md). Reconstrua timeline, feedback A–E, Five Whys, contraprova, retrabalho, tools/MCP/rules/skills e cenário “começar amanhã”.

Saída: causas sistêmicas, ações corretivas/preventivas P0–P3 e owners.  
Limite: commits não medem horas; sem telemetria use NÃO FOI POSSÍVEL DETERMINAR.

### Passo 11 — Reutilizar e evoluir IA/governança

Leia [reutilização](13-reutilizacao.md), [governança documental](12-governanca-documental.md), [IA/rules/skills/tools/MCP/agents](04-ia-rules-skills-tools-mcp-agents.md) e [contexto/tokens](09-contexto-tokens-telemetria.md). Zere estados, remova resíduos e reconstrua fatos.

Use [rules](templates/rules.md) e [agents](templates/agents.md) apenas como propostas; AGENTS.md continua sendo autoridade. A [skill](skill/denuncias-quality-review/SKILL.md) está versionada no kit, mas não instalada automaticamente.

Saída: controle reutilizável, auditado e proporcional.  
Limite: skill/MCP configurado não prova descoberta, autenticação, saúde ou autorização.

## Catálogo dos artefatos

| Grupo | Artefatos |
| --- | --- |
| origem/análise | [00](00-mapa-origens-baseline-drift.md), [01](01-analise-inicial.md), [02](02-engenharia-reversa-requisitos.md), [07](07-preflight.md), [15](15-baseline-analises-denuncias.md) |
| pós-implementação `denunciasnew` | [16 — post-mortem CP-0..CP-5](16-postmortem-denunciasnew-cp0-cp5.md) |
| ferramentas/IA | [03](03-ferramentas.md), [04](04-ia-rules-skills-tools-mcp-agents.md), [09](09-contexto-tokens-telemetria.md), [10](10-escalonamento.md) |
| execução/qualidade | [05](05-processo-correcoes.md), [06](06-gates-qa-testes-seguranca.md), [08](08-evidencias-estados-rastreabilidade.md) |
| pós-entrega | [11](11-postmortem-rca.md), [12](12-governanca-documental.md), [13](13-reutilizacao.md), [14](14-metricas-plano-acao.md) |
| stack | [backend](backend/README.md), [backend security](backend/seguranca.md), [backend tests](backend/testes.md), [frontend](frontend/README.md), [a11y](frontend/acessibilidade.md), [frontend tests](frontend/testes.md), [contrato](contrato/README.md) |
| templates | [requisitos](templates/requisitos.md), [rastreabilidade](templates/rastreabilidade.md), [analysis](templates/analysis.md), [contexto](templates/project-context.md), [implementation](templates/implementation.md), [testing](templates/testing.md), [review](templates/review.md), [threat model](templates/threat-model.md), [tools](templates/tools.md), [MCP](templates/mcp.md), [evidência](templates/evidence-manifest.md), [decisões](templates/decisions.md), [rules](templates/rules.md), [agents](templates/agents.md), [checklist](templates/checklist-ciclo.md), [matrizes](templates/matrizes-operacionais.md), [post-mortem](templates/lessons-learned.md) |
| automação | [script de pre-flight](scripts/README.md), [skill](skill/denuncias-quality-review/SKILL.md) |
| referência | [fontes e precedência](fontes.md), [baseline factual das Analises](15-baseline-analises-denuncias.md) |

## Limitações gerais

- Manifests/código/documentos mudam; associe análises a commit e data.
- N1B/N3B são fontes metodológicas, não evidência do Denúncias.
- O kit registra achados de drift, mas não os corrige.
- Testes não autorizam uso de dados reais, produção, carga ou DAST.
- Automação de acessibilidade não prova WCAG; revisão legal não é feita por este kit.
- npm audit/SAST/DAST/antivírus têm falsos positivos e negativos.
- Tool/MCP/agent aumenta capacidade e superfície de risco; menor privilégio e fallback continuam necessários.
- A skill em docs precisa ser explicitamente referenciada ou instalada em local autorizado.
- Telemetria do OpenAI API, assinatura e Codex são fontes distintas; não estime custo sem fonte oficial.
