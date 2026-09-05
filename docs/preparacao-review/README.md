# Preparação para Review — Canal de Denúncias (`denunciasnew`)

Status: **PÓS-IMPLEMENTAÇÃO, REVIEW CONCLUÍDA** (Passos 5 a 9 do [kit de lições aprendidas](../licoesaprendidas/README.md)).
Escopo: consolida em formato estruturado o trabalho de implementação, teste, review e
segurança/QA já executado e commitado entre 2026-09-04 e 2026-09-05.
Repositório: `denunciasnew` (branch `main`, commits `addbd7b`..`c24f910` — 11 commits à frente de
`origin/main`, nenhum push realizado).
Data da compilação: 2026-09-05.
Autor da compilação: Claude Sonnet 5 (execução direta — implementação, testes e review, não
leitura estática).
Owner humano: Frederico José Monteiro Leite.

> Este pacote **não é planejamento** (isso já existe em
> [`docs/preparacao-implementacao/`](../preparacao-implementacao/)) — é o registro estruturado do
> que foi de fato **implementado, testado e revisado**, seguindo os mesmos templates do kit
> (`templates/testing.md`, `templates/review.md`, `templates/evidence-manifest.md`) para que a
> Fase 5–9 tenha a mesma completude documental que a Fase 0–4 já tinha.

## Como este pacote se conecta ao kit

O kit define o fluxo canônico
**DISCOVER → ANALYZE → READINESS CHECK → PLAN → IMPLEMENT → TEST → REVIEW → SECURITY/QA → ACCEPTANCE → DELIVER → LESSONS LEARNED**.
`preparacao-implementacao/` cobriu os Passos 0–4 (antes do trabalho). Este pacote cobre os
Passos 5–9 (durante e logo depois) — que na compilação original de `preparacao-implementacao`
existiam só como prompts, porque a implementação ainda não tinha começado.

| Momento | Passos | Cobertura neste pacote |
| --- | --- | --- |
| **Antes do trabalho** | 0–4 | ✅ [`docs/preparacao-implementacao/`](../preparacao-implementacao/) |
| **Durante** | 5 (Implement), 6 (Test) | ✅ coberto integralmente aqui |
| **Depois** | 7 (Review), 8 (Security/QA), 9 (Acceptance) | ✅ coberto integralmente aqui |
| **Post-mortem** | 10 (Lessons Learned) | ✅ [`docs/licoesaprendidas/16-postmortem-denunciasnew-cp0-cp5.md`](../licoesaprendidas/16-postmortem-denunciasnew-cp0-cp5.md) |
| **Reutilização** | 11 | 🟡 ver [`docs/preparacao-implementacao/prompts/FRAMEWORK-REVIEW.md`](../preparacao-implementacao/prompts/FRAMEWORK-REVIEW.md) (processo reutilizável de review) |

## Mapa de artefatos por Passo

| Passo do kit | Objetivo | Artefato produzido aqui |
| --- | --- | --- |
| 5 — Implementar | mudança pequena, reversível, testada, por fatia | [01-IMPLEMENTATION-SUMMARY.md](01-IMPLEMENTATION-SUMMARY.md) |
| 6 — Testar por modo | resultado aprovado/falhou/inconclusivo por requisito e modo | [02-TESTING.md](02-TESTING.md) |
| 7 — Capturar evidência | prova sanitizada, revisada, com owner/acesso/retenção | [03-EVIDENCE-MANIFEST.md](03-EVIDENCE-MANIFEST.md) |
| 8 — Review adversarial | findings por severidade + decisão ENTREGAR/CORRIGIR/BLOQUEAR | [04-REVIEW.md](04-REVIEW.md) |
| 6 (Security/QA) + 7 (Delivery Ready) — Gates | condição de bloqueio por gate | [05-GATES-DOD.md](05-GATES-DOD.md) |
| 9 — Entregar/publicar | DoD, aceite humano, riscos residuais | [06-ACCEPTANCE-DECISION.md](06-ACCEPTANCE-DECISION.md) |

## Fontes primárias desta compilação

Diferente de `preparacao-implementacao/` (que foi uma leitura estática de um repositório externo
antes de qualquer código existir), este pacote consolida **trabalho de execução direta na mesma
sessão**: cada afirmação aqui é rastreável a um commit, um comando executado e um resultado
observado — não a inferência sobre código de terceiros. As fontes primárias, em ordem de
precedência:

1. Commits `addbd7b`..`c24f910` neste repositório (`git log`, `git diff`).
2. Saída real de `npm run lint`, `npm test`, `npm run build`, `npx playwright test` (citada com
   contagens exatas em [02-TESTING.md](02-TESTING.md)).
3. Relatórios de sessão já commitados em
   [`docs/preparacao-implementacao/prompts/VERIFICACAO-*.md`](../preparacao-implementacao/prompts/)
   e [`FRAMEWORK-REVIEW.md`](../preparacao-implementacao/prompts/FRAMEWORK-REVIEW.md) — este
   pacote reorganiza e formaliza esse conteúdo nos templates do kit, não o substitui.
4. `contract/openapi.yaml` como fonte de verdade do formato de dados (nunca alterado nesta
   sessão).

## Limitações desta compilação

- Cobre exclusivamente o que foi implementado nesta sessão (CP-0 a CP-5 do wizard principal).
  CP-6 (classificador + alertas) não foi iniciado — ver [06-ACCEPTANCE-DECISION.md](06-ACCEPTANCE-DECISION.md).
- Testes E2E cobrem `e2e-mock` (API interceptada pelo `backend-mock`) — não há ambiente `live`
  autorizado para o backend real da outra equipe, IBGE real ou provedor de STT real.
- Acessibilidade automatizada (axe-core) cobre WCAG 2.1 AA; não substitui teste manual com
  tecnologia assistiva real nem revisão jurídica de linguagem simples.
- Duas decisões do owner (`DEC-DN-16`, `DEC-DN-20`) foram fechadas nesta sessão; o processo de
  coordenação de contrato (`DEC-DN-26`) tem o princípio fechado mas o detalhe operacional
  pendente (equipe do backend real ainda não identificada).
