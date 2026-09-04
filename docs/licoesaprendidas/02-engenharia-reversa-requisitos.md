# Engenharia reversa de requisitos

Objetivo: reconstruir o que o sistema faz, o que deveria fazer e o que ainda precisa de decisão, sem confundir comportamento existente com intenção do negócio.

## Método

1. Leia a fonte primária integralmente e extraia cada verbo/restrição em um requisito atômico.
2. Cruze código, teste, UI, Swagger, documentação e operação.
3. Registre ID, tipo, fonte com localização, ator, estímulo, regra, resultado, erro, dados, ambiente e confiança.
4. Defina aceite em formato Dado/Quando/Então e o estado probatório exigido.
5. Ligue requisito a artefato, implementação, teste e evidência.
6. Registre conflito, ambiguidade, requisito implícito e exclusão; não resolva por suposição.
7. Faça contraprova: qual evidência refutaria esta interpretação?
8. Obtenha decisão humana para conflitos materiais.

## Taxonomia

- funcional;
- segurança e abuso;
- privacidade/LGPD;
- acessibilidade;
- performance e capacidade;
- disponibilidade/resiliência;
- compatibilidade;
- observabilidade/auditoria;
- operação/implantação;
- manutenibilidade;
- documental;
- dependência externa/humana;
- restrição e fora de escopo.

## Catálogo inicial observado

Estes itens são baseline de engenharia reversa, não aprovação final de Produto.

| ID | Tipo | Comportamento observado | Confiança |
| --- | --- | --- | --- |
| RF-01 | funcional | Wizard conduz acolhimento, local, relato, evidências, identificação, revisão e confirmação | confirmada pelo código/UI |
| RF-02 | funcional | Estado e navegação residem em ComplaintService com signals | confirmada |
| RF-03 | integração | Cliente envia denuncia serializada e arquivo_N em multipart para POST /api/denuncias | confirmada |
| RF-04 | validação | BFF exige UF, município e irregularidade selecionada ou relato textual | confirmada |
| RF-05 | erro/UX | Falha visível mantém isSubmitted falso, protocolo vazio e permite retry | confirmada por código/testes |
| RF-06 | contrato | Frontend só confirma resposta 2xx com protocolo string não vazio | confirmada |
| RF-07 | backend | BFF gera protocolo MPT-XXXXXXXX localmente antes de chamar a API MPT | confirmada; conflita com parte da documentação |
| RF-08 | upload | Até dez arquivos de até 20 MiB por padrão, MIME allowlist, disco temporário e cleanup | confirmada; limites configuráveis |
| RF-09 | antimalware | Arquivos são enviados ao ClamAV INSTREAM; ameaça retorna 422 | confirmada |
| RF-10 | perímetro | POST possui rate limit; produção exige Redis, CORS exato, MPT URL e ClamAV | confirmada |
| RF-11 | operação | health é público e Swagger é desabilitado por padrão em produção | confirmada |
| RF-12 | desenvolvimento | API MPT indisponível e ClamAV indisponível podem resultar em aceitação local em development | confirmada; não equivale a live |

## Requisitos não funcionais candidatos

- RNF-SEC-01 — token e URL interna permanecem no BFF; nenhuma PII, anexo, segredo ou payload completo em logs/evidências.
- RNF-SEC-02 — upload usa defesa em profundidade: limites, nome aleatório, temporário, validação de conteúdo, antimalware, cleanup e isolamento de rede.
- RNF-PRV-01 — minimização, finalidade, base legal, sigilo/anonimato, retenção, acesso e descarte dependem de aprovação de DPO/área jurídica.
- RNF-A11Y-01 — alvo WCAG 2.2 AA com automação e inspeção manual por teclado, foco, zoom/reflow e leitor de tela.
- RNF-REL-01 — production falha explicitamente quando integração crítica não está pronta; development deve ser rotulado como simulação/local.
- RNF-PERF-01 — budgets Angular, latência, upload concorrente, memória/disco e capacidade ClamAV/Redis/API têm metas mensuráveis.
- RNF-MNT-01 — modelo TS, FormData, validação, payload MPT, Swagger e testes permanecem sincronizados.
- RNF-REP-01 — instalação reproduzível com npm ci nos dois lockfiles e versões compatíveis com Angular 22.
- RNF-OBS-01 — logs/métricas possuem correlação mínima, mascaramento, retenção e acesso aprovados.

## Lacunas que o código não resolve

SLA/SLO, RTO/RPO, volume; contrato oficial da API MPT e ownership do protocolo; política legal de anonimato/sigilo; retenção; browsers e tecnologias assistivas suportados; conteúdo real permitido por anexo; topologia de proxies; capacidade/HA de Redis e ClamAV; resposta a incidentes; critérios de produção para desligar comportamentos fail-open de desenvolvimento.

## Requisitos derivados dos achados abertos

