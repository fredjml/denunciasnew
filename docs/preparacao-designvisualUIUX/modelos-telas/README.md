# modelos-telas

Wireframes / modelos de tela de baixa e média fidelidade — a saída da Fase 4 do workflow
(`../02-WORKFLOW-SKILLS-TOOLS-AGENTES.md`). Ver `R-DVX-01`/`R-DVX-02` em `../AGENTS.md`.

## Convenção de nomes

`NN-nome-da-tela.md` (texto estruturado — ver template abaixo) opcionalmente acompanhado de
`NN-nome-da-tela.png` (rascunho visual, gerado por ferramenta externa ou desenhado à mão) ou
`NN-nome-da-tela.html` (protótipo solto, publicado como Artifact para revisão visual).

## Template do arquivo `.md`

```markdown
# NN — Nome da tela

- **Status:** rascunho | aprovado | promovido para docs/Prototipacao/ | descartado
- **Referência oficial:** página X do PDF, ou "nenhuma — tela nova sem precedente no mockup"
- **Campos usados:** lista de campos + confirmação de que cada um existe em
  `contract/openapi.yaml` (ou marcação explícita de gap, ver `R-DVX-02`)
- **Navegação:** o que leva a esta tela, o que esta tela leva a seguir (linkar o diagrama
  correspondente em `../diagramas-navegacao/` se a navegação mudou)

## Descrição do layout

(estrutura de cima para baixo, por seção)

## Trade-offs considerados

(se houve mais de uma variação na Fase 3, registrar por que esta foi escolhida)

## Aprovação

- **Owner:** nome
- **Data:**
- **Registro:** link para `../prompts/AUTORIZACAO-*.md` correspondente
```

## Ciclo de vida

`rascunho` (Fase 3/4, ainda sob discussão) → `aprovado` (owner aprovou, mas a tela ainda não
foi implementada) → `promovido para docs/Prototipacao/` (implementado, validado, e agora é
tratado como mockup oficial para futuras comparações) — nesse ponto o arquivo aqui pode
permanecer como histórico da decisão, mas deixa de ser a referência ativa.

Um modelo pode também virar `descartado` sem nunca ser implementado — mantenha o arquivo (não
apague) como registro de uma opção considerada e rejeitada, com o motivo.
