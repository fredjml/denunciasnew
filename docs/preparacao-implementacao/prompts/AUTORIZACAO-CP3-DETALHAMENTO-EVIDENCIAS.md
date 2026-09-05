# Autorização de execução — CP-3 Detalhamento + Evidências

## Registro

- **Data:** 2026-09-05.
- **Owner:** Frederico José Monteiro Leite.
- **Checkpoint anterior:** CP-2, commits `df2a03c` + `cc9b5ac`.
- **Autorização vigente:** owner instruiu "pode seguir com os próximos passos" em sessão de chat
  (não um prompt formal pré-escrito como CP-1/CP-2). Este documento formaliza retroativamente o
  escopo executado, conforme exigido por `AGENTS.md` §2/§8 (todo checkpoint precisa de registro
  de autorização e evidência).
- **Contexto adicional do owner nesta sessão:** o frontend seguirá até produção acoplado a um
  **backend real construído por outra equipe** — reforça que `contract/openapi.yaml` é interface
  imutável (`R-DN-06`) e não pode ser alterado unilateralmente nesta sessão.
- **Proibido (herdado):** alterar `contract/openapi.yaml` fora de PR revisado, dados/PII reais,
  push, deploy, avanço ao CP-4 sem gate.

## Escopo executado

1. `T-CP3-01`: `StepDetalhamento` — nº de trabalhadores, modalidade, grupos vulneráveis (todos
   opcionais, defaults DEC-DN-13/14).
2. `T-CP3-03`: `StepEvidencias` (upload de evidências) — client-side.
3. `T-CP3-04`: validação MIME + magic bytes no `backend-mock` (endpoint de teste, fora do
   contrato).
4. `T-CP3-05`: rejeição de extensões executáveis (`.exe`, `.bat`, `.cmd`, `.sh`, `.ps1`).
5. `T-CP3-06`: mock de antivírus (assinatura EICAR), sem protocolo TCP/INSTREAM real.

## Escopo explicitamente NÃO executado nesta sessão

- **`T-CP3-02`** (contrato do payload): exigiria alterar `contract/openapi.yaml`. Bloqueado por
  `R-DN-06` — decisão do owner necessária sobre como coordenar essa mudança com a equipe do
  backend real antes de qualquer código tocar o contrato.
- **`T-CP3-07`** (subformulário de testemunhas): **BLOQUEADA** por `DEC-DN-16` (tratamento LGPD de
  dados de testemunha ainda não decidido).

## Fonte primária e decisões

- PDF externo, página 8 (detalhamento) e página 9 (evidências).
- `DN-RF-005..009`.
- Defaults aplicados: `DEC-DN-13` (nº trabalhadores opcional), `DEC-DN-14` (lista genérica de
  modalidade), `DEC-DN-15` (10 arquivos × 20 MiB).

## Gate CP-3 — emitido

- **Data:** 2026-09-05.
- **Estado:** `T-CP3-01,03,04,05,06` implementadas com evidência unit-front + integ-sim + e2e-mock.
  `T-CP3-02` e `T-CP3-07` permanecem pendentes de decisão do owner (ver acima).
- **Validações executadas:** `npm run lint` (0 erros), `npm test` (frontend 37/37, backend-mock
  13/13), `npm run build`, `npx playwright test` (10/10 e2e, incluindo axe-core no wizard
  completo até Evidências).
- **Simplificação registrada:** `T-CP3-06` mocka o ClamAV por assinatura de conteúdo (EICAR), não
  pelo protocolo TCP/INSTREAM real — suficiente para provar o comportamento de bloqueio, mas não
  testa a integração de rede com um ClamAV real.
- **Próximo passo:** aguardar decisão do owner sobre `T-CP3-02` (processo de PR de contrato com a
  equipe do backend) e `DEC-DN-16` (testemunhas) antes de fechar o CP-3 por completo ou avançar ao
  CP-4. Nenhum avanço ao CP-4 foi realizado.
