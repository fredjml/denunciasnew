# Verificação CP-3 — Detalhamento + Evidências (sessão 2026-09-05)

> Relatório de auditoria da sessão que implementou o subconjunto seguro do CP-3, a partir do
> ponto onde o CP-2 fechou (`cc9b5ac`). Owner: Frederico José Monteiro Leite.

## 1. Contexto e decisão de escopo

O owner pediu para seguir com os próximos passos e informou que o frontend será acoplado, em
produção, a um **backend construído por outra equipe**. Isso torna `contract/openapi.yaml` uma
interface ainda mais sensível: qualquer mudança precisa de coordenação externa, não apenas
revisão interna. Por isso, o CP-3 foi dividido em dois grupos:

- **Executado nesta sessão**: fatias que não tocam o contrato compartilhado.
- **Não executado**: `T-CP3-02` (contrato) e `T-CP3-07` (bloqueada por `DEC-DN-16`).

Detalhes completos da autorização em
[`AUTORIZACAO-CP3-DETALHAMENTO-EVIDENCIAS.md`](AUTORIZACAO-CP3-DETALHAMENTO-EVIDENCIAS.md).

## 2. O que foi implementado

| # | Item | Arquivo(s) principais | Evidência |
| --- | --- | --- | --- |
| 1 | `StepDetalhamento` (nº trabalhadores, modalidade, grupos vulneráveis) | `frontend/src/app/steps/step-detalhamento/*`, `services/detalhamento-state.service.ts` | 3 testes unit-front |
| 2 | `StepEvidencias` (upload cliente) | `frontend/src/app/steps/step-evidencias/*`, `services/evidencias-state.service.ts` | 5 testes unit-front + 3 e2e |
| 3 | Wiring de navegação Relato → Detalhamento → Evidências | `frontend/src/app/app.ts`, `app.html`, `step-relato-guiado.ts/html` (novo `output advance`) | e2e |
| 4 | Validação MIME + magic bytes (backend) | `backend-mock/src/middleware/upload.js`, `src/services/magic-bytes.js` | 6 testes integ-sim |
| 5 | Rejeição de extensões executáveis | mesmo middleware | incluído nos 6 testes acima |
| 6 | Mock de antivírus (assinatura EICAR) | `backend-mock/src/services/clamav-mock.js` | incluído nos 6 testes acima |
| 7 | Endpoint de teste `POST /api/evidencias` | `backend-mock/src/routes/evidencias.js`, `src/index.js` | idem |
| 8 | Cobertura de acessibilidade estendida ao wizard completo | `frontend/e2e/accessibility.spec.ts` | novo teste axe-core (Acolhimento → Relato → Detalhamento) |

**Nota sobre `/api/evidencias`:** é um endpoint só do `backend-mock`, criado para exercitar a
validação de upload — **não faz parte de `contract/openapi.yaml`**. Quando a integração real com
o backend de outra equipe for definida, o formato desse endpoint pode mudar; ele existe apenas
como evidência de que a lógica de validação (MIME/magic-bytes/antivírus) funciona.

## 3. O que foi deliberadamente NÃO implementado

| Item | Motivo | Quem decide o próximo passo |
| --- | --- | --- |
| `T-CP3-02` — novos campos no contrato do payload | Exige alterar `contract/openapi.yaml`, interface imutável compartilhada com o backend real de outra equipe (`R-DN-06`) | Owner — decidir processo de PR de contrato coordenado |
| `T-CP3-07` — subformulário de testemunhas | Bloqueada por `DEC-DN-16` (tratamento LGPD de dados de testemunha ainda não definido) | Owner + DPO + Jurídico |

## 4. Evidência final (comandos executados e resultado)

| Comando | Resultado |
| --- | --- |
| `npm run lint` (raiz) | 0 erros |
| `npm test` (raiz) | frontend: 37/37 · backend-mock: 13/13 |
| `npm run build` | sem erros |
| `npx playwright test` (frontend) | 10/10 (inclui novo axe-core do wizard completo) |
| `git diff --check` | sem avisos |

## 5. Estado do checkpoint

**CP-3 — Detalhamento + Evidências: gate parcial emitido.** 5 de 7 fatias implementadas com
evidência; 2 permanecem pendentes de decisão do owner (contrato + LGPD testemunhas), não por
falha técnica.

**Nenhum avanço ao CP-4 foi realizado.**

## 6. Próximos passos (após esta execução)

1. **Decidir o processo de coordenação de contrato** com a equipe do backend real para viabilizar
   `T-CP3-02` (campos `numero_prejudicados`, `modalidade_trabalho`, `grupos_vulneraveis` no
   payload). Sugestão: abrir esse PR em conjunto com a outra equipe assim que houver um repositório
   ou processo compartilhado definido.
2. **Decidir `DEC-DN-16`** (LGPD de testemunhas) para desbloquear `T-CP3-07`.
3. **Autorizar CP-4 — Sigilo + Local** (`DN-RG-005`, `DN-RF-010..012`) quando pronto. Duas fatias
   desse checkpoint já estão marcadas `BLOQUEADA` no plano (`FATIA-DN-CP4-05` depende de
   `pino-noir`/CP0-06, que já existe; revisar ao autorizar).
4. Nenhuma pendência técnica bloqueante ficou aberta no que foi implementado do CP-3.

## 7. Como testar agora, passo a passo

1. Na raiz do projeto:
   ```
   npm start
   ```
2. Abra `http://localhost:4200`.
3. **Acolhimento** → escolha "Denuncie" → "Avançar".
4. **Relato Guiado** → marque uma irregularidade (obrigatório) → "Avançar" (agora navega de
   verdade para a próxima tela).
5. **Detalhamento** (nova tela): preencha ou deixe em branco nº de trabalhadores, modalidade e
   grupos vulneráveis (tudo opcional) → "Avançar".
6. **Evidências** (nova tela): arraste/selecione um PDF, JPG ou PNG — aparece na lista com botão
   "Remover". Tente anexar um `.exe` ou um arquivo maior que 20 MB para ver a mensagem de erro em
   linguagem simples.
7. Para rodar a suíte automatizada:
   ```
   npm run lint
   npm test
   npm run build
   npm --prefix frontend run test:e2e
   ```
