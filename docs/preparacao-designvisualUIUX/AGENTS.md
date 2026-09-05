# AGENTS.md — preparacao-designvisualUIUX

> Governança **local** desta subpasta. Não substitui o [`AGENTS.md`](../../AGENTS.md) raiz do
> workspace — todas as suas regras (persona, `R-*`, `R-DN-*`, comandos permitidos/proibidos)
> continuam valendo integralmente. Este arquivo só acrescenta o que é específico da fase de
> preparação visual/UI/UX.

## 1. Escopo desta fase

Esta pasta cobre o trabalho que acontece **antes** de qualquer implementação de tela: pesquisa
de referência visual, desenho de fluxo de navegação, wireframe/modelo de tela, e aprovação do
owner. Ela produz **artefatos de decisão** (diagramas, modelos, catálogos), não código.

**Não está no escopo desta fase:** implementação de CSS/HTML/TS, testes automatizados, revisão
de segurança — esses ficam em `docs/preparacao-implementacao/` e `docs/preparacao-review/`.

## 2. Fonte de verdade visual

Em ordem de precedência (a mesma do `AGENTS.md` raiz, §3, aplicada a decisões visuais):

1. `docs/Prototipacao/Documento externo-outros 010970.2026.pdf` — mockup oficial do MPT.
2. `docs/Prototipacao/*.png` — telas de referência em alta resolução.
3. Modelo de tela aprovado nesta pasta (`modelos-telas/`) — quando cobre um caso não
   detalhado no PDF/PNG oficiais (ex.: um estado de erro, um formulário que o PDF não mostra).
4. `contract/openapi.yaml` — nenhum modelo de tela pode assumir um campo que não existe aqui
   sem uma decisão `DEC-DN-*` associada (ver §4).

Um catálogo de ferramentas de referência de mercado (Google PAIR, Mobbin, etc., listadas em
`01-CATALOGO-FERRAMENTAS-IA-UX.md`) serve para **inspiração de padrão de interação** (como
outros produtos resolvem um problema parecido), nunca como fonte de verdade sobre o que este
produto deve mostrar — isso só vem do PDF/PNG oficiais do MPT ou de uma decisão do owner.

## 3. Regra P0 desta fase

- **`R-DVX-01`** — nenhuma tela nova ou mudança estrutural de tela existente é implementada sem
  um modelo de tela (`modelos-telas/`) e, se a navegação mudar, um diagrama
  (`diagramas-navegacao/`) revisados nesta pasta primeiro. Correções pontuais (cor, ícone,
  espaçamento de um elemento já existente) estão isentas.
- **`R-DVX-02`** — todo modelo de tela que introduz um campo/dado não presente em
  `contract/openapi.yaml` é marcado explicitamente como "gap de contrato" no próprio arquivo do
  modelo, com o mesmo padrão já usado para "Nomes e Dados" e "CNPJ da Empresa" — nunca
  silenciosamente assumido como implementável.
- **`R-DVX-03`** — nenhuma ferramenta externa de geração de UI por IA (Lovable, Banani, Figma
  Make, Uizard, etc.) tem acesso a dado real de denunciante, mock ou não — só a fixtures
  sintéticas (`R-DN-05`) ou a nenhum dado (geração a partir de descrição textual/mockup).
- **`R-DVX-04`** — a saída de qualquer ferramenta de geração de UI por IA é tratada como
  **rascunho**, nunca como aprovação — precisa passar pela mesma checagem WCAG 2.1 AA
  (`R-DN-07`-equivalente) e pelo owner antes de virar modelo de tela aprovado.

## 4. Autoridade final

Igual ao `AGENTS.md` raiz §8: o owner humano decide. Um modelo de tela gerado por IA, por mais
convincente visualmente, não substitui a aprovação do owner nem a citação do PDF/PNG oficial —
ver `R-SRC-01`.

## 5. Referência cruzada rápida

| Preciso de... | Vá para |
| --- | --- |
| Catálogo de ferramentas de design de IA/UX avaliadas | [01-CATALOGO-FERRAMENTAS-IA-UX.md](01-CATALOGO-FERRAMENTAS-IA-UX.md) |
| O workflow (fases + skills/tools/agentes) | [02-WORKFLOW-SKILLS-TOOLS-AGENTES.md](02-WORKFLOW-SKILLS-TOOLS-AGENTES.md) |
| Diagramas de navegação | [diagramas-navegacao/](diagramas-navegacao/) |
| Modelos de tela (wireframes) | [modelos-telas/](modelos-telas/) |
| Mockups oficiais aprovados do MPT | [docs/Prototipacao/](../Prototipacao/) |
| Plano técnico de implementação (depois desta fase) | [docs/preparacao-implementacao/](../preparacao-implementacao/) |
