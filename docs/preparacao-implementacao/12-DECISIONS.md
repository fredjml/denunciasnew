# DECISIONS — Canal de Denúncias

Registro de decisões materiais que precisam ser tomadas **antes** ou **durante** os blocos de implementação em [11-IMPLEMENTATION-PLAN.md](11-IMPLEMENTATION-PLAN.md). Cada linha exige owner competente + data + evidência anexa.

Formato de decisão: `contexto → alternativas → decisão → consequência → owner → status`.

## Decisões abertas (pré-implementação)

### DEC-01 — Ownership do protocolo e "aceite" da denúncia

- **Contexto**: BFF gera `MPT-XXXXXXXX` localmente antes de chamar API MPT. Documentação histórica sugere protocolo retornado pelo MPT (drift D-04).
- **Fontes**: `frontend/AGENTS.md`, `planejamento.md`, `server/services/complaint.service.js`, [`contrato/README.md`](../licoesaprendidas/contrato/README.md).
- **Alternativas**:
  1. Manter protocolo local no BFF, com correlação por `X-Request-ID`. Vantagem: independência do MPT. Desvantagem: não corresponde ao "aceite MPT".
  2. Adotar protocolo retornado pela API MPT como fonte oficial. Vantagem: alinhamento com o backoffice. Desvantagem: acoplamento e latência.
  3. Híbrido: protocolo local como recibo do BFF + protocolo oficial do MPT após aceite. Vantagem: continuidade em falha externa. Desvantagem: contrato duplo, risco de UX.
- **Decisão**: **pendente**.
- **Consequência**: Bloqueia RF-06/07 finais, RS-01 (formato do protocolo local), F2 do plano.
- **Owner**: Integração MPT + Produto + Segurança.
- **Status**: **aberto — bloqueador**.

### DEC-02 — Política fail-open/fail-closed por ambiente

- **Contexto**: Development aceita ausência de MPT/ClamAV (drift D-05); produção precisa fail-closed.
- **Fontes**: `server/index.js`, [`docs/licoesaprendidas/00-mapa-origens-baseline-drift.md`](../licoesaprendidas/00-mapa-origens-baseline-drift.md) linha D-05.
- **Alternativas**:
  1. Fail-closed em todos os ambientes; dev usa doubles determinísticos. Vantagem: uniformidade. Desvantagem: fricção em dev sem infra.
  2. Fail-open explícito em dev com **rótulo/label** na resposta (`simulated:true`); fail-closed em prod. Vantagem: pragmatismo. Desvantagem: risco de confundir teste com live.
- **Decisão**: **pendente**.
- **Consequência**: Bloqueia RNF-REL-01 e fatia F3.
- **Owner**: Segurança + Infra + Produto.
- **Status**: **aberto**.

### DEC-03 — Retenção de logs, anexos temporários e rascunhos

- **Contexto**: RELATORIO_FINAL sugere 10 dias para logs; sem política oficial. Rascunho `sessionStorage` (RF-16) precisa política de descarte.
- **Fontes**: RELATORIO_FINAL_SANITIZACAO §Escopo; LGPD.
- **Alternativas**: retenção legal-máxima documentada por DPO; TTL por categoria; anonimização automatizada.
- **Decisão**: **pendente**.
- **Consequência**: Bloqueia RNF-PRV-01, RNF-OBS-01.
- **Owner**: DPO + Jurídico + Infra.
- **Status**: **aberto**.

### DEC-04 — Runtime CI e engines

- **Contexto**: CI observado `Node 22.22.3`; manifest exige `^24.15 || >=26` (drift D-07).
- **Alternativas**:
  1. Atualizar CI para Node 24.15+ (recomendado).
  2. Relaxar `engines` do manifest (**não recomendado**).
- **Decisão**: **pendente**.
- **Consequência**: Bloqueia RG-03; alimenta fatia A1.
- **Owner**: Infra + Dev.
- **Status**: **aberto — solução técnica trivial; requer autorização de mudança de infra**.

### DEC-05 — Browser matrix corporativa

- **Contexto**: Playwright cobre Chromium/Firefox/WebKit; política institucional não confirmada.
- **Alternativas**: adotar Angular Baseline; adotar matriz institucional; combinar.
- **Decisão**: **pendente**.
- **Consequência**: Alimenta plano de teste manual e Safari real em homologação.
- **Owner**: QA + Infra.
- **Status**: **aberto**.

### DEC-06 — Consentimento LGPD e política vinculada

- **Contexto**: SEC-10 ainda não implementado; texto e link à política precisam existir e ser mantidos.
- **Alternativas**: link para política já publicada; nova política específica do canal.
- **Decisão**: **pendente**.
- **Consequência**: Bloqueia RP-01, fatia B3.
- **Owner**: DPO + Jurídico + Produto.
- **Status**: **aberto**.

### DEC-07 — Uso de modo "anônimo" × pseudonimização

- **Contexto**: Modo anônimo implica remoção completa de PII (RF-14). Pseudonimização (ex.: token de retorno) exigiria armazenamento — hoje inexistente.
- **Alternativas**: puramente anônimo; anônimo com token de retorno; retenção limitada de contato para acompanhamento (opt-in).
- **Decisão**: **pendente**.
- **Consequência**: Alimenta RF-14 e caso de uso UC-06.
- **Owner**: DPO + Produto.
- **Status**: **aberto**.

### DEC-08 — Contrato entre `fetch` e `HttpClient` no Angular

- **Contexto**: `planejamento.md` menciona `HttpClient`; código usa `fetch` (drift D-03).
- **Alternativas**: manter `fetch` (baixo custo); migrar para `HttpClient` (padrão Angular + interceptors).
- **Decisão**: **pendente** (não bloqueia P0).
- **Consequência**: Impacta RF-17 (AbortController via `HttpClient` seria via `Observable.pipe(takeUntil)`).
- **Owner**: Frontend + Arquitetura.
- **Status**: **aberto — decisão arquitetural adiável**.

### DEC-09 — Adoção da skill deste pacote

- **Contexto**: Este pacote inclui [`skills/denuncias-preparacao-implementacao/SKILL.md`](skills/denuncias-preparacao-implementacao/SKILL.md).
- **Alternativas**: usar apenas como referência; instalar em `~/.claude/skills/` ou `.copilot/skills/` após auditoria.
- **Decisão**: **pendente**.
- **Consequência**: Habilita orquestração automática do fluxo de preparação em conversas futuras.
- **Owner**: Owner do ambiente do agente.
- **Status**: **aberto**.

### DEC-10 — Uso de MCPs externos

- **Contexto**: Nenhum MCP é obrigatório; GitHub MCP e Browser MCP são candidatos.
- **Consequência**: Se aprovado, alimenta [04-MCP.md](04-MCP.md).
- **Owner**: Segurança + Compliance + Owner do ambiente.
- **Status**: **aberto**.

## Decisões tomadas (registrar aqui após aprovação)

| ID | Decisão | Data | Owner | Evidência | Nota |
| --- | --- | --- | --- | --- | --- |
| — | — | — | — | — | — |

## Regras de manutenção

- Cada decisão tomada substitui a linha "pendente" na tabela original com a decisão + link para evidência.
- Reversão de decisão requer nova linha (nunca reescrever histórico).
- Decisões que envolvam LGPD, contrato externo ou perímetro exigem assinatura + data.
- Sem owner competente, a decisão permanece bloqueadora.
