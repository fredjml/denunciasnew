# PRD — Product Requirements Document
## Canal de Denúncias do MPT (Cidadania)

> Status: **rascunho executivo** derivado da fonte primária (`cidadania-canal-denuncias/AGENTS.md`, `planejamento.md`, `spec_design.md`) e dos relatórios em `docs/Analises/*.md`. Não é aprovação de Produto; assinatura do Owner de Produto ainda **pendente**.
> Data: 2026-08-27 · Branch: `stg` · Compilação estática.

## 1. Visão e Objetivo

O **Canal de Denúncias** é o front-office digital do MPT para receber denúncias de cidadãos e enviá-las, com anexos, para os sistemas internos do MPT via API externa. O produto reduz atrito no acolhimento da denúncia, viabiliza sigilo/anonimato e produz um protocolo verificável para acompanhamento.

Objetivos mensuráveis (candidatos — a homologar com Produto):

- **O-01** Reduzir para ≤ 3 minutos a mediana de tempo entre "Acolhimento" e "Confirmação" para denúncia simples sem anexos.
- **O-02** ≥ 99,5% de disponibilidade do canal público em janela mensal.
- **O-03** 100% das denúncias em modo anônimo **sem** PII (nome, e-mail, telefone) no payload enviado ao BFF ou API MPT — condição de LGPD.
- **O-04** 100% dos anexos aceitos submetidos ao ClamAV **antes** de encaminhamento à API MPT em produção.
- **O-05** Conformidade automatizada com WCAG 2.2 AA em todo o wizard (sem regressão em axe crítica).
- **O-06** 100% dos envios bem-sucedidos retornam um protocolo string não vazio ao cidadão em ≤ 30 s ou erro visível.

## 2. Público-alvo, personas e casos de uso

Personas primárias:

- **Cidadão denunciante** — leigo, mobile-first, possivelmente com PII sensível. Precisa clareza, sigilo opcional, acessibilidade real.
- **Denunciante anônimo** — quer garantir que a identificação **não** seja transmitida.
- **Cidadão com deficiência** — usa teclado, leitor de tela, contraste alto, zoom.

Personas secundárias (fora do canal, mas afetadas):

- **Operador MPT interno** — recebe a denúncia pela API MPT.
- **DPO/Jurídico** — auditoria de retenção, base legal, minimização.
- **AppSec/Infra** — monitora abuso, disponibilidade, logs.

Casos de uso principais (sintetizados do wizard atual):

- UC-01 Envio de denúncia identificada com ou sem anexos.
- UC-02 Envio anônimo (PII removida) com ou sem anexos.
- UC-03 Gravação de relato em áudio como anexo.
- UC-04 Retomar rascunho após recarga acidental (candidato — QA-04).
- UC-05 Reenvio após erro visível (retry sem duplicidade indevida).
- UC-06 Consumo do protocolo em canal de acompanhamento (fora do escopo do MVP publicado; depende de decisão futura).

## 3. Escopo

### Dentro do escopo

- Wizard mobile-first: `Acolhimento → StepIrregularidades → StepOcorrencias → StepEvidencias → StepIdentificacao → StepLocal → StepRevisao → Confirmation` (7 etapas).
- Coleta de metadados: UF, município, empresa/órgão, irregularidade, ocorrências, relato (texto/áudio), evidências (anexos), identificação opcional.
- Envio multipart `denuncia` (JSON) + `arquivo_N` (anexos) ao endpoint público `POST /api/denuncias` do BFF.
- Geração de protocolo local pelo BFF (`MPT-XXXXXXXX`) com fonte criptográfica (após correção do SEC-02).
- Antimalware em produção (ClamAV INSTREAM) com política fail-closed.
- Rate limit compartilhado (Redis) em produção.
- Consentimento LGPD antes do envio.
- Acessibilidade WCAG 2.2 AA (foco, teclado, contraste, leitor de tela, `aria-live`).

### Fora do escopo (registrar e não decidir por suposição)

- Autenticação/autorização de cidadão.
- Acompanhamento da denúncia após envio (fase 2).
- Painel administrativo interno (é responsabilidade dos sistemas MPT internos).
- Aceite/homologação da denúncia por analista humano — depende da API MPT.
- Integração direta com bases externas (Receita, CNPJ, etc.) — depende de decisão.

## 4. Requisitos funcionais (resumo executivo)

Detalhamento atômico em [06-REQUIREMENTS.md](06-REQUIREMENTS.md). Categorias:

| # | Categoria | Exemplo | Referência |
| --- | --- | --- | --- |
| RF-01–RF-12 | comportamento baseline observado | wizard, ComplaintService com signals, multipart, protocolo local | kit §02 |
| RF-13 | validação obrigatória por etapa | Wizard não avança sem obrigatórios | QA-01 |
| RF-14 | modo anônimo remove PII | Estado zera nome/e-mail/telefone; BFF sanitiza | QA-02/SEC-01 |
| RF-15 | áudio como multipart nomeado | `arquivo_audio` chega ao BFF | QA-03 |
| RF-16 | persistência de rascunho | `sessionStorage` restaurável | QA-04 |
| RF-17 | timeout observável e offline detectado | AbortController, `navigator.onLine`, erro em ≤ 30 s | QA-05 |
| RA-01 | acessibilidade das etapas | foco no `h1`, `aria-live`, `<label for>`, `aria-describedby` | Sugestões §2 |
| RP-01 | consentimento LGPD | checkbox obrigatório com link à política vigente | SEC-10 |

