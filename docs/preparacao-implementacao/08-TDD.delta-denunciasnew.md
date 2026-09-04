# 08-TDD — Delta `denunciasnew`

> **Delta proposto.** Não substitui [`08-TDD.md`](08-TDD.md). Consolida a arquitetura-alvo do **novo leiaute** derivada do PDF externo (F2) e dos diagramas `denunciasnew-*` (F3).
>
> **Fase:** F4. **Autorização:** `SOMENTE_LEITURA + DOCUMENTAÇÃO`. **Rede TLC:** não autorizada nesta fase.
> **Fontes:** `docs/Documento externo-outros 010970.2026.pdf` (transcrito em [`prompts/fases/F2-pdf-transcript.md`](prompts/fases/F2-pdf-transcript.md)), [`06-REQUIREMENTS.delta-denunciasnew.md`](06-REQUIREMENTS.delta-denunciasnew.md), diagramas `denunciasnew-*.mmd` ([contexto](../diagramas-mermaid/denunciasnew-contexto.mmd), [containers](../diagramas-mermaid/denunciasnew-c4-containers.mmd), [componentes](../diagramas-mermaid/denunciasnew-c4-componentes.mmd), [classes](../diagramas-mermaid/denunciasnew-classes.mmd), [casos-de-uso](../diagramas-mermaid/denunciasnew-casos-de-uso.mmd)).
>
> **Bloqueador transversal:** `cidadania-canal-denuncias/**` indisponível (D-DN-06) → todas as afirmações sobre código atual permanecem `ND`. Este delta descreve **arquitetura-alvo do novo leiaute**, não a implementada.

## 1. Convenção

- Cada bloco reflete o padrão de [`08-TDD.md`](08-TDD.md), mas **como delta**: só o que muda em relação ao histórico + o que é `NOVO`.
- `NOVO`, `PART`, `HERDADO`, `ND` conforme convenção de F2.
- Numeração de seções desta delta cresce a partir de §D1.

## D1. Topologia-alvo do novo leiaute

Substitui conceitualmente §1 de [08-TDD.md](08-TDD.md) enquanto o ciclo `denunciasnew` estiver ativo. **NÃO** sobrescreve o original.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        Ambiente do cidadão (mobile-first)                    │
│                                                                              │
│   Navegador móvel (≤ 360 px) + Navegador desktop (fallback)                  │
│      │  HTTPS · WCAG 2.1 (ou 2.2 AA · DEC-DN-07)                            │
│      ▼                                                                       │
│   Angular SPA · Wizard 8 telas (Progressive Disclosure)                     │
│      Acolhimento → Relato Guiado → Detalhamento → Evidências                │
│      → Sigilo/Anonimato → Local → Revisão → Confirmação                     │
│      • Componentes NOVOS: ChecklistIrregularidades, AudioRecorder,          │
│        InfograficoFluxo, StepSigiloAnonimato                                │
│      • Estado: ComplaintService (signals) · HERDADO                          │
│      • HTTP: ComplaintApiClient (fetch + FormData) · HERDADO                 │
└──────────────────────────────┬──────────────────────────────────────────────┘
                               │  POST /api/denuncias (multipart)             │
                               ▼                                              │
