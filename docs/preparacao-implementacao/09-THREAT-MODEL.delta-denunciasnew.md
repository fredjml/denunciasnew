# 09-THREAT-MODEL — Delta `denunciasnew`

> **Delta proposto.** Não substitui [`09-THREAT-MODEL.md`](09-THREAT-MODEL.md). Adiciona ameaças introduzidas pelos elementos **NOVO** do novo leiaute (F2/F3/F4).
>
> **Fase:** F4. **Autorização:** `SOMENTE_LEITURA + DOCUMENTAÇÃO`. Sem DAST, sem pentest, sem chamadas a serviço live.
> **Fontes:** [`06-REQUIREMENTS.delta-denunciasnew.md`](06-REQUIREMENTS.delta-denunciasnew.md), [`08-TDD.delta-denunciasnew.md`](08-TDD.delta-denunciasnew.md), diagramas `denunciasnew-*.mmd`, [`../licoesaprendidas/backend/seguranca.md`](../licoesaprendidas/backend/seguranca.md), [`../licoesaprendidas/frontend/acessibilidade.md`](../licoesaprendidas/frontend/acessibilidade.md), transcrição PDF em [`prompts/fases/F2-pdf-transcript.md`](prompts/fases/F2-pdf-transcript.md).

## 1. Escopo desta delta

- **Mudança analisada:** introdução de 4 sistemas externos NOVO·PART (WhatsApp Bot, STT provider, Classificador, Motor de alertas), redesenho do wizard em 8 telas, novo endpoint `POST /api/denuncias/bot` e novas obrigações LGPD (art. 20).
- **Fora do escopo desta delta:** ameaças T-DEN-01..17 herdadas (permanecem abertas em [`09-THREAT-MODEL.md`](09-THREAT-MODEL.md) §5).
- **Owner de Segurança/DPO:** **pendente**.

## 2. Novos ativos e classificação

| Ativo | Classificação | Impacto | Retenção alvo | Fonte |
| --- | --- | --- | --- | --- |
| Áudio da denúncia (`relato_audio`) | **PII sensível — voz** | Exposição: identificação por biometria vocal; alteração: falsa autoria; indisponibilidade: perda de evidência | descartar após transcrição confirmada (DEC-DN-11 / P-F4-4) | DN-RF-004, DN-RS-002 |
| Transcrição do áudio (`relato_audio_transcricao`) | **Sigiloso + PII potencial** | Exposição: mesma do relato textual; adiciona risco de erro do STT criar conteúdo falso | igual ao relato textual | DN-RS-002 |
| Metadados WhatsApp (`bot_metadata.session_id`, número mascarado) | **PII sensível (número parcial)** | Correlacionar denúncia com telefone; risco de reidentificação | zero após envio; máscara antes do log | DN-RS-001 |
| Envelope enviado ao Classificador | **Sigiloso — pós-anonimização** | Se anonimização falhar, PII exposta a terceiro | trânsito apenas | DN-RS-003 |
| Categoria + Prioridade retornadas | **Interno** | Alteração: falsa prioridade urgente; exposição: enumeração de categorias | log 10 d | DN-RS-003 |
| Payload de alerta operacional | **Interno agregado** | Exposição: canal ops mal configurado revela padrão de denúncias | conforme SLA de alerta (DEC-DN-22) | DN-RS-004 |
| Chave HMAC do WhatsApp Adapter | **Secret** | Comprometimento permite forjar denúncias no BotIngress | ciclo próprio; rotação ≥ 90 d | P-F4-2 |
| Credencial STT / Classificador / Alertas | **Secret** | Uso indevido gera custo e potencial vazamento | ciclo próprio | DEC-DN-11/12/22 |

## 3. Novos fluxos (delta sobre §4 do original)

