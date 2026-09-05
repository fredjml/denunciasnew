# 04-REVIEW — Passo 8 (Review adversarial e aceite)

> Preenchido a partir do template `licoesaprendidas/templates/review.md`. Metodologia completa em
> [`FRAMEWORK-REVIEW.md`](../preparacao-implementacao/prompts/FRAMEWORK-REVIEW.md); relato
> detalhado em
> [`VERIFICACAO-REVIEW-QA-TESTE-SEGURANCA-2026-09-05.md`](../preparacao-implementacao/prompts/VERIFICACAO-REVIEW-QA-TESTE-SEGURANCA-2026-09-05.md).

## Fonte e escopo reabertos

Diff completo `origin/main...HEAD` (11 commits, `addbd7b`..`c24f910`) — todo o código de produto
desta sessão. Reaberto duas vezes: uma vez pelo `/code-review` (8 ângulos + verificação
adversarial), e uma segunda vez pelo `/security-review` (pipeline de 3 fases), este último
rodado até a conclusão formal **depois** de aplicar as correções da primeira rodada.

## Findings primeiro

| Severidade | Finding | Evidência | Requisito/impacto | Correção/owner | Estado |
| --- | --- | --- | --- | --- | --- |
| **HIGH** | `POST /api/denuncias` (rota real de envio) aceitava anexos sem validação de extensão/MIME/magic-bytes/antivírus — só a rota de teste `/api/evidencias` (nunca chamada pelo frontend) tinha essa proteção | `backend-mock/src/routes/denuncias.js:10` (antes da correção); confirmado por 2 ângulos independentes do `/code-review` | T-DN-04; um `.exe` renomeado para `.jpg` seria aceito e retornaria 201 | Rotas unificadas sob `middleware/upload.js` + novo `services/attachment-validation.js`; 4 testes de regressão / Frontend+Segurança | **CORRIGIDO** — commit `58b5c57`; confirmado sem novo achado pelo `/security-review` completo |
| MEDIUM | `EvidenciasStateService.remover(nome)` apagava todos os arquivos com o mesmo nome, não só o clicado | achado do `/code-review` (ângulo "diff linha a linha") | perda silenciosa de evidência anexada pelo usuário | `EvidenciaArquivo` ganhou `id` único; `remover(id)` | **CORRIGIDO** — commit `58b5c57` |
| MEDIUM | `protocolo` (tela de Confirmação) não sobrevivia a reload | achado do `/code-review` (ângulo "cross-file tracer") | usuário perde o número do protocolo se recarregar a página de confirmação | Persistido via `createPersistedSignal`; teste e2e de regressão | **CORRIGIDO** — commit `58b5c57` |
| MEDIUM | Seleção de mais de 3 evidências enviava só 3 ao backend (limite do contrato) sem avisar o usuário | achado do `/code-review` (ângulo "cross-file tracer") | usuário acredita que anexou N arquivos, só 3 chegam | Aviso visível na tela de Evidências (`excedeLimiteEnvio()`) | **CORRIGIDO** — commit `58b5c57` |
| LOW | `AudioRecorderService.recording` era um sinal morto (nunca atualizado) | achado do `/code-review` (2 ângulos independentes) | API pública incorreta para futuros consumidores | Exposto o sinal real (`recordingState`) | **CORRIGIDO** — commit `58b5c57` |
| LOW | Duplicação: padrão de persistência (`AcolhimentoStateService`), allowlist de upload (3 arquivos), busca de taxonomia (2 arquivos) | achados do `/code-review` (ângulos "reuso" e "altitude") | manutenibilidade — correção futura em um lugar não se propaga | Consolidados em `shared/persisted-signal.ts`, `attachment-validation.js`, `shared/taxonomia.ts` | **CORRIGIDO** — commit `58b5c57` |
| LOW | `app.ts` com 7 métodos quase idênticos (`goToX()`) | achado do `/code-review` (ângulo "simplificação") | escala mal ao adicionar novo passo ao wizard | Colapsado em `goTo(step)` único | **CORRIGIDO** — commit `58b5c57` |
| — (avaliado, rejeitado) | Colapsar 3 booleanos de `StepRelatoGuiado` (`consentDialog`/`audioEnabled`/`microphoneUnavailable`) em um enum único | achado do `/code-review` (ângulo "efficiency"), plausível na superfície | — | **NÃO APLICADO** — verificado que `audioEnabled` e `microphoneUnavailable` podem ser verdadeiros simultaneamente por design (testado em e2e); um enum perderia essa combinação legítima | Rejeitado com justificativa registrada |
| — (avaliado, sem ação) | `municipios-ibge-fallback.json` sem índice `Map` para busca O(1) | achado do `/code-review` (ângulo "eficiência") | — | **NÃO APLICADO** — o agente assumiu ~5.570 municípios; o arquivo real tem 6 entradas nesta fase do MVP | Sem impacto prático mensurável |

