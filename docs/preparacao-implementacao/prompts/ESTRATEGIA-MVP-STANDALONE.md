# Estratégia MVP Standalone — `denunciasnew`

> **Documento acionável.** Substitui operacionalmente o plano baseado em `cidadania-canal-denuncias/**` (que fica preservado como histórico).
>
> **Data:** 2026-09-04.
> **Decisão do owner:** criar código novo executável dentro de `denunciasnew/`, focado no frontend, com backend mock; sem tocar em `cidadania-canal-denuncias/`.
> **Objetivo:** protótipo MVP funcional que evolui até produção e futuramente acopla-se a um backend real feito por outra equipe.
>
> **Documentos anteriores preservados como referência técnica:** todos os deltas `*.delta-denunciasnew.md` + 5 diagramas `denunciasnew-*.mmd` + registros F1..F7 continuam válidos como fonte primária dos requisitos e das ameaças. Este documento adapta o **plano de execução** ao novo escopo.

## 0. Sumário deste documento

| Você quer... | Vá para |
| --- | --- |
| Entender por que a estratégia mudou | §1 |
| Ver **quais riscos zeraram** | §2 |
| Ver a **stack escolhida** | §3 |
| Ver a **estrutura de diretórios** do novo MVP | §4 |
| Ver o **contrato OpenAPI** mock (esqueleto) | §5 |
| Ver as **fatias adaptadas** | §6 |
| Copiar o **prompt para o Codex** iniciar CP-0 | §7 |
| Ver a sequência de execução | §8 |
| Ver o **checklist de setup** inicial | §9 |

## 1. Nova estratégia — o que mudou

### 1.1 Escopo revisado

- **NÃO tocar** em `cidadania-canal-denuncias/`.
- **Criar novo código** em `denunciasnew/app/` com Angular 22 standalone + signals.
- **Backend mock** em `denunciasnew/mock-api/` como Express Node.js standalone respeitando um **contrato OpenAPI** compartilhado (fonte de verdade para o backend real futuro).
- **Protótipo executável** desde a primeira fatia (npm start → app roda no browser com mock, sem depender de nada externo).
- **Deploy automático** em Vercel/Netlify por PR (preview) e branch principal (produção do protótipo).
- **Backend real futuro** será feito por outra equipe **respeitando o mesmo contrato OpenAPI**.

### 1.2 Justificativa

- Elimina dependência de código legado indisponível (D-DN-06).
- Reduz massivamente a superfície de risco (§2).
- Permite iterar em ciclos curtos com deploy visível para stakeholders.
- Cria o **contrato** que será a interface do backend futuro — ganho arquitetural.
- Mantém 100% dos requisitos catalogados (24 `DN-*`) e diagramas (5 `denunciasnew-*.mmd`) como fonte primária.

## 2. Impacto nos riscos (dos 30 catalogados)

### 2.1 Zerados (15)

| ID | Como zerou |
| --- | --- |
| D-DN-02 | backups históricos deixam de ser referência |
| D-DN-03 | PDF já é fonte primária declarada |
| D-DN-04 | duplicidade `docs/docs/` não impacta app |
| D-DN-05 | assets extras dos diagramas não impactam app |
| D-DN-06 | não dependemos mais do código legado |
| R-F3-01 | validador oficial não se aplica ao novo projeto |
| R-F4-03 | custos `$$$` eram para live-\* / chatbot — fora do MVP |
| R-F4-04 | ameaças chatbot fora do MVP |
| R-F5-02 | live-\* fora do escopo do MVP |
| R-F5-03 | KPIs pós-MVP; não bloqueiam código |
| R-F5-05 | pino-noir instalado desde o começo |
| R-F6-01 (parcial) | 9 fatias de CP-6 destravadas por ausência de código legado |
| R-F6-04 | protocolo `SYN-*` é oficial do protótipo |
| R-F6-05 | chatbot mantém dívida arquivada para pós-MVP |
| N-01 mitigado | contrato OpenAPI publicado antes do mock |

### 2.2 Mitigados (10)

| ID | Como mitigou / próxima ação |
| --- | --- |
| D-DN-01 | `git init` na Fatia 0 |
| R-F2-01 | defaults aplicáveis sem risco (não há código legado para conflitar) |
| R-F2-02 | screenshots do PDF viram assets do repo em CP-1 |
| R-F3-02 | `@mermaid-js/mermaid-cli` instalado como devDep |
| R-F3-03 | elementos NOVO/PART refletem o protótipo desde o primeiro dia |
| R-F4-02 | reduzimos as 22 auditorias a 6–8 relevantes ao MVP |
| R-F4-05 | interface admin URGENTE fica pós-MVP |
| R-F5-04 | retenção default DEC-DN-P-F5-1 aplicada |
| R-F6-02 | Git init resolve rollback |
| R-F6-03 | taxonomias mock ficam publicadas em `contract/` |