| ID | Origem | Destino | Dados | Protocolo/auth | Validações |
| --- | --- | --- | --- | --- | --- |
| F-DN-01 | Angular SPA | BFF | `POST /api/denuncias` com `arquivo_audio` | HTTPS mesma origem | tamanho, formato, duração (DEC-DN-15/P-F2-1) |
| F-DN-02 | BFF | STT provider | `arquivo_audio` (streaming) | HTTPS + credencial | timeout, retry, política fail-closed em prod |
| F-DN-03 | BFF | Classificador | envelope pós-anonimização | HTTPS ou local | timeout; nunca enviar PII |
| F-DN-04 | BFF | Motor de alertas | payload agregado sem PII | HTTPS/webhook/SIEM | payload validado antes do despacho |
| F-DN-05 | Cidadão | WhatsApp Business API | mensagens | canal do provedor (fora do escopo do MPT) | — |
| F-DN-06 | WhatsApp Bot Adapter | BFF | `POST /api/denuncias/bot` | HTTPS + HMAC + timestamp | assinatura, janela de replay, schema validation |
| F-DN-07 | Cidadão | Redirect Ouvidoria | UI escolha "Fale com a Ouvidoria" | link externo HTTPS | validação de destino |

Estes fluxos precisam ser rastreados **ponta a ponta** com `X-Request-ID`, incluindo o `session_id` do bot quando aplicável (sem log do número em claro).

## 4. Novas ameaças (T-DN-\*)

### 4.1 Transcrição de áudio (STT)

| ID | Fluxo/ativo | Ameaça (STRIDE) | Controle proposto | Impacto | Prob. | Ação/teste | Owner | Risco residual |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **T-DN-01** | F-DN-02 / `relato_audio` | **I** — provedor STT retém áudio; PII vocal exposta | contratual + `retention=min`; consentimento explícito antes de habilitar áudio; opção de submeter sem transcrição | Alto (LGPD + biometria) | Média | integ-sim com mock STT; auditoria contratual do provedor | DPO / Segurança | Alto até DEC-DN-11 |
| **T-DN-02** | F-DN-02 | **T** — STT retorna transcrição errada que altera contexto do relato | UI mostra transcrição para revisão editável antes do envio (DN-RS-002 aceite) | Médio | Alta | Playwright e2e cobrindo `TranscricaoStatus.CONCLUIDA` e `.FALHA` | Frontend + Produto | Baixo após correção |
| **T-DN-03** | F-DN-01/02 | **D** — envio de áudio muito grande satura BFF/STT | limite duração/tamanho no cliente e servidor (P-F2-1); rate limit por IP | Médio | Média | unit + integ-sim com fixture no limite | Backend | Baixo |
| **T-DN-04** | F-DN-02 | **S** — atacante submete áudio malicioso (payload dentro do container audio) | ClamAV inspeciona antes de encaminhar ao STT; MIME + magic bytes (RS-03 herdado) | Alto | Baixa | integ-sim com EICAR-in-audio + malformed container | Segurança | Médio |

### 4.2 Categorização automática (Classificador)

| ID | Fluxo/ativo | Ameaça (STRIDE) | Controle proposto | Impacto | Prob. | Ação/teste | Owner | Risco residual |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **T-DN-05** | F-DN-03 | **I** — envelope contém PII residual que vaza ao classificador | `applyAnonimizationRules()` antes de `ClassifierProxy.classify()`; teste automatizado que rejeita PII no payload | Alto (LGPD) | Média | unit (regex/allowlist do payload) + integ-sim | Backend + DPO | Médio até controle testado |
| **T-DN-06** | F-DN-03 | **E** — atacante forja envelope com prioridade URGENTE para inflar alertas | classificação server-side, ignora prioridade vinda do cliente; `Prioridade` só do classificador | Médio | Média | contrato: prioridade não é campo aceito no request | Backend | Baixo |
| **T-DN-07** | F-DN-03 | **R** — decisão automatizada sem log de auditoria; usuário não pode contestar | `Classificacao.metodo`, `versao_classificador`, `revisada_por_humano` obrigatórios em log e envelope MPT | Médio (LGPD art. 20) | Alta | teste que verifica presença dos 3 campos em cada envelope MPT | Segurança / DPO | Médio até controle testado |
| **T-DN-08** | F-DN-03 | **T** — modelo ML enviesado penaliza denúncias de grupos vulneráveis | monitoramento periódico da distribuição de prioridade × grupo vulnerável; revisão humana obrigatória para prioridade URGENTE | Alto (LGPD + reputacional) | Baixa (opera com denúncias variadas) | análise estatística offline com dado sintético | Produto + DPO | Alto até DEC-DN-12 |

