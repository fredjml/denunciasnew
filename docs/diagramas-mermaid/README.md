# Diagramas da engenharia reversa

Estes diagramas foram derivados do código em `cidadania-canal-denuncias`, sem alterar o codebase. A fonte de verdade de cada desenho é o arquivo `.mmd`, que pode ser aberto ou importado no draw.io por **Organizar > Inserir > Avançado > Mermaid**. Depois da importação, escolha **Diagrama** para manter os elementos editáveis, em vez de imagem.

## Padrão editorial e visual

- A sequência `02` → `01` → `07` aplica o zoom C4: contexto, contêineres e componentes.
- Elementos C4 apresentam nome, tecnologia ou tipo e uma responsabilidade curta.
- Relações C4 são unidirecionais, rotuladas por intenção e, quando aplicável, por protocolo.
- Azul-marinho identifica o sistema ou componente em foco; cinza identifica dependências; branco identifica pessoas ou hipóteses.
- Títulos e descrições acessíveis (`accTitle` e `accDescr`) acompanham os diagramas compatíveis.
- Diagramas comportamentais mantêm um fluxo principal evidente e deixam exceções em ramificações secundárias.
- A notação permanece simples e autocontida, com legenda nas três vistas C4.

| Arquivo | Visão | Público principal |
| --- | --- | --- |
| `01-arquitetura-geral.mmd` | C4 nível 2: contêineres e integrações | Arquitetura e desenvolvimento |
| `02-contexto.mmd` | C4 nível 1: contexto do sistema | Investidores, negócio e arquitetura |
| `03-classes.mmd` | Classes e dependências relevantes | Desenvolvimento |
| `04-atividade-envio.mmd` | Atividade ponta a ponta e exceções | Produto, QA e desenvolvimento |
| `05-sequencia-envio.mmd` | Sequência técnica da submissão | Desenvolvimento e operações |
| `06-casos-de-uso.mmd` | Casos de uso e fronteira do sistema | Investidores, produto e desenvolvimento |
| `07-componentes.mmd` | C4 nível 3: componentes do frontend e do BFF | Desenvolvimento |
| `08-estados-wizard.mmd` | Máquina de estados do formulário | Frontend e QA |
| `09-implantacao-seguranca.mmd` | Topologia e fronteiras de segurança | Infraestrutura e segurança |
| `10-fluxo-dados.mmd` | Transformação dos dados | Arquitetura, segurança e integração |

## Diagramas do `denunciasnew` — planejamento (pré-implementação)

Os 5 diagramas `denunciasnew-*.mmd` acima (contexto, C4 containers, C4 componentes, classes,
casos de uso) foram desenhados **antes** da implementação (fase de planejamento F3) — contêm
componentes especulativos («NOVO», «PART») que nunca chegaram a existir (ex.: `SttProxy`,
`ClassifierProxy`, `BotIngress`, `ComplaintApiClient`) porque o MVP standalone entregue é mais
enxuto que a proposta original do PDF. Mantidos como registro histórico da decisão de escopo,
não como referência do estado atual.

**O conjunto completo "como construído" do `denunciasnew` mudou de lugar:** está em
[`docs/diagramas-mermaid-new/`](../diagramas-mermaid-new/) — 10 diagramas nas mesmas categorias
desta pasta (arquitetura, contexto, classes, atividade, sequência, casos de uso, componentes,
estados, implantação/segurança, fluxo de dados), gerados 100% do código real e mantidos
atualizados a cada mudança estrutural. Os 3 arquivos `denunciasnew-frontend-*-asbuilt.mmd` que
existiam nesta pasta foram descontinuados e substituídos por esse conjunto mais completo em
2026-09-05.

Não fazem parte de `validate-diagrams.js` (que valida só os 10 arquivos originais numerados
desta pasta) — mesma situação da pasta `diagramas-mermaid-new/`.

## Premissas e limites

- O BFF é representado como uma única unidade implantável; suas camadas são módulos internos, não serviços independentes.
- Redis, ClamAV, proxy reverso, hospedagem do Angular e a API interna do MPT são dependências/configurações, mas o repositório não contém uma definição completa de infraestrutura como código.
- O diretório `backend/` contém apenas o exemplo Quarkus `GreetingResource` e não participa do fluxo de denúncias observado.
- Não há persistência de denúncias no codebase analisado. O BFF valida, verifica anexos, encaminha e remove os arquivos temporários.
- Por não existir banco, ORM, entidade persistente ou migração no fluxo real, um MER seria fictício e não foi incluído.
- Em desenvolvimento, indisponibilidade do ClamAV e falha de chamada à API MPT possuem tolerâncias explícitas; em produção, a configuração e os erros são tratados de modo restritivo.
