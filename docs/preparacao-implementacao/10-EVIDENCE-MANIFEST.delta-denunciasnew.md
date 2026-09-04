# 10-EVIDENCE-MANIFEST — Delta `denunciasnew`

> **Delta proposto.** Não substitui [`10-EVIDENCE-MANIFEST.md`](10-EVIDENCE-MANIFEST.md). Adiciona plano de evidências para os requisitos `DN-*` (F2), ameaças `T-DN-*` (F4) e diagramas `denunciasnew-*` (F3).
>
> **Fase:** F5. **Autorização vigente:** `SOMENTE_LEITURA + DOCUMENTAÇÃO`.
> **Modo de teste autorizado por padrão:** `e2e-mock` (Playwright multi-browser com API interceptada; sem BFF real, sem MPT real, sem ClamAV real).
> **Modos que exigem autorização adicional:** `live-BFF`, `live-STT`, `live-CLASSIFIER`, `live-ALERT`, `live-MPT`, `live-WHATSAPP` (todos rejeitados por padrão).
> **Fontes:** [`06-REQUIREMENTS.delta-denunciasnew.md`](06-REQUIREMENTS.delta-denunciasnew.md), [`08-TDD.delta-denunciasnew.md`](08-TDD.delta-denunciasnew.md), [`09-THREAT-MODEL.delta-denunciasnew.md`](09-THREAT-MODEL.delta-denunciasnew.md), [`../Analises/MATRIZ_FERRAMENTAS_DENUNCIASNEW.md`](../Analises/MATRIZ_FERRAMENTAS_DENUNCIASNEW.md), 5 `.mmd` `denunciasnew-*`.

## 1. Convenções

| Coluna | Definição |
| --- | --- |
| Requisito/Ameaça | ID de `DN-*` (F2) ou `T-DN-*` (F4). |
| Cenário | `feliz` \| `alternativo` \| `falha` \| `regressão`. |
| Modo de teste | `unit-front`, `unit-back`, `integ-sim`, `e2e-mock`, `a11y-mock`, `perf-mock`, `live-BFF`, `live-STT`, `live-CLASSIFIER`, `live-ALERT`, `live-MPT`, `live-WHATSAPP`. |
| Ferramenta | Da matriz [MATRIZ_FERRAMENTAS_DENUNCIASNEW.md](../Analises/MATRIZ_FERRAMENTAS_DENUNCIASNEW.md). |
| Evidência esperada | Artefato produzido pelo modo autorizado. |
| Owner | Papel responsável. |
| Retenção | Dias; `ND` até DPO decidir (DEC-DN-18). |
| Estado | `PRONTA-CAPTURA` (F6 pode agendar) \| `ND-DECISÃO` (aguarda DEC-DN-\*) \| `AUTORIZAR-LIVE` (exige autorização extra). |

Todas as evidências obedecem às **regras de manipulação** herdadas de [`10-EVIDENCE-MANIFEST.md`](10-EVIDENCE-MANIFEST.md) §4 (redaction obrigatória, fixtures sintéticas, nunca produção sem autorização).

## 2. Modos de teste — decisão de gate por modo

| Modo | Autorização padrão | Cabe em CI? | Uso |
| --- | :---: | :---: | --- |
| `unit-front` | ✔ vigente | ✔ | Vitest 4 |
| `unit-back` | ✔ vigente | ✔ | Vitest 4 + Supertest |
| `integ-sim` | ✔ vigente | ✔ | Supertest + `msw` |
| `e2e-mock` | ✔ vigente **(default)** | ✔ | Playwright multi-browser com `page.route()` interceptando `/api/*`, IBGE, WhatsApp webhook |
| `a11y-mock` | ✔ vigente | ✔ | `@axe-core/playwright` + `Lighthouse a11y` |
| `perf-mock` | ✔ vigente | ✔ | Lighthouse + `network.emulate('Slow 3G')` |
| `live-BFF` | ✖ requer autorização | ✔ mediante autorização | ambiente autorizado (nunca produção) |
| `live-STT` | ✖ requer autorização | ✖ | apenas ambiente autorizado com conta STT paga; DEC-DN-11 |
| `live-CLASSIFIER` | ✖ requer autorização | ✖ | idem; DEC-DN-12 |
| `live-ALERT` | ✖ requer autorização | ✖ | idem; DEC-DN-22 |
| `live-MPT` | ✖ requer autorização | ✖ | apenas com owner MPT presente |
| `live-WHATSAPP` | ✖ requer autorização | ✖ | requer conta BSP e Jurídico assinado |

