# diagramas-navegacao

Diagramas Mermaid de **fluxo de navegação** — desenhados antes de implementar qualquer mudança
de navegação (nova tela, novo ramo condicional, mudança de ordem no wizard). Ver `R-DVX-01` em
`../AGENTS.md`.

## Convenção de nomes

`NN-nome-do-fluxo.mmd` — numerado na ordem em que foi criado, não na ordem do wizard (um
diagrama pode ser revisado/substituído; mantenha o número, incremente só ao criar um novo).

## Diferença em relação a `docs/diagramas-mermaid/`

- `docs/diagramas-mermaid/denunciasnew-*.mmd` documenta o sistema **como construído** (as-built)
  ou **como planejado na arquitetura geral** (C4, classes) — é retrospectivo/arquitetural.
- Esta pasta documenta uma **proposta de navegação ainda não implementada** — é prospectivo. Um
  diagrama daqui só migra para `docs/diagramas-mermaid/` (como as-built) depois que a
  implementação correspondente estiver concluída e validada.

## Exemplo — fluxo atual do wizard (referência de formato)

`01-fluxo-wizard-atual.mmd` documenta o estado de navegação vigente (8 telas, sem router) como
baseline para comparar qualquer proposta de mudança futura.