### 2.3 Permanecem — dependem de decisão humana (5)

| ID | Descrição | Impacto |
| --- | --- | --- |
| **DEC-DN-08** | SLA mobile (LCP/TTI) | usa default `LCP ≤ 4s / TTI ≤ 6s`; owner confirma antes do release |
| **DEC-DN-16** | LGPD testemunhas | fatia CP3-testemunhas fica bloqueada até DPO responder |
| **DEC-DN-19** | Formato oficial protocolo real | irrelevante para o protótipo; fica para integração com backend real |
| **T-DN-20** | Cookies vídeo institucional | resolvido no dia 1 (auto-hospedar) |
| **P-F4-sec-3** | Interface admin URGENTE | pós-MVP |

### 2.4 Novos riscos introduzidos (5)

| ID | Descrição | Mitigação |
| --- | --- | --- |
| **N-01** | Divergência de contrato mock vs backend real | OpenAPI publicado em `denunciasnew/contract/openapi.yaml` como fonte única de verdade |
| **N-02** | Novo projeto sem AGENTS.md/CI/lint | fatias iniciais em CP-0 cuidam disso |
| **N-03** | Choice paralysis | congelado nesta sessão (§3) |
| **N-04** | Sem repo remoto | owner cria repo GitHub/GitLab e faz push |
| **N-05** | Sem TDD estrito | disciplina do prompt Codex (§7) + CI que falha em unit sem cobertura |

## 3. Stack escolhida (decisões congeladas)

| Camada | Escolha | Justificativa |
| --- | --- | --- |
| Framework | **Angular 22 standalone + signals** | padrão do repo original; migração futura simples se backend usar mesma stack |
| Package manager | **npm** | padrão do repo; funciona bem com Angular CLI |
| TypeScript | **6.0.2** | herdado do repo original |
| Testes unit | **Vitest 4** | padrão do repo |
| E2E | **Playwright 1.61** | padrão do repo |
| A11y | **@axe-core/playwright** | wcag21aa piso, wcag22aa alvo |
| Perf | **Lighthouse CLI** | Slow 3G mobile |
| Estilização | **CSS puro + tokens de design + componentes custom** | controle total sobre a11y (WCAG 2.2 AA); alinhado a Legal Design/Visual Law |
| Mock backend | **Express 4 Node.js standalone** em `denunciasnew/mock-api/` | próximo do backend real futuro; segrega contratos |
| Contrato | **OpenAPI 3.1** em `denunciasnew/contract/openapi.yaml` | fonte de verdade compartilhada |
| Validação | **Zod** para runtime + `openapi-typescript` para tipos | zero drift entre contrato e código |
| Log | **pino** + `pino-noir` para redaction | desde o dia 1 |
| CI | **GitHub Actions** | grátis; Vercel/Netlify plug-and-play |
| Deploy | **Vercel** (recomendado; Netlify como alternativa) | preview por PR + produção por push em `main` |
| Fixtures áudio | **espeak-ng** (via container em CI) | offline, gratuito, determinístico |
| Redirect Ouvidoria | link externo (URL a decidir com Produto) | mesmo pattern do redirect vídeo |

## 4. Estrutura de diretórios do novo MVP

