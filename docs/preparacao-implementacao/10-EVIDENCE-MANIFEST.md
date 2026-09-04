# EVIDENCE MANIFEST — Canal de Denúncias

Template base: [`templates/evidence-manifest.md`](../licoesaprendidas/templates/evidence-manifest.md).
Regra do kit: **content freeze** antes da captura; sanitizar; inspecionar; ligar ao commit.

## 1. Manifesto por requisito

| ID | Requisito/alegação | Ambiente/modo | Fonte privada | Artifact publicável | Mostrar | Ocultar/redaction | Versão/hash | Owner/acesso | Retenção | Revisão |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| RF-01 | Wizard percorre 7 etapas | E2E-mock (Chromium+Firefox+WebKit; desktop+mobile) | vídeo local sanitizado | screenshot final por etapa | fluxo do formulário | dados sintéticos qualquer PII | commit `stg@HEAD` (a preencher) | QA | 30 d | Produto + QA |
| RF-04 | Validação servidor obrigatórios | integ-sim (Supertest) | log do CI | resultado do teste + payload sintético | 400 com mensagem | corpo cheio | idem | Backend | 30 d | Backend |
| RF-06 | Só 2xx com protocolo string não vazio | unit-front + integ-sim | log Vitest | resultado | protocolo mockado (`TEST-XXX`) | qualquer token | idem | Frontend | 30 d | Frontend |
| RF-07 / RS-01 | Protocolo criptográfico | unit-back | log Vitest | resultado | entropia + amostra | reais | idem | Backend + Segurança | 30 d | Segurança |
| RF-08 | Limites de upload | integ-sim | log CI | resultado + fixtures | teste com 11 arquivos | conteúdo real | idem | Backend | 30 d | Backend |
| RF-09 | ClamAV INSTREAM (EICAR) | live-BFF em ambiente autorizado | log CI + saída ClamAV | resultado | 422 esperado | rede/host | idem | Backend + Infra | 30 d | Segurança |
| RF-10 | Rate limit + Redis + CORS | integ-sim + live-BFF | log CI | resultado + amostra 429 | 429 com `Retry-After` | IP real | idem | Infra + Backend | 30 d | Infra |
| RF-13 | Wizard não avança sem obrigatórios | unit-front + E2E-mock | vídeo | screenshot mensagem `aria-live` | mensagem acessível | — | idem | Frontend + QA | 30 d | QA |
| RF-14 / T-DEN-01 | Anônimo remove PII | unit-front + unit-back + integ-sim | log CI | resultado + amostra sanitizada | payload sem PII | qualquer PII | idem | Frontend + Backend + DPO | 30 d | DPO |
| RF-15 / T-DEN-02 | Áudio como `arquivo_audio` | unit-front + integ-sim | log CI | resultado | contrato multipart | conteúdo real | idem | Frontend + Backend | 30 d | QA |
| RF-16 | Rascunho `sessionStorage` | unit-front + E2E-mock | vídeo/log | screenshot recarga | rascunho restaurado | dados sintéticos PII | idem | Frontend | 30 d | Frontend |
| RF-17 | Timeout + offline | unit-front + E2E-mock | vídeo/log | screenshot erro visível | mensagem acessível | rede real | idem | Frontend | 30 d | Frontend |
| RS-02 | Upload restrito | integ-sim | log CI | resultado | campo `desconhecido` → 400 | — | idem | Backend + Segurança | 30 d | Segurança |
| RS-03 | Magic bytes | integ-sim | log CI | resultado | rename → 422 | conteúdo real | idem | Backend + Segurança | 30 d | Segurança |
| RS-04 | CSP restritiva | integ-sim + E2E-mock | log + headers | inspeção header | CSP header | domínios internos | idem | Segurança | 30 d | Segurança |
| RS-05 | Cliente MPT injetável | unit-back | log Vitest | resultado | teste com injeção falsa | token real | idem | Backend | 30 d | Backend |
| RS-06 | Rate limit em `/info` | integ-sim | log CI | resultado | 429 | IP real | idem | Backend | 30 d | Backend |
| RS-07 | Sanitização texto livre | unit-back | log CI | payload sanitizado | antes/depois | conteúdo real | idem | Backend + Segurança | 30 d | Segurança |
| RS-08 | 404 sem `originalUrl` em prod | integ-sim | log CI | resultado | body 404 | rotas internas | idem | Backend | 30 d | Backend |
| RS-09 | `X-Request-ID` | integ-sim | log CI + morgan | resultado | header presente + log correlacionado | conteúdo real | idem | Backend + QA | 30 d | QA |
| RA-01 | a11y das etapas | E2E-mock (axe) + UI-manual | HTML axe + notas | relatório axe sanitizado | violações críticas = 0 | — | idem | QA + A11Y | 30 d | A11Y |
| RP-01 | Consentimento LGPD | unit-front + E2E-mock | vídeo | screenshot checkbox obrigatório | política linkada | — | idem | Frontend + DPO | 30 d | DPO |
| RG-01 | CI executa gates | integ-sim (CI) | log workflow | badge + artefatos | verde/vermelho | secrets | idem | Infra + Dev | 90 d | Dev |
| RG-02 | `ui-audit.spec.ts` falha em crítico | E2E-mock | log Playwright | resultado | assertion `criticalFindings = []` | — | idem | QA | 90 d | QA |
| RG-03 | Node CI = manifest | integ-sim (CI) | log workflow | versão Node no runner | versão exata | — | idem | Infra | 90 d | Infra |
| RG-04 | Redocly + Prettier no CI | integ-sim (CI) | log workflow | resultado | erros/OK | — | idem | Dev | 90 d | Dev |
| RNF-PERF-01 | Bundle ≤ 500 kB / 120 kB | build report | log build | tabela de tamanhos | valores | — | idem | Frontend | 90 d | Frontend |
| RNF-A11Y-01 | WCAG 2.2 AA | E2E-mock (axe) + UI-manual | HTML axe + relato manual | relatório sanitizado | violações + notas manuais | — | idem | QA + A11Y | 90 d | A11Y |
| RNF-REL-01 | Fail-closed em prod | integ-sim + live-BFF | log CI + notas | resultado com deps derrubadas | erro claro | secrets | idem | Segurança + Infra | 90 d | Segurança |

