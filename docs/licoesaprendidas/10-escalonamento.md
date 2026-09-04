# Protocolo de escalonamento

## Fluxo

1. registrar erro, contexto e hipótese;
2. executar o menor diagnóstico local, read-only e não destrutivo;
3. verificar ferramenta/fallback já disponível e autorizado;
4. se instalação/configuração for necessária, verificar autorização;
5. identificar requisito, owner, credencial, dado, custo ou sistema externo;
6. escolher uma alternativa segura;
7. pedir ação/decisão objetiva quando a dependência for humana.

## Regra de parada

- após duas falhas iguais sem nova hipótese, não repetir o comando;
- após três diagnósticos distintos sem progresso material, escalar;
- parar imediatamente diante de segredo, dado real, produção, ação irreversível, escopo materialmente novo ou autorização ausente.

## Classificação

| Tipo | Exemplo | Ação |
| --- | --- | --- |
| requisito | aceite/escopo ambíguo | opções, impacto e decisão |
| autorização | push, deploy, DAST, custo | consentimento específico |
| credencial | OAuth, MFA, token | owner configura; nunca pedir valor no chat |
| ferramenta | CLI/browser/runtime | fallback ou instalação aprovada |
| ambiente | proxy, rede, versão, permissão | diagnóstico e erro exato |
| externo | API MPT, Redis, ClamAV | owner, health e ambiente |
| evidência | histórico/telemetria ausente | não foi possível determinar |
| escopo | refactor/produção não pedido | parar e pedir nova autoridade |

## Solicitação ao usuário

~~~text
Bloqueio:
Evidência:
Impacto:
Já validado:
Hipótese atual:
Opção segura A:
Opção segura B:
Ação recomendada:
Risco/custo/dados:
Autorização necessária:
Critério para continuar:
~~~

## Quando resolvido

Registre autorização e limites, ação, resultado, evidência, o que não foi autorizado e próximo passo. Autorização de uma ação não se estende a outra fase.

## Exemplo do Denúncias

“ClamAV de homologação indisponível” não autoriza usar o fail-open de development como prova production. Opções: bloquear teste live, usar double e marcar FEITO OFFLINE, ou obter ambiente/owner autorizado.

## Limitações

O limite de tentativas é heurístico: incidente crítico pode exigir parada imediata; investigação segura com nova evidência pode continuar. Escalonamento não transfere responsabilidade nem deve coletar segredo.
