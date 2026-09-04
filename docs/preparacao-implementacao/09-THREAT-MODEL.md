# SECURITY / Threat Model — Canal de Denúncias

Template base: [`templates/threat-model.md`](../licoesaprendidas/templates/threat-model.md).
Este modelo é derivado do kit e dos relatórios em `docs/Analises/`. Não substitui pentest, revisão DPO/jurídica ou capacidade de infraestrutura.

## 1. Escopo

- **Versão/commit**: leitura estática 2026-08-27, branch `stg`.
- **Mudança ou fluxo analisado**: envio ponta a ponta de denúncia (Angular → BFF → API MPT) + antimalware (ClamAV) + rate limit (Redis) + observabilidade.
- **Responsável**: **pendente** (owner de Segurança).
- **Data**: 2026-08-27.
- **Ambientes considerados**: development (mocks/doubles), test/CI (E2E com API mockada), production (integração real).
- **Fora de escopo**: pentest ativo (DAST), rede corporativa MPT, produção operacional de ClamAV/Redis, homologação legal.

## 2. Ativos e classificação

| Ativo | Classificação | Impacto de exposição/alteração/indisponibilidade | Retenção esperada | Evidência |
| --- | --- | --- | --- | --- |
| Denúncia (relato_texto, ocorrências, funções) | **Sigiloso** | Exposição: reputacional + risco pessoal ao denunciante. Alteração: perda de valor probatório. Indisponibilidade: perda do canal. | apenas trânsito; não persistir no BFF | Kit + LGPD |
| Identidade e opção de sigilo (nome, e-mail, telefone, `anonimo`) | **PII sensível** | Exposição: violação LGPD; retaliação. Alteração: falsa autoria. | zero após envio | RELATORIO_ANALISE §5.1 |
| Anexos (documentos, áudio) | **PII / possível conteúdo sensível** | Exposição: dados de terceiros; alteração: adulteração de prova; indisponibilidade: perda de evidência. | temporário durante scan/envio | Kit + RF-08/09 |
| Protocolo local (`MPT-XXXXXXXX`) | **Interno** | Exposição: enumeração; alteração: perda de rastreabilidade. | logs por 10 d | Kit + RS-01 |
| Credenciais/tokens (`MPT_API_TOKEN`, Redis, ClamAV) | **Secret** | Exposição: acesso indevido à API MPT; alteração: DoS interno. | ciclo de vida próprio | AGENTS §Guardrails 1 |
| Logs e telemetria | **Interno com risco** se conter PII | Exposição: LGPD; alteração: perda de auditoria. | 10 d sugerido; aprovar DPO | RELATORIO_FINAL |
| Disponibilidade do canal | **Serviço** | Indisponibilidade: cidadão sem canal, dano reputacional. | 99,5% sugerido | RELATORIO_FINAL |

## 3. Atores e zonas de confiança

- **Usuários legítimos**: cidadãos denunciantes (identificados ou anônimos).
- **Usuários maliciosos ou automatizados**: scrapers, bots de spam, atacantes que testam limites, exfiltradores.
- **Operadores e administradores**: Infra/DevOps do BFF, DBA Redis, Admin ClamAV, operadores MPT.
- **Serviços externos**: API MPT, ClamAV, Redis, provedor de e-mail (se houver), gateways de rede.
- **Atores internos ou credenciais comprometidas**: engenheiro com acesso não sancionado, secret escaping.

Zonas (kit):

1. Navegador.
2. Angular SPA.
3. BFF Express.
4. Armazenamento temporário de upload.
5. ClamAV.
6. Redis / rate limiting.
7. API MPT.
8. Logs, métricas e ferramentas de observabilidade.