```
denunciasnew/
├── docs/                          # preservado (planejamento F1..F7)
│   ├── Analises/
│   ├── diagramas-mermaid/         # 10 originais + 5 denunciasnew-*.mmd
│   ├── preparacao-implementacao/
│   │   └── prompts/
│   │       ├── analise-denunciasnew.md
│   │       ├── PROXIMAS-ACOES-DENUNCIASNEW.md    (histórico da estratégia legada)
│   │       ├── ESTRATEGIA-MVP-STANDALONE.md      (ESTE DOCUMENTO)
│   │       └── fases/
│   ├── docs/                      # documentação paralela existente
│   └── licoesaprendidas/          # kit reutilizável
│
├── contract/                      # NOVO — contrato compartilhado
│   ├── openapi.yaml               # contrato OpenAPI 3.1 do backend futuro
│   ├── schemas/                   # schemas JSON gerados
│   ├── examples/                  # requests/responses de exemplo
│   └── README.md                  # como usar o contrato
│
├── app/                           # NOVO — frontend Angular
│   ├── src/
│   │   ├── app/
│   │   │   ├── steps/             # 8 telas do wizard
│   │   │   │   ├── step-acolhimento/
│   │   │   │   ├── step-relato-guiado/
│   │   │   │   ├── step-detalhamento/
│   │   │   │   ├── step-evidencias/
│   │   │   │   ├── step-sigilo-anonimato/
│   │   │   │   ├── step-local-empresa/
│   │   │   │   ├── step-revisao/
│   │   │   │   └── step-confirmacao/
│   │   │   ├── components/        # átomos e moléculas custom
│   │   │   │   ├── checklist-irregularidades/
│   │   │   │   ├── audio-recorder/
│   │   │   │   ├── evidence-uploader/
│   │   │   │   └── infografico-fluxo/
│   │   │   ├── services/          # ComplaintService, AudioRecorderService
│   │   │   ├── models/            # Complaint, enums
│   │   │   └── styles/            # tokens de design (cores, tipografia)
│   │   ├── assets/
│   │   │   ├── fixtures/          # SÓ sintéticas (SYN-*, TTS, PNGs 1x1)
│   │   │   ├── municipios-ibge.json
│   │   │   └── taxonomia-mock.json
│   │   ├── environments/
│   │   └── index.html
│   ├── e2e/                       # specs Playwright
│   ├── angular.json
│   ├── package.json
│   ├── vitest.config.ts
│   ├── playwright.config.ts
│   ├── tsconfig.json
│   └── README.md
│
├── mock-api/                      # NOVO — Express mock standalone
│   ├── src/
│   │   ├── index.js               # bootstrap Express
│   │   ├── routes/
│   │   │   ├── denuncias.js
│   │   │   ├── municipios.js      # proxy/fallback IBGE
│   │   │   └── health.js
│   │   ├── services/
│   │   │   ├── protocolo.js       # gerador SYN-*
│   │   │   ├── classifier-mock.js
│   │   │   └── alert-dispatcher-mock.js
│   │   ├── middleware/
│   │   │   ├── upload.js          # Multer + MIME + magic bytes
│   │   │   ├── redact.js          # pino-noir
│   │   │   └── correlation.js     # X-Request-ID
│   │   ├── logger.js
│   │   └── openapi-loader.js      # carrega contract/openapi.yaml
│   ├── test/
│   ├── package.json
│   ├── vitest.config.js
│   └── README.md
│
├── .github/
│   └── workflows/
│       ├── ci.yml                 # lint + unit + e2e + a11y + lighthouse
│       ├── contract-drift.yml     # detecta drift contract ↔ app ↔ mock
│       └── deploy-preview.yml     # Vercel preview por PR
│
├── .gitignore
├── .editorconfig
├── AGENTS.md                      # NOVO — governança do workspace denunciasnew
├── LICENSE
├── package.json                   # meta-package (scripts globais)
├── vercel.json                    # config de deploy
└── README.md                      # visão geral + como rodar
```

**Notas:**

- `app/` e `mock-api/` são **independentes** (cada um com seu `package.json` e `node_modules`). Meta-scripts no `package.json` raiz orquestram (`npm run dev`, `npm run test`).
- `contract/openapi.yaml` é referenciado por **ambos** — se mudar, CI de `contract-drift` alerta.
- `docs/` continua sendo autoridade documental; nada nele é alterado por este ciclo.

## 5. Contrato OpenAPI (esqueleto — Fatia 0)

Arquivo alvo: `denunciasnew/contract/openapi.yaml`. Descreve **apenas** o que o frontend precisa. O backend real futuro pode acrescentar campos, mas nunca **remover** os declarados.

