# Processo de análise e implementação de correções

Fluxo: descobrir → reproduzir → classificar → especificar → planejar evidência → testar falha → corrigir → validar → revisar adversarialmente → aceitar → entregar → aprender.

## 1. Descobrir

Registre ID, origem, fonte/versão, ambiente, data, ator, comportamento esperado e escopo. Reabra a fonte primária; não use apenas ticket ou relatório derivado.

## 2. Reproduzir

Execute o menor caso seguro com dado sintético. Preserve evidência sanitizada. Se não reproduzir, classifique como inconclusivo e proponha hipótese falsificável.

## 3. Classificar

- P0 — incidente ativo, exploração plausível ou perda crítica;
- P1 — bloqueia entrega, segurança alta ou jornada crítica;
- P2 — impacto relevante com workaround;
- P3 — melhoria/dívida.

Separe severidade, prioridade e confiança. Segurança usa confidencialidade, integridade, disponibilidade, privacidade e alcance; QA inclui usuário e regressão.

## 4. Especificar

Atualize requisito, Dado/Quando/Então, ambientes, fora de escopo e risco. Conflito material precisa de decisão. Determine se o teste deve provar offline, integração BFF, E2E UI mockado, live ou UI real.

## 5. Planejar

Defina fatia vertical, arquivos, dependências, menor teste, testes ampliados, evidence manifest, rollback/fallback, owner e autorização. Atenda à DoR.

## 6. Teste vermelho

Quando reproduzível, escreva regressão que falhe pela razão correta. Não acople ao detalhe interno nem use sucesso simulado como prova externa.

## 7. Corrigir

- menor mudança coerente;
- padrões do repositório e limites de AGENTS.md;
- contrato ponta a ponta sincronizado;
- sem refactor oportunista;
- erro real, null, timeout, retry e cleanup explícitos;
- documentação e configuração na mesma fatia quando o comportamento muda.

## 8. Validar incrementalmente

1. teste focal;
2. suíte do componente/camada;
3. lint/type/build;
4. integração e contrato;
5. E2E UI;
6. segurança/a11y/performance;
7. live/UI real somente autorizado.

Registre resultado como aprovado, falhou, inconclusivo ou não executado; isso é diferente do estado probatório.

## 9. Review adversarial

Um passe separado começa na fonte primária e tenta provar que a entrega está incompleta. Revise diff, untracked/ignored, contrato, testes, erros, abuso, PII/secrets, docs, rollback e evidência. Findings primeiro, resumo depois.

## 10. Aceitar e entregar

Preencha matriz, DoD, riscos residuais e exceções aprovadas. Confirme target/branch/remote e autorização antes de commit/push/deploy. Após publicação, verifique o destino; arquivo local não prova publicação.

## Política por classe

- QA funcional: estado anterior/posterior, mensagem, retry, duplo envio, navegação e dados preservados.
- Teste quebrado: determinar produto, teste ou ambiente; nunca relaxar assertiva sem evidência.
- Segurança: preservar evidência, reduzir exposição, analisar exploração/causa; não publicar segredo ou payload ofensivo.
- Dependência: caminho direto/transitivo, lockfile correto, breaking change, prod/dev e rollback.
- Acessibilidade: HTML semântico, teclado, foco, zoom/reflow, leitor de tela e axe.
- Upload: limites, conteúdo real, nome, temporário, scanner, cleanup, concorrência e indisponibilidade.

## Checkpoints e Git

Cada checkpoint corresponde a requisito/critério, inclui teste e tem diff revisável. Não crie commit sem pedido/autorização. Commit grande reduz isolabilidade; commit pequeno sem coesão também.

## Parada

Interrompa quando faltar autorização, dado real puder ser afetado, requisito crítico conflitar, próxima ação expandir escopo ou duas tentativas repetirem erro sem nova hipótese. Use 10-escalonamento.md.

## Limitações

Nem todo defeito permite teste vermelho determinístico. Correção emergencial pode comprimir fases, mas não elimina rastreabilidade, segurança, validação ou post-mortem.