### 4.3 Alertas inteligentes

| ID | Fluxo/ativo | Ameaça (STRIDE) | Controle proposto | Impacto | Prob. | Ação/teste | Owner | Risco residual |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **T-DN-09** | F-DN-04 | **I** — canal ops mal configurado envia alerta com PII | payload agregado sem PII (schema fixo); teste automatizado que rejeita PII no alerta | Alto (LGPD) | Média | unit do `AlertDispatcher` bloqueia campos não permitidos | Backend | Baixo |
| **T-DN-10** | F-DN-04 | **D** — flood de alertas satura canal ops | throttle server-side por categoria (janela) + agrupamento | Médio | Média | integ-sim com N denúncias urgentes em rajada | SRE | Baixo |
| **T-DN-11** | F-DN-04 | **S** — atacante induz classificação urgente para gerar caos | mitigação em T-DN-06 (prioridade só server-side) + revisão humana obrigatória (T-DN-07) | Médio | Baixa | integ-sim de payload manipulado | Segurança | Baixo |

### 4.4 Chatbot WhatsApp

| ID | Fluxo/ativo | Ameaça (STRIDE) | Controle proposto | Impacto | Prob. | Ação/teste | Owner | Risco residual |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **T-DN-12** | F-DN-05 | **I** — WhatsApp Business retém histórico da conversa; MPT perde controle sobre PII | Termo de uso explícito no início da conversa; consentimento LGPD; log do MPT armazena apenas envelope estruturado | Alto (LGPD) | Alta (canal externo) | auditoria do termo + amostragem de log | DPO / Produto | Alto até DEC-DN-09 |
| **T-DN-13** | F-DN-06 | **S** — atacante forja envelope no BotIngress sem passar pelo Adapter | HMAC-SHA256 sobre body + `X-Bot-Timestamp` (janela ≤ 5 min); rotação de chave | Alto | Média | unit + integ-sim com HMAC inválido, timestamp expirado, replay | Backend + Segurança | Baixo após implementar |
| **T-DN-14** | F-DN-06 | **T** — Adapter modifica denúncia antes de encaminhar | denúncia assinada também pelo cliente WhatsApp (não trivial) OU log completo do Adapter para reprodutibilidade | Médio | Baixa | log auditável do Adapter; hash da conversa vs envelope | Segurança | Médio |
| **T-DN-15** | F-DN-06 | **R** — usuário nega ter feito a denúncia via WhatsApp | Adapter preserva `session_id` + hash da conversa em log auditável (retenção definida); usuário recebe confirmação no canal | Médio | Média | teste manual: enviar denúncia bot → confirmar recebimento | Produto / Legal | Baixo |
| **T-DN-16** | F-DN-06 | **D** — bot sofre flood via API pública WhatsApp | rate limit por `bot_session_id` no BotIngress + backpressure no Adapter | Médio | Média | integ-sim com N requests concorrentes | SRE | Baixo |
| **T-DN-17** | F-DN-06 | **E** — atacante usa BotIngress para chamar endpoints internos do BFF | BotIngress **só** encaminha para `ComplaintController.receberDenuncia` (whitelist); nunca para `/health`, `/docs`, admin | Alto | Baixa | teste unitário do router; DAST fora do escopo | Backend | Baixo |

### 4.5 Wizard mobile-first e acessibilidade

| ID | Fluxo/ativo | Ameaça (STRIDE) | Controle proposto | Impacto | Prob. | Ação/teste | Owner | Risco residual |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **T-DN-18** | F-01 wizard | **R** — usuário mobile perde estado ao trocar de app | auto-save `sessionStorage` (herda T-DEN-17); mensagem de recuperação ao voltar | Médio (UX) | Alta | Playwright emula background/foreground | Frontend | Baixo |
| **T-DN-19** | Tela Sigilo | **R** — usuário alega não ter visto aviso de não-compartilhamento | contraste AAA no aviso (DN-RG-005); confirmação explícita registrada em log com timestamp | Médio (LGPD) | Média | axe-core AAA no aviso + Playwright registra clique | Frontend + Legal | Baixo |
| **T-DN-20** | Vídeo institucional | **I** — vídeo hospedado externamente rastreia usuário (cookies) | vídeo self-hosted ou provedor sem cookies (`ytdl` privacy-enhanced, `Vimeo do-not-track`, etc.) | Baixo (privacidade) | Média | inspeção de headers/cookies no Playwright | Frontend + DPO | Baixo |

