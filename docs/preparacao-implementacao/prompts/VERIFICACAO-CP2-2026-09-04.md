# Verificação CP-2 — Relato Guiado (sessão 2026-09-04)

> Relatório de verificação da sessão que continuou o trabalho não commitado do Codex para o
> CP-2 e fechou o gate. Owner: Frederico José Monteiro Leite. Autorização: `AUTORIZACAO-CP2-RELATO-GUIADO.md`.

## 1. Ponto de partida

O workspace tinha trabalho não commitado do Codex para `T-CP2-01..09` com a árvore quebrada:
`ng build` falhava (erro de tipo em `audio-recorder.service.ts`), o que teria impedido qualquer
validação (`lint`/`test`/`build`) exigida pelo prompt de autorização vigente.

## 2. O que foi corrigido/completado nesta sessão

| # | Item | Arquivo(s) | Motivo |
| --- | --- | --- | --- |
| 1 | Build quebrado | `frontend/src/app/services/audio-recorder.service.ts` | fábrica retornava `MediaRecorder` nativo tipado como `RecorderPort` (interface estreita p/ mocks) — incompatível por variância. Corrigido com adaptador `adaptNativeRecorder`. |
| 2 | Teste com off-by-one | `frontend/src/app/steps/step-relato-guiado/step-relato-guiado.spec.ts` | asserção esperava `'24'`, string de teste tem 23 caracteres; componente já estava correto. |
| 3 | Lint (`no-control-regex`) | `frontend/src/app/services/relato-state.service.ts` | sanitização de caracteres de controle é o caso de uso legítimo da regra; adicionado `eslint-disable` justificado. |
| 4 | Fixture de áudio ausente (`T-CP2-08`) | `frontend/scripts/generate-audio-fixtures.mjs`, `frontend/src/test/fixtures/audio/sample-syn.wav`, `fixtures.spec.ts` | script Node puro gera WAV de ruído branco determinístico (sem instalar `espeak-ng`/`edge-tts`, indisponíveis no ambiente — decisão do owner nesta sessão). |
| 5 | Gap de cobertura no gravador | `frontend/src/app/steps/step-relato-guiado/audio-recorder.spec.ts` | `AudioRecorderComponent` não tinha spec própria; T-CP2-04/05 ficavam sem evidência direta. |
| 6 | Evidência e2e real de gravação (`SH-DN-04`) | `frontend/e2e/relato-guiado.spec.ts`, `frontend/playwright.config.ts` | fecha a lacuna deixada como pendência no fim da sessão anterior; usa `--use-fake-device-for-media-stream` + `context.grantPermissions`/`addInitScript` para o caminho feliz e o caminho de negação de microfone. |
| 7 | `/api/stt` inexistente no backend real | `backend-mock/src/routes/stt.js`, `backend-mock/src/index.js`, `backend-mock/test/stt.spec.mjs` | o MSW só mockava a camada de teste unitário; ao rodar a aplicação de verdade (`npm start`) ou o e2e, a transcrição sempre falhava (`FALHA`) por falta de rota real. Nova rota replica os 3 cenários do mock de teste. |
| 8 | Proxy do dev-server ausente | `frontend/proxy.conf.json`, `frontend/angular.json` | `ng serve` nunca encaminhava `/api/*` ao `backend-mock`; nenhuma chamada de API funcionava fora dos testes (gap pré-existente, não limitado ao CP-2). |
| 9 | `webServer` do Playwright só subia o frontend | `frontend/playwright.config.ts` | e2e rodava sem o `backend-mock` no ar; agora usa `npm --prefix .. run dev` (sobe os dois). |
| 10 | Host ambíguo (IPv6 vs IPv4) | `package.json` (raiz) | `ng serve` sem `--host` explícito bindava só em `::1`, quebrando checagem de saúde do Playwright em `127.0.0.1`. |
| 11 | Lint do backend-mock quebrando em testes novos | `backend-mock/eslint.config.mjs` | `test/**/*.mjs` não herdava globals Node (`Buffer`); gap pré-existente exposto pelo novo teste de `stt.spec.mjs`. |

## 3. Evidência final (comandos executados e resultado)

| Comando | Resultado |
| --- | --- |
| `npm run lint` (raiz — frontend + backend-mock) | 0 erros |
| `npm test` (raiz) | frontend: 24/24 · backend-mock: 7/7 |
| `npm run build` | sem erros |
| `npx playwright test` (frontend) | 6/6 (`acolhimento` 3, `accessibility` 1, `relato-guiado` 2 novos) |
| `git diff --check` | sem avisos |

