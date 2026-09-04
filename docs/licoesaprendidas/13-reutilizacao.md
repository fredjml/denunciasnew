# Reutilização segura

Regra: copie estrutura e controles; reconstrua fatos e evidências.

## Pode reutilizar

- fluxo, gates, checklists e critérios de parada;
- templates vazios;
- classificação de evidência;
- estados probatórios;
- regras de segurança, rastreabilidade e autorização;
- estratégia de contexto, evidence plan e review adversarial;
- skill após revisar sua aplicabilidade.

## Não pode herdar

- nomes, requisitos, métricas, datas e conclusões do projeto anterior;
- commits, branches, remotes, IDs, traces, URLs privadas ou paths locais;
- ferramentas marcadas disponíveis/autenticadas;
- resultados de teste, aceite, risco ou estado FEITO;
- secrets, .env, cookies, tokens, anexos ou PII;
- fatos do Calmaria/N1B/N3B ou artifacts MCP da POC Hermex.

## Procedimento

1. selecione apenas artefatos aplicáveis;
2. copie e marque MODELO NÃO VALIDADO;
3. substitua nome/objetivo/fonte;
4. zere estados para PENDENTE;
5. procure resíduos históricos;
6. reconstrua requisitos/riscos/owners;
7. execute pre-flight e health checks;
8. refaça testes/evidências;
9. faça review de links, secrets e consistência;
10. remova a marca somente após gates.

Busca inicial, adaptando termos:

~~~powershell
rg -n 'Calmaria|N1B|N3B|2026-|origin/main|trace|commit|USD|FEITO|Hermex' docs
~~~

Uma ocorrência pode ser citação metodológica legítima; classifique, não apague cegamente.

## Critério de prontidão

- [ ] sem fatos/identificadores herdados indevidamente;
- [ ] requisitos e riscos da nova fonte;
- [ ] owners, ambientes e autorizações atuais;
- [ ] instrução, hipótese, evidência e resultado separados;
- [ ] nenhum concluído sem execução;
- [ ] links, segurança e skill validados.

## Limitações

Template reduz trabalho mecânico, mas pode importar suposições invisíveis. Reset textual não garante neutralização sem revisão semântica.

