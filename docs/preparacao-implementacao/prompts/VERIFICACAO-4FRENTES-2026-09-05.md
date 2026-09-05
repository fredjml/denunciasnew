# Verificação — 4 frentes: paridade visual, performance, PWA, PO (sessão 2026-09-05, rodada 6)

> Owner: Frederico José Monteiro Leite. Pedido: "Os 4, pode?" — continuar as 4 frentes deixadas
> em aberto no fim da rodada anterior (paridade visual fina, performance, teste PWA, relatório
> PO atualizado).

## 1. Paridade visual — cartões de campo removidos (Detalhamento, Local, Sigilo)

Comparação contra `docs/Prototipacao/OndeOFatoocorreu.png` (referência oficial) revelou que
`Detalhamento`, `Local` e a seção de identificação de `Sigilo e Anonimato` envolviam os grupos
de campo (`.field-group`) em cartões com borda/fundo branco/padding — **o mockup oficial não
tem esse cartão**: as seções ficam direto no fundo da página, só os próprios campos têm um
preenchimento sutil e cantos bem arredondados.

**Ação:** removida a borda/fundo/padding de `.field-group` nas 3 telas; campos de texto/select
passaram de `border-strong` + `radius-md` para `border` (mais sutil) + `radius-lg` (mais
arredondado) + fundo `--color-bg-subtle`, batendo com o visual do mockup.
**Motivo:** fechar a diferença estrutural mais visível dessas 3 telas contra a referência
oficial, verificado com screenshot novo comparado ao PNG antes de declarar pronto (ciclo
Thought/Action/Observation do `PWA-PIXEL-PARITY-PROMPT.md`).

## 2. Performance — remoção de `@angular/router` não utilizado

**Achado:** o relatório do Lighthouse (Slow 3G) mostrou 87% do tempo de LCP em "Render Delay"
(custo de CPU, não rede) — sinal de que o próximo ganho real estava no peso do bundle inicial.
Investigação encontrou `@angular/router` instalado e configurado (`provideRouter(routes)` em
`app.config.ts`, `app.routes.ts` com `routes: Routes = []`) **mas nunca usado**: confirmado via
busca por `RouterLink`/`Router`/`ActivatedRoute` em todo `frontend/src/app` — zero ocorrências
fora dos 2 arquivos de configuração. A navegação sempre foi via signal local (`app.ts`).

**Ação:** removida a dependência por completo — `app.config.ts` sem `provideRouter`,
`app.routes.ts` apagado, `@angular/router` fora de `package.json` (`npm install` rodado para
atualizar o lockfile, sem instalar nada novo).
**Motivo:** dependência morta consumindo bundle inicial sem entregar nenhuma funcionalidade —
remoção seguramente reversível (`git revert`) e zero risco funcional (confirmado: 69 unit +
12 e2e continuam verdes depois da remoção).

**Resultado medido (build de produção, Slow 3G real via `npm run lighthouse:ci`):**

| Momento | Bundle inicial (raw / gzip) | LCP/TTI |
| --- | --- | --- |
| Início da sessão (sem otimização) | ~330 KB / ~90 KB | ≈10,2 s |
| Depois do `@defer` nas telas | 257 KB / 70 KB | ≈8,26 s |
| Depois de remover `@angular/router` | 185 KB / 54 KB | ≈7,21 s |

Ainda não atinge o alvo de `DEC-DN-08` (LCP≤4s/TTI≤6s), mas caiu ~30% no total desta sessão.
Detalhes completos em `12-DECISIONS.delta-denunciasnew.md` (`DEC-DN-08`).

## 3. Teste PWA — verificação manual (Lighthouse não tem mais categoria PWA)

**Achado:** o Lighthouse 12.6.1 (versão instalada) **removeu a categoria PWA** dos audits padrão
(Google descontinuou esses checks por volta da v10) — `--only-categories=pwa` não executa nada.
**Ação:** escrito um script Playwright ad-hoc que verifica, contra o build de produção servido
estaticamente, os mesmos critérios que a categoria PWA do Lighthouse cobria: manifest acessível
e com campos obrigatórios (`name`, `short_name`, `start_url`, `display`, ícones 192/512 +
maskable), todos os ícones realmente respondendo 200, `<link rel="manifest">` e `theme-color`
no `index.html`, service worker chegando ao estado `activated`, e — o teste mais forte —
**navegação com a rede desligada (`context.setOffline(true)`) depois do SW ativo carrega o
shell da página**, provando que a estratégia de cache funciona de verdade, não só na teoria.
**Resultado: 17/17 critérios passaram.**
**Motivo:** sem essa verificação, "PWA implementada" ficaria sem evidência de que a
instalabilidade/funcionamento offline realmente funciona — mesmo padrão de rigor já aplicado a
todo o resto do projeto (nunca declarar pronto sem evidência).

**Pendência que continua real:** nenhum teste automatizado substitui o teste em aparelho físico
Android/iOS real (comportamento de "Adicionar à tela inicial", safe-area de notch, teclado
virtual) — isso só o owner pode fazer manualmente, passo a passo já passado numa rodada
anterior desta sessão.

## 4. Relatório do PO — não regenerado nesta rodada

Decidi não gerar um novo `.docx` agora: os únicos itens novos desde `Relatorio-Requisitos-
Faltantes-PO-2026-09-05.docx` são melhorias técnicas (paridade visual, performance, PWA) que
não mudam nenhuma pergunta de produto pendente — o relatório já cobre exatamente as decisões
que o PO precisa tomar, e nenhuma delas mudou nesta rodada. Se quiser, gero uma versão 2 só
para registrar o progresso técnico, mas o conteúdo de perguntas seria idêntico.

## 5. Evidência

| Comando | Resultado |
| --- | --- |
| `npx eslint .` (frontend) | 0 erros |
| `npx ng test --watch=false` | 69/69 |
| `npx ng build` | sem erros; bundle inicial 185 KB (era 257 KB no início desta rodada) |
| `npx playwright test` | 12/12, incluindo 2 checks WCAG 2.1 AA |
| `npm run lighthouse:ci` | LCP/TTI ≈7,21s (era ≈8,26s no início desta rodada); ainda `warn`, não bloqueia CI |
| Script PWA ad-hoc (Playwright) | 17/17 critérios de instalabilidade/offline passaram |
| `npm install` (frontend) | 1 pacote removido (`@angular/router`), lockfile atualizado, sem instalar nada novo |
