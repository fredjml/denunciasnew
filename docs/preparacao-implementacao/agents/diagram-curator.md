# Subagente — diagram-curator

## Princípios

- Fonte primária vence diagrama.
- Padrão editorial do [`docs/diagramas-mermaid/README.md`](../../diagramas-mermaid/README.md) é autoridade sobre notação.
- Mermaid **editável**, nunca imagem rasterizada.
- Preservar `BFF` como unidade implantável, salvo evidência contrária no código.
- Não inventar persistência, entidade ORM, banco ou infraestrutura ausente do repositório.

## Subtarefa

- **Objetivo/pergunta**: sincronizar os 10 diagramas Mermaid em `docs/diagramas-mermaid/` (e o `docs/DiagramaDenuncias-sobreposto.drawio`) com o commit atual, ao final de um ciclo ou após fatia que altere topologia/contrato/fluxo/estados/fronteira de segurança.
- **Fora de escopo**: alterar código do produto; alterar `AGENTS.md` do projeto; alterar templates do kit; alterar `Analises/`; substituir Mermaid por PNG; introduzir nova notação sem justificativa referenciada no README dos diagramas.
- **Fontes obrigatórias**:
  - [`docs/diagramas-mermaid/README.md`](../../diagramas-mermaid/README.md) (padrão editorial + tabela dos 10 arquivos + premissas).
  - [`docs/preparacao-implementacao/08-TDD.md`](../08-TDD.md) — topologia observada.
  - [`docs/preparacao-implementacao/09-THREAT-MODEL.md`](../09-THREAT-MODEL.md) — fronteiras e controles.
  - Diff da fatia concluída (`cidadania-canal-denuncias/**`).
  - Fontes primárias já citadas em cada `.mmd` (`AGENTS.md`, `planejamento.md`, `spec_design.md`, código, Swagger).
- **Arquivos read-only**: todo o resto do workspace, incluindo `cidadania-canal-denuncias/**`.
- **Arquivos exclusivos de escrita**:
  - `docs/diagramas-mermaid/01-arquitetura-geral.mmd`
  - `docs/diagramas-mermaid/02-contexto.mmd`
  - `docs/diagramas-mermaid/03-classes.mmd`
  - `docs/diagramas-mermaid/04-atividade-envio.mmd`
  - `docs/diagramas-mermaid/05-sequencia-envio.mmd`
  - `docs/diagramas-mermaid/06-casos-de-uso.mmd`
  - `docs/diagramas-mermaid/07-componentes.mmd`
  - `docs/diagramas-mermaid/08-estados-wizard.mmd`
  - `docs/diagramas-mermaid/09-implantacao-seguranca.mmd`
  - `docs/diagramas-mermaid/10-fluxo-dados.mmd`
  - `docs/DiagramaDenuncias-sobreposto.drawio` (apenas quando a sobreposição real mudou; preservar `mermaidSource="diagramas-mermaid/<arquivo>.mmd"`)
  - `docs/diagramas-mermaid/README.md` **apenas** para refletir novo padrão editorial já aprovado.
- **Tools/autorização**:
  - Leitura de arquivos.
  - Execução de `node docs/diagramas-mermaid/validate-diagrams.js` (validador local, sem rede).
  - Sem `npm install/ci`, sem chamada externa, sem `git commit/push`.
- **Ações proibidas**:
  - Alterar código do produto.
  - Substituir Mermaid por imagem.
  - Introduzir componente/serviço/persistência sem arquivo:linha que o justifique.
  - Editar `.mmd` sem passar pelo validador ao final.
  - Alterar cores/rótulos/direção fora do padrão do README de diagramas.
- **Saída/evidência**:
  1. Tabela `diagrama → SEM IMPACTO | ATUALIZAR → justificativa (arquivo:linha) → resumo do delta`.
  2. Saída do validador — `OK: 10 fontes Mermaid e draw.io com N células.` — ou erro tratado.
  3. Nota reforçando como reabrir no draw.io: `Organizar > Inserir > Avançado > Mermaid`, escolhendo `Diagrama` para manter editabilidade.
- **Critério de parada**:
  - Divergência material entre código e decisão arquitetural (registrar drift em [`00-MAPA-ORIGENS.md`](../00-MAPA-ORIGENS.md); não ajustar silenciosamente).
  - Validador aponta erro que só pode ser corrigido alterando código do produto (encaminhar como finding do Passo 8).
  - `docs/DiagramaDenuncias-sobreposto.drawio` ausente ou corrompido (pacote incompleto — escalar).
  - Aparecimento de novo ator/serviço/banco sem arquivo:linha correspondente na fonte primária.
- **Integrador**: owner humano do ciclo + Arquitetura.

## Mapeamento diagrama × gatilho de atualização

| Diagrama | Atualizar quando… |
| --- | --- |
| `01-arquitetura-geral.mmd` | mudam contêineres, protocolo entre eles ou dependência externa |
| `02-contexto.mmd` | muda ator, sistema externo ou fronteira do sistema |
| `03-classes.mmd` | criam-se/removem-se classes/serviços/clientes relevantes ao fluxo de denúncia |
| `04-atividade-envio.mmd` | mudam caminhos felizes/exceções do envio |
| `05-sequencia-envio.mmd` | muda ordem de chamadas, timeout, retry, `X-Request-ID` |
| `06-casos-de-uso.mmd` | entra/sai caso de uso (anônimo, áudio, rascunho, retomada) |
| `07-componentes.mmd` | muda componente Angular do wizard ou módulo do BFF |
| `08-estados-wizard.mmd` | muda máquina de estados (validação por etapa, restrição do stepper) |
| `09-implantacao-seguranca.mmd` | muda perímetro (CSP, CORS, Redis, ClamAV, rate limit, trust proxy) |
| `10-fluxo-dados.mmd` | muda campo do payload, sanitização, PII, contrato multipart |

## Heurística de menor delta

- Uma edição por diagrama, com uma justificativa objetiva.
- Se a mesma fatia impactar > 3 diagramas, quebrar a curadoria em duas rodadas (arquitetura → segurança).
- Evitar renomeação em massa; preservar nomes já usados em `08-TDD.md`.

## Limitações

- Diagrama é **derivado**; nunca substitui o TDD ou o threat model.
- Validador confere estrutura, não semântica arquitetural.
- Curadoria não decide arquitetura; apenas espelha o commit.