Diagrama de fluxo em [08-TDD.md §1](08-TDD.md#1-topologia-geral).

## 4. Fluxos relevantes

| ID | Origem | Destino | Dados | Protocolo/autenticação | Validações | Evidência |
| --- | --- | --- | --- | --- | --- | --- |
| F-01 | Navegador | Angular SPA | interações UI | HTTPS mesma origem | validação de campo por etapa (RF-13) | UI + unit-front |
| F-02 | Angular SPA | BFF | `POST /api/denuncias` multipart | HTTPS mesma origem, `Origin` conferido | AbortController + retry (RF-17) | unit-front + integ-sim |
| F-03 | BFF (Multer) | Disco temporário | anexos | processo local, permissão restrita | limites + allowlist + magic bytes | integ-sim + live-BFF |
| F-04 | BFF | ClamAV | conteúdo do arquivo | TCP INSTREAM | timeout, retry, política fail-closed em prod | integ-sim (EICAR sintético) |
| F-05 | BFF | Redis | contador/rate-limit | TCP (TLS opcional) | TTL, fail-closed em prod | integ-sim |
| F-06 | BFF | API MPT | multipart + JSON | HTTPS + `MPT_API_TOKEN` | timeout, retry idempotente, `X-Request-ID` | live-MPT (autorizado) |
| F-07 | BFF | Logs/metrics | eventos sanitizados | Console/agent local | mask/redaction obrigatórios | auditoria de amostra |

Para anexos: rastrear o **mesmo arquivo** desde F-03 até F-06, com decisão do ClamAV registrada por `X-Request-ID`. Testes isolados por componente **não** demonstram essa correlação.

## 5. Ameaças, controles e risco residual

Baseline mínimo herdado dos relatórios (kit). Cada linha deve ser reavaliada contra o **commit atual** antes de fechada.

| ID | Fluxo/ativo | Ameaça | Controle atual comprovado | Evidência | Impacto | Probabilidade | Ação/teste | Owner | Risco residual |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-DEN-01 | F-02 / Payload | PII persiste em modo anônimo — vaza para BFF e potencialmente API MPT | inexistente/parcial | RELATORIO_ANALISE §5.1 SEC-01 | Alto (LGPD) | Alta | limpar no `ComplaintService` + defesa em profundidade no BFF (RF-14) | Frontend + Backend + DPO | Alto até corrigir |
| T-DEN-02 | F-02 | Áudio Blob descartado pelo `JSON.stringify` (perda silenciosa de evidência) | inexistente | RELATORIO_ANALISE §3.1 QA-03 | Alto | Alta | anexar como parte multipart nomeada + teste de contrato (RF-15) | Frontend + Backend | Alto até corrigir |
| T-DEN-03 | BFF | Protocolo com `Math.random()` — previsível | inexistente | RELATORIO_ANALISE §5.1 SEC-02 | Médio | Média | `crypto.randomUUID()` + teste determinístico (RS-01) | Backend + Segurança | Médio |
| T-DEN-04 | F-03 | `upload.any()` aceita campos arbitrários | inexistente | RELATORIO_ANALISE §3.2 QA-07 / §5.2 SEC-03 | Médio–Alto | Alta | `upload.array('arquivo', 10)` / `fields` (RS-02) | Backend | Médio |
| T-DEN-05 | F-03 | MIME apenas por cabeçalho; sem magic bytes | inexistente | RELATORIO_ANALISE §5.2 SEC-04 | Alto | Média | `file-type` + fail-closed (RS-03) | Backend + Segurança | Médio |
| T-DEN-06 | F-02/F-01 | CSP não configurada explicitamente | Helmet padrão | RELATORIO_ANALISE §5.2 SEC-05 | Alto (XSS) | Média | CSP restritiva com nonce/hash (RS-04) | Segurança + Frontend | Médio |
| T-DEN-07 | F-06 | `mpt-api.client.js` lê `process.env` direto | inexistente | RELATORIO_ANALISE §5.2 SEC-06 | Médio | Média | injeção de configuração (RS-05) | Backend | Médio |
| T-DEN-08 | Endpoint informacional | `/api/denuncias/info` sem rate limit | inexistente | RELATORIO_ANALISE §5.3 SEC-07 | Baixo–Médio | Alta | rate limit permissivo (RS-06) | Backend | Baixo |
| T-DEN-09 | Handler 404 | `req.originalUrl` expõe rotas internas | parcial | RELATORIO_ANALISE §5.3 SEC-09 | Baixo | Média | ocultar em produção (RS-08) | Backend | Baixo |
| T-DEN-10 | F-06 | Texto livre sem sanitização (`relato_texto`, `nomes_dados`, `funcoes_setores`) | inexistente | RELATORIO_ANALISE §5.3 SEC-08 | Médio | Média | sanitização server-side (RS-07) | Backend + Segurança | Médio |
| T-DEN-11 | F-02 | UI trava em rede lenta (`fetch` sem `AbortController`) | inexistente | RELATORIO_ANALISE §3.2 QA-05 | Médio | Alta | timeout ≤ 30 s + `navigator.onLine` (RF-17) | Frontend | Baixo |
| T-DEN-12 | UI | Wizard permite avançar sem obrigatórios ou pular etapas | inexistente | RELATORIO_ANALISE §3.1 QA-01 / §3.2 QA-08 | Médio | Alta | validação por etapa + restrição do stepper (RF-13) | Frontend | Baixo |
| T-DEN-13 | UI | Falta `<label for>`, `aria-describedby`, foco visível, `aria-live` | parcial | RELATORIO_SUGESTOES §2 | Médio (a11y) | Alta | corrigir semântica (RA-01) | Frontend + A11Y | Baixo |
| T-DEN-14 | UI | Sem consentimento LGPD antes do envio | inexistente | RELATORIO_ANALISE §5.4 SEC-10 | Alto (LGPD) | Alta | checkbox obrigatório + link à política (RP-01) | Frontend + DPO | Alto até corrigir |
| T-DEN-15 | CI/CD | E2E e Vitest backend fora do pipeline | inexistente | RELATORIO_ANALISE §6.1 REG-01 / §6.2 REG-06 | Alto (regressão) | Alta | adicionar jobs (RG-01) | Infra + Dev | Alto até corrigir |
| T-DEN-16 | Observabilidade | Sem `X-Request-ID` correlacionando front↔back | inexistente | RELATORIO_ANALISE §5.4 SEC-11 | Médio | Média | middleware (RS-09) | Backend + QA | Médio |
| T-DEN-17 | UI | Sem persistência de rascunho (mobile background/reload perde tudo) | inexistente | RELATORIO_DIAGNOSTICO §3.1 | Médio (UX) | Alta | auto-save `sessionStorage` (RF-16) | Frontend | Baixo |

Considere ainda:

- **Falsificação** de origem ou payload por bot: mitigar por CORS + rate limit + validação servidor.
- **Repúdio**: ausência de auditoria; mitigar por `X-Request-ID` + logs sanitizados + timestamp.
- **Elevação de privilégio**: superfície mínima; endpoint público não autoriza operações internas.
- **Abuso de negócio**: envio massivo, floods; rate limit + captcha (fora do escopo atual).
- **Cadeia de suprimentos**: `npm audit --omit=dev`, lockfiles, overrides declaradas no incremento 9.
- **Diferença entre ambientes**: drift D-05 → rotular explicitamente.

## 6. Checklist específico de upload

- [ ] Limites de tamanho, quantidade e tipos verificados no código e testados (RF-08).
- [ ] Validação considera **conteúdo real** (magic bytes) — não só extensão/`Content-Type` (RS-03).
- [ ] Diretório temporário, permissões, quota e limpeza em sucesso/erro/timeout/cancelamento.
- [ ] Mesmo anexo correlacionado entre upload, varredura e encaminhamento (`X-Request-ID`).
- [ ] ClamAV exercitado nos estados: `clean`, `infected` (EICAR sintético), `timeout`, `unavailable`.
- [ ] Comportamento fail-open/fail-closed registrado **por ambiente** (dev × prod) — RF-12.
- [ ] Zip bomb, arquivo poliglota, nomes maliciosos, alta concorrência (100 uploads).
- [ ] Rejeitados/não varridos **não** alcançam a API MPT quando a política exigir bloqueio.
- [ ] Logs/evidências sem conteúdo, token, PII ou metadados desnecessários.

## 7. Decisão

- **Resultado**: **BLOQUEADO** até resolução dos P0 acima (`T-DEN-01/02/03` e `T-DEN-14/15` são bloqueadores de produção).
- **Riscos aceitos e justificativa**: nenhum aceito neste momento; owner de Segurança **pendente**.
- **Correções obrigatórias antes da entrega**: RS-01..05, RF-13..17, RA-01, RP-01, RG-01/02.
- **Evidências ainda pendentes**: tudo — nada foi executado nesta compilação.
- **Testes de regressão necessários**: ver [10-EVIDENCE-MANIFEST.md](10-EVIDENCE-MANIFEST.md).
- **Prazo de reavaliação**: a cada mudança material em fluxo, upload, integração, ambiente ou dado — e a cada 30 dias.

## Limitações

- Este template orienta a análise; **não executa** scanner, pentest ou validação de configuração em ambiente real.
- Declarações sobre produção **exigem** evidência daquele ambiente.
- E2E de frontend com interceptação/mocks **não comprova** BFF, Redis, ClamAV ou API MPT reais.
