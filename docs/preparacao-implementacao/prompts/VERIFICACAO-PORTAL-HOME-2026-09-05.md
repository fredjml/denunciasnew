# Verificação — Portal institucional (Home) (sessão 2026-09-05, rodada 7)

> Owner: Frederico José Monteiro Leite. Nova tela adicionada ao app, seguindo pela primeira vez
> o workflow de `docs/preparacao-designvisualUIUX/` de ponta a ponta.

## 1. Contexto

Owner enviou um print e perguntou "cadê essa tela no projeto". Identificado: a imagem é a
página 4 do PDF oficial (`Documento externo-outros 010970.2026.pdf`, slide "Versão Mobile") —
o **site institucional atual do MPT** (Petição eletrônica, Consulta de Processos, Audiências
Públicas, Transparência, Ouvidoria, notícia, WhatsApp), usada no documento só como contexto do
motivo do redesign, **não** uma tela do Canal de Denúncias. Owner confirmou que queria adicioná-
la como tela nova mesmo assim.

## 2. Processo seguido (R-DVX-01)

1. Criado `docs/preparacao-designvisualUIUX/modelos-telas/02-portal-institucional-home.md`
   (rascunho) listando os 6 elementos da tela e marcando que 5 deles referenciam sistemas reais
   do MPT sem fonte no `contract/openapi.yaml`/backend-mock — gap de contrato generalizado.
2. Criado `docs/preparacao-designvisualUIUX/diagramas-navegacao/02-fluxo-com-portal-home.mmd`
   propondo a tela como nova entrada, antes do Acolhimento.
3. Perguntas objetivas ao owner via `AskUserQuestion` (4 perguntas, todas resolvidas com a
   opção recomendada): tiles sem contrato → link externo real; sem banner de notícia (não
   inventar conteúdo); vira a nova primeira tela do app; sem botão de WhatsApp (sem número
   real documentado).
4. Só então implementado.

## 3. Ação → Motivo

| Ação | Motivo |
| --- | --- |
| Pesquisei URLs reais no `mpt.mp.br`/`prt17.mpt.mp.br` para os 5 tiles sem destino (`WebFetch`) | Não inventar link — mesmo princípio já aplicado à URL da Ouvidoria antes. |
| Verifiquei cada URL com `curl` + User-Agent de navegador antes de usar | `curl` sem User-Agent recebeu 403 do WAF do domínio — sem checar com UA de navegador, teria descartado URLs válidas por engano. "Audiências Públicas" e "Carta de Serviços" não têm página dedicada confirmada — usei a página geral `/servicos` (200 real) em vez de uma URL inventada, documentado como tal. |
| Criado `frontend/src/app/shared/mpt-links.ts` centralizando todas as URLs externas, incluindo a Ouvidoria (antes só em `app.ts`) | Um único lugar para auditar/atualizar links externos; evita duas fontes divergentes da mesma URL de Ouvidoria. |
| Criado `frontend/src/app/portal-home/` (`.ts`/`.html`/`.css`/`.spec.ts`) | Nova tela, sem tocar nos 8 componentes de passo existentes do wizard. |
| `app.ts`: novo `WizardStep = 'PORTAL'`, virou o valor default do `createPersistedSignal`, nova `WizardTab = 'PORTAL'` | Portal vira a tela de entrada (decisão do owner); estado persistido em `sessionStorage` do mesmo jeito que os demais passos. |
| `app.html`: abas e barra de progresso escondidas quando `currentStep() === 'PORTAL'` | Abas do wizard (Acolhimento/Relato/Empresa/Revisão) não fazem sentido antes do usuário entrar no fluxo de denúncia. |
| Botão "Denuncie" no portal chama `goTo('ACOLHIMENTO')`; "Início" da Confirmação volta ao Portal (era Acolhimento) | Bate com o diagrama de navegação proposto e aprovado. |
| Cor do botão "Denuncie" ajustada de `--color-accent` (#d97706) para `#b45309` | `axe-core` (e2e de acessibilidade) reprovou o contraste original: 3,18:1 com texto branco, abaixo do mínimo AA (4,5:1). Tom mais escuro da mesma família passou no teste, mantendo a intenção visual laranja do mockup. |
| Todos os 5 e2e specs que assumiam abertura direta no Acolhimento (`acolhimento`, `detalhamento-evidencias`, `fluxo-completo`, `relato-guiado`, `accessibility`) ganharam um clique em `portal-denuncie` antes de continuar | A tela inicial do app mudou; os testes precisam navegar através dela como um usuário real faria. |
| `fluxo-completo.spec.ts`: assert final trocado de "Denuncie ao MPT" para "Acesso Rápido" | O botão "Início" da Confirmação agora volta ao Portal, não ao Acolhimento — mesmo diagrama aprovado. |

## 4. Evidência

| Comando | Resultado |
| --- | --- |
| `npx eslint .` (frontend) | 0 erros |
| `npx ng test --watch=false` | 74/74 (+5 novos testes do `PortalHome`) |
| `npx ng build` | sem erros; bundle inicial 190 KB (+5 KB pela tela nova, aceitável) |
| `npx playwright test` | 12/12, incluindo os 2 checks WCAG 2.1 AA (o da tela inicial agora cobre o Portal) |
| `curl` com User-Agent de navegador | confirmou 200 em `peticionamento.prt17.mpt.mp.br`, `prt17.mpt.mp.br/servicos(/movimentacao-de-procedimentos)`, `mpt.mp.br/MPTransparencia/` |

## 5. Pendências

- Nenhuma página dedicada de "Carta de Serviços" ou "Audiências Públicas" foi confirmada no
  domínio do MPT — ambas apontam para a página geral de serviços. Se essas páginas específicas
  existirem sob outra URL, atualizar `frontend/src/app/shared/mpt-links.ts`.
- O ícone usado para "Ouvidoria" (`chat`) tem uma forma visual que lembra mais um ícone de
  "atualizar/sincronizar" do que uma conversa — inconsistência pré-existente do componente
  `Icon` (usado também no Acolhimento), não introduzida nesta rodada; registrar como possível
  ajuste futuro, não corrigido agora por estar fora do pedido desta rodada.
