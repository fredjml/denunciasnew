# REQUIREMENTS — Canal de Denúncias

Template base: [`templates/requisitos.md`](../licoesaprendidas/templates/requisitos.md).
Status: **MODELO NÃO VALIDADO** (aguardando aprovação de Produto e demais owners).

## Identificação

- **Projeto/feature**: `cidadania-canal-denuncias` — wizard + BFF + upload seguro.
- **Fonte primária e versão**: `cidadania-canal-denuncias/AGENTS.md`, `planejamento.md`, `spec_design.md`, código, testes, Swagger — leitura estática em 2026-08-27, branch `stg`.
- **Owner de Produto**: **pendente**.
- **Data/commit**: 2026-08-27 · commit atual da branch `stg`.
- **Objetivo**: cobrir cada verbo/restrição da fonte primária + achados abertos como requisito atômico com aceite verificável.
- **Atores**: cidadão denunciante (identificado ou anônimo), operador MPT interno (consumidor via API), DPO, Segurança, QA, Infra.
- **Dados**: metadados de denúncia, PII opcional, anexos (documentos + áudio), protocolo, logs sanitizados.
- **Dentro/fora do escopo**: ver [PRD §3](05-PRD.md#3-escopo).

## Requisitos funcionais

Legenda de confiança: `CONF` (confirmada), `PART` (parcial), `INF` (inferência forte), `HIP` (hipótese), `ND` (não foi possível determinar).

| ID | Tipo | Fonte/local | Ator/estímulo | Regra/resultado | Erro | Ambiente | Confiança | Aceite Dado/Quando/Então |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| RF-01 | funcional | `frontend/src/app/components/**` | cidadão | Wizard conduz Acolhimento → Irregularidades → Ocorrências → Evidências → Identificação → Local → Revisão → Confirmação | inconsistência de estado bloqueia | dev/prod | CONF | Dado o Acolhimento visível, Quando o cidadão avança pelas 7 etapas com dados válidos, Então a `Confirmation` exibe o protocolo. |
| RF-02 | funcional | `frontend/src/app/services/complaint.service.ts` | cidadão | Estado e navegação residem em `ComplaintService` com signals | perda de estado em recarga | dev/prod | CONF | Dado o wizard aberto, Quando o cidadão navega entre etapas, Então o `ComplaintService` mantém estado sem duplicações. |
| RF-03 | integração | `frontend/src/app/clients/complaint-api.client.ts` | cidadão | Envia denúncia serializada + `arquivo_N` em multipart para `POST /api/denuncias` | falha de rede/rejeição | dev/prod | CONF | Dado o envio, Quando o cliente monta a `FormData`, Então `denuncia` é JSON e cada arquivo vira `arquivo_1..N`. |
| RF-04 | validação | `server/services/complaint.service.js` | BFF | Exige UF, município e (irregularidade selecionada OU relato textual) | 400 quando faltar | dev/prod | CONF | Dado um payload sem UF, Quando o BFF valida, Então retorna 400 com mensagem sanitizada. |
| RF-05 | erro/UX | `complaint.service.ts` + `complaint-api.client.ts` | cidadão | Falha visível mantém `isSubmitted=false`, `protocolo=''`, permite retry | — | dev/prod | CONF | Dado um envio com falha, Quando o serviço trata o erro, Então `isSubmitted` permanece falso, `protocolo` vazio, e o botão de retry fica ativo. |
| RF-06 | contrato | `complaint-api.client.ts` | cidadão | Confirma apenas resposta 2xx com `protocolo` string não vazio | 502/503 se ausente | dev/prod | CONF | Dado 2xx com `protocolo=''`, Quando o cliente valida, Então trata como erro externo e mantém `isSubmitted=false`. |
| RF-07 | backend | `server/services/complaint.service.js` | BFF | Gera protocolo `MPT-XXXXXXXX` **localmente** antes de chamar API MPT | — | dev/prod | CONF (conflita com doc — D-04) | Dado um envio válido, Quando o BFF gera protocolo, Então usa `crypto.randomUUID()`/`crypto.randomBytes()` (após RS-01) e persiste correlação com `X-Request-ID`. |
| RF-08 | upload | `server/middleware/upload.js` | BFF | Até 10 arquivos de até 20 MiB por padrão; MIME allowlist; disco temporário; cleanup | 413/422 se exceder | dev/prod | CONF | Dado 11 arquivos, Quando o BFF processa, Então rejeita com 400/413 e nenhum arquivo persiste. |
| RF-09 | antimalware | `server/clients/clamav.client.js` | BFF | Cada arquivo passa por ClamAV INSTREAM; ameaça retorna 422 | timeout/indisponível conforme ambiente | prod fail-closed; dev fail-open configurável | CONF | Dado um arquivo com assinatura EICAR sintética em ambiente de teste, Quando o BFF envia ao ClamAV, Então retorna 422 e nada é encaminhado à API MPT. |
| RF-10 | perímetro | `server/index.js` | BFF | POST com rate limit; produção exige Redis, CORS exato, MPT URL e ClamAV | 429 quando exceder | prod | CONF | Dado N+1 requisições no intervalo, Quando o BFF atende, Então bloqueia com 429 e header `Retry-After`. |
| RF-11 | operação | `server/index.js`, `swagger.config.js` | operador | `/health` público; Swagger desabilitado por padrão em produção | — | prod | CONF | Dado produção, Quando alguém acessa `/api-docs`, Então retorna 404 (ou 403 conforme decisão). |
| RF-12 | desenvolvimento | `server/index.js` | dev | Em `NODE_ENV=development`, indisponibilidade de MPT ou ClamAV pode aceitar localmente | rotular como simulação | dev | CONF (D-05 aberto) | Dado dev sem MPT/ClamAV, Quando o BFF responde, Então marca resposta com flag/label de simulação (após decisão). |
| RF-13 | validação/UX | Wizard | cidadão | Só avança com obrigatórios da etapa preenchidos | UX bloqueia botão | dev/prod | HIP (bloqueia produção — QA-01) | Dado `StepIrregularidades` sem seleção nem relato, Quando aciona "Avançar", Então o botão fica desabilitado e mensagem acessível anuncia o motivo. |
| RF-14 | privacidade | `complaint.service.ts` + BFF | cidadão | Modo anônimo remove PII do estado e payload | — | dev/prod | HIP (bloqueia produção — QA-02/SEC-01) | Dado nome/e-mail/telefone preenchidos, Quando alterna para "Denúncia Anônima" e envia, Então `nome=''`, `email=''`, `telefone=''` no payload; BFF confirma ausência. |
| RF-15 | evidência | `complaint-api.client.ts` | cidadão | Áudio gravado é transmitido como parte multipart nomeada | — | dev/prod | HIP (bloqueia produção — QA-03) | Dado `relato_audio` presente, Quando o cliente envia, Então BFF recebe `arquivo_audio` com MIME `audio/*` compatível e teste unitário cobre o caminho. |
| RF-16 | UX/rascunho | `complaint.service.ts` | cidadão | Rascunho por etapa persistido em `sessionStorage`, limpo em sucesso/desistência | — | dev/prod | HIP (QA-04) | Dado wizard em andamento, Quando a página recarrega, Então estado da etapa é restaurado sem PII persistida após envio. |
| RF-17 | UX/rede | `complaint-api.client.ts` | cidadão | Envio HTTP com timeout observável e detecção offline | erro visível ≤ 30 s | dev/prod | HIP (QA-05) | Dado rede indisponível ou lenta, Quando envia, Então há erro em ≤ 30 s (`AbortController`) com opção de nova tentativa. |
| RA-01 | acessibilidade | Todo o wizard | cidadão | Foco visível global, `<label for>`, `aria-describedby`, `aria-live="polite"`, foco no `h1` da etapa | — | dev/prod | HIP (Sugestões §2) | Dado transição entre etapas, Quando o foco muda, Então o `h1` recebe foco, o `aria-live` anuncia mudança, e o axe passa sem violação crítica. |
| RP-01 | privacidade/LGPD | Wizard antes do envio | cidadão | Checkbox obrigatório de ciência LGPD com link para política vigente | — | dev/prod | HIP (SEC-10) | Dado a etapa `Revisao`, Quando o cidadão tenta enviar sem marcar consentimento, Então o botão fica desabilitado e mensagem acessível explica. |

## Requisitos de segurança (RS-*)

| ID | Fonte | Regra | Aceite |
| --- | --- | --- | --- |
| RS-01 | SEC-02 | Protocolo usa fonte criptográfica | Nenhum `Math.random()` sobrevive em `services/complaint.service.js`; teste dedicado verifica entropia mínima. |
| RS-02 | SEC-03/QA-07 | Upload aceita apenas campos nomeados | `upload.array('arquivo', 10)` ou `upload.fields([...])`; teste com campo `desconhecido` retorna 400. |
| RS-03 | SEC-04 | MIME validado por magic bytes | Divergência entre `Content-Type` e assinatura real → 422 com mensagem sanitizada. |
| RS-04 | SEC-05 | CSP restritiva ativa em produção | Header `Content-Security-Policy` limita `script-src`, `style-src`, `font-src`, `img-src` conforme fontes reais. |
| RS-05 | SEC-06 | `mpt-api.client.js` recebe configuração por injeção | Cliente **não** lê `process.env`; testes injetam URL/credenciais. |
| RS-06 | SEC-07 | `/api/denuncias/info` com rate limit | Bloqueia rajada acima do limite permissivo. |
| RS-07 | SEC-08 | Sanitização server-side de texto livre (`relato_texto`, `nomes_dados`, `funcoes_setores`) | Payload à API MPT não contém HTML/JS injetado. |
| RS-08 | SEC-09 | Handler 404 sem `req.originalUrl` em produção | Body de 404 não expõe rota interna. |
| RS-09 | SEC-11 | `X-Request-ID` gerado e propagado | Log frontend/backend correlacionam mesma requisição. |

## Requisitos operacionais/CI (RG-*)

| ID | Fonte | Regra | Aceite |
| --- | --- | --- | --- |
| RG-01 | REG-01/REG-06 | CI executa lint + Vitest (frontend + backend) + Playwright + `npm audit` | Workflow verde é **condição necessária** para merge; artefatos publicados. |
| RG-02 | REG-02 | `ui-audit.spec.ts` falha em achado crítico | `expect(report.criticalFindings).toEqual([])`. |
| RG-03 | D-07 | CI alinhado a Node do manifest | Job usa Node compatível com `engines`. |
| RG-04 | D-09 | Script `redocly lint` e `prettier --check` no CI | Fail rápido em contrato/formatação. |

## Requisitos não funcionais (RNF-*)

| ID | Área | Regra | Aceite |
| --- | --- | --- | --- |
| RNF-SEC-01 | segredos | Nenhum token/URL interna/PII/anexo em logs, prompts, artifacts | Grep dedicado no CI; smoke test de logs. |
| RNF-SEC-02 | upload defesa em profundidade | Limites + nome aleatório + temporário + magic bytes + ClamAV + cleanup + isolamento | `upload.spec.mjs` + `secure-upload.integration.spec.mjs` cobrem cenários. |
| RNF-PRV-01 | LGPD | Minimização, finalidade, base legal, sigilo/anonimato, retenção 10 d | Aprovação DPO em `12-DECISIONS.md`. |
| RNF-A11Y-01 | acessibilidade | WCAG 2.2 AA + inspeção manual (teclado, foco, leitor de tela, zoom 200%) | axe + smoke manual documentado em `10-EVIDENCE-MANIFEST.md`. |
| RNF-REL-01 | resiliência | Produção **fail-closed** em ausência de MPT/ClamAV/Redis; dev rotulado | Teste com dependência derrubada. |
| RNF-PERF-01 | performance | Bundle ≤ 500 kB bruto / 120 kB transferido; p95 envio ≤ 3 s sem anexo | Build report + medição sintética. |
| RNF-MNT-01 | manutenção | Modelo TS + FormData + validação + payload MPT + Swagger + testes sincronizados | Checklist de contrato executado. |
| RNF-REP-01 | reprodutibilidade | `npm ci` idempotente; Volta pinada; CI compatível | Rebuild limpo em máquina nova. |
| RNF-OBS-01 | observabilidade | Logs correlacionados por `X-Request-ID`, sem PII/anexo/token, retenção aprovada | Auditoria de amostra sanitizada. |

## Ambiguidades, conflitos e exclusões

| ID | Questão | Fontes conflitantes | Impacto | Contraprova | Owner | Decisão/aprovação |
| --- | --- | --- | --- | --- | --- | --- |
| A-01 (D-04) | Protocolo é do BFF ou da API MPT? | Documentação histórica × código atual | Alto — contrato e confiança do cidadão | Ler contrato oficial MPT (não fornecido) | Integração MPT | **pendente** |
| A-02 (D-05) | Development pode aceitar ausência de MPT/ClamAV? | Kit permite × política de segurança | Médio — usado como "prova" indevida | Definir rótulo e política de ambientes | Segurança + Produto | **pendente** |
| A-03 | Retenção real de logs e anexos | Sugerido 10 d × sem política oficial | Alto — LGPD | Consulta DPO/jurídico | DPO | **pendente** |
| A-04 | Browser matrix corporativa | Kit cita Chromium/Firefox/WebKit × política institucional | Baixo–médio | Definir baseline | QA + Infra | **pendente** |
| A-05 | Ownership do rate limit e trust proxy | Manifest × topologia real | Médio | Levantar topologia de rede | Infra | **pendente** |
| A-06 | Uso do modo anônimo x pseudonimização | UX × LGPD | Alto | Modelagem legal | DPO + Segurança | **pendente** |

## Exclusões formais (a aprovar)

| ID | Escopo excluído | Justificativa | Aprovador |
| --- | --- | --- | --- |
| E-01 | Autenticação do cidadão | Fora do MVP conforme AGENTS.md | Produto |
| E-02 | Painel admin/backoffice | Responsabilidade dos sistemas MPT internos | Produto |
| E-03 | Acompanhamento pós-envio (fase 2) | Não previsto na fonte primária atual | Produto |

## Gate 1 — Requirements Ready

- [ ] cobertura atômica da fonte primária
- [ ] aceite verificável para cada RF/RS/RG/RNF acima
- [ ] implícito separado de confirmado (`HIP` × `CONF`)
- [ ] exclusões aprovadas (E-01/02/03)
- [ ] fora de escopo (§ PRD 3.2) endossado
- [ ] conflitos decididos ou bloqueados (A-01 a A-06)

Assinatura do owner de Produto: **pendente**.

## Limitações

- Todo `HIP` precisa de evidência do commit atual antes de virar `CONF`.
- Números do RELATORIO (histórico) não valem como evidência atual.
- Aprovação de LGPD, browser matrix e ownership do protocolo **bloqueia** subida a produção.
