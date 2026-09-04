# IMPLEMENTATION PLAN — Canal de Denúncias

Template base: [`templates/implementation.md`](../licoesaprendidas/templates/implementation.md).
> Este plano **não autoriza** implementação. Cada fatia exige owner + autorização just-in-time por [`docs/licoesaprendidas/05-processo-correcoes.md`](../licoesaprendidas/05-processo-correcoes.md) e [`06-gates-qa-testes-seguranca.md`](../licoesaprendidas/06-gates-qa-testes-seguranca.md).

## Objetivo/requisitos

Fechar os P0/P1 abertos em `docs/Analises/` como fatias verticais reversíveis, cada uma com aceite, teste focal, gates ampliados e rollback, encaixando os requisitos catalogados em [06-REQUIREMENTS.md](06-REQUIREMENTS.md).

## Estratégia e alternativas

- **Fatia vertical por requisito**: uma fatia atende UM requisito ponta-a-ponta (modelo → validação → payload → teste → doc) para reduzir risco de regressão.
- **Prioridade por severidade + dependência**: bloqueadores LGPD/Segurança primeiro; regressão/CI antes de qualquer alegação de qualidade; UX/A11Y em seguida; contrato MPT depois de decisão material (D-04).
- **Alternativa descartada**: "grande PR de correções". Motivo: aumenta superfície de review, mistura findings, dificulta rollback e viola R-INC-01 do kit.
- **Alternativa condicional**: acelerar RG-01 (CI) para dar sinal automático **antes** das fatias de código. Recomendado.

## Fatias

Legenda de estado: `planejada`, `aguardando autorização`, `em andamento`, `bloqueada`, `concluída`.

### Bloco A — Habilitar sinal automático (pré-fatias)

| ID | Requisito | Arquivos | Mudança mínima | Teste focal | Gate | Rollback | Estado |
| --- | --- | --- | --- | --- | --- | --- | --- |
| A1 | RG-03 (D-07) | `.github/workflows/*.yml` | Alinhar Node do CI ao `engines` do manifest | rodar `npm ci` no CI com Node novo | Gate 0 revalidado | reverter workflow | planejada |
| A2 | RG-01 | `.github/workflows/*.yml`, scripts | Adicionar jobs de lint + Vitest (2×) + Playwright + `npm audit --omit=dev` | CI verde em execução limpa | Gate 6 (CI) | reverter workflow | planejada |
| A3 | RG-02 | `cidadania-canal-denuncias/e2e/ui-audit.spec.ts` | Adicionar assertiva `expect(report.criticalFindings).toEqual([])` | rodar spec, ver falha em cenário sintético | Gate 4 | reverter spec | planejada |
| A4 | RG-04 (D-09) | manifests + workflow | Adicionar scripts `redocly lint` e `prettier --check` | rodar CI | Gate 4 | reverter script | planejada |

### Bloco B — LGPD e privacidade (P0 bloqueadores)

| ID | Requisito | Arquivos | Mudança mínima | Teste focal | Gate | Rollback | Estado |
| --- | --- | --- | --- | --- | --- | --- | --- |
| B1 | RF-14 / T-DEN-01 (frontend) | `frontend/src/app/services/complaint.service.ts`, `models/complaint.model.ts` | Zerar PII quando `anonimo=true`; expor payload sanitizado | unit-front (Vitest): 2 casos (limpo + com PII) | Gate 4 + Gate 6 | reverter arquivos | bloqueada por owner DPO |
| B2 | RF-14 / T-DEN-01 (backend) | `server/services/complaint.service.js`, `server/controllers/complaint.controller.js` | Rejeitar payload com PII quando `anonimo=true` (defesa em profundidade) | unit-back + integ-sim: 3 casos | Gate 4 + Gate 6 | reverter arquivos | bloqueada por owner DPO |
| B3 | RP-01 / T-DEN-14 | `frontend/src/app/components/step-revisao/*`, política linkada | Checkbox obrigatório + link | unit-front + E2E-mock cenário 5 | Gate 4 | reverter componente | bloqueada por owner DPO |
| B4 | RS-07 / T-DEN-10 | `server/services/complaint.service.js` | Sanitizar `relato_texto`, `nomes_dados`, `funcoes_setores` | unit-back: 4 casos (HTML, script, unicode, normal) | Gate 4 + Gate 6 | reverter service | bloqueada por owner Segurança |

### Bloco C — Segurança de upload e perímetro (P0/P1)

