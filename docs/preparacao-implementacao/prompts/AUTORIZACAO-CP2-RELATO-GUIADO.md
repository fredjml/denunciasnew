# Autorização de execução — CP-2 Relato Guiado

## Registro

- **Data:** 2026-09-04.
- **Owner:** Frederico José Monteiro Leite.
- **Checkpoint anterior:** CP-1, commit `3111dce`.
- **Autorização vigente:** `CÓDIGO_FATIA CP-2`, tasks `T-CP2-01..09`.
- **Proibido:** STT real, dados/áudio reais, alteração do contrato OpenAPI, push, deploy e avanço ao CP-3.

## Escopo autorizado

1. `T-CP2-01`: checklist visual de irregularidades com taxonomia mock.
2. `T-CP2-02`: relato textual “do seu jeito”, com contador e sanitização segura.
3. `T-CP2-03`: `AudioRecorderService` sobre MediaRecorder.
4. `T-CP2-04`: gravador in-app acessível.
5. `T-CP2-05`: fallback textual quando o microfone for negado/indisponível.
6. `T-CP2-08`: fixtures de áudio exclusivamente sintéticas.
7. `T-CP2-06`: STT mock via MSW nos estados `CONCLUIDA`, `FALHA` e `TIMEOUT`.
8. `T-CP2-07`: preview de transcrição editável antes do envio.
9. `T-CP2-09`: consentimento explícito antes de habilitar áudio.

## Fonte primária e decisões

- PDF externo, página 7: texto ou áudio, transcrição automática e checklist visual de irregularidades.
- `DN-RF-003`, `DN-RF-004` e `DN-RS-002`.
- Taxonomia permanece mock até `DEC-DN-10`.
- STT permanece 100% mock no MVP conforme `DEC-DN-P-F5-6`; `DEC-DN-11` não autoriza provedor real.
- Consentimento específico permanece controle obrigatório para o protótipo, sem substituir revisão DPO/Legal.

## Prompt autorizado

```prompt
Projeto: Canal de Denúncias MPT — MVP standalone.
Workspace: F:\ProjetosMPT\denunciasnew.
Owner: Frederico José Monteiro Leite.
Autorização: CÓDIGO_FATIA CP-2, exclusivamente T-CP2-01..09.

Implemente o Relato Guiado por TDD estrito, nesta ordem:
1. checklist de irregularidades com taxonomia mock local;
2. textarea “do seu jeito”, contador e tratamento seguro;
3. AudioRecorderService e gravador acessível;
4. fallback textual para microfone negado/indisponível;
5. fixture de áudio sintética e script reprodutível;
6. STT mock MSW com CONCLUIDA, FALHA e TIMEOUT;
7. preview editável e status EDITADA_MANUALMENTE;
8. consentimento explícito antes de solicitar acesso ao microfone.

Regras:
- Reabra AGENTS.md, PDF pág. 7, requisitos, ameaças, decisões e plano.
- Escreva o teste focal antes da implementação de cada comportamento.
- Use somente SYN-*, @example.com e áudio gerado artificialmente.
- Não envie áudio, texto ou PII para rede/serviço externo.
- Não implemente classificador real nem prioridade client-side.
- Não altere contract/openapi.yaml ou frontend/src/app/api/generated.ts.
- Não faça push, deploy ou avance ao CP-3.

Valide:
- npm run lint
- npm test
- npm run build
- npm --prefix frontend run test:e2e
- git diff --check

Atualize plano e playbook apenas com evidência concluída. Emita gate CP-2 e pare antes do CP-3.
```

## Gate CP-2 — emitido

- **Data:** 2026-09-04.
- **Estado:** `T-CP2-01..09` implementadas com evidência unit-front (24/24 testes Vitest aprovados).
- **Validações executadas:** `npx eslint .` (0 erros), `npx ng test --watch=false` (24 passed),
  `npx ng build` (sem erros), `npx playwright test` (4 passed), `git diff --check` (sem avisos).
- **Desvio registrado:** `T-CP2-08` usa ruído branco sintético via Node puro em vez de TTS
  (`espeak-ng`/`edge-tts` indisponíveis no ambiente) — ver nota de implementação em
  `12-DECISIONS.delta-denunciasnew.md` (`DEC-DN-P-F5-4`).
- **Pendência não bloqueante:** evidência e2e-mock com `--use-fake-device-for-media-stream`
  (`SH-DN-04`) não foi capturada nesta rodada; cobertura atual é unit-front.
- **Próximo passo:** aguardar autorização do owner para `CP-3`. Nenhum avanço realizado.
