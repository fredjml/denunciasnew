# 01-IMPLEMENTATION-SUMMARY — Passo 5 (Implementar)

> Template livre (o kit não define um template fixo para o Passo 5 além de "mudança pequena,
> reversível e testada" por fatia — ver `licoesaprendidas/README.md` §Passo 5). Este documento
> consolida o que cada fatia entregou, na ordem em que foi implementada.

## Ponto de partida

O workspace tinha trabalho de uma sessão anterior (Codex) para `CP-2` com a árvore de build
quebrada (erro de tipo em `audio-recorder.service.ts`), o que teria impedido qualquer validação
(`lint`/`test`/`build`) exigida pelo prompt de autorização vigente. A sessão retomou daí.

## Checkpoints implementados

| Checkpoint | Commit(s) | O que entrega | Fatias `FATIA-DN-*` |
| --- | --- | --- | --- |
| CP-0 (herdado) | `addbd7b` | Gates de qualidade/segurança, CI, `pino-noir` | CP0-01..06 |
| CP-1 (herdado) | `3111dce` | Tela de Acolhimento acessível | CP1-01,02,04 |
| CP-2 | `df2a03c`, `cc9b5ac` | Relato Guiado: checklist, texto/áudio, STT mock, consentimento; correção de build + rota `/api/stt` real + proxy de dev | CP2-01..09 |
| CP-3 | `d8421aa` | Detalhamento + Evidências (subconjunto seguro: sem tocar contrato, sem coleta de PII de testemunha) | CP3-01,03,04,05,06 |
| Visual | `a84e439` | Identidade visual MPT (header, abas, ícones, cards) aplicada às 4 telas já existentes | — (gap de escopo identificado e fechado) |
| CP-4 + CP-5 | `ff3db92` | Sigilo/Anonimato, Local, Revisão, Confirmação — **wizard completo de ponta a ponta com envio real** | CP4-01..04,06..08; CP5-01..06 |
| Logo + DEC-DN-16 | `03a7da1` | Logo oficial no header; pergunta "há testemunhas?" sim/não | CP3-07 |
| Segurança | `58b5c57` | Correção de bypass de validação de upload em `/api/denuncias` + 10 refatorações de manutenibilidade | — |
| Documentação | `c24f910` | Registro da confirmação formal do `/security-review` | — |

## Decisões do owner tomadas durante a implementação

Todas registradas em `docs/preparacao-implementacao/12-DECISIONS.delta-denunciasnew.md`:

- **`DEC-DN-P-F5-4`** (nota de implementação): fixture de áudio como ruído branco sintético via
  Node puro, não TTS (`espeak-ng` indisponível no ambiente).
- **`DEC-DN-16`**: só "há testemunhas? sim/não", sem nome/contato coletado no formulário público.
- **`DEC-DN-20`**: tela de confirmação não promete prazo/SLA.
- **`DEC-DN-26`** (nova): processo de PR revisado pelas duas equipes para mudanças em
  `contract/openapi.yaml` — princípio fechado, detalhe operacional pendente.

## Desvios conscientes do mockup visual (e por quê)

Documentados em `docs/preparacao-implementacao/prompts/VERIFICACAO-VISUAL-2026-09-05.md`:

1. Campo livre "Nomes e Dados" (tela de Detalhamento no mockup) — **omitido**: colidia com
   `DEC-DN-16` antes de ela ser decidida, e continua fora do formulário mesmo após a decisão
   (que fechou para sim/não, não para coleta de nome).
2. Campo "CNPJ da Empresa" (tela de Local no mockup) — **omitido**: não existe em
   `contract/openapi.yaml`; coletar um dado que não tem para onde ir seria enganoso.
3. "Grupos vulneráveis" — **realocado** de Detalhamento (onde o plano original previa) para
   Evidências (onde o mockup do PDF realmente mostra), por fidelidade à fonte primária.

## Regra de contrato observada

Nenhum commit desta sessão alterou `contract/openapi.yaml`. Onde o mockup ou o plano pediam um
campo ausente do contrato, a fatia foi implementada sem esse campo (ver acima) — nunca inventando
uma extensão de contrato unilateral (`R-DN-06`).