| ID | Requisito | Arquivos | Mudança mínima | Teste focal | Gate | Rollback | Estado |
| --- | --- | --- | --- | --- | --- | --- | --- |
| C1 | RS-01 / T-DEN-03 | `server/services/complaint.service.js` | `crypto.randomUUID()` para protocolo | unit-back: 2 casos (formato + entropia) | Gate 4 + Gate 6 | reverter serviço | planejada |
| C2 | RS-02 / T-DEN-04 | `server/middleware/upload.js`, `server/routes/complaint.routes.js` | `upload.fields([{name:'arquivo',maxCount:10},{name:'arquivo_audio',maxCount:1}])` | integ-sim: 3 casos (arquivo, arquivo_audio, campo desconhecido) | Gate 4 + Gate 6 | reverter middleware | planejada |
| C3 | RS-03 / T-DEN-05 | `server/middleware/upload.js`, novo cliente `file-type` | Validar magic bytes; rejeitar divergência | integ-sim: 3 casos (match, mismatch, corrompido) | Gate 4 + Gate 6 | reverter middleware | planejada |
| C4 | RS-04 / T-DEN-06 | `server/index.js` (Helmet) | CSP restritiva com nonce/hash | integ-sim + E2E-mock (header inspecionado) | Gate 4 + Gate 6 | reverter config | planejada |
| C5 | RS-05 / T-DEN-07 | `server/clients/mpt-api.client.js`, factory | Injeção de configuração | unit-back: 2 casos (fábrica com fake + real) | Gate 4 | reverter cliente | planejada |
| C6 | RS-06 / T-DEN-08 | `server/routes/complaint.routes.js` | Rate limit permissivo em `/api/denuncias/info` | integ-sim: 429 após N req | Gate 4 | reverter rota | planejada |
| C7 | RS-08 / T-DEN-09 | `server/index.js` (handler 404) | Ocultar `originalUrl` em prod | integ-sim: body sem path | Gate 4 | reverter handler | planejada |
| C8 | RS-09 / T-DEN-16 | novo middleware, `mpt-api.client.js`, logger | `X-Request-ID` gerado/propagado; log correlacionado | unit-back + integ-sim | Gate 4 + Gate 6 | reverter middleware | planejada |

### Bloco D — Robustez do wizard (P0/P1 UX)

| ID | Requisito | Arquivos | Mudança mínima | Teste focal | Gate | Rollback | Estado |
| --- | --- | --- | --- | --- | --- | --- | --- |
| D1 | RF-13 / T-DEN-12 | steps + `complaint.service.ts` | Validação por etapa + botão desabilitado + `aria-live` | unit-front + E2E-mock cenário 2 | Gate 4 | reverter componentes | planejada |
| D2 | RF-15 / T-DEN-02 | `complaint-api.client.ts`, `step-evidencias` | Enviar áudio como `arquivo_audio` multipart | unit-front + integ-sim | Gate 4 + Gate 6 | reverter arquivos | planejada |
| D3 | RF-16 / T-DEN-17 | `complaint.service.ts` | `sessionStorage` por etapa; limpar em sucesso/desistência | unit-front + E2E-mock cenário 6 | Gate 4 | reverter serviço | planejada |
| D4 | RF-17 / T-DEN-11 | `complaint-api.client.ts` | `AbortController` (30 s) + `navigator.onLine` | unit-front + E2E-mock cenário 3 | Gate 4 | reverter cliente | planejada |
| D5 | QA-06 | componentes de cards/botões | Remover ou implementar ação para botões/cards inertes | unit-front + E2E-mock cenário 7 | Gate 4 | reverter componentes | planejada |

### Bloco E — Acessibilidade WCAG 2.2 AA

| ID | Requisito | Arquivos | Mudança mínima | Teste focal | Gate | Rollback | Estado |
| --- | --- | --- | --- | --- | --- | --- | --- |
| E1 | RA-01 (labels/descritores) | steps + `styles.css` | `<label for>`, `aria-describedby`, foco visível global | axe + unit-front | Gate 4 + Gate 6 | reverter templates | planejada |
| E2 | RA-01 (foco/anúncio) | `complaint.service.ts` + steps | Foco no `h1` da etapa + `aria-live="polite"` para transições/erros | E2E-mock + UI-manual | Gate 4 + Gate 6 | reverter arquivos | planejada |
| E3 | RA-01 (stepper) | componente stepper | Restringir navegação a etapas já validadas | unit-front + E2E-mock | Gate 4 | reverter componente | planejada |

### Bloco F — Decisão material e contrato MPT (bloqueadora)

| ID | Requisito | Arquivos | Mudança mínima | Teste focal | Gate | Rollback | Estado |
| --- | --- | --- | --- | --- | --- | --- | --- |
| F1 | A-01 (D-04) | [12-DECISIONS.md](12-DECISIONS.md), Swagger, `services/complaint.service.js` | Registrar decisão sobre ownership do protocolo (BFF vs MPT) | reexecutar Gate 1 | Gate 1 | reverter decisão + comunicado | **aguardando owner Integração MPT** |
| F2 | RF-06 / RF-07 pós-decisão | cliente MPT + service + testes | Alinhar código à decisão F1 | unit-back + integ-sim + live-MPT autorizado | Gate 4 + Gate 6 + Gate 7 | reverter arquivos | dependente de F1 |
| F3 | RNF-REL-01 (D-05) | config por ambiente | Rotular fail-open dev, aplicar fail-closed prod | integ-sim + live-BFF | Gate 4 + Gate 6 | reverter config | dependente de decisão Segurança |

