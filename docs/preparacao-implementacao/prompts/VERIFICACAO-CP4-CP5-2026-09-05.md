# Verificação CP-4 + CP-5 — Sigilo, Local, Revisão e Confirmação (sessão 2026-09-05)

> Auditoria da sessão que implementou o restante do MVP até o envio real da denúncia. Owner:
> Frederico José Monteiro Leite. Contexto reafirmado pelo owner: o frontend seguirá até produção
> acoplado a um **backend real construído por outra equipe** — `contract/openapi.yaml` é a
> interface imutável entre os dois (`R-DN-06`).

## 1. Escopo executado

### CP-4 — Sigilo + Local

| Item | Arquivo(s) | Evidência |
| --- | --- | --- |
| `StepSigiloAnonimato` (aviso AAA, radio anônimo/identificado, checkbox de confirmação obrigatório) | `frontend/src/app/steps/step-sigilo-anonimato/*`, `services/sigilo-state.service.ts` | 2 testes unit-front |
| `StepLocal` (UF/Município obrigatórios, empresa opcional) | `frontend/src/app/steps/step-local/*`, `services/local-state.service.ts` | 2 testes unit-front |
| Cliente de municípios com fallback local | `services/municipios-client.service.ts`, `assets/municipios-ibge-fallback.json` | 3 testes unit-front |

### CP-5 — Revisão + Confirmação (com envio real)

| Item | Arquivo(s) | Evidência |
| --- | --- | --- |
| `StepRevisao` (sumário editável, "Enviar Denúncia") | `frontend/src/app/steps/step-revisao/*` | 2 testes unit-front |
| `ComplaintSubmissionService` (monta payload no formato exato do contrato + envia multipart) | `services/complaint-submission.service.ts` | 4 testes unit-front |
| `StepConfirmacao` (protocolo real + infográfico acessível) | `frontend/src/app/steps/step-confirmacao/*` | 2 testes unit-front |
| Auto-save via `sessionStorage` (T-DN-18) | `shared/persisted-signal.ts` (novo helper, reaproveitado em Relato/Detalhamento/Sigilo/Local/passo atual) | 4 testes unit-front |
| Backend-mock `/api/denuncias` migrado de JSON para multipart (para bater com `contract/openapi.yaml`, que já documentava multipart mas nunca tinha sido implementado assim) | `backend-mock/src/routes/denuncias.js` | 5 testes integ-sim (não existia nenhum teste antes) |

## 2. Achado corrigido: contrato vs. implementação

`contract/openapi.yaml` já documentava `POST /api/denuncias` como `multipart/form-data` com um
campo `denuncia` (JSON) + até 3 anexos + áudio — mas o `backend-mock` só aceitava
`application/json` puro. Isso significa que, mesmo que o frontend fosse escrito certo, a
submissão real falharia contra o próprio mock. Corrigi o `backend-mock` para seguir o contrato
já existente (não alterei `contract/openapi.yaml` — só o mock passou a implementá-lo
corretamente). Isso é exatamente o tipo de mismatch que pode se repetir com o backend real da
outra equipe se o contrato não for tratado como fonte única de verdade nos dois lados.

## 3. Traduções de enum (estado interno da UI → contrato)

O estado interno usa códigos amigáveis para UI (`'6-20'`, `'presencial'`, `'IDOSOS'`). O
contrato exige enums específicos (`SEIS_A_VINTE`, `PRESENCIAL`, `IDOSO`). Criei um adaptador
único (`ComplaintSubmissionService.buildPayload()`) que faz essa tradução só no momento do
envio — a UI interna não muda, e qualquer ajuste futuro no contrato fica isolado num só lugar.

## 4. O que ficou de fora (documentado, não esquecido)

| Item | Motivo |
| --- | --- |
| `FATIA-DN-CP4-05` (`applyAnonimizationRules()` no BFF) | É lógica do **backend real**, que será construído pela outra equipe — não faz sentido implementar no `backend-mock` de teste. |
| Campo "CNPJ da Empresa" (aparece no mockup, tela "Onde o fato ocorreu?") | Não existe em `contract/openapi.yaml` (`Complaint` não tem campo CNPJ). Mesma categoria do achado da sessão anterior ("Nomes e Dados"): mockup à frente do contrato. Não implementado para não coletar dado que não tem para onde ir. |
| `FATIA-DN-CP5-07` (SLA no infográfico) | Bloqueada por `DEC-DN-20` (não decidida). Copy atual não promete prazo. |
| Persistência de arquivos de evidência entre reloads | Limitação de plataforma: `File`/`Blob` não são serializáveis em `sessionStorage`. Metadados de outros campos persistem; anexos precisam ser reanexados após um reload real. |
| `FATIA-DN-CP3-07` (testemunhas) | Continua bloqueada por `DEC-DN-16`, sem mudança nesta sessão. |