## 5. Requisitos não funcionais (resumo executivo)

| ID | Área | Meta candidata | Fonte |
| --- | --- | --- | --- |
| RNF-SEC-01 | segredos | `MPT_API_TOKEN` e URL interna somente no BFF; nenhum log de PII/anexo/segredo | AGENTS + kit |
| RNF-SEC-02 | upload | limites, nome aleatório, temporário, magic bytes, ClamAV, cleanup | kit + SEC-03/04/05 |
| RNF-PRV-01 | LGPD | minimização, finalidade, base legal, retenção 10 d, sigilo/anonimato | RELATORIO_FINAL |
| RNF-A11Y-01 | acessibilidade | WCAG 2.2 AA com automação (axe) + inspeção manual (teclado, foco, leitor de tela, zoom) | Sugestões UX |
| RNF-REL-01 | resiliência | production **fail-closed** ao faltar MPT/ClamAV/Redis; development explícito como simulação | kit + D-05 |
| RNF-PERF-01 | performance | bundle ≤ 500 kB bruto / 120 kB transferido; envio simples ≤ 3 s p95 (a decidir) | RELATORIO_FINAL §10 |
| RNF-MNT-01 | manutenção | modelo TS, FormData, validação, payload MPT, Swagger e testes sincronizados | AGENTS #6 |
| RNF-REP-01 | reprodutibilidade | `npm ci` em frontend e server; Volta pinada; CI em Node compatível | drift D-07 |
| RNF-OBS-01 | observabilidade | logs correlacionados por `X-Request-ID`, sem PII/anexo/token; retenção aprovada | SEC-11 |

## 6. Métricas de sucesso (candidatas — depende de owner)

- Taxa de conclusão do wizard (`Confirmation` / `Acolhimento`).
- P95 tempo de envio (Angular → 201 BFF).
- Taxa de erro visível ao cidadão (por tipo: rede, 4xx, 5xx, timeout).
- Taxa de rejeição por antimalware (por MIME).
- Taxa de bloqueio por rate limit.
- Achados críticos abertos por severidade (P0/P1/P2/P3).

## 7. Estratégia de acessibilidade e privacidade

- WCAG 2.2 AA como alvo. axe automatizado em todas as etapas + inspeção manual periódica.
- Anonimato configurável: alternância obrigatória antes do envio; PII removida do estado **e** do payload servidor-side.
- Sanitização de texto livre (`relato_texto`, `nomes_dados`, `funcoes_setores`) antes do encaminhamento.
- Retenção mínima; sem persistência de rascunho contendo PII após sucesso/desistência.
- Consentimento explícito com link para política; sem opt-in tácito.

## 8. Dependências externas

- **API MPT** (contrato oficial pendente — **D-04 material**). Sem contrato firmado, o BFF gera protocolo local; documentação histórica sugere protocolo do MPT.
- **ClamAV** externo (INSTREAM TCP) — obrigatório em produção.
- **Redis** — obrigatório em produção (rate limit compartilhado, 3 réplicas do BFF).
- **Ambientes**: development pode aceitar ausência de MPT/ClamAV; production **não** pode.

## 9. Restrições e riscos executivos

- **LGPD**: SEC-01/QA-02 abertos bloqueiam produção. Owner: DPO.
- **Segurança de upload**: SEC-03/04/05 abertos exigem defesa em profundidade.
- **Regressão silenciosa**: REG-01/02/06 abertos impedem sinal automático de qualidade.
- **Drift de runtime** (D-07) exige alinhamento Node CI/manifest antes de release.
- **Drift de contrato** (D-04) exige decisão material antes de qualquer promessa sobre "aceite MPT".

## 10. Roadmap (sequência recomendada, sem datas)

1. Aprovar owners e assinar Gate 1 (requisitos).
2. Fechar decisões materiais (D-04, D-05, D-07, retenção, browser matrix).
3. Executar plano incremental por fatia P0 → P1 → P2/P3 (ver [11-IMPLEMENTATION-PLAN.md](11-IMPLEMENTATION-PLAN.md)).
4. Reexecutar suíte completa + evidência sanitizada.
5. Revisão adversarial e aceite humano.
6. Publicação/entrega mediante autorização just-in-time.
7. Post-mortem/aprendizado (Passos 10–11).

## 11. Aprovações necessárias antes de implementação

- [ ] Owner de Produto — assinatura dos requisitos e critérios de aceite.
- [ ] Owner de Segurança — threat model ([09-THREAT-MODEL.md](09-THREAT-MODEL.md)).
- [ ] DPO/Jurídico — RNF-PRV-01, retenção, anonimato, consentimento.
- [ ] Owner de Integração MPT — decisão D-04 (protocolo) e contrato oficial.
- [ ] Owner de Infra — Redis, ClamAV, CI/CD, runtime (D-07).
- [ ] Owner de QA/A11Y — plano de testes ([10-EVIDENCE-MANIFEST.md](10-EVIDENCE-MANIFEST.md)).

## Limitações

- Este PRD é **executivo**. O detalhe verificável e testável está em [06-REQUIREMENTS.md](06-REQUIREMENTS.md).
- Números citados (volume, budget, disponibilidade) vêm de relatórios historicos ou premissas de trabalho, **não** de SLA/SLO homologados.
- Nenhum item aqui autoriza implementação, commit ou uso de dados reais.