## 2. Shot list

| ID | Tela/estado | Viewport/AT | Resultado esperado | Nome final | Status |
| --- | --- | --- | --- | --- | --- |
| SH-01 | Acolhimento | 360×640 mobile Chromium | apresentação sem PII | `SH-01_acolhimento_mobile.png` | pendente |
| SH-02 | StepIrregularidades sem seleção | 1280×800 desktop | botão Avançar desabilitado + mensagem `aria-live` | `SH-02_irreg_disabled.png` | pendente |
| SH-03 | StepIdentificacao (identificado) | 1280×800 | campos preenchidos com dados sintéticos | `SH-03_identificado.png` | pendente |
| SH-04 | StepIdentificacao (anônimo) | 1280×800 | campos ocultos/limpos + aviso | `SH-04_anonimo.png` | pendente |
| SH-05 | StepEvidencias com áudio | 360×640 mobile | player + botão adicionar | `SH-05_audio.png` | pendente |
| SH-06 | StepRevisao com consentimento LGPD | 1280×800 | checkbox obrigatório + link à política | `SH-06_lgpd.png` | pendente |
| SH-07 | Confirmação | 360×640 mobile | protocolo string visível | `SH-07_confirmacao.png` | pendente |
| SH-08 | Erro visível pós-timeout | 1280×800 | mensagem + retry | `SH-08_erro.png` | pendente |
| SH-09 | axe – wizard completo | Chromium desktop | 0 violações críticas | `SH-09_axe_report.html` | pendente |
| SH-10 | 429 rate limit | leitor de logs | corpo com `Retry-After` | `SH-10_rate_limit.log` | pendente |

## 3. Content freeze

- [ ] fonte congelada (commit registrado)
- [ ] derivado gerado (build, relatório de teste, HTML axe)
- [ ] todas as páginas/telas inspecionadas
- [ ] metadados e PII revisados (EXIF removido; nomes sintéticos)
- [ ] ligado ao commit/requisito (nome do arquivo contém hash curto)
- [ ] publicação verificada quando aplicável (link testado; permissões conferidas)

## 4. Regras de manipulação

- **Redaction obrigatória**: nome, e-mail, telefone, endereço, CPF/CNPJ, IP, `Authorization`, URL interna MPT, corpo de anexos, cookies.
- **Fixtures sintéticas**: usar dados obviamente falsos (`FULANO DA SILVA`, `usuario@example.com`, `(11) 90000-0000`).
- **Nunca** capturar tela de produção sem autorização específica.
- **Evidência local ≠ publicação**: verificar destino após upload autorizado.

## Limitações

- Evidência aumenta confiança; **não garante** veracidade absoluta.
- axe cobre subset de WCAG; conformidade completa exige inspeção manual/AT.
- Screenshot **não** prova contrato de API; arquivo local **não** prova publicação.