┌─────────────────────────────────────────────────────────────────────────────┐│
│                              BFF Express (redesenho parcial)                ││
│                                                                              ││
│  Bootstrap (Helmet + CORS + morgan) · HERDADO                               ││
│    └─ RateLimiter (Redis) · HERDADO                                         ││
│        └─ Complaint Router · HERDADO                                        ││
│            └─ Upload Middleware (Multer diskStorage · D-01)                 ││
│                └─ ComplaintController                                       ││
│                    ├─ ComplaintDomainService                                ││
│                    │   └─ applyAnonimizationRules() · NOVO                  ││
│                    ├─ ClamAvClient · HERDADO                                ││
│                    ├─ SttProxy · NOVO · PART (DEC-DN-11)                    ││
│                    ├─ ClassifierProxy · NOVO · PART (DEC-DN-12)             ││
│                    ├─ AlertDispatcher · NOVO · PART (DEC-DN-22)             ││
│                    └─ MptApiClient · HERDADO                                ││
│  BotIngress (rota alternativa) · NOVO · PART (DEC-DN-09)                    ││
│      └─ recebe webhook do WhatsApp Bot Adapter                              ││
└──────────────────────────────┬──────────────────────────────────────────────┘│
                               │
      ┌────────────┬───────────┴───────────┬────────────┬────────────┐
      ▼            ▼                       ▼            ▼            ▼
   ClamAV      Redis                    API MPT      IBGE      Ouvidoria
  (INSTREAM)  (rate-limit)           (institucional) (locais)  (redirect)
  HERDADO      HERDADO                  HERDADO       HERDADO   HERDADO
                                                                     ▲
                                                                     │
                                                             (redirect via UI)

   ─── NOVO · PART (canais externos propostos pelo PDF) ─────────────────
   WhatsApp Business API ── WhatsApp Bot Adapter (contêiner separado ou serviço)
   STT provider          ── SttProxy no BFF
   Classificador          ── ClassifierProxy no BFF
   Motor de alertas       ── AlertDispatcher no BFF