```yaml
openapi: 3.1.0
info:
  title: Canal de Denúncias MPT — Contrato do MVP
  version: 0.1.0
  description: |
    Contrato entre o frontend Angular e o backend (mock no MVP,
    real futuramente). Fonte de verdade compartilhada.
    Referência: docs/preparacao-implementacao/08-TDD.delta-denunciasnew.md

paths:
  /api/denuncias:
    post:
      operationId: submeterDenuncia
      summary: Submete uma denúncia com anexos opcionais
      requestBody:
        required: true
        content:
          multipart/form-data:
            schema:
              type: object
              required: [denuncia]
              properties:
                denuncia:
                  type: string
                  description: JSON serializado do objeto Complaint
                arquivo_1..N:
                  type: string
                  format: binary
                arquivo_audio:
                  type: string
                  format: binary
      responses:
        '201':
          description: Denúncia aceita
          headers:
            X-Request-ID:
              schema: { type: string }
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/DenunciaAceita'
        '400': { description: Validação falhou }
        '413': { description: Tamanho excedido }
        '422': { description: Antimalware ou MIME rejeitado }
        '429': { description: Rate limit }

  /api/municipios:
    get:
      operationId: listarMunicipios
      summary: Lista municípios por UF
      parameters:
        - in: query
          name: uf
          required: true
          schema: { type: string, minLength: 2, maxLength: 2 }
      responses:
        '200':
          description: Lista de municípios
          content:
            application/json:
              schema:
                type: array
                items: { $ref: '#/components/schemas/Municipio' }

  /health:
    get:
      operationId: health
      summary: Health check
      responses:
        '200': { description: OK }

components:
  schemas:
    Complaint:
      type: object
      required: [origem, irregularidades, tipo_identificacao, uf, municipio]
      properties:
        origem: { type: string, enum: [WEB, WHATSAPP_BOT] }
        irregularidades:
          type: array
          items: { $ref: '#/components/schemas/Irregularidade' }
        relato_texto: { type: string }
        relato_audio_transcricao: { type: string }
        relato_audio_transcricao_status:
          type: string
          enum: [NAO_APLICAVEL, PENDENTE, CONCLUIDA, FALHA, EDITADA_MANUALMENTE]
        numero_prejudicados:
          type: string
          enum: [UM, DOIS_A_CINCO, SEIS_A_VINTE, VINTE_UM_A_CEM, MAIS_DE_CEM]
        modalidade_trabalho:
          type: string
          enum: [PRESENCIAL, REMOTO, HIBRIDO, INFORMAL, TERCEIRIZADO, OUTRA]
        grupos_vulneraveis:
          type: array
          items:
            type: string
            enum: [IDOSO, CRIANCA, PESSOA_COM_DEFICIENCIA, OUTRO]
        tipo_identificacao:
          type: string
          enum: [ANONIMO, IDENTIFICADO]
        nome_completo: { type: string }
        email: { type: string, format: email }
        telefone: { type: string }
        uf: { type: string, minLength: 2, maxLength: 2 }
        municipio: { type: string }
        municipio_ibge: { type: string }
        nome_empresa: { type: string }
        endereco_empresa: { type: string }
        testemunhas:
          type: array
          items: { $ref: '#/components/schemas/Testemunha' }
    Irregularidade:
      type: object
      required: [codigo]
      properties:
        codigo: { type: string }
        rotulo: { type: string }
        icone: { type: string }
        categoria: { type: string }
    Testemunha:
      type: object
      properties:
        tem_testemunhas: { type: boolean }
        nome_referencial: { type: string }
        contato_opcional: { type: string }
    Municipio:
      type: object
      required: [codigo_ibge, nome]
      properties:
        codigo_ibge: { type: string }
        nome: { type: string }
        uf: { type: string, minLength: 2, maxLength: 2 }
    DenunciaAceita:
      type: object
      required: [protocolo]
      properties:
        protocolo: { type: string, pattern: '^SYN-[A-Z0-9]{8}$' }
        timestamp: { type: string, format: date-time }
        classificacao: { $ref: '#/components/schemas/Classificacao' }
    Classificacao:
      type: object
      properties:
        categoria: { type: string }
        subcategoria: { type: string }
        prioridade:
          type: string
          enum: [BAIXA, MEDIA, ALTA, URGENTE]
        metodo:
          type: string
          enum: [REGRA_DETERMINISTICA, MODELO_ML]
        versao_classificador: { type: string }
        revisada_por_humano: { type: boolean }
```

## 6. Fatias adaptadas (novo plano)

**Total revisado:** **~40 fatias PRONTA** (vs. 33 anteriores) porque 9 se destravaram + 5 novas foram criadas para setup do projeto zero.

### 6.1 CP-0 — Fundação do projeto zero (7 fatias)

| ID | Descrição | Autorização |
| --- | --- | --- |
| FATIA-DN-CP0-INIT-01 | `git init` + `.gitignore` + `.editorconfig` + primeira estrutura de pastas | owner do ciclo |
| FATIA-DN-CP0-INIT-02 | `AGENTS.md` na raiz de `denunciasnew/` + `README.md` | owner do ciclo |
| FATIA-DN-CP0-INIT-03 | `contract/openapi.yaml` v0.1.0 + `contract/README.md` | Arquitetura |
| FATIA-DN-CP0-INIT-04 | `app/` — `ng new app --standalone --routing --style=css` + tokens de design | Frontend |
| FATIA-DN-CP0-INIT-05 | `mock-api/` — Express + pino + pino-noir + carregar OpenAPI | Backend |
| FATIA-DN-CP0-INIT-06 | Meta-scripts no `package.json` raiz (`npm run dev`, `test`, `build`, `deploy`) | Owner técnico |
| FATIA-DN-CP0-INIT-07 | Vercel setup (`vercel.json` + conectar repo GitHub) | Owner técnico |

### 6.2 CP-0 — CI/CD (5 fatias)