Regra: **falha em modo `mock` nunca é sucesso em modo `live`**. E vice-versa: mock verde não prova live.

## 3. Manifesto por requisito e cenário

### 3.1 Tela 1 — Acolhimento (DN-RF-001, DN-RF-002)

| Requisito | Cenário | Modo | Ferramenta | Evidência esperada | Owner | Retenção | Estado |
| --- | --- | --- | --- | --- | --- | --- | --- |
| DN-RF-001 | feliz — cidadão escolhe "Denuncie" | e2e-mock | Playwright | trace + screenshot do avanço | Frontend | 30 d | PRONTA-CAPTURA |
| DN-RF-001 | alternativo — cidadão escolhe "Servidor" | e2e-mock | Playwright | trace + screenshot | Frontend | 30 d | PRONTA-CAPTURA |
| DN-RF-001 | alternativo — cidadão escolhe "Ouvidoria" | e2e-mock | Playwright + network.route() | trace + verifica navegação a URL externa (mock) | Frontend + Produto | 30 d | PRONTA-CAPTURA |
| DN-RF-001 | falha — nenhuma opção selecionada | e2e-mock | Playwright | screenshot com botão Avançar desabilitado + mensagem `aria-live` | Frontend + A11y | 30 d | PRONTA-CAPTURA |
| DN-RF-002 | feliz — vídeo institucional opcional | e2e-mock | Playwright | verifica ausência de autoplay com som + presença de captions/transcript | Frontend + A11y | 30 d | PRONTA-CAPTURA |
| DN-RF-002 | alternativo — usuário pula vídeo | e2e-mock | Playwright | avanço permitido sem clique no player | Frontend | 30 d | PRONTA-CAPTURA |
| T-DN-20 | falha — cookies de terceiros | e2e-mock | Playwright + inspeção de headers | log de cookies deve ser vazio (self-hosted) | DPO + Frontend | 30 d | ND-DECISÃO (P-F4-sec-5 para vídeo hosting) |

### 3.2 Tela 2 — Relato Guiado (DN-RF-003, DN-RF-004, DN-RS-002)

