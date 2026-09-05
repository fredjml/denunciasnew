# Verificação — Review QA/Padrões/Testes/Segurança e correções (sessão 2026-09-05)

> Owner: Frederico José Monteiro Leite. Executado com o framework de review descrito em
> [`FRAMEWORK-REVIEW.md`](FRAMEWORK-REVIEW.md) — 8 ângulos de `/code-review` (nível `high`, alvo
> `origin/main`) + pipeline de 3 fases do `/security-review`.

## 1. Achado de segurança (HIGH) — corrigido

**A rota real de envio (`POST /api/denuncias`) aceitava anexos sem nenhuma validação de
conteúdo.** `/api/evidencias` (rota de teste, nunca chamada pelo frontend) tinha checagem de
extensão bloqueada + MIME allowlist + magic-bytes + antivírus mock — mas
`ComplaintSubmissionService.enviar()` (o caminho realmente usado) envia `arquivo_1..3` e
`arquivo_audio` direto para `/api/denuncias`, que usava um `multer` próprio sem `fileFilter`.
Um arquivo `malware.exe` renomeado para `foto.jpg` com `Content-Type: image/jpeg` era aceito e
retornava 201.

**Correção:** `denuncias.js` agora usa o mesmo middleware (`middleware/upload.js`, com
`fileFilter` de extensão/MIME) e o mesmo validador de conteúdo
(`services/attachment-validation.js`, novo — magic-bytes + antivírus mock) que `/api/evidencias`.
Extraí a checagem de conteúdo para esse módulo único para que nenhuma rota de upload fique sem
ela no futuro. Também estendi o allowlist de MIME para diferenciar anexos de documento
(pdf/jpeg/png) de áudio do relato (webm/wav/ogg — os únicos com assinatura de magic-bytes
definida, para não repetir o "correctness trap" nº 2 abaixo).

**Evidência:** `backend-mock/test/denuncias.spec.mjs` ganhou 4 testes novos provando a rejeição
(extensão bloqueada, MIME/magic-bytes divergente, antivírus mock) e a aceitação de áudio válido
pelo caminho real.

## 2. Outros achados corrigidos

| # | Achado | Correção |
| --- | --- | --- |
| 1 | `EvidenciasStateService.remover(nome)` apagava **todos** os arquivos com aquele nome — dois anexos chamados `foto.jpg` e o usuário perdia os dois ao remover um | Cada `EvidenciaArquivo` agora tem um `id` numérico único; `remover(id)` afeta só o clicado. Teste novo prova o caso de nomes duplicados. |
| 2 | `AudioRecorderService.recording` era um sinal morto — nunca atualizado, sempre retornava `false` | Passou a expor o sinal real (`recordingState`) em vez de um duplicado nunca escrito. |
| 3 | `protocolo` (tela de Confirmação) não sobrevivia a um reload — usuário perdia o número do protocolo se recarregasse a página | Persistido via `createPersistedSignal`, igual ao restante do wizard. Teste e2e novo recarrega a página na tela de confirmação e confirma que o protocolo continua visível. |
| 4 | Envio silencioso de no máximo 3 anexos, mesmo permitindo selecionar até 10 (`DEC-DN-15`) — usuário podia acreditar que anexou 5 arquivos e só 3 chegavam ao backend | Aviso visível ("Apenas os 3 primeiros... serão enviados") quando o usuário seleciona mais que o limite real do envelope do contrato (`MAX_ANEXOS_ENVIO`, nova constante documentando essa restrição do contrato). |
| 5 | `AcolhimentoStateService` reimplementava à mão o mesmo padrão de persistência que `shared/persisted-signal.ts` já fornece (usado por todos os outros 6 serviços de estado) | Refatorado para usar `createPersistedSignal`, removendo ~25 linhas de código duplicado. |
| 6 | Allowlist de MIME/extensão duplicado em 3 lugares (`middleware/upload.js`, `magic-bytes.js`, e implicitamente em `denuncias.js`) | Consolidado: `attachment-validation.js` é agora o único ponto de checagem de conteúdo, reutilizado pelas duas rotas. |
| 7 | Busca de irregularidade por código (`taxonomia.find(...)`) duplicada em `complaint-submission.service.ts` e `step-revisao.ts`, refeita a cada render em `step-revisao.html` | Centralizado em `shared/taxonomia.ts` com um `Map` construído uma vez (`buscarIrregularidade`/`rotuloIrregularidade`), importado nos dois lugares. |
| 8 | `app.ts` tinha 7 métodos quase idênticos (`goToDetalhamento`, `goToEvidencias`, ...) só para setar o passo atual | Colapsado em um único `goTo(step: WizardStep)`; o template passa o nome do passo como argumento. |
| 9 | `complaint-submission.service.ts` repetia o mesmo ternário `identificado ? valor : undefined` 3 vezes (nome/email/telefone) | Extraído para uma função local `soSeIdentificado`. |
| 10 | `App.startReport(choice: string)` não usava o tipo forte `AcolhimentoChoice` já emitido pelo componente | Tipado corretamente — um valor inválido agora é erro de compilação, não silêncio em runtime. |
| 11 | Template do checklist de irregularidades chamava `state.irregularidades().includes(codigo)` duas vezes por item, a cada ciclo de detecção de mudanças | Movido para `RelatoStateService.isIrregularidadeSelecionada(codigo)` — lógica de estado no serviço, não repetida no template. |

## 3. Achados avaliados e conscientemente NÃO aplicados

| Achado | Por que não apliquei |
| --- | --- |
| Colapsar `consentDialog`/`audioEnabled`/`microphoneUnavailable` (3 booleanos) em um único estado tipo enum | Verifiquei o comportamento real: `audioEnabled` e `microphoneUnavailable` podem ser **verdadeiros ao mesmo tempo** por design (o gravador continua montado, mostrando seu próprio erro, enquanto a mensagem de fallback também aparece — comportamento coberto pelo e2e `mostra fallback textual quando o microfone é negado`). Um enum de estado único perderia essa combinação legítima. Achado plausível na superfície, mas refutado ao checar o requisito real (`R-REV-01`). |
| Indexar `municipios-ibge-fallback.json` com um `Map` para busca O(1) | O agente assumiu ~5.570 municípios; o arquivo real criado nesta sessão tem 6 entradas. Otimização sem efeito prático no tamanho de dado atual — não aplicada para não adicionar complexidade sem ganho mensurável. |
| Middleware de erro dedicado para multer em `index.js` | Baixo risco (ambiente mock/dev, não produção); registrado aqui para retomar se o backend-mock evoluir para expor stack traces por engano. |

## 4. Evidência final

| Comando | Resultado |
| --- | --- |
| `npm run lint` (raiz) | 0 erros |
| `npm test` (raiz) | frontend: 68/68 · backend-mock: 22/22 (+4 desde a rodada anterior, todos provando a correção de segurança) |
| `npm run build` | sem erros |
| `npx playwright test` | 11/11, incluindo a nova regressão de protocolo pós-reload |
| `git diff --check` | sem avisos |

## 5. Próximos passos

Nenhuma pendência de código dos achados desta rodada. Itens não aplicados (§3) ficam
documentados para reavaliação se as premissas mudarem (ex.: fallback de municípios crescer para
a lista real do IBGE).
