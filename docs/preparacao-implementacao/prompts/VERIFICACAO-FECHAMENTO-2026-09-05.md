# Registro de ações — fechamento de pendências (sessão 2026-09-05, rodada 4)

> Owner: Frederico José Monteiro Leite. Log ação → motivo para auditoria futura, cobrindo as
> respostas do owner à lista de 5 pendências apresentada ao final de
> `VERIFICACAO-CP6-PERF-2026-09-05.md`.

## 1. Respostas do owner nesta rodada

| # | Pendência | Resposta do owner |
| --- | --- | --- |
| 1 | URL da Ouvidoria (`FATIA-DN-CP1-03`) | `https://www.proteste.org.br/` |
| 2 | Hosting do vídeo institucional (fatia `FATIA-DN-CP1-05`) | "sim" — decidir agora, manter self-hosted |
| 3 | Otimização de performance (`DEC-DN-08` não atingido) | "Sim, comece agora" |
| 4 | Rate limit no dispatcher de alertas (`FATIA-DN-CP6-06`) | "implemente, ok?" |
| 5 | Processo de coordenação de contrato (`DEC-DN-26`) | "Aguardar, diga quais informações precisa para preparar o acoplamento como um lego" |

## 2. Ação → Motivo

| Ação | Motivo |
| --- | --- |
| Adicionado `URL_OUVIDORIA` em `frontend/src/app/app.ts` e `startReport()` passou a chamar `window.open(URL_OUVIDORIA, '_blank', 'noopener,noreferrer')` para a escolha `OUVIDORIA` | Fechar `FATIA-DN-CP1-03`, que dependia só do texto da URL. **Alerta de segurança/produto registrado**: a URL fornecida (`proteste.org.br`) não é um domínio do MPT — é o site de uma ONG de defesa do consumidor não relacionada. Sinalizei isso ao owner antes de implementar (`AskUserQuestion`); owner confirmou explicitamente ("Confirmo, é essa mesmo") duas vezes ao longo da rodada, então prossegui com a implementação como instruído, mas deixei o fato documentado em código (comentário em `app.ts`) e em `12-DECISIONS.delta-denunciasnew.md` para qualquer revisão futura perceber a anomalia rapidamente. |
| Testes novos: `app.spec.ts` (unit, mock de `window.open`) e `e2e/acolhimento.spec.ts` (Playwright, `waitForEvent('popup')`) | Toda fatia fechada neste projeto exige evidência de teste, não só código — convenção seguida em 100% das fatias anteriores (`R-QA-01`). |
| `FATIA-DN-CP1-03` marcada `IMPLEMENTADA` em `11-IMPLEMENTATION-PLAN.delta-denunciasnew.md` | Registrar o estado real da fatia após evidência verde (69/69 unit + 12/12 e2e). |
| Criada `DEC-DN-27` (nova) em `12-DECISIONS.delta-denunciasnew.md`, fechando a decisão de hosting do vídeo como "self-hosted, sem embed de terceiro" | O identificador "DEC-DN-25" tinha sido usado informalmente numa pergunta anterior para este assunto, mas `DEC-DN-25` já estava ocupado no documento pela decisão de instalação do LibreOffice. Um novo número evita reescrever/colidir com uma decisão já fechada e documenta a colisão para quem ler o histórico depois. |
| `FATIA-DN-CP1-05` marcada `IMPLEMENTADA`, referenciando `DEC-DN-27` | Nenhuma mudança de código era necessária — `video-institucional.html` já usava `<video>` nativo sem iframe/embed desde o CP-1; faltava só a decisão formal para destravar a fatia. |
| Adicionado `@defer (on immediate)` + bloco `@loading` do Angular 17+ em `app.html` para os 7 componentes de passo além de `app-step-acolhimento` | Aplicar a otimização de performance autorizada ("comece agora") sem migrar para `@angular/router` (fora de escopo, mudaria a arquitetura de navegação do app inteiro por sinal). `@defer` é compatível com o `@switch` baseado em signal já existente e converte automaticamente os componentes usados só dentro do bloco em *chunks* carregados sob demanda. `app-step-acolhimento` ficou fora do `@defer` de propósito: é a primeira tela vista pelo usuário, então adiá-la pioraria o LCP em vez de melhorar. |
| Adicionado `.app-step-loading` em `app.css` | Placeholder textual mínimo do `@loading` — sem isso a tela ficaria em branco por alguns milissegundos ao trocar de passo. |
| Medido antes/depois com `npm run lighthouse:ci` | Verificar se a otimização teve efeito real, não só teórico — prática já estabelecida nesta sessão de nunca declarar uma melhoria de performance sem medir contra o build de produção sob throttling Slow 3G. |
| **Resultado medido:** bundle inicial 330 KB → 257 KB (~70 KB gzip); LCP/TTI 10,2 s → 8,26 s | Melhoria real e mensurável, mas **ainda não atinge o alvo de `DEC-DN-08`** (LCP≤4s/TTI≤6s). Documentado como tal em vez de forçar a leitura como "resolvido" — o restante exige revisar o peso do runtime Angular + dependências no bundle inicial, trabalho de escopo maior que uma rodada de fechamento de pendências. |
| `DEC-DN-08` atualizada com o resultado da otimização e o gap remanescente | Manter o dashboard de decisões como fonte única de verdade sobre o que foi de fato alcançado, sem otimismo. |
| Adicionada janela deslizante em memória (`JANELA_MS`/`LIMITE_POR_JANELA`) em `backend-mock/src/services/alert-dispatcher-mock.js`, com motivo `LIMITE_DE_TAXA_EXCEDIDO` e função `_resetParaTeste` exportada só para os testes | Implementar `FATIA-DN-CP6-06` conforme pedido ("implemente, ok?"), antes registrada como não implementada por ser "infraestrutura real". Optei pela forma mais simples que ainda é genuinamente funcional (sem instalar dependência nova, sem introduzir Redis) — um contador de timestamps por processo já é suficiente para o mock de instância única deste MVP. **Limitação documentada explicitamente no código e no plano**: não funciona entre múltiplas instâncias; um canal real (`DEC-DN-22`, ainda não decidido) vai precisar de um limitador compartilhado. |
| Teste novo em `alert-dispatcher-mock.spec.mjs`: rajada de 6 despachos, 6º bloqueado | Evidência de que o limite realmente ativa, seguindo a mesma disciplina de TDD do resto do projeto. |
| `FATIA-DN-CP6-06` marcada `IMPLEMENTADA` em `11-IMPLEMENTATION-PLAN.delta-denunciasnew.md` | Registrar o estado real após evidência verde (36/36 testes backend-mock). |
| **Item 5 (`DEC-DN-26`) NÃO implementado — resposta dada em texto ao owner, não em código** | O owner pediu para aguardar a decisão operacional em si, só perguntou o que seria necessário saber para "preparar o acoplamento como um lego". Como isso é uma pergunta, não uma instrução de código, a resposta foi dada diretamente na conversa (ver seção "O que a equipe de backend real precisa fornecer" na resposta ao usuário) em vez de alterar arquivos. |
| Rodada completa de validação (`npm run lint`, `npm test`, `npm run build`, `npx playwright test`) executada na raiz do monorepo antes de considerar a rodada pronta para commit | Disciplina seguida em toda a sessão: nunca documentar/commitar sem primeiro confirmar que nada quebrou. Resultado: lint 0 erros, 69 testes frontend + 36 backend-mock = 105 testes verdes, build sem erros, 12/12 e2e verdes. |