| ID | Descrição |
| --- | --- |
| FATIA-DN-CP0-CI-01 | `.github/workflows/ci.yml` — lint + unit + build |
| FATIA-DN-CP0-CI-02 | `.github/workflows/ci.yml` — Playwright + axe wcag21aa |
| FATIA-DN-CP0-CI-03 | `.github/workflows/ci.yml` — Lighthouse mobile Slow 3G |
| FATIA-DN-CP0-CI-04 | `.github/workflows/contract-drift.yml` — valida contract ↔ app ↔ mock |
| FATIA-DN-CP0-CI-05 | `.github/workflows/deploy-preview.yml` — Vercel preview por PR |

### 6.3 CP-0 — Ferramentas

| ID | Descrição |
| --- | --- |
| FATIA-DN-CP0-TOOL-01 | Fixtures sintéticas em `app/src/assets/fixtures/` (SYN-\*, PNGs 1×1, sample.pdf) |
| FATIA-DN-CP0-TOOL-02 | Script `mock-api/scripts/generate-tts-fixtures.js` usando `espeak-ng` |
| FATIA-DN-CP0-TOOL-03 | `openapi-typescript` gera tipos em `app/src/app/api/generated.ts` |

### 6.4 CP-1 → CP-5 (fatias já catalogadas)

As **~30 fatias** de CP-1 a CP-5 do plano original ([11-IMPLEMENTATION-PLAN.delta-denunciasnew.md](../11-IMPLEMENTATION-PLAN.delta-denunciasnew.md)) permanecem válidas com **3 ajustes**:

1. Todos os "arquivos permitidos" agora começam com `app/src/app/` (não mais `frontend/src/app/`).
2. Fatias de backend movem de `server/` para `mock-api/src/`.
3. Fatias que estavam BLOQUEADAS por `D-DN-06` (código legado ausente) ficam **PRONTA-P/-AUTORIZAÇÃO** (código novo é criado do zero):
   - FATIA-DN-CP0-06 (pino-noir) → **PRONTA**.
   - FATIA-DN-CP4-05 (applyAnonimizationRules) → **PRONTA**.
   - FATIA-DN-CP5-04 (gerador SYN-\*) → **PRONTA**.
   - FATIA-DN-CP6-01..06 (Classificador + Alertas mock) → **PRONTA**.

### 6.5 CP-a11y-piso + CP-mobile-perf

Sem mudanças. Todas PRONTA. CP-mobile-03 (Lighthouse) usa default LCP ≤ 4s / TTI ≤ 6s enquanto DEC-DN-08 não for respondida.

### 6.6 CP-6 destravado

Como o código é novo, todas as fatias CP-6 (Classificador mock + Alertas mock + LGPD art. 20) ficam **PRONTA** e viram parte do MVP.

### 6.7 Balanço final

- **Total planejado:** 47 fatias no MVP.
- **PRONTA-P/-AUTORIZAÇÃO:** **~42** (89%).
- **BLOQUEADA:** ~2 (CP1-03 URL Ouvidoria; CP3-07 LGPD testemunhas).
- **FORA-DO-MVP:** ~3 (chatbot WhatsApp + KPI baseline).

## 7. Prompt Codex — Ciclo 1: CP-0 (setup zero)

Cole este bloco no Codex após executar §9 (checklist inicial).