Os relatórios em [`Analises/`](../../Analises) — em especial `RELATORIO_ANALISE_QA_CLEANCODE_SECURITY_REGRESSAO.md` (31/07/2026) e `RELATORIO_DIAGNOSTICO_FRONTEND_PRODUCAO.md` (26/07/2026) — descrevem 47 achados P0–P3 ainda abertos após a sanitização. Convertê-los em requisitos verificáveis é obrigatório antes de qualquer promoção a produção. Mapa completo em [15-baseline-analises-denuncias.md](15-baseline-analises-denuncias.md).

Candidatos mínimos a incluir no `REQUIREMENTS.md`:

| ID candidato | Origem | Regra observável | Aceite Dado/Quando/Então (esboço) |
| --- | --- | --- | --- |
| RF-13 | QA-01 | Wizard só avança com campos obrigatórios preenchidos por etapa | Dado o `StepIrregularidades` sem seleção nem relato, Quando o cidadão aciona `Avançar`, Então o botão permanece desabilitado e mensagem acessível anuncia o motivo |
| RF-14 | QA-02 / SEC-01 | Modo anônimo remove PII do estado e do payload | Dado nome/e-mail/telefone preenchidos, Quando o cidadão alterna para "Denúncia Anônima", Então o `ComplaintService` zera esses campos e o BFF não recebe PII |
| RF-15 | QA-03 | Áudio gravado é transmitido como parte multipart nomeada | Dado `relato_audio` presente, Quando o cliente envia, Então o BFF recebe um `arquivo_audio` de mime compatível e o teste unitário do `ComplaintApiClient` cobre o cenário |
| RF-16 | QA-04 | Rascunho por etapa é persistido em `sessionStorage` e limpo no sucesso/desistência | Dado wizard em andamento, Quando a página recarrega, Então o estado da etapa é restaurado sem PII persistida após envio |
| RF-17 | QA-05 | Envio HTTP tem timeout observável e detecção offline | Dado rede indisponível ou lenta, Quando o cidadão envia, Então há erro visível em ≤ 30 s com opção de nova tentativa e nenhum estado congelado |
| RS-01 | SEC-02 | Protocolo do BFF usa fonte criptográfica | `crypto.randomUUID()` ou `crypto.randomBytes()`; nenhum uso de `Math.random()` sobrevive em `services/complaint.service.js` |
| RS-02 | SEC-03 / QA-07 | Upload aceita apenas o campo `arquivo` (ou nomes explicitamente listados) | `upload.array('arquivo', 10)` ou `upload.fields([...])`; qualquer outro campo é rejeitado |
| RS-03 | SEC-04 | MIME de anexo é validado por magic bytes | Divergência entre `Content-Type` e assinatura real leva a `422` com mensagem sanitizada |
| RS-04 | SEC-05 | CSP restritiva ativa em produção | `Content-Security-Policy` limita `script-src`, `style-src`, `font-src` e `img-src` conforme fontes reais |
| RS-05 | SEC-06 | `mpt-api.client.js` recebe configuração por injeção | O cliente não lê `process.env`; testes injetam URL e credenciais |
| RA-01 | Sugestões §2 | Foco visível global, `<label for>`, `aria-describedby`, `aria-live="polite"` e foco no `h1` da etapa | Teste de teclado + axe passam em todos os steps e no `Confirmation` |
| RP-01 | SEC-10 | Ciência de Termos/LGPD antes do envio | Checkbox obrigatório com link acessível para a política vigente |
| RG-01 | REG-01 / REG-06 | CI executa lint + Vitest (frontend e backend) + Playwright + `npm audit` | Pipeline verde é condição necessária para merge |
| RG-02 | REG-02 | `ui-audit.spec.ts` falha em qualquer achado crítico | `expect(report.criticalFindings).toEqual([])` |

Os demais P2/P3 (validação de CNPJ com DV, formato de e-mail/telefone, `<label>` em todos os inputs, `X-Request-ID`, sanitização de texto livre, remoção de `parsePositiveInteger` duplicado, remoção de `express-validator`/`multer`/`opencode-ai` do lado errado, teste de arquivo oversized, teste de rede lenta, CSS modularizado) devem ser catalogados no plano de ação em [14-metricas-plano-acao.md](14-metricas-plano-acao.md).

## Regra de cobertura

Nenhum requisito crítico está concluído sem: fonte primária, aceite, artefato, implementação, teste, evidência, ambiente e estado. Exclusão de escopo exige trecho que a autoriza, impacto e aprovação.

Use templates/requisitos.md e templates/rastreabilidade.md. Não herde estados ou evidências de N1B/N3B.

## Limitações

Engenharia reversa descreve o sistema observado; não legitima automaticamente bugs, dívida ou decisões antigas. Testes mostram exemplos cobertos, não uma especificação completa. Requisitos legais e operacionais precisam de owners competentes.
