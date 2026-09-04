# Passo 0 — Mapa de origens, baseline e drift (re-síntese)

Este documento **cita** e consolida — não substitui — o mapa canônico em [`docs/licoesaprendidas/00-mapa-origens-baseline-drift.md`](../licoesaprendidas/00-mapa-origens-baseline-drift.md) e a baseline factual em [`docs/licoesaprendidas/15-baseline-analises-denuncias.md`](../licoesaprendidas/15-baseline-analises-denuncias.md).

## Fontes com precedência (para este pacote)

| Ordem | Fonte | Papel |
| ---: | --- | --- |
| 1 | `cidadania-canal-denuncias/AGENTS.md`, `planejamento.md`, `spec_design.md`, código, testes e Swagger | fonte primária (fato atual) |
| 2 | `cidadania-canal-denuncias/frontend/AGENTS.md`, `cidadania-canal-denuncias/backend/AGENTS.md` (se presente) | governança local por camada |
| 3 | Relatórios em `docs/Analises/*.md` (janelas 21/07/2026 a 31/07/2026) | evidência histórica datada |
| 4 | `.docx` derivados dos scripts `build_*_docx.py` | publicação executiva |
| 5 | Kit `docs/licoesaprendidas/` | controles reutilizáveis |
| 6 | Este pacote `docs/preparacao-implementacao/` | leitura consolidada |

## Baseline técnica observada (kit, 26/08/2026)

- Aplicação em `cidadania-canal-denuncias/`.
- Angular **22.0.5**, TypeScript **6.0.2**; Node declarado `^24.15` ou `>=26`.
- BFF Express **4.22** em `server/`, com lockfile próprio.
- Frontend usa `fetch`, `FormData`, componentes standalone e signals.
- BFF gera **protocolo local** `MPT-XXXXXXXX`, encaminha multipart à API MPT, limita POST e usa Redis em produção.
- Upload em disco temporário, MIME allowlist, ClamAV INSTREAM e cleanup.
- Vitest/Angular test, Supertest, Playwright multi-browser com API **mockada**, axe-core.
- Swagger JSDoc + Redocly, ESLint e `npm audit` disponíveis nos manifests.

> Baseline é **datada**. Reexecute o pre-flight (ver [02-PRE-FLIGHT.md](02-PRE-FLIGHT.md)) antes de qualquer afirmação atual.

## Baseline dos relatórios (janela 21–31/07/2026)

| Dimensão | Valor relatado | Fonte |
| --- | --- | --- |
| Backend Vitest | 30/30 aprovados, ~1,79 s | RELATORIO_TESTES §1–2 |
| Frontend Vitest | 8/8 aprovados, ~15,89 s | RELATORIO_TESTES §3 |
| E2E Playwright + axe | 16/16 (4 projetos × 4 cenários) | RELATORIO_TESTES §4 |
| Bundle inicial bruto | 601,09 kB → 384,38 kB | RELATORIO_FINAL §10 |
| Transferência estimada | 85,26 kB | RELATORIO_FINAL §10 |
| `npm audit --omit=dev` frontend | 99 deps, 0 vulnerabilidades | RELATORIO_TESTES §5.2 |
| `npm audit --omit=dev` backend | 150 deps, 0 vulnerabilidades | RELATORIO_TESTES §5.2 |
| ESLint frontend/backend | 0 erros / 0 avisos | RELATORIO_TESTES §5.1 |
| Runtime CI relatado | Node 22.22.3, npm 11.11.0 (Volta) | RELATORIO_TESTES cabeçalho |
| SLOC | 4.917 SLOC em 67 arquivos | RELATORIO_ANALISE §2.4 |

## Drift conhecido (herdado, ainda aberto)

| ID | Evidência em conflito/lacuna | Estado | Ação recomendada |
| --- | --- | --- | --- |
| D-01 | AGENTS diz Multer em memória; código usa `diskStorage` | aberto | atualizar governança em tarefa própria |
| D-02 | AGENTS cita "sucesso simulado frontend"; código atual expõe falha | histórico obsoleto | retirar pitfall após decisão |
| D-03 | `planejamento.md` cita Angular 21.2/HttpClient; manifest usa 22/fetch | aberto | alinhar decisão e documentação |
| D-04 | Documentação sugere protocolo/aceite retornado pelo MPT; BFF gera protocolo | **alto** | decidir ownership e contrato oficial |
| D-05 | Development aceita indisponibilidade MPT e ClamAV | intencional ou dívida | rotular e impedir uso como evidência live |
| D-06 | E2E intercepta API e sobe só Angular | confirmado | nunca alegar integração BFF/live |
| D-07 | CI usa Node 22.22.3; manifest exige `^24.15`/`>=26` | aberto | alinhar CI/runtime |
| D-08 | CI frontend sem lint/E2E; backend só audit | aberto | definir gates de CI |
| D-09 | Redocly/Prettier sem scripts; `test` backend aceita ausência de testes | aberto | decidir comandos e thresholds |
| D-10 | `multer`/`opencode-ai` aparecem em manifesto frontend sem uso observado | investigar | confirmar e mover/remover em tarefa autorizada |
| D-11 | `server_log.txt` versionado apesar da regra contra logs | aberto | classificar necessidade e sanitizar/remover |
| D-12 | MCP Miro local/oficial sobrepostos; Playwright MCP fallback desabilitado | investigar | justificar superfície e fallback |

Este pacote **não corrige** nenhum desses itens. Eles são tratados como bloqueios ou pré-requisitos das fatias em [11-IMPLEMENTATION-PLAN.md](11-IMPLEMENTATION-PLAN.md).

## Saída do Passo 0

- ✅ Fontes com precedência declaradas.
- ✅ Baseline datada preservada.
- ✅ Drift catalogado sem alteração silenciosa.
- ⚠️ Limite: snapshot datado **não** prova runtime atual.