```prompt
Projeto: Canal de Denúncias MPT — MVP standalone (denunciasnew).
Workspace: <CAMINHO_ABSOLUTO_DE_denunciasnew/>.
Commit inicial: primeiro commit da branch main.
Branch: main.
Owner do ciclo: <NOME>.
Owner Frontend: <NOME>.
Owner Backend mock: <NOME>.
Autorização vigente: CÓDIGO_FATIA CP-0 completo (INIT + CI + TOOL).
Modo: prototype-driven MVP. Backend real futuro NÃO é escopo desta iniciativa.

Assuma INTEGRALMENTE a persona da Seção 4.0 de
docs/preparacao-implementacao/prompts/analise-denunciasnew.md
(Engenheiro Sênior Dev/DevOps/AIOps, 20a).
Aplique todos os princípios §4.0.3, tom §4.0.4, heurísticas §4.0.5,
anti-padrões §4.0.6, gatilhos §4.0.7.

Estratégia congelada (não questione, apenas execute):
- Framework: Angular 22 standalone + signals
- Package manager: npm
- Estilização: CSS puro + tokens de design + componentes custom
- Backend mock: Express 4 Node.js standalone em denunciasnew/mock-api/
- Contrato: OpenAPI 3.1 em denunciasnew/contract/openapi.yaml
- Deploy: Vercel com preview automático por PR

Fontes obrigatórias:
- docs/preparacao-implementacao/prompts/ESTRATEGIA-MVP-STANDALONE.md (este documento)
- docs/preparacao-implementacao/06-REQUIREMENTS.delta-denunciasnew.md (24 requisitos DN-*)
- docs/preparacao-implementacao/08-TDD.delta-denunciasnew.md (topologia alvo)
- docs/preparacao-implementacao/09-THREAT-MODEL.delta-denunciasnew.md (23 ameaças T-DN-*)
- docs/preparacao-implementacao/10-EVIDENCE-MANIFEST.delta-denunciasnew.md (fixtures + shots)
- docs/preparacao-implementacao/12-DECISIONS.delta-denunciasnew.md (decisões vigentes)
- docs/diagramas-mermaid/denunciasnew-*.mmd (5 diagramas)
- docs/Documento externo-outros 010970.2026.pdf (PDF externo — fonte primária dos requisitos)

Execute UMA FATIA POR VEZ, na ordem:

1. FATIA-DN-CP0-INIT-01 — git init + .gitignore + .editorconfig
   - Ações: `git init`; criar .gitignore (node_modules, dist, .env, coverage, .vercel);
     .editorconfig padrão (utf-8, LF, indent_size=2).
   - Teste focal: git status limpo após adicionar os 2 arquivos.
   - Commit: "chore(setup): inicializar Git + convenções de arquivo".

2. FATIA-DN-CP0-INIT-02 — AGENTS.md + README.md raiz
   - Ações: criar AGENTS.md com: escopo do projeto, persona §4.0 como padrão,
     comandos permitidos (git, npm), comandos proibidos (`rm -rf`, `git push --force`,
     `docker`, chamadas de rede não autorizadas), regras R-DN-01..05.
     Criar README.md com: visão do projeto, como rodar (`npm run dev`), 
     estrutura de diretórios, links aos docs.
   - Teste focal: AGENTS.md tem pelo menos as seções [Escopo], [Autorização], [Regras],
     [Comandos proibidos].
   - Commit: "docs(governance): AGENTS.md e README.md iniciais".

3. FATIA-DN-CP0-INIT-03 — contract/openapi.yaml v0.1.0
   - Ações: criar contract/openapi.yaml com o esqueleto da §5 deste documento
     (esquemas Complaint, DenunciaAceita, Classificacao, Municipio, Irregularidade,
     Testemunha; endpoints POST /api/denuncias, GET /api/municipios, GET /health).
     Criar contract/README.md explicando: (1) fonte de verdade única;
     (2) mudanças exigem PR + revisão; (3) drift entre contract, app e mock-api
     falha CI.
   - Teste focal: `npx swagger-cli validate contract/openapi.yaml` retorna válido.
   - Commit: "feat(contract): OpenAPI 3.1 v0.1.0 do MVP".

4. FATIA-DN-CP0-INIT-04 — app/ com Angular 22
   - Ações: `cd denunciasnew; npx @angular/cli@22 new app --standalone
     --routing --style=css --skip-git --package-manager=npm`.
     Configurar tsconfig strict. Criar tokens de design em app/src/styles/tokens.css
     (paleta, tipografia, spacing, tokens de contraste AAA para aviso de sigilo).
     Instalar devDeps: @axe-core/playwright, msw, openapi-typescript, zod.
     Criar app/src/app/api/ pasta placeholder (será populada por openapi-typescript).
   - Teste focal: `npm --prefix app run build` retorna 0 erros; bundle inicial < 500 kB gzip.
   - Commit: "feat(app): scaffolding Angular 22 standalone + tokens de design".

5. FATIA-DN-CP0-INIT-05 — mock-api/ Express
   - Ações: criar mock-api/package.json com deps: express@4, multer, pino, pino-noir,
     `@apidevtools/swagger-parser`, cors. Criar mock-api/src/index.js que carrega
     ../contract/openapi.yaml e monta rotas em memória. Implementar GET /health
     retornando {status:'ok'} + POST /api/denuncias retornando 201 + protocolo SYN-*
     gerado com crypto.randomUUID() encurtado para 8 chars alfanuméricos.
     Configurar pino-noir para redigir CPF, e-mail, telefone, tokens, IP.
     Adicionar package.json script "dev": "node --watch src/index.js".
   - Teste focal: `curl http://localhost:3001/health` retorna 200 + JSON;
     `curl -X POST -F 'denuncia={"origem":"WEB","irregularidades":[{"codigo":"FALTA_EPI"}],
     "tipo_identificacao":"ANONIMO","uf":"SP","municipio":"São Paulo"}' 
     http://localhost:3001/api/denuncias` retorna 201 com protocolo SYN-*.
   - Commit: "feat(mock-api): Express + pino + gerador SYN-* + contrato OpenAPI".

