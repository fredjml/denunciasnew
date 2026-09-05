# 02 — Workflow: skills, tools, agentes e subagentes por fase

> Define o processo repetível de preparação visual/UI/UX e mapeia cada fase às primitivas do
> Claude Code (skills, tools, agentes/subagentes) e, quando aplicável, a workflows formais
> (`Workflow` tool). Segue o modelo operacional de
> `docs/licoesaprendidas/04-ia-rules-skills-tools-mcp-agents.md` (Rules/Skill/Tool/MCP/Agent).

## Visão geral das 5 fases

```
1. Descoberta        2. Referência       3. Rascunho         4. Modelo de tela    5. Aprovação
   (o que muda?)   →   (benchmark)     →   (gerar opções)  →   (arquivo final)  →   (owner + gate)
```

Cada fase tem um objetivo único, uma primitiva primária do Claude Code, e um critério de saída
verificável — mesmo padrão de evidência exigido em `docs/preparacao-implementacao/`.

## Fase 1 — Descoberta: o que precisa mudar

**Objetivo:** identificar exatamente qual tela ou fluxo está em jogo, e se a mudança é
estrutural (exige este workflow) ou pontual (não exige, ver `R-DVX-01`).

- **Primitiva:** `Tool` — leitura direta (`Read`, `Grep`, `Glob`) do estado atual do app e dos
  mockups oficiais. Nenhum agente é necessário nesta fase; é trabalho de 1 pessoa (ou 1 sessão
  principal do Claude Code) comparando o pedido contra o que já existe.
- **Entrada:** pedido do owner + estado atual do código (`frontend/src/app/steps/*`).
- **Saída:** uma frase objetiva do tipo "a tela X precisa de Y, o mockup oficial mostra/não
  mostra isso na página Z do PDF".
- **Gate:** se a mudança não altera estrutura/navegação/campo novo, pare aqui e implemente
  direto (não é preciso o resto do workflow).

## Fase 2 — Referência: benchmarking de padrão de mercado

**Objetivo:** ver como o mesmo problema de UX foi resolvido em produtos reais, antes de
desenhar uma solução do zero.

- **Primitiva:** `Tool` (`WebFetch`/`WebSearch`) sobre o catálogo de
  `01-CATALOGO-FERRAMENTAS-IA-UX.md` — tipicamente Mobbin/Refero.design para padrão visual de
  mercado, ou The Shape of AI/HAX/PAIR se o problema envolver comunicar algo sobre uma decisão
  automatizada.
