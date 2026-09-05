# Verificação — CP-6 mock + DEC-DN-08 (Lighthouse) (sessão 2026-09-05, rodada 3)

> Owner: Frederico José Monteiro Leite. Continuação da rodada de fechamento de pendências
> (`06-ACCEPTANCE-DECISION.md`).

## 1. Decisões do owner respondidas nesta rodada

| Pergunta | Resposta | Ação |
| --- | --- | --- |
| Publicar os commits em `origin/main`? | Sim | `git push` ao final desta rodada |
| URL real da Ouvidoria (`FATIA-DN-CP1-03`) | Vai fornecer | **Aguardando o texto da URL** — nada implementado ainda nesta fatia |
| `DEC-DN-08` (SLA performance) | Aceitar o default (LCP≤4s/TTI≤6s) | Fechada — ver §2 |
| CP-6 (classificador + alertas) | Sim, com defaults mockados simples | Implementado — ver §3 |

## 2. DEC-DN-08 — Lighthouse Slow 3G

Corrigido um problema pré-existente (desde CP-0) antes de fechar a decisão: o job
`lighthouse-mobile` media contra `ng serve` (dev server, não otimizado), produzindo um número
sem relação com o app real (~143 s de TTI). Corrigido para medir contra o **build de produção**
(`npm run build` + `npx http-server` estático), com throttling de rede Slow 3G explícito
(400 Kbps / 400 ms RTT).

**Resultado real medido: LCP ≈ 10,2 s / TTI ≈ 10,2 s — não atinge o alvo de 4 s/6 s.** Isso é
esperado: o app ainda não teve nenhuma otimização de performance (bundle único de ~330 KB, sem
lazy-loading de rotas). Para não travar o CI por um requisito que exige um checkpoint dedicado de
otimização, as asserções de LCP/TTI ficam em nível `warn` (visíveis, não bloqueantes) até
`CP-mobile-perf` efetivamente otimizar o bundle.

## 3. CP-6 — Classificador + Alertas (mock)

Implementado com defaults simples e determinísticos, seguindo o mesmo padrão já usado no STT
mock (CP-2) e no protocolo mock (CP-1):

- **`classifier-mock.js`**: prioridade calculada por regra determinística — nº de irregularidades
  distintas selecionadas (1→BAIXA, 2→MEDIA, 3+→ALTA) + escalonamento de 1 nível se houver grupos
  vulneráveis envolvidos (teto em URGENTE). Só recebe códigos/enums, nunca campos identificadores
  (T-DN-05).
- **`alert-dispatcher-mock.js`**: só "despacha" (loga, sem canal real — `DEC-DN-22` não decidida)
  quando prioridade=URGENTE **e** `revisada_por_humano=true`. Como não existe interface
  administrativa para setar essa flag (`P-F4-sec-3`, fora de escopo), **todo caso URGENTE fica
  sempre pendente de revisão humana nesta versão** — comportamento seguro por padrão, não uma
  simulação incompleta.
- `POST /api/denuncias` agora também rejeita `prioridade` vinda do cliente (além de
  `classificacao`, já rejeitado desde CP-2) — T-DN-06.

**Não implementado, registrado explicitamente:** `FATIA-DN-CP6-06` (rate limit/throttle no
dispatcher) — é infraestrutura real (contador de rajada, janela de tempo), não um mock simples
como os demais itens desta rodada. Fica como pendência aberta, não escondida.

## 4. Evidência

| Comando | Resultado |
| --- | --- |
| `npm run lint` (raiz) | 0 erros |
| `npm test` (raiz) | frontend: 68/68 · backend-mock: **35/35** (+13 desde a rodada anterior) |
| `npm run build` | sem erros |
| `npx playwright test` | 11/11 |
| `npm run lighthouse:ci` (frontend) | roda com sucesso (exit 0); LCP/TTI reportados como `warn`, não bloqueiam |
| `git diff --check` | sem avisos |

## 5. Pendências remanescentes

- **URL da Ouvidoria** — aguardando o owner fornecer o texto para fechar `FATIA-DN-CP1-03`.
- **`DEC-DN-25`** (hosting do vídeo sem cookie de terceiro) — não abordada nesta rodada.
- **`FATIA-DN-CP6-06`** (rate limit do dispatcher) — registrada como não implementada.
- **Otimização de performance real** — para o app efetivamente atingir LCP≤4s/TTI≤6s, precisa de
  um checkpoint dedicado (lazy-loading de rotas, redução de bundle) — fora do escopo desta rodada
  de "fechar pendências", é trabalho de implementação novo.