| Requisito | Cenário | Modo | Ferramenta | Evidência esperada | Owner | Retenção | Estado |
| --- | --- | --- | --- | --- | --- | --- | --- |
| DN-RF-003 | feliz — seleciona 1..N irregularidades | e2e-mock | Playwright | trace + chip renderizado | Frontend | 30 d | ND-DECISÃO (DEC-DN-10 taxonomia) |
| DN-RF-003 | falha — envia sem selecionar | e2e-mock + unit-front | Playwright + Vitest | erro `aria-live` + botão desabilitado | Frontend + A11y | 30 d | PRONTA-CAPTURA |
| DN-RF-004 | feliz — descrição por texto | e2e-mock + unit-front | Playwright + Vitest | trace + textarea preenchida | Frontend | 30 d | PRONTA-CAPTURA |
| DN-RF-004 | feliz — descrição por áudio | e2e-mock | Playwright + fake microphone (`--use-fake-device-for-media-stream`) | trace + Blob capturado em memória | Frontend | 30 d | PRONTA-CAPTURA |
| DN-RF-004 | falha — permissão de mic negada | e2e-mock | Playwright + permissions API | UI mostra fallback para texto | Frontend + A11y | 30 d | PRONTA-CAPTURA |
| DN-RS-002 | feliz — transcrição retorna com sucesso (mock) | e2e-mock + integ-sim | Playwright + msw | preview de transcrição + campo editável | Frontend + Backend | 30 d | ND-DECISÃO (DEC-DN-11) |
| DN-RS-002 | falha — STT falha | e2e-mock + integ-sim | msw retorna 500 | envio segue sem transcrição; status `FALHA` | Backend | 30 d | ND-DECISÃO |
| DN-RS-002 | live — teste real com provedor | live-STT | STT SaaS + fixture sintética | log com áudio "isca" + resposta redacted | DPO + Backend | ND (DEC-DN-18) | AUTORIZAR-LIVE |
| T-DN-01 | falha — provedor STT com retenção alta | contrato | inspeção do contrato do provedor | ata do DPO | DPO | ∞ | ND-DECISÃO |
| T-DN-02 | falha — transcrição errada | e2e-mock | Playwright | UI permite edição antes do envio | Frontend | 30 d | PRONTA-CAPTURA |
| T-DN-03 | falha — áudio muito grande | integ-sim | Supertest + fixture 100 MB | 413 esperado | Backend | 30 d | ND-DECISÃO (DEC-DN-15 limites) |
| T-DN-04 | falha — payload malicioso em áudio (EICAR-in-audio) | integ-sim | Supertest + ClamAV mock | 422 esperado; ClamAV bloqueia antes do STT | Segurança + Backend | 30 d | PRONTA-CAPTURA |

### 3.3 Tela 3 — Detalhamento (DN-RF-005, DN-RF-006, DN-RF-007)

| Requisito | Cenário | Modo | Ferramenta | Evidência esperada | Owner | Retenção | Estado |
| --- | --- | --- | --- | --- | --- | --- | --- |
| DN-RF-005 | feliz — informa faixa de trabalhadores | e2e-mock | Playwright | trace + select preenchido | Frontend | 30 d | ND-DECISÃO (DEC-DN-13 obrigatoriedade) |
| DN-RF-006 | feliz — escolhe modalidade | e2e-mock | Playwright | trace + select preenchido | Frontend | 30 d | ND-DECISÃO (DEC-DN-14 taxonomia) |
| DN-RF-007 | feliz — nenhum grupo vulnerável | e2e-mock | Playwright | trace + envio segue | Frontend | 30 d | PRONTA-CAPTURA |
| DN-RF-007 | alternativo — grupo vulnerável indicado | e2e-mock | Playwright | trace + valor persiste | Frontend | 30 d | PRONTA-CAPTURA |

### 3.4 Tela 4 — Evidências e testemunhas (DN-RF-008, DN-RF-009)

| Requisito | Cenário | Modo | Ferramenta | Evidência esperada | Owner | Retenção | Estado |
| --- | --- | --- | --- | --- | --- | --- | --- |
| DN-RF-008 | feliz — upload de PDF/JPG/PNG dentro do limite | integ-sim + e2e-mock | Supertest + Playwright | trace + resposta 201 | Backend + QA | 30 d | ND-DECISÃO (DEC-DN-15) |
| DN-RF-008 | falha — MIME não permitido | integ-sim | Supertest + fixture `.exe` | 422 esperado | Segurança | 30 d | PRONTA-CAPTURA |
| DN-RF-008 | falha — quantidade acima do limite | integ-sim | Supertest + fixture 11 arquivos | 413/422 esperado | Backend | 30 d | ND-DECISÃO (DEC-DN-15) |
| DN-RF-008 | falha — zip bomb | integ-sim | Supertest + fixture EICAR-like | 422 esperado | Segurança | 30 d | PRONTA-CAPTURA |
| DN-RF-009 | feliz — declara testemunha com dados sintéticos | e2e-mock + unit-front | Playwright + Vitest | trace + campo preenchido; consentimento LGPD gravado | Frontend + DPO | 30 d | ND-DECISÃO (DEC-DN-16) |
| DN-RF-009 | falha — usuário anônimo declara testemunha | e2e-mock | Playwright | validação impede vazamento cruzado (política a definir) | DPO + Frontend | 30 d | ND-DECISÃO (DEC-DN-16) |

