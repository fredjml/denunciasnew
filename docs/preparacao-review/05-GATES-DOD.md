# 05-GATES-DOD — Gates 4 a 7 do kit

> Estrutura de `licoesaprendidas/06-gates-qa-testes-seguranca.md`, preenchida com o estado real
> do `denunciasnew` nesta sessão (não o baseline do produto histórico `cidadania-canal-denuncias`
> citado naquele arquivo, que é outro codebase).

## Gate 4 — Testing

| Condição de bloqueio | Estado |
| --- | --- |
| Teste obrigatório falha/não é executado | Nenhum teste obrigatório falhando — 68 frontend + 22 backend + 11 e2e, todos verdes |

**Gate 4: APROVADO.**

## Gate 5 — Review

| Condição de bloqueio | Estado |
| --- | --- |
| Crítico/alto não tratado | 1 achado HIGH, tratado e corrigido (ver `04-REVIEW.md`) |
| Review circular (mesma análise valida a si mesma) | Mitigado: `/security-review` rodou uma segunda vez, independente, depois da correção |

**Gate 5: APROVADO.**

## Gate 6 — Security/QA

| Item | Estado |
| --- | --- |
| Segurança | `/security-review` completo pós-correção: 0 achados novos ≥ 8/10 de confiança |
| Privacidade | Nenhuma PII real em nenhum commit; `DEC-DN-16` limita coleta de dado de testemunha a um booleano |
| Acessibilidade | axe-core 0 violações serious/critical (WCAG 2.1 AA) nas 8 telas do wizard |
| Evidência | Manifesto em `03-EVIDENCE-MANIFEST.md`; galeria visual publicada (privada) |

**Gate 6: APROVADO** para o escopo implementado (CP-0..CP-5). Não avaliado para CP-6 (não
implementado).

## Gate 7 — Delivery Ready

| Item | Estado |
| --- | --- |
| DoD | Ver `04-REVIEW.md` §DoD e decisão — cumprido para o escopo entregue |
| Autorização | Owner presente durante toda a sessão; autorizações just-in-time por checkpoint registradas em `docs/preparacao-implementacao/prompts/AUTORIZACAO-CP*.md` |
| Pacote entregável | 11 commits locais, `git status` limpo, nenhum push realizado (aguardando autorização explícita do owner para publicar) |
| Rollback | Cada commit é uma unidade reversível (`git revert`); nenhuma migração de dado irreversível foi feita |

**Gate 7: APROVADO para entrega local.** Push para `origin/main` **não** foi solicitado nem
executado nesta sessão — exige autorização explícita separada (`R-GIT-01`).

## Definition of Done — checklist final

- [x] cobertura de requisitos completa para o escopo implementado (CP-0..CP-5); exceções
      (CP-6, campos de mockup ausentes do contrato) aprovadas e documentadas.
- [x] lint, teste, build e validações obrigatórias aprovados.
- [x] estado offline/live/UI alegado corretamente (tudo `mock`/`e2e-mock`, nada apresentado como
      `live`).
- [x] evidências sanitizadas, rastreáveis e retidas conforme política (`03-EVIDENCE-MANIFEST.md`).
- [x] contrato, docs e testes sincronizados (`contract/openapi.yaml` intocado; decisões e plano
      atualizados a cada fatia).
- [x] nenhum achado crítico aberto.
- [x] review adversarial e diff/untracked conferidos (duas rodadas independentes).
- [x] risco residual, rollback e limitações registrados (`04-REVIEW.md`, `README.md`).
- [ ] target/publicação confirmados — **não aplicável nesta rodada**: nenhum push/deploy foi
      solicitado.
- [x] aceite humano registrado — ver `06-ACCEPTANCE-DECISION.md`.