## 3. Pendências que continuam em aberto após esta rodada

- **`DEC-DN-26`** (detalhe operacional do processo de PR de contrato) — princípio já fechado
  (PR revisado obrigatório); falta identificar a equipe do backend real e combinar repositório/
  aprovadores/prazo. Ver checklist de informações necessárias na resposta desta rodada ao owner.
- **Otimização de performance** — `DEC-DN-08` melhorou de ~10,2 s para ~8,26 s de LCP/TTI, mas
  ainda não atinge o alvo de 4 s/6 s. Requer um checkpoint dedicado (`CP-mobile-perf`) para revisar
  o peso do runtime/dependências no bundle inicial.
- **`DEC-DN-10`, `DEC-DN-11`, `DEC-DN-12`, `DEC-DN-13`, `DEC-DN-14`, `DEC-DN-15`, `DEC-DN-17`,
  `DEC-DN-18`, `DEC-DN-19`, `DEC-DN-21`, `DEC-DN-22`, `DEC-DN-23`, `DEC-DN-24`** — decisões que já
  estavam em aberto antes desta rodada e não foram tocadas (não bloqueiam o MVP; ver
  `12-DECISIONS.delta-denunciasnew.md` §2).
- **Persistência de anexos de evidência entre reloads** — limitação de navegador (arquivos não
  sobrevivem a F5), documentada desde CP-3, sem mudança nesta rodada.

## 4. Evidência desta rodada

| Comando | Resultado |
| --- | --- |
| `npm run lint` (raiz) | 0 erros |
| `npm test` (raiz) | frontend: 69/69 · backend-mock: 36/36 (+1 desde a rodada anterior) |
| `npm run build` (raiz) | sem erros; bundle inicial 257 KB (antes: ~330 KB) |
| `npx playwright test` (frontend) | 12/12 |
| `npm run lighthouse:ci` (frontend) | LCP/TTI ≈ 8,26 s (antes: ≈10,2 s); ainda em nível `warn`, não bloqueia CI |