```

Detalhamento visual: [denunciasnew-c4-containers.mmd](../diagramas-mermaid/denunciasnew-c4-containers.mmd) e [denunciasnew-c4-componentes.mmd](../diagramas-mermaid/denunciasnew-c4-componentes.mmd).

## D2. Runtime, dependências e execução

### D2.1 Frontend — redesenho parcial

- **Runtime:** ND-CÓDIGO. Herança do §2.1 de [08-TDD.md](08-TDD.md): Angular 22.0.5, TS 6.0.2. **Não confirmado** neste ciclo.
- **Novas dependências candidatas** (a instalar via fatia autorizada em F6, não nesta fase):
  - `MediaRecorder API` — nativa (sem dependência npm).
  - Componente de checklist visual — sugerido puro Angular (sem dependência externa). Alternativa: `@angular/cdk` (`SelectionModel`) — já pode ser transitiva do CDK.
  - Renderização SVG do infográfico — Angular puro; sem dependência.
  - Preview de transcrição — apenas UI, backend faz a chamada real (SttProxy).
- **Sem dependência nova mandatória** para MVP mobile-first (DN-RNF-002) além do que já está no manifest histórico.

### D2.2 Backend — extensões

Novos módulos no BFF (contêiner único — mantém decisão de deployability herdada de [`../diagramas-mermaid/README.md`](../diagramas-mermaid/README.md) §Premissas):

| Módulo | Papel | Dependência externa | Estado | Decisão bloqueadora |
| --- | --- | --- | --- | --- |
| `SttProxy` | encaminha áudio para provedor STT | HTTPS + credencial | NOVO · PART | DEC-DN-11 |
| `ClassifierProxy` | envia relato ao classificador | HTTPS ou local | NOVO · PART | DEC-DN-12 |
| `AlertDispatcher` | despacha alerta em pauta urgente | canal ops (SIEM/e-mail/webhook) | NOVO · PART | DEC-DN-22 |
| `BotIngress` | recebe envelope do WhatsApp Adapter | HTTPS + assinatura HMAC | NOVO · PART | DEC-DN-09 |
| `applyAnonimizationRules()` (extensão de `ComplaintDomainService`) | reforçar sigilo LGPD antes de encaminhar | — | NOVO | — |

### D2.3 Novo contêiner externo (opcional) — WhatsApp Bot Adapter

Se DEC-DN-09 aprovar chatbot no MVP:

- Contêiner separado (Node.js ou provedor SaaS gerenciado).
- Converte conversa em envelope compatível com `POST /api/denuncias`.
- Autenticação com o BFF via HMAC ou mTLS.
- **Fora do escopo** deste TDD detalhar o adapter; deve ter TDD próprio ou fatia dedicada.

## D3. Contratos afetados

### D3.1 Endpoint `POST /api/denuncias` — campos novos

Referência: §3 de [08-TDD.md](08-TDD.md) e [`06-REQUIREMENTS.delta-denunciasnew.md`](06-REQUIREMENTS.delta-denunciasnew.md).

Campos **NOVOS** no JSON `denuncia`:

| Campo | Tipo | Origem | Requisito | Estado |
| --- | --- | --- | --- | --- |
| `origem` | `WEB | WHATSAPP_BOT` | UI ou Bot | DN-RG-002, DN-RS-001 | NOVO |
| `irregularidades` | `Irregularidade[]` (código + rótulo) | checklist visual | DN-RF-003 | NOVO · PART (DEC-DN-10) |
| `relato_audio_transcricao` | string | STT ou usuário | DN-RS-002 | NOVO · PART |
| `relato_audio_transcricao_status` | `TranscricaoStatus` | BFF | DN-RS-002 | NOVO · PART |
| `numero_prejudicados` | `FaixaTrabalhadores` | UI | DN-RF-005 | NOVO · PART (DEC-DN-13) |
| `modalidade_trabalho` | `ModalidadeTrabalho` | UI | DN-RF-006 | NOVO · PART (DEC-DN-14) |
| `grupos_vulneraveis` | `GrupoVulneravel[]` | UI | DN-RF-007 | NOVO |
| `testemunhas` | `Testemunha[]` | UI | DN-RF-009 | NOVO · PART (DEC-DN-16) |
| `classificacao` (retorno) | `Classificacao` | BFF (via ClassifierProxy) | DN-RS-003 | NOVO · PART (DEC-DN-12) |

### D3.2 Novo endpoint `POST /api/denuncias/bot`

Somente se DEC-DN-09 aprovar chatbot no MVP.

- **Método:** `POST /api/denuncias/bot`.
- **Auth:** HMAC-SHA256 (`X-Bot-Signature`) sobre o body + `X-Bot-Timestamp` (janela ≤ 5 min).
- **Body:** JSON com mesmo `Complaint` do web + `bot_metadata` (session_id, número mascarado). Sem `MessageBird raw payload` para minimizar surface LGPD.
- **Resposta:** 201 + `protocolo` (mesmo formato que `POST /api/denuncias`).
- **Rate limit:** compartilha o mesmo store Redis, chave separada por `bot_id` (não IP).
- **Estado:** contrato `NOVO · PART` — sujeito a DEC-DN-09.

### D3.3 Contrato interno BFF → STT

- **Método:** definido pelo provedor (DEC-DN-11).
- **Restrições invariáveis:**
  - Áudio nunca sai do BFF em canal não-TLS.
  - Consentimento explícito do usuário antes de enviar (DN-RF-004 + LGPD).
  - Retenção no provedor **deve** ser configurada com o menor prazo disponível.
  - Se provedor falhar/timeout, o áudio segue como anexo sem transcrição (`TranscricaoStatus.FALHA`); envio da denúncia **não** bloqueia.

### D3.4 Contrato interno BFF → Classificador

- Consumo: envelope pós-anonimização.
- **Nenhum campo de PII** deve ser enviado ao classificador. `applyAnonimizationRules()` roda **antes** do `ClassifierProxy.classify()`.
- Se DEC-DN-12 optar por **modelo ML**, `Classificacao.metodo = MODELO_ML` e revisão humana passa a ser obrigatória (LGPD art. 20 — DN-RS-003).

### D3.5 Contrato interno BFF → Motor de alertas

- Payload agregado, **sem PII**, apenas `{ protocolo, categoria, prioridade, uf, municipio, timestamp }`.
- SLA de despacho e canal alvo: DEC-DN-22.

## D4. Estados do wizard (delta sobre 08-estados-wizard.mmd)

Nova máquina de 8 estados substitui os 7 estados do wizard atual:

```
ACOLHIMENTO → RELATO_GUIADO → DETALHAMENTO → EVIDENCIAS
   → SIGILO_ANONIMATO → LOCAL_EMPRESA → REVISAO → CONFIRMACAO