## 4. Desvios/decisões registrados para o owner revisar

- **`DEC-DN-P-F5-4`** (fixture de áudio): decisão original do owner era TTS local
  (`espeak-ng`/`edge-tts`). Ambiente de execução não tinha essas ferramentas e instalá-las exige
  autorização just-in-time (`AGENTS.md` §6). Nesta sessão, usei **ruído branco sintético via Node
  puro** como substituto interino (nota registrada em `12-DECISIONS.delta-denunciasnew.md`). A
  decisão original permanece vigente; revisar antes de qualquer evidência que dependa de fala
  inteligível.

## 5. Estado do checkpoint

**CP-2 — Relato Guiado: gate emitido.** Todas as `T-CP2-01..09` implementadas com evidência
unit-front + e2e-mock. Detalhes completos em
[`AUTORIZACAO-CP2-RELATO-GUIADO.md`](AUTORIZACAO-CP2-RELATO-GUIADO.md) (seção "Gate CP-2 — emitido").

Commit: `df2a03c` (`feat(cp2): implement Relato Guiado with mock STT and consent gate`) +
correções desta rodada (build/e2e/backend, commit seguinte).

**Nenhum avanço ao CP-3 foi realizado.** Autorização formal de CP-3 (`AUTORIZACAO-CP3-*.md`,
seguindo o mesmo formato do CP-1/CP-2) ainda não existe e é pré-requisito antes de qualquer
código novo, conforme `AGENTS.md` §8 (autoridade final do owner, checkpoint por checkpoint).

## 6. Próximos passos (após esta execução)

1. **Autorizar CP-3 — Detalhamento + Evidências** (`DN-RF-005..009`): eu preciso que você confirme
   o escopo antes de codar, porque duas fatias do CP-3 já são bloqueadas/sensíveis:
   - `FATIA-DN-CP3-02` toca `models/complaint.model.ts` **e** o contrato Swagger — `AGENTS.md`
     (`R-DN-06`) proíbe alterar `contract/openapi.yaml` fora de PR revisado; preciso saber se essa
     fatia fica só no lado frontend/mock ou se você quer abrir PR de contrato separado.
   - `FATIA-DN-CP3-07` (subformulário de testemunhas) está **BLOQUEADA** por `DEC-DN-16` (LGPD) —
     continua fora de escopo até essa decisão existir.
2. Revisar a nota de implementação de `DEC-DN-P-F5-4` (ruído branco vs TTS local) e decidir se
   vale a pena autorizar a instalação de `espeak-ng` num ambiente futuro.
3. Nenhuma pendência técnica bloqueante ficou aberta no CP-2.

## 7. Como testar agora, passo a passo

Pré-requisito único: `npm run install:all` já executado (ou `npm install` em cada pasta).

1. Na raiz do projeto, rode:
   ```
   npm start
   ```
   Isso sobe **os dois serviços juntos**: `backend-mock` (porta 3001) e o Angular dev-server
   (porta 4200, com proxy de `/api/*` e `/health` para o backend-mock).
2. Abra `http://localhost:4200` no navegador.
3. **Tela de Acolhimento**: escolha "Denuncie" ou "Faz parte de um órgão público...", clique
   "Avançar".
4. **Tela de Relato Guiado**:
   - Marque ao menos uma irregularidade no checklist (necessário para o botão final habilitar).
   - Digite algo na textarea "Descreva os fatos do seu jeito" — o contador de caracteres deve
     atualizar em tempo real.
   - Clique em "Usar áudio" → aparece o diálogo de consentimento (LGPD) → clique "Concordar e
     habilitar áudio" (ou "Continuar por texto" para recusar).
   - Se aceitar: aparecem os botões "Iniciar gravação"/"Parar gravação". Ao gravar e parar, o
     navegador vai pedir permissão de microfone (real, seu microfone físico) — depois de
     conceder, uma seção "Revise a transcrição antes de continuar" aparece com texto mock
     editável (`SYN-TRANSCRICAO: ...`).
   - Se negar a permissão de microfone no navegador, aparece a mensagem de fallback "O microfone
     não foi autorizado. O campo de texto continua disponível."
5. Para rodar a suíte automatizada em vez de testar manualmente:
   ```
   npm run lint
   npm test
   npm run build
   npm --prefix frontend run test:e2e
   ```
   Todos devem terminar sem erro (ver seção 3 acima para os números esperados).