### 3.5 Tela 5 — Sigilo e Anonimato (DN-RG-005, DN-RF-010)

| Requisito | Cenário | Modo | Ferramenta | Evidência esperada | Owner | Retenção | Estado |
| --- | --- | --- | --- | --- | --- | --- | --- |
| DN-RG-005 | feliz — aviso destacado com contraste AAA | a11y-mock | axe-core + WebAIM contrast | HTML axe-report com contraste ≥ 7:1 no aviso | A11y + Frontend | 30 d | PRONTA-CAPTURA |
| DN-RG-005 | regressão — clique "não vi o aviso" | e2e-mock | Playwright | log com timestamp + confirmação explícita | Legal + Frontend | 30 d | PRONTA-CAPTURA |
| DN-RF-010 | feliz — denúncia anônima remove campos | e2e-mock + unit-back | Playwright + Supertest | payload de saída sem `nome`/`email`/`telefone` | Frontend + Backend + DPO | 30 d | PRONTA-CAPTURA |
| DN-RF-010 | falha — cliente envia campos identificadores em modo anônimo | integ-sim | Supertest | BFF rejeita com 400 (defesa em profundidade) | Backend + DPO | 30 d | PRONTA-CAPTURA |
| DN-RF-010 | regressão — a11y do toggle | a11y-mock | axe-core + NVDA/VoiceOver manual | HTML axe + notas AT | A11y | 30 d | PRONTA-CAPTURA |
| T-DN-19 | regressão — aviso sem contraste AAA | a11y-mock | axe-core | violação apontada | A11y | 30 d | PRONTA-CAPTURA |

### 3.6 Tela 6 — Local/Empresa (DN-RF-011, DN-RF-012)

| Requisito | Cenário | Modo | Ferramenta | Evidência esperada | Owner | Retenção | Estado |
| --- | --- | --- | --- | --- | --- | --- | --- |
| DN-RF-011 | feliz — usuário preenche UF/município | e2e-mock | Playwright + msw (IBGE) | trace + select preenchido | Frontend | 30 d | PRONTA-CAPTURA |
| DN-RF-011 | falha — avança sem preencher | e2e-mock + unit-front | Playwright + Vitest | erro `aria-live` + botão desabilitado | Frontend + A11y | 30 d | PRONTA-CAPTURA |
| DN-RF-011 | falha — IBGE indisponível | e2e-mock | Playwright + msw retorna 500 | fallback `municipios-ibge.json` local | Frontend | 30 d | PRONTA-CAPTURA |
| DN-RF-012 | feliz — usuário deixa empresa em branco | e2e-mock | Playwright | avanço permitido; hint visível | Frontend + UX | 30 d | PRONTA-CAPTURA |

### 3.7 Tela 7 — Revisão (DN-RF-013)

| Requisito | Cenário | Modo | Ferramenta | Evidência esperada | Owner | Retenção | Estado |
| --- | --- | --- | --- | --- | --- | --- | --- |
| DN-RF-013 | feliz — usuário edita campo e retorna | e2e-mock | Playwright | trace + valor editado refletido | Frontend | 30 d | PRONTA-CAPTURA |
| DN-RF-013 | falha — usuário tenta enviar sem clicar "Confirmar" | e2e-mock | Playwright | envio bloqueado até confirmação explícita | Frontend | 30 d | PRONTA-CAPTURA |
| DN-RF-013 | regressão — sumário consolidado sem PII no leitor de tela | a11y-mock | axe-core + NVDA/VoiceOver | notas AT + HTML axe | A11y | 30 d | PRONTA-CAPTURA |
| T-DN-18 | falha — trocar app no mobile perde estado | e2e-mock | Playwright + emulate `page.emulate(mobile)` + background/foreground | auto-save `sessionStorage` restaura | Frontend | 30 d | PRONTA-CAPTURA |

