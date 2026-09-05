# Diagramas do `denunciasnew` — as-built completo (2026-09-05)

> Todos os diagramas desta pasta são gerados **do código real** deste repositório
> (`frontend/`, `backend-mock/`), no estado do commit mais recente na data indicada em cada
> arquivo — não do PDF de requisitos nem do plano de F3. Nenhum componente especulativo
> («NOVO», «PART», features fora do MVP) aparece aqui. Sempre que o código mudar de forma
> estrutural (nova tela, novo serviço, mudança de navegação, endpoint novo), **estes arquivos
> devem ser regenerados** — um diagrama as-built desatualizado é pior que nenhum diagrama,
> porque engana quem confia nele.

## Por que uma pasta nova, separada de `docs/diagramas-mermaid/`

A pasta `docs/diagramas-mermaid/` mistura duas coisas diferentes:

1. Os 10 arquivos numerados (`01-arquitetura-geral.mmd` … `10-fluxo-dados.mmd`) — engenharia
   reversa de **outro** codebase (`cidadania-canal-denuncias`, o "produto principal"), não
   deste MVP.
2. Os 5 arquivos `denunciasnew-*.mmd` (sem sufixo `-asbuilt`) — diagramas de **planejamento**
   deste projeto, desenhados *antes* da implementação (fase F3), com componentes que nunca
   chegaram a existir (`SttProxy`, `BotIngress`, `ComplaintApiClient`).

Nenhuma das duas coisas é "como o `denunciasnew` está hoje". Esta pasta nova existe para isso:
um conjunto completo, nas mesmas 10 categorias/convenções editoriais da pasta original (ver
seção "Convenções herdadas" abaixo), mas 100% fiel ao código real.

## Convenções herdadas de `docs/diagramas-mermaid/`

Aprendidas lendo todos os arquivos daquela pasta antes de começar esta:

- Zoom C4 na sequência contexto → contêineres → componentes (`02` → `01` → `07`).
- Elementos C4 trazem nome, tecnologia/tipo e responsabilidade curta numa linha.
- Relações são unidirecionais, rotuladas por intenção e, quando aplicável, por protocolo.
- `accTitle`/`accDescr` em todo diagrama que o Mermaid aceitar (acessibilidade do próprio
  artefato de documentação).
- Cor por papel, não por gosto: tom principal para o sistema em foco, neutro para dependências,
  branco para pessoas/atores externos — mantive a mesma lógica, com uma paleta própria (ver
  legenda em cada arquivo) para não confundir com os diagramas da pasta antiga se abertos lado a
  lado.
- Diagramas de comportamento mostram o caminho feliz em destaque e desvios/exceções em ramos
  secundários, nunca escondidos.
- Nenhuma infraestrutura fictícia: mesma premissa da pasta antiga — este projeto não tem BFF
  real, banco de dados, ORM ou fila; o `backend-mock` é um Express de teste, não produção.

## Índice

| Arquivo | Visão | Público principal |
| --- | --- | --- |
| `01-arquitetura-geral.mmd` | C4 nível 2: contêineres reais (SPA Angular, backend-mock, browser storage, links externos) | Arquitetura e desenvolvimento |
| `02-contexto.mmd` | C4 nível 1: cidadão, agente público, backend-mock, sistemas externos do MPT | Produto e arquitetura |
| `03-classes.mmd` | Serviços de estado Angular e seus contratos (signals, interfaces reais) | Desenvolvimento frontend |
| `04-atividade-envio.mmd` | Atividade ponta a ponta do wizard, incluindo os desvios reais (erro de upload, falha de rede, revisão) | Produto, QA e desenvolvimento |
| `05-sequencia-envio.mmd` | Sequência técnica real do envio (multer → attachment-validation → classifier-mock → alert-dispatcher-mock → protocolo) | Desenvolvimento e segurança |
| `06-casos-de-uso.mmd` | Casos de uso reais (o que o MVP realmente faz, não o que o PDF propôs) | Produto e desenvolvimento |
| `07-componentes.mmd` | C4 nível 3: componentes Angular + módulos do backend-mock | Desenvolvimento |
| `08-estados-wizard.mmd` | Máquina de estados real do wizard (9 estados, incluindo o Portal) | Frontend e QA |
| `09-implantacao-seguranca.mmd` | Topologia real de execução + fronteiras de segurança (CORS, rate limit, validação de anexo, PWA) | Infraestrutura e segurança |
| `10-fluxo-dados.mmd` | Transformação real dos dados, do formulário ao protocolo | Arquitetura e segurança |

## Limites e premissas (herdados + específicos deste MVP)

- `backend-mock` é um Express de teste com fixtures sintéticas — não é o backend de produção;
  o backend real será construído por outra equipe usando `contract/openapi.yaml` como interface.
- Não há banco de dados, ORM ou persistência de denúncia neste repositório — o `backend-mock`
  valida e responde, sem gravar nada.
- O classificador e o STT são mocks determinísticos (`DEC-DN-P-F5-6`), não modelos reais.
- Redis/ClamAV real, proxy reverso e hospedagem de produção não existem no código — o rate
  limit do dispatcher é em memória de processo único, e o "antivírus" é uma checagem de
  assinatura EICAR, ambos documentados como tal nos diagramas correspondentes.
