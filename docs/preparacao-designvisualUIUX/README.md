# preparacao-designvisualUIUX

> Pacote de governança e workflow para a fase de **preparação visual/UI/UX** — o trabalho que
> acontece **antes** de qualquer linha de código de interface ser escrita ou alterada. Criado em
> 2026-09-05, a pedido do owner, para que futuras mudanças visuais (novo checkpoint, nova tela,
> redesign) sigam um processo repetível em vez de depender de comparação ad-hoc contra um PDF.

## Por que este pacote existe

Ao longo da implementação do MVP `denunciasnew`, o trabalho de alinhar a interface aos mockups
oficiais do MPT (`docs/Prototipacao/`) foi feito de forma reativa: comparar screenshot contra
PDF, ajustar CSS, repetir. Funcionou, mas não deixou um processo — cada rodada reaprendeu o
mesmo método. Este pacote fixa esse método como um **workflow nomeado**, com:

- um catálogo avaliado de ferramentas/referências de design de IA e UX (seção 1);
- um mapeamento explícito de quais primitivas do Claude Code (skills, tools, agentes,
  subagentes) cobrem qual etapa do processo (seção 2);
- duas pastas de artefato **anteriores à implementação** — diagramas de navegação e modelos de
  tela — para que a próxima mudança visual comece por um desenho revisável, não direto no código
  (seções 3 e 4).

## Posição no pipeline do projeto

```
docs/preparacao-designvisualUIUX/   ←  ESTE PACOTE (antes de codar)
        │  gera/aprova
        ▼
docs/Prototipacao/                   (mockups oficiais aprovados, fonte de verdade visual)
        │  referência para
        ▼
docs/preparacao-implementacao/       (planejamento técnico — requisitos, fatias, decisões)
        │  implementa
        ▼
frontend/, backend-mock/             (código)
        │  valida
        ▼
docs/preparacao-review/              (QA, teste, segurança — depois de implementado)
```

Este pacote **não substitui** `docs/preparacao-implementacao/` nem `docs/preparacao-review/` —
ele preenche a lacuna que faltava: a etapa de design antes da primeira linha de CSS/HTML.

## Estrutura

| Arquivo/pasta | Conteúdo |
| --- | --- |
| [`AGENTS.md`](AGENTS.md) | Governança local desta fase — persona, regras, autoridade final. |
| [`01-CATALOGO-FERRAMENTAS-IA-UX.md`](01-CATALOGO-FERRAMENTAS-IA-UX.md) | Ferramentas e sites de referência de design de IA/UX avaliados, com quando usar cada um. |
| [`02-WORKFLOW-SKILLS-TOOLS-AGENTES.md`](02-WORKFLOW-SKILLS-TOOLS-AGENTES.md) | O workflow em si: fases, e quais skills/tools/agentes/subagentes do Claude Code cobrem cada fase. |
| [`diagramas-navegacao/`](diagramas-navegacao/) | Diagramas Mermaid de fluxo de navegação — desenhados **antes** de qualquer tela nova ser implementada. |
| [`modelos-telas/`](modelos-telas/) | Wireframes/modelos de tela de baixa e média fidelidade — anteriores à implementação, promovidos para `docs/Prototipacao/` só depois de aprovados pelo owner. |
| [`prompts/`](prompts/) | Registros de autorização e verificação desta fase (mesmo padrão de `docs/preparacao-implementacao/prompts/`). |

## Regra de ouro

**Nenhuma tela nova ou redesign de tela existente é implementado sem antes passar por este
pacote**: diagrama de navegação (se a navegação muda) + modelo de tela (se o layout muda) +
aprovação do owner registrada em `prompts/`. Isso não se aplica a correções pontuais (ex.: um
ícone errado, um espaçamento) — só a mudanças estruturais de tela ou fluxo.