### 3.8 Tela 8 — Confirmação (DN-RF-014)

| Requisito | Cenário | Modo | Ferramenta | Evidência esperada | Owner | Retenção | Estado |
| --- | --- | --- | --- | --- | --- | --- | --- |
| DN-RF-014 | feliz — protocolo + infográfico exibidos | e2e-mock | Playwright | screenshot + inspeção do SVG/HTML | Frontend + Produto | 30 d | ND-DECISÃO (DEC-DN-19 formato) |
| DN-RF-014 | regressão — a11y do infográfico | a11y-mock | axe-core + inspeção manual | descrição textual acessível confirmada | A11y | 30 d | PRONTA-CAPTURA |
| DN-RF-014 | falha — protocolo vazio ou inválido | integ-sim | Supertest | 500 esperado; monitorado por SRE | Backend + SRE | 30 d | PRONTA-CAPTURA |

### 3.9 Não funcionais

| Requisito | Cenário | Modo | Ferramenta | Evidência esperada | Owner | Retenção | Estado |
| --- | --- | --- | --- | --- | --- | --- | --- |
| DN-RNF-001 | regressão — WCAG completo em cada tela | a11y-mock | axe-core (`wcag21aa` ou `wcag22aa`) + Lighthouse a11y | HTML report + Playwright trace | A11y | 30 d | ND-DECISÃO (DEC-DN-07 versão WCAG) |
| DN-RNF-002 | regressão — mobile-first 360 px sem overflow | e2e-mock | Playwright multi-viewport | screenshots por viewport | QA + Frontend | 30 d | PRONTA-CAPTURA |
| DN-RNF-003 | regressão — Lighthouse mobile Slow 3G | perf-mock | Lighthouse CLI | JSON com LCP ≤ 4 s, TTI ≤ 6 s | Frontend + SRE | 90 d | ND-DECISÃO (DEC-DN-08 SLA) |
| DN-RNF-004 | regressão — zero PII em log | unit-back + integ-sim | Vitest + Supertest + `pino-noir` mock | payload sanitizado nas amostras | Backend + DPO | 90 d | ND-DECISÃO (DEC-DN-18 política) |

### 3.10 Serviços NOVO/PART

| Requisito/Ameaça | Cenário | Modo | Ferramenta | Evidência esperada | Owner | Retenção | Estado |
| --- | --- | --- | --- | --- | --- | --- | --- |
| DN-RS-001 | feliz — bot converte conversa em envelope | integ-sim | Supertest + fixture do envelope | 201 + protocolo | Backend | 30 d | ND-DECISÃO (DEC-DN-09) |
| T-DN-13 | falha — HMAC inválido no BotIngress | integ-sim | Supertest | 401 esperado | Backend + Segurança | 30 d | ND-DECISÃO (DEC-DN-09) |
| T-DN-13 | falha — replay com timestamp expirado | integ-sim | Supertest | 401 esperado | Backend + Segurança | 30 d | ND-DECISÃO (DEC-DN-09) |
| T-DN-17 | falha — bot tenta chamar `/health` via ingress | integ-sim | Supertest | 404/403 esperado | Backend + Segurança | 30 d | ND-DECISÃO (DEC-DN-09) |
| DN-RS-003 | feliz — classificação retorna com sucesso (mock) | integ-sim | Supertest + msw | envelope enriquecido | Backend | 30 d | ND-DECISÃO (DEC-DN-12) |
| T-DN-05 | falha — envelope contém PII residual | unit-back | Vitest + fixture com PII | teste rejeita payload; `applyAnonimizationRules()` remove | Backend + DPO | 30 d | ND-DECISÃO (DEC-DN-12) |
| T-DN-06 | falha — cliente tenta forçar `Prioridade.URGENTE` | integ-sim | Supertest | 400 esperado (campo não aceito no request) | Backend | 30 d | PRONTA-CAPTURA |
| T-DN-07 | regressão — envelope MPT sem campos LGPD art. 20 | unit-back | Vitest | rejeita ausência de `metodo`, `versao_classificador`, `revisada_por_humano` | Backend + DPO | 30 d | ND-DECISÃO (DEC-DN-12) |
| T-DN-08 | regressão — viés do classificador | análise offline | script Python + dados sintéticos | relatório estatístico com distribuição por grupo vulnerável | Produto + DPO | 90 d | ND-DECISÃO (DEC-DN-12) |
| DN-RS-004 | feliz — alerta dispachado (mock) | integ-sim | Supertest + msw webhook | log de despacho sem PII | Backend + SRE | 30 d | ND-DECISÃO (DEC-DN-22) |
| T-DN-09 | regressão — payload de alerta rejeita PII | unit-back | Vitest | teste rejeita `nome`, `email` etc. no payload | Backend + DPO | 30 d | PRONTA-CAPTURA |
| T-DN-10 | falha — flood de alertas | integ-sim | Supertest + rajada de N eventos | throttling ativa (log) | SRE | 30 d | ND-DECISÃO (DEC-DN-22) |