## 5. Evidência final (comandos executados e resultado)

| Comando | Resultado |
| --- | --- |
| `npm run lint` (raiz) | 0 erros |
| `npm test` (raiz) | frontend: 64/64 · backend-mock: 18/18 |
| `npm run build` | sem erros |
| `npx playwright test` (frontend) | 11/11, incluindo `fluxo-completo.spec.ts` (Acolhimento → Confirmação com protocolo real) e axe-core em todas as 8 telas |
| `git diff --check` | sem avisos |

## 6. Verificação visual real

Screenshots reais (Playwright, Pixel 5) de Sigilo, Local, Revisão e Confirmação conferidos
manualmente contra o PDF — cores, ícones, cards e fluxo do infográfico batem com o mockup.

## 7. Estado do projeto (MVP completo do fluxo principal)

**O wizard completo agora funciona de ponta a ponta**: Acolhimento → Relato Guiado →
Detalhamento → Evidências → Sigilo → Local → Revisão → Confirmação, com envio real ao
`backend-mock` e protocolo `SYN-*` retornado. CP-0 a CP-5 estão implementados (com as exceções
documentadas acima, todas por decisão consciente, não por lacuna técnica).

**CP-6 (Classificador + Alertas mock) não foi iniciado** — todas as suas fatias já estavam
`BLOQUEADA` no plano original.

## 8. Próximos passos

1. **Aguardando o logo oficial do MPT** (você mencionou que vai enviar em breve) — é uma troca
   simples em `frontend/src/app/app.html` (`<app-icon name="shield-lock">` → `<img>` com o SVG/PNG
   oficial).
2. **Decidir o processo de coordenação de contrato** com a equipe do backend real — necessário
   sempre que um campo do mockup não existir em `contract/openapi.yaml` (já aconteceu 2x: "Nomes
   e Dados" e "CNPJ da Empresa").
3. **`DEC-DN-16`** (LGPD de testemunhas) e **`DEC-DN-20`** (SLA do infográfico) — decisões do
   owner ainda pendentes.
4. Quando o backend real da outra equipe estiver disponível, trocar a `baseURL`/proxy do
   `frontend/proxy.conf.json` do `backend-mock` (porta 3001) para o endereço real, mantendo o
   mesmo contrato — nenhuma mudança de código do frontend deveria ser necessária além disso,
   já que a submissão já é construída estritamente no formato do `contract/openapi.yaml`.
5. Autorizar **CP-6** (classificador + alertas) ou **CP-a11y-piso/CP-mobile-perf** quando quiser
   seguir adiante — ambos dependem de decisões do owner que ainda não foram tomadas (ver plano).

## 9. Como testar agora, passo a passo

1. Na raiz do projeto:
   ```
   npm start
   ```
2. Abra `http://localhost:4200`.
3. Percorra o fluxo completo:
   - **Acolhimento** → "Denuncie" → Avançar.
   - **Relato Guiado** → marque uma irregularidade → Avançar.
   - **Detalhamento** → preencha ou pule (tudo opcional) → Avançar.
   - **Evidências** → anexe ou pule → Avançar.
   - **Sigilo** → escolha anônimo ou identificado → marque "Li e entendi" → Avançar.
   - **Local** → escolha um estado (ex.: SP) → escolha um município → "Revisar denúncia".
   - **Revisão** → confira o resumo, use "Editar" para voltar a qualquer etapa → "Enviar
     Denúncia".
   - **Confirmação** → deve aparecer um protocolo real no formato `SYN-XXXXXXXX` e o fluxo
     Recebimento → Triagem → Investigação. "Início" reinicia tudo.
4. Para testar o auto-save: no meio do preenchimento (ex.: na tela de Relato), recarregue a
   página (F5) — o texto digitado e a etapa atual devem ser restaurados.
5. Para rodar a suíte automatizada:
   ```
   npm run lint
   npm test
   npm run build
   npm --prefix frontend run test:e2e
   ```