## Contraprova

- **O que refutaria prontidão?** Um achado HIGH sem correção, ou um achado de segurança
  reaberto pelo `/security-review` pós-correção. Nenhum dos dois ocorreu — a segunda rodada do
  `/security-review` (pós-fix) não encontrou achado novo de confiança ≥ 8/10.
- **Algum derivado substituiu a fonte?** Não. Toda alegação de "corrigido" foi verificada
  rodando `npm run lint && npm test && npm run build && npx playwright test` depois de cada
  lote de correção, não por leitura do próprio código corrigido.
- **Mock/offline foi apresentado como live?** Não. Todos os testes desta rodada são
  `unit-front`/`unit-back`/`integ-sim`/`e2e-mock`/`a11y-mock` — nenhum modo `live-*` foi citado
  como prova.
- **Diff/untracked/ignored/gerados foram conferidos?** Sim — `git status --porcelain` revisado
  antes de cada commit desta sessão; nenhum arquivo suspeito (`.env`, credenciais) encontrado.
  `.claude/` (artefato da própria ferramenta) foi adicionado ao `.gitignore` ao ser notado.
- **Secrets/PII/links/paths privados foram buscados?** Sim — toda fixture usa `SYN-*`/dados
  fictícios; nenhum token, credencial ou PII real em nenhum commit desta sessão.
- **Contrato, docs, testes e a11y estão sincronizados?** Sim — `contract/openapi.yaml` não foi
  alterado; a documentação de decisões (`12-DECISIONS.delta-denunciasnew.md`) e o plano
  (`11-IMPLEMENTATION-PLAN.delta-denunciasnew.md`) foram atualizados a cada fatia fechada; testes
  de a11y cobrem as 8 telas do wizard completo.

## Riscos residuais/exceções

- **CP-6 (classificador + alertas) não implementado** — todas as fatias já estavam bloqueadas
  por decisões de arquitetura no plano original; não é uma lacuna desta rodada de review.
- **`DEC-DN-26`** (processo de coordenação de contrato) tem só o princípio fechado — o
  detalhe operacional depende da equipe do backend real ainda não identificada.
- **ClamAV é mock por assinatura EICAR**, não um scanner de antivírus real — aceitável para o
  MVP standalone (`DEC-DN-P-F5-5`), mas deve ser revisitado antes de produção com uploads reais.
- **Anexos de evidência não persistem entre reloads** — limitação de plataforma (`File`/`Blob`
  não são serializáveis em `sessionStorage`), documentada, não é um bug a corrigir.
- **Sem teste de carga/rate-limit** sob a política `R-DN-04` (rate limit compartilhado) — não
  verificado nesta rodada.

## DoD e decisão

**ENTREGAR.**

Todos os achados HIGH e MEDIUM têm correção aplicada, testada e confirmada por uma segunda
rodada independente de security-review. Os achados não aplicados têm justificativa técnica
registrada (não foram "esquecidos"). Os riscos residuais são conhecidos, documentados e não
bloqueiam o escopo entregue (CP-0 a CP-5, wizard completo com envio real). CP-6 e as decisões
`DEC-DN-26` (operacional) permanecem como trabalho futuro explicitamente fora deste escopo de
entrega — ver [06-ACCEPTANCE-DECISION.md](06-ACCEPTANCE-DECISION.md).