## 4. Shot list `denunciasnew-*`

Extensão da §2 do original. IDs `SH-DN-*` para não colidir com `SH-01..10`.

| ID | Tela/estado | Viewport/AT | Resultado esperado | Nome final | Modo | Status |
| --- | --- | --- | --- | --- | --- | --- |
| SH-DN-01 | Acolhimento (3 caminhos + vídeo) | 360×640 Chromium mobile | 3 CTAs + player sem autoplay-com-som | `SH-DN-01_acolhimento_mobile.png` | e2e-mock | PRONTA-CAPTURA |
| SH-DN-02 | Acolhimento — servidor | 360×640 mobile | caminho servidor destacado | `SH-DN-02_acolhimento_servidor.png` | e2e-mock | PRONTA-CAPTURA |
| SH-DN-03 | Relato Guiado — checklist visual | 360×640 mobile | chips + ícones + linguagem simples | `SH-DN-03_checklist_mobile.png` | e2e-mock | ND-DECISÃO (DEC-DN-10) |
| SH-DN-04 | Relato Guiado — modo áudio | 360×640 mobile | gravador + preview de transcrição | `SH-DN-04_audio_preview.png` | e2e-mock | ND-DECISÃO (DEC-DN-11) |
| SH-DN-05 | Detalhamento — grupos vulneráveis | 360×640 mobile | multi-select acessível | `SH-DN-05_grupos_vulneraveis.png` | e2e-mock | PRONTA-CAPTURA |
| SH-DN-06 | Evidências — anexos + testemunhas | 360×640 mobile | uploader + subformulário de testemunhas | `SH-DN-06_evidencias_testemunhas.png` | e2e-mock | ND-DECISÃO (DEC-DN-16) |
| SH-DN-07 | Sigilo — aviso com contraste AAA + toggle | 360×640 mobile | contraste ≥ 7:1; toggle acessível | `SH-DN-07_sigilo_toggle.png` | a11y-mock | PRONTA-CAPTURA |
| SH-DN-08 | Local — hint "não sabe? deixe em branco" | 360×640 mobile | hint visível ao lado dos campos | `SH-DN-08_local_hint.png` | e2e-mock | PRONTA-CAPTURA |
| SH-DN-09 | Revisão — sumário editável | 360×640 mobile | ícones de editar por bloco | `SH-DN-09_revisao_editar.png` | e2e-mock | PRONTA-CAPTURA |
| SH-DN-10 | Confirmação — protocolo + infográfico | 360×640 mobile | SVG + descrição acessível | `SH-DN-10_confirmacao_infografico.png` | e2e-mock + a11y | ND-DECISÃO (DEC-DN-19) |
| SH-DN-11 | axe-core do wizard completo | Chromium desktop | 0 violações críticas/sérias | `SH-DN-11_axe_wizard.html` | a11y-mock | ND-DECISÃO (DEC-DN-07) |
| SH-DN-12 | Lighthouse mobile Slow 3G | Chromium mobile | JSON com LCP/TTI dentro do alvo | `SH-DN-12_lighthouse_mobile.json` | perf-mock | ND-DECISÃO (DEC-DN-08) |
| SH-DN-13 | Fluxo bot WhatsApp — envelope válido | headless | envelope estruturado gerado | `SH-DN-13_bot_envelope.json` | integ-sim | ND-DECISÃO (DEC-DN-09) |
| SH-DN-14 | Bot — HMAC inválido | headless | 401 esperado | `SH-DN-14_bot_hmac_invalido.log` | integ-sim | ND-DECISÃO (DEC-DN-09) |
| SH-DN-15 | STT mock — sucesso e falha | headless | 2 logs (`CONCLUIDA` e `FALHA`) | `SH-DN-15_stt_states.log` | integ-sim | ND-DECISÃO (DEC-DN-11) |
| SH-DN-16 | Anonimização antes do classificador | headless | payload sem PII no output | `SH-DN-16_anonimizacao.log` | unit-back | ND-DECISÃO (DEC-DN-12) |
| SH-DN-17 | Alertas — payload sem PII | headless | teste bloqueia payload com PII | `SH-DN-17_alertas_sem_pii.log` | unit-back | PRONTA-CAPTURA |
| SH-DN-18 | ClamAV — EICAR-in-audio rejeitado | headless | 422 antes do STT | `SH-DN-18_clamav_audio.log` | integ-sim | PRONTA-CAPTURA |
| SH-DN-19 | Mobile background/foreground | 360×640 mobile | `sessionStorage` restaura estado | `SH-DN-19_auto_save.gif` | e2e-mock | PRONTA-CAPTURA |
| SH-DN-20 | Rate limit no `/api/denuncias/bot` | headless | 429 esperado com `Retry-After` | `SH-DN-20_bot_rate_limit.log` | integ-sim | ND-DECISÃO (DEC-DN-09) |