### Bloco G — Regressão e limpeza

| ID | Requisito | Arquivos | Mudança mínima | Teste focal | Gate | Rollback | Estado |
| --- | --- | --- | --- | --- | --- | --- | --- |
| G1 | D-10 | `cidadania-canal-denuncias/package.json` | Investigar e mover/remover `multer` e `opencode-ai` do frontend | `npm run lint`, build, testes | Gate 4 | reverter manifest | planejada |
| G2 | D-11 | `cidadania-canal-denuncias/server_log.txt` (raiz do repo, se presente) | Classificar necessidade + sanitizar/remover com autorização | grep no CI | Gate 6 | reverter deleção | **precisa de autorização específica** |
| G3 | D-01/D-02 | AGENTS.md do projeto (raiz + frontend) | Atualizar governança após correções | review adversarial | Gate 5 | reverter doc | planejada — pós B/C/D |

## Sequência recomendada

```
A1 → A2 → A3 → A4                      (habilitar sinal automático)
       │
       ├─▶ B1 + B2 + B3 + B4           (LGPD)
       │
       ├─▶ C1 + C2 + C3 + C4 + C5 + C6 + C7 + C8   (segurança de upload/perímetro/observabilidade)
       │
       ├─▶ D1 + D2 + D3 + D4 + D5     (UX robusto)
       │
       ├─▶ E1 + E2 + E3               (a11y)
       │
       ├─▶ F1 → F2 → F3               (decisão material MPT + rótulos de ambiente)
       │
       └─▶ G1 + G2 + G3               (limpeza e governança)
```

## Dependências, owners e autorizações

| Ação | Owner | Momento | Autorização |
| --- | --- | --- | --- |
| Mudar workflows CI (Bloco A) | Infra + Dev | antes das demais fatias | Infra |
| Alterar código do frontend (B1, B3, D*, E*) | Frontend + QA + DPO (B1/B3) | por fatia | Produto + DPO (quando LGPD) |
| Alterar código do backend (B2, B4, C*) | Backend + Segurança | por fatia | Segurança |
| Live-BFF com EICAR / Redis / MPT | Infra + Segurança | por rodada de teste | Owner do ambiente |
| Live-MPT (autorizado) | Integração MPT | pós-F1 | Integração MPT + Segurança |
| Instalar `file-type` (RS-03) | Dev | fatia C3 | Segurança (SCA) |
| Alterar `AGENTS.md` (G3) | Dev + Produto | pós-correções | Produto |
| Commit/push/PR | Owner do repo | por fatia | Repo owner |

## Evidence plan

Ver [10-EVIDENCE-MANIFEST.md](10-EVIDENCE-MANIFEST.md). Para cada fatia:

- salvar log de teste + versão do commit;
- para UI, screenshot sanitizado da tela relevante;
- para segurança, resultado do teste com fixture sintética;
- para CI, badge + workflow run;
- para live, log com PII/segredo redigido.

## Checkpoints/decisões

| Checkpoint | Critério | Owner |
| --- | --- | --- |
| CP-0 | Bloco A concluído; CI verde para lint + Vitest 2× + Playwright + audit | Infra + Dev |
| CP-1 | Blocos B e C P0 concluídos (B1/B2/B3/B4/C1/C2/C3) | DPO + Segurança + Backend + Frontend |
| CP-2 | Bloco D concluído; UX robusto | Frontend + QA |
| CP-3 | Bloco E concluído; axe crítico = 0 + smoke manual | A11Y + QA |
| CP-4 | Decisão F1 registrada em [12-DECISIONS.md](12-DECISIONS.md) | Integração MPT + Segurança + Produto |
| CP-5 | F2/F3 concluídos com evidência live autorizada | Integração MPT + Infra |
| CP-6 | G3 atualiza `AGENTS.md` conforme correções aceitas | Produto + Dev |

## Fora de escopo desta rodada

- Autenticação do cidadão (E-01).
- Painel admin (E-02).
- Acompanhamento pós-envio (E-03).
- Testes de carga (k6) — depende de decisão de Infra.
- DAST — depende de aprovação de Segurança.
- Substituição de `fetch` por `HttpClient` (drift D-03) — decisão arquitetural pendente.

## Critério de parada

Interromper qualquer fatia quando:

- Faltar autorização ou owner competente.
- Dado real puder ser afetado.
- Requisito crítico entrar em conflito (usar [10-escalonamento.md](../licoesaprendidas/10-escalonamento.md)).
- Próxima ação expandir escopo (violando R-SCOPE-01).
- Duas tentativas repetirem o mesmo erro sem nova hipótese (R-LOOP-01).

## Limitações

- Este plano é **preparatório**. Nenhuma fatia é executada apenas por constar aqui.
- Bloco F depende de decisão humana; **não** deve ser executado por IA sem owner.
- Fatias B/C dependem de owners externos (DPO/Segurança) para prosseguir.
