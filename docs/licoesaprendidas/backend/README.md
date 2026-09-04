# Backend — Node.js/Express BFF

Este guia complementa o [baseline factual](../15-baseline-analises-denuncias.md) e o [contrato compartilhado](../contrato/README.md). Sempre reabra a fonte primária antes de citar comportamento ou número.

## Topologia observada

server/index.js → routes/complaint.routes.js → middleware/upload.js → controllers/complaint.controller.js → services/complaint.service.js → clients/clamav.client.js e mpt-api.client.js. Redis fornece store compartilhado do rate limit.

## Parâmetros de produção declarados (RELATORIO_FINAL_SANITIZACAO §Escopo)

- 100 denúncias/hora e 500 usuários simultâneos.
- 100 uploads simultâneos, limite atual de 20 MiB por arquivo e até 10 anexos.
- 3 réplicas do BFF; rate limit compartilhado em Redis.
- Retenção de logs sugerida em 10 dias; disponibilidade sugerida 99,5%.
- ClamAV externo obrigatório (INSTREAM), com `StreamMaxLength > 20 MiB` e `MaxThreads`/`MaxQueue` dimensionados para a concorrência esperada.
- Safari real obrigatório em homologação; API MPT deve ser homologada em ambiente real.

Estes valores são premissas de trabalho — devem virar requisitos com owner e critério verificável em `REQUIREMENTS.md`.

## Invariantes

- BFF guarda MPT_API_TOKEN e detalhes internos.
- Entrada do browser é não confiável e validada no servidor.
- Produção exige MPT_API_URL, FRONTEND_URL, REDIS_URL e CLAMAV_HOST.
- Sucesso de produção só após sendComplaint resolver; protocolo hoje é gerado localmente pelo BFF.
- Upload é temporário em disco, com nome aleatório, scan e cleanup.
- Logs nunca recebem corpo, identidade, anexo ou token.

## Análise de mudança

1. siga o fluxo completo e liste ambientes afetados;
2. compare body/multipart, validação, payload MPT, status e Swagger;
3. revise timeout, erro, retry/idempotência e resposta externa;
4. avalie CORS, trust proxy, rate limit e Redis/TTL/TLS;
5. para upload, avalie tamanho/quantidade, MIME versus conteúdo, nome, path, permissões, scan, cleanup, concorrência e disco;
6. revise logs/health/docs e exposição de configuração;
7. defina testes focal, integração, contrato e live.

## Comandos

~~~powershell
npm --prefix cidadania-canal-denuncias/server ci
npm --prefix cidadania-canal-denuncias/server run lint
npm --prefix cidadania-canal-denuncias/server test
npm --prefix cidadania-canal-denuncias/server audit --omit=dev
~~~

Redocly está instalado, mas sem script no manifesto observado; registre o comando exato se executar. O script test usa passWithNoTests; confirme a contagem para evitar falso verde.

## Pontos de decisão abertos

- ownership e validade do protocolo;
- fail-open de API MPT e ClamAV em development;
- log da URL MPT no banner;
- validação de assinatura/magic bytes além de MIME declarado;
- autenticação/autorização futura do canal;
- SLO/capacidade e política de retenção;
- env.template versus README que menciona .env.example.

## Achados abertos priorizados (RELATORIO_ANALISE... 31/07/2026)

Preserve estes IDs no `REQUIREMENTS.md` e no `threat-model` até resolução com evidência.

