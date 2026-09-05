# Framework de Review — QA, Testes e Segurança (`denunciasnew`)

> Metodologia usada a partir de 2026-09-05 para revisar código já implementado (diferente do
> "triplo review" de `F7-consolidacao.md`, que revisou os artefatos de **planejamento**, não
> código). Aplica as regras já vigentes no projeto — `R-QA-01`, `R-REV-01`, `R-SEC-01`
> (`docs/licoesaprendidas/04-ia-rules-skills-tools-mcp-agents.md`) — como um processo repetível.

## 1. Quando rodar

- Antes de considerar um checkpoint (`CP-N`) definitivamente fechado, além dos testes verdes.
- Depois de qualquer mudança que toque autenticação, upload de arquivo, dados pessoais, ou o
  contrato de submissão (`ComplaintSubmissionService`, rotas do `backend-mock`).
- Quando o owner pedir explicitamente ("vamos para a review").

## 2. As duas frentes

### 2.1 QA / padrões / manutenibilidade — skill `/code-review`

Comando: `/code-review <alvo> <nível>` — ex. `/code-review origin/main high`.

- **Alvo**: `origin/main` compara todo o trabalho do branch atual contra o que já está publicado
  (uso recomendado para revisar um conjunto de commits, não só o diff não commitado).
- **Nível**: `medium` para mudanças pequenas e já bem entendidas; `high` para uma rodada de
  fechamento de checkpoint (mais ângulos, mais cobertura); `ultra` só quando o owner pedir
  explicitamente (dispara revisão multi-agente na nuvem, tem custo maior).
- O skill despacha ~8 "ângulos" de busca em paralelo (duplicação/reuso, simplificação,
  eficiência, convenções do repositório, comportamento removido/enfraquecido, diff linha a
  linha, rastreamento cross-file, altitude/arquitetura) e depois verifica cada achado
  adversarialmente antes de reportar.

**Antes de aplicar qualquer achado, faça a pergunta de `R-REV-01`: dá para refutar isso olhando
o comportamento real?** Um achado plausível na superfície pode estar errado sobre a intenção do
código (exemplo real desta sessão: "essas 3 flags booleanas deveriam ser um enum" — falso,
porque duas delas podem ser verdadeiras ao mesmo tempo por design; ver
`VERIFICACAO-REVIEW-QA-TESTE-SEGURANCA-2026-09-05.md` §3).

### 2.2 Segurança — skill `/security-review`

Comando: `/security-review` (sem argumentos — sempre revisa o diff do branch atual contra
`origin/HEAD`).

- **Pré-requisito local:** este repositório precisou de `git remote set-head origin -a` uma vez
  (o `origin/HEAD` simbólico não vinha configurado do clone original). Se o comando falhar com
  `ambiguous argument 'origin/HEAD...'`, rode esse comando uma vez e tente de novo.
- Pipeline de 3 fases: (1) um subagente identifica vulnerabilidades candidatas nas categorias
  padrão (injeção, auth, cripto/segredos, exposição de dados — ver categorias completas no corpo
  do skill); (2) cada candidata vira uma sub-tarefa paralela de filtragem de falso-positivo; (3)
  só sobrevive ao relatório final o que tiver confiança ≥ 8/10.
- Focado em **alta confiança, baixo ruído** — o objetivo é encontrar o que um engenheiro de
  segurança sênior realmente levantaria num PR, não uma lista genérica de boas práticas.

## 3. Severidade e prioridade de correção

| Severidade | Critério | Prazo de correção |
| --- | --- | --- |
| **HIGH** | Bypass de validação de segurança, exposição de PII, RCE, auth bypass — mesmo que só explorável localmente | Corrigir antes de considerar o checkpoint fechado |
| **MEDIUM** | Bug de correção concreto (perda de dado, estado inconsistente) sem ser vulnerabilidade de segurança direta | Corrigir na mesma rodada se o esforço for baixo; senão, registrar e agendar |
| **LOW / manutenibilidade** | Duplicação, acoplamento, nomenclatura, eficiência sem impacto de dado real | Corrigir quando o custo for baixo e não arriscar quebrar teste verde; senão, documentar e adiar |

## 4. Processo de aplicação (o que fazer com os achados)

1. **Ler cada achado com ceticismo** — ele descreve um `failure_scenario` concreto? Se não,
   trate como ruído (ver `R-REV-01`).
2. **Priorizar por severidade** (tabela acima), não pela ordem em que os agentes terminaram.
3. **TDD também nas correções**: todo achado de bug corrigido ganha um teste que falha antes da
   correção e passa depois — sem exceção para achados de segurança (ver
   `backend-mock/test/denuncias.spec.mjs` como exemplo dos 4 testes de regressão desta rodada).
4. **Rodar a suíte completa depois de cada lote de correções** — `npm run lint && npm test &&
   npm run build && npm --prefix frontend run test:e2e` — não só os testes novos.
5. **Registrar o que foi corrigido E o que foi conscientemente descartado**, com o motivo. Um
   achado descartado sem registro é indistinguível de um achado esquecido na próxima auditoria.
6. **Nunca aplicar um achado que exigiria tocar `contract/openapi.yaml`** sem passar pelo
   processo de `DEC-DN-26` (revisão coordenada com a equipe do backend real).

## 5. Checklist rápido (copiar antes de cada rodada de review)

- [ ] `/code-review origin/main high` rodado e aguardado até o fim (8 ângulos + verificação).
- [ ] `/security-review` rodado e aguardado até o fim (3 fases).
- [ ] Cada achado HIGH tem correção + teste de regressão.
- [ ] Cada achado MEDIUM aplicado ou explicitamente adiado com motivo registrado.
- [ ] Achados rejeitados têm o porquê escrito (não silenciados).
- [ ] `npm run lint`, `npm test`, `npm run build`, `npm --prefix frontend run test:e2e` — todos
      verdes após as correções.
- [ ] `git diff --check` sem avisos.
- [ ] Relatório de auditoria (`VERIFICACAO-REVIEW-*.md`) escrito antes do commit.

## 6. Histórico de execuções

| Data | Alvo | Achados HIGH | Achados MEDIUM/LOW aplicados | Registro |
| --- | --- | --- | --- | --- |
| 2026-09-05 (rodada 1 — `/code-review`) | `origin/main` (9 commits, CP-0..CP-5 completos) | 1 (upload sem validação em `/api/denuncias`) | 10 | [`VERIFICACAO-REVIEW-QA-TESTE-SEGURANCA-2026-09-05.md`](VERIFICACAO-REVIEW-QA-TESTE-SEGURANCA-2026-09-05.md) §1-3 |
| 2026-09-05 (rodada 2 — `/security-review` completo, pós-correção) | `origin/main` (10 commits, após aplicar a rodada 1) | 0 — confirma que a correção fechou o problema nas duas rotas/dois grupos de MIME, sem novo achado | — | idem, §3.1 |

**Nota de processo:** na rodada 1, o `/security-review` foi disparado mas interrompido antes de
concluir o pipeline de 3 fases (uma instrução nova do owner chegou no meio). O achado HIGH da
rodada 1 veio, na prática, dos ângulos de `/code-review` ("comportamento removido/enfraquecido" e
"diff linha a linha"), não do `/security-review`. A rodada 2 rodou o `/security-review` até o
fim para fechar essa lacuna de processo — daqui para frente, **não considere um
`/security-review` "feito" só porque foi disparado; confirme que a notificação final do pipeline
chegou** antes de registrar o resultado.