```

Regras de transição (delta):

- `ACOLHIMENTO` bloqueia avanço até uma das 3 opções ser escolhida (DN-RF-001).
- `RELATO_GUIADO` bloqueia avanço até `irregularidades[].length ≥ 1` (DN-RF-003).
- `EVIDENCIAS` permite `attach` opcional; se `AudioRecorder` estiver em execução, avanço bloqueia até `stop`.
- `SIGILO_ANONIMATO` requer confirmação explícita do aviso de não-compartilhamento (DN-RG-005).
- `REVISAO` permite `edit(step)` que retorna ao passo mantendo estado.

## D5. Requisitos não funcionais alvo

| RNF | Alvo | Fonte | Verificação prevista |
| --- | --- | --- | --- |
| Acessibilidade | WCAG 2.1 AA (mínimo) / 2.2 AA (recomendado) | DN-RNF-001, DEC-DN-07 | `axe-core` em Playwright multi-browser + auditoria manual |
| Mobile-first | ≤ 360 px sem scroll horizontal; áreas de toque ≥ 44×44 px | DN-RNF-002 | Playwright multi-viewport |
| Performance mobile | LCP ≤ 4 s em `Slow 3G`; TTI ≤ 6 s | DN-RNF-003 (DEC-DN-08) | Lighthouse `--preset=perf --form-factor=mobile` |
| Privacidade | zero PII em log; retenção definida | DN-RNF-004 (DEC-DN-18) | inspeção de amostra de log; teste automatizado de redaction |
| Cobertura de testes | ≥ 70% unit por camada (ND) | herdado | Vitest / Playwright |

## D6. Diferenças por ambiente

Mantém a política herdada:

- **Development:** ClamAV/Redis/MPT podem ficar indisponíveis (drift D-05); `NOVO · PART` (STT, Classificador, Alertas) usam **mock/stub** — nunca provedor real em dev.
- **Test/CI:** interceptação Playwright de API + Vitest com Supertest. Nunca chamar STT/Classificador reais em CI (custo + LGPD).
- **Production:** todos os serviços externos são obrigatórios; **fail-closed** para STT (falha ⇒ envio segue sem transcrição), Classificador (falha ⇒ envio segue sem classificação, alertas suspensos), Alertas (falha ⇒ retry com backoff, log crítico para SRE).

## D7. Perguntas técnicas geradas em F4 (P-F4-\*)

| ID | Pergunta | Owner esperado |
| --- | --- | --- |
| **P-F4-1** | O BotIngress deve compartilhar o `ComplaintController` (reuso) ou ter controller próprio? Impacto em rate limit e observabilidade. | Arquitetura |
| **P-F4-2** | Onde reside a chave HMAC do WhatsApp Adapter? Vault dedicado ou variável de ambiente? | Segurança |
| **P-F4-3** | O `applyAnonimizationRules()` roda em modo síncrono (bloqueando envio ao MPT) ou pipeline? | Arquitetura |
| **P-F4-4** | Retenção de áudio no BFF após envio: descartar imediatamente ou manter por N horas para auditoria? | DPO / Segurança |
| **P-F4-5** | O Classificador pode gerar `Prioridade.URGENTE` mesmo se `MetodoClassificacao.MODELO_ML` sem revisão humana prévia? | Jurídico / Produto |
| **P-F4-6** | Alertas devem ir para SIEM já contratado, e-mail de plantão, ou canal específico? | SRE / Segurança |

## D8. Estado consolidado

- **Arquitetura-alvo definida** para o novo leiaute, com marcadores NOVO/PART/HERDADO em cada elemento.
- **Nenhum código foi alterado.**
- **14 dos 24 requisitos** dependem de decisão (`DEC-DN-07..23`).
- **6 novas perguntas técnicas** (P-F4-1..6) para o owner.