- **Quando usar um subagente:** se a pesquisa exigir mais de ~3 consultas (ex.: comparar 5
  produtos diferentes), delegar para um `Agent` do tipo `Explore` ou `general-purpose` com um
  prompt objetivo ("pesquise como 3 apps de denúncia trabalhista tratam upload de evidência,
  reporte em 150 palavras") em vez de fazer manualmente na sessão principal — protege o
  contexto da sessão principal (ver `docs/licoesaprendidas` sobre uso de subagentes).
- **Saída:** 2-4 linhas por referência encontrada, sem copiar layout inteiro — inspiração de
  padrão, não cópia.
- **Gate:** nenhuma decisão de mercado sobrepõe o mockup oficial do MPT — isso é só contexto.

## Fase 3 — Rascunho: gerar 1-3 opções de layout

**Objetivo:** produzir alternativas de layout rapidamente antes de comprometer com uma.

- **Primitiva:** `Tool` externa (ferramenta de geração de UI por IA da seção 3 do catálogo —
  Figma Make, Banani, 21st.dev) **ou**, se nenhuma ferramenta externa estiver autorizada no
  momento, um `Agent` (`subagent_type: "claude"` ou `general-purpose`, sem `isolation` — não
  precisa de worktree, é só geração de HTML/Markdown de rascunho) que produz um wireframe em
  Markdown/ASCII ou um protótipo HTML solto (não integrado ao Angular) para visualização rápida.
- **Quando usar `Artifact`:** se o rascunho for HTML e precisar ser visualizado/comparado
  visualmente antes de virar um `modelos-telas/*.md`, publicar como Artifact (ver skill
  `artifact-design`) em vez de só descrever em texto — comparação visual é mais confiável que
  descrição.
- **Saída:** 1-3 variações, cada uma com 1 frase do trade-off (ex.: "opção A: checklist em
  carrossel, igual ao mockup oficial; opção B: checklist em lista vertical, mais acessível a
  leitor de tela mas diverge do mockup").
- **Gate:** nenhum rascunho vira código ainda — só decide qual variação segue para a Fase 4.

## Fase 4 — Modelo de tela: o arquivo final revisável

**Objetivo:** consolidar a variação escolhida em um arquivo de `modelos-telas/` (ver convenção
no README daquela pasta) — e, se a navegação mudar, atualizar/criar um diagrama em
`diagramas-navegacao/`.

- **Primitiva:** `Tool` (`Write`/`Edit` direto) — trabalho de síntese, não precisa de agente.
- **Checklist obrigatório antes de marcar como pronto** (aplicar como um mini gate, mesmo
  padrão de `R-QA-01`):
  - [ ] Toda referência a campo de dado existe em `contract/openapi.yaml`, ou está marcada
        como "gap de contrato" (`R-DVX-02`).
  - [ ] Contraste de cor e tamanho de alvo de toque compatíveis com WCAG 2.1 AA (`DEC-DN-07`) —
        conferir manualmente, sem esperar o axe-core do CI (que só roda sobre código real).
  - [ ] Se a navegação mudou, o diagrama em `diagramas-navegacao/` foi atualizado.
- **Saída:** um arquivo `modelos-telas/NN-nome-da-tela.md` (ou `.png`/`.html` de apoio).

## Fase 5 — Aprovação: gate do owner

**Objetivo:** autorização explícita antes de qualquer implementação.

- **Primitiva:** `Tool` (`AskUserQuestion` quando a decisão for objetiva e cabe em 2-4 opções)
  ou pergunta direta em texto quando exigir resposta livre (ex.: aprovar/reprovar um layout
  inteiro).
- **Registro:** criar/atualizar um arquivo em `prompts/` (mesmo padrão de
  `docs/preparacao-implementacao/prompts/AUTORIZACAO-*.md`) documentando o que foi aprovado.
- **Saída:** o modelo de tela aprovado é promovido (copiado/referenciado) como próxima entrada
  de `docs/preparacao-implementacao/11-IMPLEMENTATION-PLAN.delta-denunciasnew.md` (nova fatia
  `FATIA-DN-*`) — só a partir daqui a implementação em código pode começar.

## Quando usar um Workflow formal (`Workflow` tool)

As 5 fases acima cabem numa única sessão interativa na grande maioria dos casos (1 tela, 1
mudança). Considere um `Workflow` script multi-agente **só** quando o pedido cobrir várias
telas de uma vez (ex.: um redesign completo de checkpoint, como o CP-1..CP-6 inteiro) — nesse
caso, um workflow com `pipeline()` rodando a Fase 2 (referência) em paralelo para cada tela,
seguida de Fase 3/4 por tela, é mais eficiente que serializar tudo numa sessão só. **Só disparar
um `Workflow` quando o owner pedir explicitamente** ("use um workflow", "ultracode") — não por
iniciativa própria, conforme a política padrão da ferramenta.

## Tabela-resumo

| Fase | Primitiva principal | Agente/subagente? | Artefato de saída |
| --- | --- | --- | --- |
| 1. Descoberta | Tool (leitura) | Não | Frase objetiva do escopo |
| 2. Referência | Tool (WebFetch/WebSearch) | Opcional (`Explore`/`general-purpose`) | Notas de benchmarking |
| 3. Rascunho | Tool externa de geração de UI, ou Agent + Artifact | Opcional | 1-3 variações de layout |
| 4. Modelo de tela | Tool (Write/Edit) | Não | `modelos-telas/*.md` + diagrama se navegação mudou |
| 5. Aprovação | Tool (AskUserQuestion) | Não | `prompts/AUTORIZACAO-*.md` + nova fatia no plano de implementação |
