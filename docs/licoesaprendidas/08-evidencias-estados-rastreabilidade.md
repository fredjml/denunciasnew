# Evidências, estados e rastreabilidade

Lição central do N3B: implementado, executado, observado, evidenciado e publicado não são sinônimos.

## Dimensões separadas

Não use uma única coluna “status”. Registre:

| Dimensão | Valores sugeridos |
| --- | --- |
| trabalho | não iniciado, em andamento, implementado, bloqueado |
| modo | estático, unitário, integração simulada, E2E mockado, live, UI manual |
| resultado | não executado, inconclusivo, falhou, aprovado |
| evidência | ausente, capturada, sanitizada, revisada, retida |
| entrega | local, empacotada, publicada, verificada no destino |

## Estados probatórios abreviados

- PENDENTE — ainda sem execução/prova;
- FEITO OFFLINE — fixture, mock ou modo determinístico local;
- FEITO LIVE — dependência externa real exercitada no ambiente nomeado;
- FEITO UI — resultado observado na interface/tecnologia definida;
- EVIDENCIADO — prova sanitizada, preservada e ligada ao requisito;
- PUBLICADO — destino autorizado conferido;
- BLOQUEADO — owner/decisão/dependência impede avanço.

Um estado não substitui outro. No Denúncias, Playwright aprovado é FEITO UI com API mockada; não é BFF LIVE. Em development, 201 local com MPT indisponível não é aceite da API MPT.

## Matriz canônica

| ID | Fonte/local | Requisito | Artefato | Implementação | Teste/mode | Resultado | Evidência | Entrega | Owner |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |

Regras:

1. requisito crítico exige todos os campos aplicáveis;
2. exclusão cita fonte e aprovação;
3. evidência aponta para commit/versão/ambiente;
4. documento derivado não substitui fonte primária;
5. resultado histórico não prova estado atual;
6. “não foi possível determinar” é válido e preferível à invenção.

## Evidence plan antes da execução

Para cada prova, defina:

- requisito e alegação;
- ambiente/dado sintético ou real autorizado;
- comando/caso e resultado esperado;
- captura/arquivo/ID;
- campos que podem aparecer e campos proibidos;
- sanitização e revisor;
- owner, acesso e retenção;
- nome/caminho final;
- condição de content freeze;
- como validar que a prova pertence à versão.

## Shot list

Use para UI, acessibilidade, relatórios e integrações:

| ID | Tela/estado | Requisito | Viewport/AT | Mostrar | Ocultar | Nome | Revisor |
| --- | --- | --- | --- | --- | --- | --- | --- |

Capture uma vez após estabilizar o conteúdo. Não exponha denúncia, PII, protocolo real, anexo, token, URL interna, cookie, path de usuário ou identificador privado.

## Content freeze e derivados

1. feche requisitos e conteúdo;
2. execute validações estruturais;
3. gere HTML/PDF/DOCX/screenshot;
4. inspecione todas as páginas/telas;
5. sanitize e confira metadados;
6. ligue hash/versão ao requisito;
7. regenere se a fonte mudar.

Validação estrutural não é inspeção visual.

## Evidência mínima de comando

Data/hora, commit, ambiente, versões relevantes, comando exato, exit code, contagem/resumo, duração aproximada, artifact sanitizado e limitações. Guarde logs extensos fora do chat e exponha apenas recorte necessário.

## Review adversarial

O revisor recebe fonte primária, matriz, diff e evidências — não a conclusão desejada. Deve procurar:

- requisito sem prova;
- prova de versão/ambiente errado;
- mock apresentado como live;
- dados privados;
- evidência herdada;
- publicação não verificada;
- alegação mais forte que o teste.

## Limitações

Screenshot pode ser manipulada ou perder contexto; hash prova integridade, não veracidade; log aprovado pode omitir erro; teste live pontual não prova disponibilidade. Evidência aumenta confiança, não produz certeza absoluta.