6. FATIA-DN-CP0-INIT-06 — Meta-scripts no package.json raiz
   - Ações: criar denunciasnew/package.json (raiz) com "private": true e scripts:
     "dev": "concurrently \"npm --prefix mock-api run dev\" \"npm --prefix app start\"",
     "test": "npm --prefix app test && npm --prefix mock-api test",
     "build": "npm --prefix app run build",
     "lint": "npm --prefix app run lint && npm --prefix mock-api run lint",
     "e2e": "npm --prefix app run e2e".
     Instalar concurrently como devDep na raiz.
   - Teste focal: `npm run dev` sobe app na :4200 e mock na :3001; requisição do
     app para http://localhost:3001/api/denuncias retorna 201.
   - Commit: "chore(root): meta-scripts orquestrando app + mock-api".

7. FATIA-DN-CP0-INIT-07 — vercel.json + conectar repo
   - Ações: criar vercel.json na raiz com config de monorepo (Angular build em app/,
     ignorar mock-api/ no build de produção; usar mock estático via public/mock-*.json
     para demonstração ou configurar function serverless simples).
     Documentar em README.md como o owner conecta o repo GitHub à Vercel.
   - Teste focal: `vercel dev` local (se Vercel CLI instalado) sobe o app.
   - Commit: "chore(deploy): configuração Vercel + preview por PR".
     
8. FATIA-DN-CP0-CI-01..05 — GitHub Actions (5 fatias em uma sessão)
   - Ações: criar .github/workflows/ci.yml com jobs:
     * lint (npm run lint em app e mock-api)
     * unit (npm test em app e mock-api)
     * a11y (axe-core/playwright wcag21aa em Chromium; falha em serious+)
     * lighthouse (mobile Slow 3G; publica JSON como artifact)
     * build (npm run build)
     Criar .github/workflows/contract-drift.yml que roda openapi-typescript e falha
     se app/src/app/api/generated.ts estiver defasado.
     Criar .github/workflows/deploy-preview.yml que dispara em PR.
   - Teste focal: PR fictício roda todos os workflows verde em < 10 min.
   - Commit: "chore(ci): pipeline completo (lint/unit/e2e/a11y/perf/contract-drift)".

9. FATIA-DN-CP0-TOOL-01..03 — Fixtures + tipos gerados
   - Ações: criar app/src/assets/fixtures/ com sample.pdf (1 página branca gerada
     por pdfkit), pixel.png (1×1), municipios-ibge.json (subset).
     Adicionar mock-api/scripts/generate-tts-fixtures.js que gera 3 WAV via
     espeak-ng se disponível (senão pula com aviso). Rodar openapi-typescript
     para popular app/src/app/api/generated.ts a partir do contract.
   - Teste focal: `npm test` no app importa os tipos gerados sem erro.
   - Commit: "feat(fixtures): fixtures sintéticas + tipos gerados do OpenAPI".

Após TODAS as 15 fatias:
- Rode `npm run dev` e valide que o app carrega em http://localhost:4200
  com uma tela vazia (ainda sem wizard) e o mock responde /health em :3001.
- Apresente diff resumido (git log --oneline), artefatos criados, riscos residuais
  e próximo gate (autorização para iniciar CP-1).
- Assine com o bloco §4.0.9 do roteiro-mestre.

PARE se:
- git init falhar (workspace já é repo);
- npm/npx não estiverem disponíveis;
- Angular CLI 22 não puder ser resolvido;
- OpenAPI failed validation;
- alguma fatia exigir arquivo fora do escopo desta autorização;
- duas iterações repetirem a mesma hipótese sem nova evidência.

Nada aqui autoriza:
- git push (pende autorização separada + repo remoto configurado);
- deploy Vercel real (pende conta configurada pelo owner);
- alterar contract/openapi.yaml após CP0-INIT-03 (mudanças exigem PR e review);
- instalar dependências além das listadas.
```

## 8. Sequência de execução recomendada

```
[DIA 0 — Owner humano]
├─ 1. Ler §1 (nova estratégia) + §3 (stack) desta página
├─ 2. Confirmar todas as 6 escolhas de §3
├─ 3. Criar repositório remoto (GitHub) vazio: github.com/mpt/denunciasnew-mvp
├─ 4. Criar conta Vercel (grátis) e conectar ao repo
├─ 5. Autorizar Codex a executar Ciclo 1 (§7)
└─ 6. Confirmar em mensagem: "Autorizado CP-0 completo"

[DIA 1–2 — Codex CP-0]
├─ Cole prompt §7 no Codex
├─ Codex executa 15 fatias em ~2h
├─ Após término: `npm run dev` funciona; site abre em :4200; mock responde em :3001
└─ Owner faz revisão + `git push` para o remoto

[SEMANA 1 — Codex CP-1]
├─ Owner autoriza CP-1 (prompt §7.3 do PROXIMAS-ACOES-DENUNCIASNEW.md, adaptado)
├─ Codex implementa StepAcolhimento + player vídeo
└─ Deploy preview no Vercel; owner revisa a demo