Total: **20 shots novas** (`SH-DN-01..20`).

## 5. Fixtures sintéticas

Todas as evidências devem usar **exclusivamente** as fixtures abaixo:

| Tipo | Exemplo | Uso |
| --- | --- | --- |
| Nome | `FULANO DA SILVA`, `MARIA DE SOUZA` | campo `nome_completo` |
| E-mail | `usuario@example.com`, `denuncia+teste@example.org` | campo `email` |
| Telefone | `(11) 90000-0000`, `(21) 91234-5678` | campo `telefone` |
| CPF | `000.000.000-00` (obviamente falso) | nunca gerar CPF válido matematicamente |
| CNPJ | `00.000.000/0000-00` | nunca gerar CNPJ válido |
| Endereço | `Rua de Teste, 123 — Bairro Sintético` | campo endereço |
| UF/Município | `SP / São Paulo`, `RJ / Rio de Janeiro` | dados IBGE reais (UF/município são públicos) |
| Áudio | 5 s de ruído branco WAV ou clip TTS sintético "denuncia de teste" | `arquivo_audio` |
| PDF/imagem anexo | arquivo `sample.pdf` de 1 página em branco / PNG 1×1 | anexos |
| Protocolo (mock) | `MPT-TEST-XXXXXXXX` | resposta 201 |
| `session_id` bot | `bot-sess-000000` | metadata WhatsApp |
| Número WhatsApp | `+55 11 90000-0000` (mascarado no log como `+55 11 9****-0000`) | metadata |
| Token/HMAC | fixo `test-hmac-key-do-not-use-in-prod`, rotacionado por teste | headers |

## 6. Redaction — padrões obrigatórios em qualquer log/artefato publicado