## 5. Ameaças à cadeia de suprimentos NOVO

| ID | Ativo | Ameaça | Controle | Owner |
| --- | --- | --- | --- | --- |
| **T-DN-21** | Provedor STT | dependência crítica de terceiro (LGPD + custo + disponibilidade) | contrato com SLA + fallback (áudio sem transcrição) | DPO + SRE |
| **T-DN-22** | Provedor Classificador (SaaS ou modelo) | risco de reidentificação por logs do provedor | executar on-prem ou provedor com contrato zero-retention | Segurança + Arquitetura |
| **T-DN-23** | WhatsApp Business API | provedor pode alterar API/preços/política; risco de vendor lock-in | abstrair contrato via BotIngress; monitorar termos de uso | Produto |

## 6. Checklist específico do novo leiaute

- [ ] Áudio de denúncia: consentimento explícito, limite de tamanho/duração, redação de metadados EXIF.
- [ ] Transcrição: usuário pode editar antes do envio; falha do STT não bloqueia envio.
- [ ] Classificador: envelope pós-anonimização; log da versão do classificador; revisão humana obrigatória para URGENTE.
- [ ] Alertas: payload agregado sem PII; throttle por categoria; canal alvo aprovado.
- [ ] Bot WhatsApp: HMAC + timestamp + retention mínima; termo LGPD na primeira mensagem.
- [ ] Wizard: auto-save; contraste AAA no aviso de sigilo; confirmação registrada.
- [ ] Anonimização: `applyAnonimizationRules()` roda antes de qualquer chamada externa (STT / Classificador / MPT).
- [ ] Nenhum dos 4 serviços NOVO·PART chamado com dado real em CI.

## 7. Decisão do delta

- **Resultado:** **APROVADO COM RISCO** — arquitetura-alvo é implementável, mas exige DEC-DN-07..23 antes de fatias serem aprovadas.
- **Riscos aceitos:** nenhum; owner de Segurança/DPO **pendente**.
- **Correções obrigatórias antes de fatia produtiva:**
  - implementar `applyAnonimizationRules()` (T-DN-05, T-DN-09) — precede todos os serviços externos NOVO.
  - implementar HMAC + timestamp no BotIngress (T-DN-13) — só se DEC-DN-09 aprovar.
  - contratar retenção mínima no STT (T-DN-01) — só se DEC-DN-11 aprovar.
  - garantir revisão humana obrigatória para URGENTE (T-DN-07, T-DN-08) — só se DEC-DN-12 aprovar.
- **Prazo de reavaliação:** a cada resposta a DEC-DN-\*.

## 8. Perguntas geradas em F4 (P-F4-security-\*)

| ID | Pergunta | Owner esperado |
| --- | --- | --- |
| **P-F4-sec-1** | O MPT possui SIEM que aceite webhook de alertas, ou o Motor de Alertas deve escrever em canal próprio? | SRE / Segurança |
| **P-F4-sec-2** | Consentimento LGPD para áudio pode ficar em um único checkbox (junto com o consentimento geral) ou precisa ser separado? | DPO / Legal |
| **P-F4-sec-3** | O fluxo de revisão humana obrigatória para URGENTE (T-DN-07) exige interface administrativa nova? Isso é escopo desta iniciativa ou de outra fatia? | Produto |
| **P-F4-sec-4** | Termo de uso na primeira mensagem WhatsApp precisa passar por Jurídico antes de ser codificado no Adapter? | Legal / Produto |
| **P-F4-sec-5** | Se o provedor STT for on-prem (por LGPD), Ops tem capacidade para hospedar e operar? | SRE |

## 9. Limitações

- Todas as ameaças `T-DN-*` são **hipotéticas** enquanto o código não for autorizado a receber os novos módulos.
- Sem SAST/DAST executados neste ciclo.
- Sem revisão de secrets em `.env` (proibido pelo charter do subagente).
- Sem consulta a TLC (rede não autorizada nesta fase).
- Sem revisão jurídica assinada por DPO.
