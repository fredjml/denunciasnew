# 02 — Portal institucional (Home) — proposta, não implementada

- **Status:** rascunho — owner confirmou que quer adicionar (via `AskUserQuestion`,
  2026-09-05), mas várias peças de conteúdo/destino ainda não têm fonte definida. Não
  implementar até a seção 4 (perguntas) ser respondida.
- **Referência oficial:** `docs/Prototipacao/Versaomobile.png` — página 4 do PDF
  (`Documento externo-outros 010970.2026.pdf`), slide "Versão Mobile". **Atenção:** essa imagem
  no PDF ilustra o *site institucional atual do MPT como um todo* (contexto/motivação para o
  redesign), não uma tela do fluxo do Canal de Denúncias — é a primeira vez que uma tela desse
  slide específico vira candidata a fazer parte deste app.
- **Campos/elementos usados:** ver tabela na seção 2 — a maioria referencia sistemas do MPT que
  não existem no `contract/openapi.yaml` nem no `backend-mock`. **Gap de contrato generalizado**
  (`R-DVX-02`): esta tela inteira depende de decisões de conteúdo que não são deste repositório.
- **Navegação:** proposta — vira uma nova tela **antes** do Acolhimento (a primeira coisa que o
  usuário vê ao abrir o app), com o botão "DENUNCIE" levando ao Acolhimento atual. Ver
  `../diagramas-navegacao/02-fluxo-com-portal-home.mmd`. Isso muda o comportamento do app de "é
  só o formulário de denúncia" para "é o portal do MPT, com denúncia como uma das opções" — é
  uma mudança de posicionamento de produto, não só uma tela nova.

## Descrição do layout (conforme a imagem de referência)

De cima para baixo:

1. Header: menu hambúrguer (esquerda), logo MPT central, ícones "Mais" + grade (direita) — layout
   diferente do header atual do app (que tem logo à esquerda + badge de sorriso à direita); essa
   tela usa o padrão do site institucional, não o padrão que já criamos para o wizard.
2. Banner/carrossel de notícia: imagem de fundo + manchete + botão "Saiba mais" + dots de
   paginação.
3. Seção "Acesso Rápido": grade 3x2 de blocos (ícone + rótulo em 1-2 linhas):
   Petição eletrônica e protocolo · Consulta de Processos · Carta de Serviços ·
   Audiências Públicas · Transparência · Ouvidoria.
4. Botão flutuante do WhatsApp (canto inferior direito, sobre o conteúdo).
5. Botão fixo "DENUNCIE" (laranja, cantos bem arredondados/pill) grudado na base da tela.

## 2. O que cada elemento precisaria para funcionar de verdade

| Elemento | Seria... | Existe no nosso sistema? |
| --- | --- | --- |
| "DENUNCIE" | Link interno → Acolhimento (já existe) | **Sim** — único elemento 100% implementável hoje |
| "Ouvidoria" (tile do grid) | Mesmo destino do "Fale com a Ouvidoria" do Acolhimento | **Sim**, reaproveitando `URL_OUVIDORIA` já implementada |
| "Petição eletrônica e protocolo" | Sistema real de peticionamento do MPT | **Não** — fora do contrato, fora do backend-mock, sistema totalmente diferente |
| "Consulta de Processos" | Sistema real de consulta processual do MPT | **Não** |
| "Carta de Serviços" | Página/documento institucional | **Não** — nem sabemos se existe uma URL pública oficial |
| "Audiências Públicas" | Sistema/agenda real do MPT | **Não** |
| "Transparência" | Portal da transparência do MPT | **Não** — provavelmente existe uma URL pública real (padrão de outros órgãos), mas não confirmada |
| Banner de notícia | Precisaria de uma fonte de conteúdo (CMS, feed, ou notícia fixa) | **Não** — não há CMS de notícias neste projeto |
| Botão flutuante WhatsApp | Precisa de um número real de atendimento | **Não** — não temos esse número documentado em nenhuma fonte deste projeto |

## 3. Trade-offs considerados

Não houve rodada de Fase 3 (rascunho de variações) ainda — a pergunta prévia (seção 4) precisa
ser respondida primeiro, porque a resposta muda o layout: se os 4 itens sem destino real forem
links externos para mpt.mp.br, é uma tela; se forem removidos/999 substituídos por "em breve", é
outra; se a tela inteira for adiada, não há tela nenhuma ainda.

## 4. Perguntas para o owner antes de implementar (`R-REQ-01`)

1. Os 4 tiles sem destino confirmado (Petição eletrônica, Consulta de Processos, Carta de
   Serviços, Audiências Públicas) devem virar **links externos** para as páginas reais do
   `mpt.mp.br` (abrindo em nova aba, mesmo padrão já usado para a Ouvidoria), ou ficam **fora
   desta primeira versão** da tela (só os 2 tiles que já temos: Denunciar/Ouvidoria)?
2. "Transparência" tem uma URL institucional oficial que devemos usar, ou também fica de fora
   por enquanto?
3. O banner de notícia é necessário nesta versão, ou pode ficar de fora até haver uma fonte de
   conteúdo real (CMS/feed)? Um banner com notícia inventada não é aceitável (`R-DN-05` não se
   aplica a texto institucional, mas o princípio de não inventar dado é o mesmo).
4. O botão flutuante do WhatsApp tem um número de atendimento real para linkar, ou também fica
   de fora?
5. Essa tela vira a **nova primeira tela do app** (antes do Acolhimento) ou fica em outro lugar
   da navegação (ex.: atrás de um menu, não na entrada)? Isso muda o posicionamento do produto —
   hoje o app *é* o formulário de denúncia; com essa tela na entrada, o app *vira* o portal do
   MPT com a denúncia como uma opção dentro dele.

## Aprovação

- **Owner:** — (pendente das perguntas acima)
- **Data:** —
- **Registro:** nenhum `AUTORIZACAO-*.md` ainda — a confirmação de "quero adicionar" já foi
  dada (`AskUserQuestion`, 2026-09-05), mas o escopo exato depende das respostas da seção 4.