| Padrão | Redação |
| --- | --- |
| CPF (`\d{3}\.\d{3}\.\d{3}-\d{2}`) | `[CPF-REDIGIDO]` |
| CNPJ | `[CNPJ-REDIGIDO]` |
| E-mail | `[EMAIL-REDIGIDO]` |
| Telefone | `[TELEFONE-REDIGIDO]` |
| Token `MPT_API_TOKEN` | `[TOKEN-REDIGIDO]` |
| `X-Bot-Signature`, `Authorization` | `[HEADER-REDIGIDO]` |
| URL interna MPT | `[URL-INTERNA]` |
| IP público | `xxx.xxx.xxx.xxx` |
| Nome próprio (heurística NLP quando disponível) | `[NOME-REDIGIDO]` |
| Coordenadas GPS em EXIF | remover EXIF |
| Áudio original enviado a STT | descartar após teste |

Auditoria de redaction: `pino-noir` (Node) para logs em runtime + inspeção manual de amostragem antes da publicação.

## 7. Content freeze — checklist para F5/F6

- [ ] commit congelado quando `denunciasnew/` tiver Git (DEC-DN-01).
- [ ] versão do PDF externo hasheada (SHA-256 do `Documento externo-outros 010970.2026.pdf`).
- [ ] versão do classificador (P-F4-1..6) fixada e registrada em `Classificacao.versao_classificador`.
- [ ] EXIF removido de todas as fixtures de imagem antes da captura.
- [ ] nomes de arquivo contêm hash curto (`SH-DN-01_<sha7>.png`).
- [ ] pino-noir configurado antes da execução dos testes.
- [ ] publicação **não autorizada** por padrão — cada publicação exige gate manual do owner.

## 8. Perguntas geradas em F5 (P-F5-\*)

| ID | Pergunta | Owner esperado |
| --- | --- | --- |
| **P-F5-1** | Retenção de evidência local: 30 d, 90 d, 180 d ou conforme LGPD específica? | DPO |
| **P-F5-2** | Publicação em portal interno de evidências é autorizada nesta iniciativa ou fica em disco local? | Segurança + SRE |
| **P-F5-3** | O `MPT-TEST-XXXXXXXX` de mock pode ser publicado ou também precisa redigir? | Produto |
| **P-F5-4** | Áudio sintético para teste STT: TTS gerado ou clipe de ruído branco? Qual banco de vozes? | Backend + Legal |
| **P-F5-5** | Ambiente de `live-BFF` está disponível? Endereço, credenciais e janela de teste? | SRE |
| **P-F5-6** | Ambiente de `live-STT` / `live-CLASSIFIER` requer conta paga; owner autoriza contratação piloto? | Produto + Financeiro |
| **P-F5-7** | Números de WhatsApp de teste (sandbox do BSP) estão disponíveis? | Produto |

## 9. Riscos e limitações

- Nenhuma captura ocorre em F5 — este é o **plano**. Captura só em F6+ com autorização.
- 20 shots novas + 33 linhas de manifesto por requisito/ameaça — grande escopo. Pode ser dividido em sublotes na F6 (`plan-decomposer`).
- Sem `live-STT` / `live-CLASSIFIER` / `live-WHATSAPP` autorizados, **não é possível validar** DN-RS-001..004 na íntegra; ficam como `AUTORIZAR-LIVE`.
- Fixtures de áudio sintético podem não representar sotaques regionais reais → risco de viés na validação da transcrição (T-DN-08).
- Retenção `ND` até DEC-DN-18 → todas as linhas com retenção pendente ficam nesse limbo.

## 10. Sumário

| Métrica | Valor |
| --- | --- |
| Linhas do manifesto por requisito/ameaça | 61 |
| Shots novas `SH-DN-*` | 20 |
| Modos de teste catalogados | 12 |
| Modos autorizados por padrão | 5 (`unit-front`, `unit-back`, `integ-sim`, `e2e-mock`, `a11y-mock`, `perf-mock`) |
| Modos que exigem autorização adicional | 6 (todos os `live-*`) |
| Estado `PRONTA-CAPTURA` | 24 |
| Estado `ND-DECISÃO` | 34 |
| Estado `AUTORIZAR-LIVE` | 3 |
| Perguntas ao owner (P-F5-\*) | 7 |
| Retenções `ND` (DEC-DN-18) | ~40 linhas |