[SEMANAS 2–5 — Codex CP-2 → CP-mobile-perf]
├─ Prompts §7.4 → §7.7 do PROXIMAS-ACOES-DENUNCIASNEW.md
├─ Cada ciclo: owner autoriza → Codex executa → deploy preview → revisão

[SEMANA 5 fim] MVP público liberado ✅

[Pós-MVP]
├─ CP-a11y-alvo (WCAG 2.2 AA)
├─ CP-6 (classificador/alertas mock — agora vira parte do MVP porque destravou)
└─ Backend real acopla-se ao contract/openapi.yaml
```

## 9. Checklist de setup inicial (Owner — antes de qualquer Codex)

- [ ] Nomear owner do ciclo, Frontend, Backend mock, Segurança, A11y.
- [ ] Criar repositório GitHub vazio (privado ou público, decisão do owner).
- [ ] Adicionar arquivo `.env.template` no repo indicando variáveis esperadas (nenhuma no MVP; documentação futura).
- [ ] Criar conta Vercel Free e conectar ao repo (deploy preview automático por PR).
- [ ] Confirmar acesso ao Node.js 22.22.3+ e npm 11+ (já disponível no ambiente).
- [ ] (Opcional) Instalar `@angular/cli@22` globalmente ou usar `npx`.
- [ ] Autorizar Codex a executar CP-0.
- [ ] Salvar este documento (`ESTRATEGIA-MVP-STANDALONE.md`) como leitura obrigatória do time.

## 10. Regras de governança do novo projeto (para `AGENTS.md`)

Sugestão para o `AGENTS.md` que a fatia CP0-INIT-02 vai criar:

```markdown
# AGENTS.md — denunciasnew MVP

## Escopo
Este projeto é um MVP standalone do novo formulário do Canal de Denúncias MPT.
Frontend Angular 22 + backend mock Express. NÃO é o produto final.

## Persona padrão
Todo agente de IA que atuar neste projeto DEVE assumir a persona da §4.0 de
docs/preparacao-implementacao/prompts/analise-denunciasnew.md.

## Fonte primária
1. docs/Documento externo-outros 010970.2026.pdf (PDF de requisitos UX/mobile)
2. contract/openapi.yaml (contrato do backend)
3. docs/preparacao-implementacao/*.delta-denunciasnew.md (deltas técnicos)
4. docs/diagramas-mermaid/denunciasnew-*.mmd (diagramas)

## Regras P0 aplicáveis
Todas as R-* de docs/licoesaprendidas/04-ia-rules-skills-tools-mcp-agents.md.
Além de:
- R-DN-01: envelope enviado ao classificador NUNCA contém PII
- R-DN-02: prioridade é setada server-side (mock ou real), nunca aceita do cliente
- R-DN-03: decisão automatizada URGENTE exige revisada_por_humano=true antes de alerta
- R-DN-04: rate limit compartilhado (mesmo mock)
- R-DN-05: fixtures sintéticas apenas (SYN-*, @example.com, TTS)

## Comandos permitidos (sem autorização adicional)
- git, npm, npx, node, playwright
- ng serve, ng build, ng test
- axe-core, lighthouse

## Comandos PROIBIDOS (exigem autorização just-in-time)
- git push --force / git reset --hard
- rm -rf
- docker (por enquanto)
- deploy manual à Vercel prod (só CI faz)
- chamar backend real do MPT
- instalar dependências fora do lock

## Padrões de código
- TypeScript strict
- Angular standalone components
- Signals para estado
- Testes unit ANTES da implementação
- WCAG 2.1 AA piso, 2.2 AA alvo (CI valida)
- Lighthouse mobile Slow 3G no CI

## Contrato imutável (sem review)
- contract/openapi.yaml SÓ muda com PR + revisão
- app/src/app/api/generated.ts é AUTOGERADO — não editar

## Autoridade final
Owner do ciclo (humano) é sempre a autoridade final. Dois agentes concordarem
NÃO substitui evidência.
```

## 11. Encerramento

Com esta nova estratégia:

- **~89% das fatias** ficam PRONTA-P/-AUTORIZAÇÃO no MVP.
- **15 riscos zerados**, **10 mitigados**, **5 permanecem** (todos dependem de decisão humana, não de código).
- **~2h de setup** (Ciclo 1 do Codex) transforma o workspace em projeto executável.
- **Deploy visível** no Vercel desde o segundo dia.
- **Contrato OpenAPI** publicado é a garantia de que o backend real futuro pode ser acoplado sem retrabalho no frontend.

**Próximo comando concreto para o owner:** siga o checklist §9. Ao terminar, cole o prompt §7 no Codex.

Boa construção.