| Prio | ID | Descrição | Ação sugerida |
| --- | --- | --- | --- |
| P0 | SEC-02 | Protocolo gerado com `Math.random()` em `services/complaint.service.js` | Migrar para `crypto.randomBytes()` ou `crypto.randomUUID()`; reforçar teste determinístico |
| P0 | SEC-01/QA-02 | PII persiste no payload quando o wizard alterna para "anônimo" | Limpar campos PII no BFF ao receber `tipo_identificacao === 'anonimo'` (defesa em profundidade com o frontend) |
| P0 | REG-06 | Backend não executa `npm run test` no pipeline de CI | Adicionar `npm run test` ao job de backend e falhar o pipeline em regressão |
| P1 | SEC-03/QA-07 | Rota usa `upload.any()` em vez de `upload.array('arquivo', MAX)` | Restringir campos aceitos no Multer |
| P1 | SEC-04 | MIME verificado apenas por cabeçalho HTTP; sem magic bytes | Validar assinatura de arquivo (ex.: `file-type`) e rejeitar divergência |
| P1 | SEC-05 | CSP não configurada explicitamente no Helmet | Definir CSP restritiva com nonce/hash e revisar fonte externa de fontes |
| P1 | SEC-06 | `mpt-api.client.js` lê `process.env.MPT_API_URL` diretamente | Receber `env`/config por injeção como em `clamav.client.js` |
| P2 | SEC-07 | `/api/denuncias/info` sem rate limit | Aplicar rate limit permissivo |
| P2 | SEC-08 | Texto livre não é sanitizado antes de armazenar/encaminhar | Sanitizar `relato_texto`, `nomes_dados`, `funcoes_setores` |
| P2 | SEC-09 | Handler 404 devolve `req.originalUrl` | Ocultar `path` em produção |
| P2 | CC-03 | `parsePositiveInteger` duplicada em 3 arquivos | Extrair para `utils/parse.js` |
| P2 | CC-12 | `express-validator` instalado sem uso | Remover ou migrar validação |
| P3 | SEC-11 | Sem `X-Request-ID` para correlação frontend↔backend | Gerar/propagar ID por requisição |
| P3 | REG-08 | Sem teste de upload acima de 20 MiB | Cobrir cenário de limite |

As referências completas estão em [Analises/RELATORIO_ANALISE_QA_CLEANCODE_SECURITY_REGRESSAO.md](../../../Analises/RELATORIO_ANALISE_QA_CLEANCODE_SECURITY_REGRESSAO.md).

## Histórico de sanitização (17 incrementos)

O backend foi trabalhado nos incrementos 4, 5, 9, 11, 12, 16 e 17 do plano descrito em [Analises/RELATORIO_FINAL_SANITIZACAO_CODEBASE_DENUNCIAS.md](../../../Analises/RELATORIO_FINAL_SANITIZACAO_CODEBASE_DENUNCIAS.md), com mapeamento por arquivo em [Analises/RELATORIO_ARQUIVOS_ALTERADOS_DENUNCIAS.md](../../../Analises/RELATORIO_ARQUIVOS_ALTERADOS_DENUNCIAS.md). O quadro sintético está em [15-baseline-analises-denuncias.md](../15-baseline-analises-denuncias.md#hist%C3%B3rico-de-sanitiza%C3%A7%C3%A3o--17-incrementos). Baseline de suíte declarado em 24/07/2026: **30/30 testes backend aprovados em ~1,79 s**, ESLint 0/0, `npm audit --omit=dev` sem vulnerabilidades em 150 dependências de produção.

## Pendências para produção (RELATORIO_FINAL §Pendências)

1. Managed Redis (ou compatível) provisionado e testado com 3 réplicas usando `REDIS_URL` real.
2. ClamAV em rede privada com assinaturas atualizadas e `StreamMaxLength`/`MaxThreads`/`MaxQueue` dimensionados.
3. Teste de carga em staging com 100 uploads simultâneos.
4. Homologação da API MPT real (timeout, indisponibilidade, idempotência).
5. Plataforma de logs com retenção de 10 dias e mascaramento (sem PII, anexo, token, payload MPT).
6. Hospedagem, certificados, DNS, secrets, health/readiness probes, monitoramento e alertas definidos.
7. Homologação funcional por responsáveis pelo negócio e DPO.

## Limitações

Supertest com doubles não comprova Redis, ClamAV ou API MPT live. npm audit não cobre lógica. Node Permission Model não substitui isolamento do SO/container. Os achados P0–P3 catalogados em `Analises/` são leitura de 21–31/07/2026 e podem ter sido corrigidos parcialmente; reexecute os testes contra o commit atual antes de citar.
