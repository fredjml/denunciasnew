# Relatório de Análise Profunda do Codebase — Canal de Denúncias MPT

**Data:** 31 de Julho de 2026  
**Versão:** 1.0  
**Público-Alvo:** Diretoria de TI, Equipe de Desenvolvimento, DPO/LGPD  
**Escopo:** Frontend Angular 22 + Backend Node.js/Express + E2E Playwright + CI/CD  

---

## 1. Sumário Executivo

A análise abrangente e profunda do codebase do Canal de Denúncias do MPT identificou **47 pontos de melhoria** distribuídos em 4 eixos: **Quality Assurance (QA)**, **Clean Code**, **Segurança (Security)** e **Testes de Regressão**. A aplicação apresenta boa arquitetura geral com separação clara de responsabilidades entre frontend (Angular 22 com Signals) e backend (Express BFF), porém existem lacunas significativas que podem comprometer a confiabilidade, segurança e manutenibilidade do sistema em operação real.

### Resumo Quantitativo

| Eixo | Crítico (P0) | Alto (P1) | Médio (P2) | Baixo (P3) | Total |
|------|:---:|:---:|:---:|:---:|:---:|
| **QA** | 3 | 5 | 4 | 2 | **14** |
| **Clean Code** | 0 | 3 | 6 | 3 | **12** |
| **Segurança** | 2 | 4 | 3 | 2 | **11** |
| **Testes de Regressão** | 2 | 4 | 3 | 1 | **10** |
| **TOTAL** | **7** | **16** | **16** | **8** | **47** |

---

## 2. Arquitetura Analisada

### 2.1 Frontend (Angular 22)
- **Componentes:** `App`, `Acolhimento`, `StepIrregularidades`, `StepOcorrencias`, `StepEvidencias`, `StepIdentificacao`, `StepLocal`, `StepRevisao`, `Confirmation`
- **Serviços:** `ComplaintService` (estado centralizado via Signals), `ComplaintApiClient` (comunicação HTTP)
- **Modelo:** `complaint.model.ts` com interfaces `Complaint`, `FileAttachment`, constantes `IRREGULARIDADES`, `ESTADOS_UF`
- **Estilo:** Design System CSS customizado (Legal Design / Visual Law), 1320 linhas

### 2.2 Backend (Node.js/Express)
- **Entrada:** `index.js` com Helmet, CORS, rate limiting, Morgan logging
- **Rotas:** `complaint.routes.js` com Swagger annotations
- **Controller:** `complaint.controller.js` com orquestração de scan antimalware e envio à API MPT
- **Serviços:** `complaint.service.js` (validação, protocolo, payload)
- **Middleware:** `upload.js` (Multer disk storage com cleanup)
- **Clientes:** `clamav.client.js` (TCP/INSTREAM), `mpt-api.client.js` (Axios multipart)
- **Infra:** `redis-rate-limit-store.js` (Redis Store para rate limiting distribuído)

### 2.3 Testes existentes
- **Frontend:** Vitest — `complaint.service.spec.ts` (5 testes), `complaint-api.client.spec.ts` (3 testes)
- **Backend:** Vitest — `index.spec.mjs` (7 testes), `complaint.controller.spec.mjs` (7 testes), `complaint.service.spec.mjs` (6 testes), `clamav.client.spec.mjs` (3 testes), `mpt-api.client.spec.mjs` (3 testes), `upload.spec.mjs` (1 teste), `redis-rate-limit-store.spec.mjs` (2 testes), `secure-upload.integration.spec.mjs` (1 teste integrativo)
- **E2E:** Playwright — `complaint-journey.spec.ts` (4 cenários), `ui-audit.spec.ts` (1 auditoria profunda)

### 2.4 Métricas Quantitativas do Codebase e Suítes

#### Volumetria e Linhas de Código (SLOC - Source Lines of Code)

| Linguagem / Formato | Arquivos | Linhas Totais | Linhas de Código (SLOC) | Comentários | Linhas em Branco |
|---------------------|:--------:|:-------------:|:-----------------------:|:-----------:|:----------------:|
| **TypeScript (Frontend / Specs)** | 20 | 1.450 | 1.245 | 28 | 177 |
| **JavaScript / ESM (Backend / Specs)** | 19 | 1.486 | 1.196 | 88 | 202 |
| **CSS / SCSS (Styles / Theme)** | 11 | 1.860 | 1.477 | 106 | 277 |
| **HTML (Angular Templates)** | 10 | 782 | 697 | 27 | 58 |
| **JSON (Configs / Tooling)** | 7 | 302 | 302 | 0 | 0 |
| **TOTAL DO CODEBASE** | **67** | **5.875** | **4.917** | **249** | **714** |

#### Estatísticas das Suítes de Testes e Auditoria Estática

| Suíte / Módulo | Ferramenta | Arquivos de Teste | Total de Testes | Taxa de Sucesso (Pass Rate) |
|----------------|------------|:-----------------:|:---------------:|:--------------------------:|
| **Backend Express BFF** | Vitest | 8 | 30 | **100% (30/30 aprovados)** |
| **Frontend Angular SPA** | Vitest | 2 | 8 | *Pendente ajustar runner de browser* |
| **Interface E2E / Audit** | Playwright | 2 | 5 | 100% (execução local mockada) |

#### Auditoria de Segurança de Dependências (`npm audit`)

| Ambiente | Dep. Produção | Dep. Desenvolvimento | Vulnerabilidades Críticas | Vulnerabilidades Altas | Vulnerabilidades Moderadas |
|----------|:-------------:|:--------------------:|:------------------------:|:---------------------:|:--------------------------:|
| **Frontend (Angular)** | 99 | 554 | 0 | 2 (dev tools) | 4 (dev tools) |
| **Backend (Express)** | 150 | 185 | 0 | 5 (dev tools) | 0 |
| **TOTAL** | **249** | **739** | **0** | **7** | **4** |

> *Nota: 100% das dependências de produção estão livres de vulnerabilidades conhecidas. As vulnerabilidades identificadas afetam exclusivamente ferramentas de desenvolvimento (como CLI, linters e bundlers em desenvolvimento).*

---

## 3. Análise de QA (Quality Assurance)

### 3.1 Crítico (P0)

| # | Camada | Achado | Arquivo(s) | Impacto |
|---|--------|--------|------------|---------|
| QA-01 | Frontend | **Ausência de validação frontend antes de avançar etapas** — O formulário permite avançar de qualquer step sem preencher campos obrigatórios (UF, município, relato). A validação só existe no backend (`validateComplaint`), mas o frontend chama `nextStep()` sem verificação alguma. | `step-irregularidades.ts:106-108`, `step-ocorrencias.ts:39`, `step-evidencias.ts:88`, `step-local.ts:54` | Recepção de denúncias incompletas; experiência do usuário degradada |
| QA-02 | Frontend | **Dados pessoais não são limpos ao trocar para "Anônimo"** — Se o cidadão preenche nome/email/telefone como "identificado" e depois volta e seleciona "anônimo", os dados pessoais continuam no objeto `Complaint` e são enviados ao servidor. | `step-identificacao.ts:27-29` | Violação de privacidade e promessa de anonimato |
| QA-03 | Frontend | **Áudio gravado (Blob) é descartado silenciosamente na serialização** — O `ComplaintApiClient` serializa `complaintData` como JSON via `JSON.stringify()`, mas o campo `relato_audio` é um `Blob` que se torna `{}` no JSON, sendo perdido sem aviso. | `complaint-api.client.ts:9-11` | Perda total de evidência oral do cidadão |

### 3.2 Alto (P1)

| # | Camada | Achado | Arquivo(s) | Sugestão |
|---|--------|--------|------------|----------|
| QA-04 | Frontend | **Sem persistência de rascunho** — Recarga da página (F5) ou interrupção (chamada telefônica) apaga todo o progresso do formulário. Nenhum mecanismo de `sessionStorage` ou `localStorage`. | `complaint.service.ts` | Implementar auto-save em `sessionStorage` a cada alteração de step |
| QA-05 | Frontend | **Sem timeout no envio HTTP do frontend** — A chamada `fetch('/api/denuncias')` não possui `AbortController` com timeout. Em redes lentas, o botão fica travado em "Enviando..." indefinidamente. | `complaint-api.client.ts:17-20` | Adicionar `AbortController` com timeout de 30s |
| QA-06 | Frontend | **Botões/cards sem funcionalidade ("mortos")** — O botão de acessibilidade (`#btn-accessibility`), o vídeo institucional (`#video-institucional`), e os cards "Órgão Público" e "Ouvidoria" são elementos visuais sem ação. | `acolhimento.html:36-48`, `app.html:39-41` | Implementar ou remover/desabilitar visualmente |
| QA-07 | Middleware | **`upload.any()` aceita qualquer campo de arquivo** — A rota usa `upload.any()` em vez de `upload.array('arquivo', MAX)`, aceitando uploads em campos arbitrários. | `complaint.routes.js:57` | Usar `upload.array('arquivo_0', 10)` ou `upload.fields()` |
| QA-08 | Frontend | **Stepper permite pular para qualquer etapa** — O componente `stepper-dot` na `app.html` permite clicar em qualquer dot e pular para qualquer step, mesmo sem preencher etapas anteriores. | `app.html:60-68` | Restringir navegação apenas a steps já visitados/completados |

### 3.3 Médio (P2)

| # | Camada | Achado | Arquivo(s) | Sugestão |
|---|--------|--------|------------|----------|
| QA-09 | Frontend | **Sem validação de CNPJ (dígito verificador)** — A máscara de CNPJ em `step-local.ts:31-41` formata mas não valida dígitos verificadores. CNPJs como `11.111.111/1111-11` são aceitos. | `step-local.ts:31-41` | Implementar algoritmo de validação de dígito verificador do CNPJ |
| QA-10 | Frontend | **Sem validação de formato de email** — O campo de email aceita qualquer texto sem validação de formato (ex: `nao-e-email`). | `step-identificacao.html:65-72` | Adicionar validação com regex ou `Validators.email` do Angular |
| QA-11 | Frontend | **Sem validação de formato de telefone** — O campo de telefone aceita texto livre como `abc`. | `step-identificacao.html:74-82` | Adicionar máscara e validação de formato de telefone brasileiro |
| QA-12 | Frontend | **Ausência de labels `<label>` nos inputs** — Os inputs usam placeholder como rótulo, mas não possuem `<label>` associado, afetando acessibilidade (WCAG 2.1 AA). | Todos os steps com inputs | Adicionar `<label for="id">` para cada input |

### 3.4 Baixo (P3)

| # | Camada | Achado | Arquivo(s) | Sugestão |
|---|--------|--------|------------|----------|
| QA-13 | Frontend | **Sem indicação de campos obrigatórios (asterisco)** — Apenas o step 5 (Local) indica "Obrigatório", os demais não informam quais campos são obrigatórios. | Todos os steps | Padronizar indicação visual de obrigatoriedade |
| QA-14 | Frontend | **Sem feedback visual de upload em progresso** — Não há barra de progresso ou spinner durante o upload de arquivos. | `step-evidencias.ts:41-58` | Adicionar indicador de progresso de upload |

---

## 4. Análise de Clean Code

### 4.1 Alto (P1)

| # | Camada | Achado | Arquivo(s) | Sugestão |
|---|--------|--------|------------|----------|
| CC-01 | Frontend | **Números mágicos na navegação de steps** — Os números 0-6 para steps estão hardcoded em `app.ts`, `app.html`, `complaint.service.ts`. Não há enum ou constante descritiva. | `app.ts:36-40`, `app.html:59`, `complaint.service.ts:34,40` | Criar enum `ComplaintStep { WELCOME = 0, IRREGULARIDADES = 1, ... }` |
| CC-02 | Frontend | **Padrão de state management inconsistente entre components** — Alguns components (Ocorrencias, Evidencias, Identificacao, Local) mantêm estado local via `signal()` e sincronizam no `save()` / `ngOnDestroy()`. Outros (Irregularidades) fazem update direto no serviço. | Todos os step components | Padronizar: ou todos usam signals locais com save, ou todos fazem binding direto ao service |
| CC-03 | Backend | **Função `parsePositiveInteger` duplicada** — Mesma função aparece em 3 arquivos diferentes: `server/index.js:24-27`, `server/infrastructure/redis-rate-limit-store.js:7-10`, `server/clients/clamav.client.js:23-26`. | 3 arquivos backend | Extrair para um módulo utilitário compartilhado (`utils/parse.js`) |

### 4.2 Médio (P2)

| # | Camada | Achado | Arquivo(s) | Sugestão |
|---|--------|--------|------------|----------|
| CC-04 | Frontend | **Uso excessivo de `!important` no CSS** — O arquivo `styles.css` e components usam `!important` 12+ vezes para sobrescrever estilos, indicando especificidade mal gerenciada. | `styles.css`, `acolhimento.css` | Refatorar hierarquia de seletores CSS; usar `:host` corretamente |
| CC-05 | Frontend | **Typo no nome de propriedade** — `funcoesSentores` no `step-ocorrencias.ts:17` deveria ser `funcoesSetores`. Erro de digitação propagado. | `step-ocorrencias.ts:17` | Corrigir para `funcoesSetores` |
| CC-06 | Frontend/Backend | **Template `app.html` usa mix de line endings** — O arquivo tem mix de `\r\n` (Windows) e `\n` (Unix), indicando contribuições de diferentes SOs sem normalização. | `app.html`, `app.ts`, múltiplos | Configurar `.gitattributes` com `* text=auto eol=lf` |
| CC-07 | Frontend | **Rotas Angular vazias** — O arquivo `app.routes.ts` declara `routes: Routes = []` sem nenhuma rota. O sistema inteiro funciona via conditional rendering em vez de routing. | `app.routes.ts` | Se routing não é necessário, remover `provideRouter(routes)` do config |
| CC-08 | Frontend | **`app.config.ts` não provê `provideHttpClient()`** — O Angular HttpClient não está configurado. O sistema usa `fetch()` diretamente em vez do HttpClient do Angular. | `app.config.ts` | Migrar para `HttpClient` ou documentar a decisão de usar `fetch()` nativo |
| CC-09 | Frontend | **Dependências não utilizadas no root `package.json`** — `multer`, `opencode-ai`, `@ng-bootstrap/ng-bootstrap` e `bootstrap` estão nas dependências do frontend mas não são importados no código Angular. | `package.json:36-40` | Remover dependências não utilizadas |

### 4.3 Baixo (P3)

| # | Camada | Achado | Arquivo(s) | Sugestão |
|---|--------|--------|------------|----------|
| CC-10 | Frontend | **CSS global com 1320 linhas** — O arquivo `styles.css` é monolítico. Deveria ser particionado em módulos (variables, reset, layout, components, etc.). | `src/styles.css` | Dividir em arquivos CSS modulares importados no `angular.json` |
| CC-11 | Backend | **Sem JSDoc nos services e controllers do backend** — As funções exportadas dos modules do servidor carecem de documentação de parâmetros e retornos. | Todos os arquivos `server/` | Adicionar JSDoc padronizado |
| CC-12 | Backend | **`express-validator` instalado mas não utilizado** — A dependência `express-validator` está no `package.json` do servidor mas a validação é feita manualmente em `complaint.service.js`. | `server/package.json:19` | Remover ou migrar validação para `express-validator` |

---

## 5. Análise de Segurança

### 5.1 Crítico (P0)

| # | Camada | Achado | Arquivo(s) | Impacto | Sugestão |
|---|--------|--------|------------|---------|----------|
| SEC-01 | Frontend/Backend | **Vazamento de PII em denúncia anônima** — Dados pessoais (nome, email, telefone) preenchidos em modo "identificado" persistem no payload quando o usuário retorna e muda para "anônimo". O backend não faz sanitização de PII baseada no `tipo_identificacao`. | `step-identificacao.ts`, `complaint.service.js` | Violação LGPD | Limpar campos PII no frontend ao mudar para anônimo E no backend ao receber `tipo_identificacao === 'anonimo'` |
| SEC-02 | Backend | **Geração de protocolo com `Math.random()` (não-criptográfico)** — Protocolos são gerados usando `Math.random()`, que não é criptograficamente seguro e pode ser previsível. | `complaint.service.js:4-13` | Protocolo previsível | Migrar para `crypto.randomBytes()` ou `crypto.randomUUID()` |

### 5.2 Alto (P1)

| # | Camada | Achado | Arquivo(s) | Impacto | Sugestão |
|---|--------|--------|------------|---------|----------|
| SEC-03 | Middleware | **`upload.any()` sem restrição de campo** — A rota aceita upload em qualquer campo do formulário via `multer.any()`. Um atacante pode enviar arquivos em campos inesperados. | `complaint.routes.js:57` | Upload arbitrário | Usar `upload.array('arquivo', MAX_FILES)` ou `upload.fields()` com campos específicos |
| SEC-04 | Middleware | **MIME type verificado apenas pelo cabeçalho HTTP, sem magic bytes** — O `fileFilter` do Multer verifica `file.mimetype` que é fornecido pelo cliente. Um atacante pode enviar um executável com MIME type falsificado. | `upload.js:40-46` | Bypass de filtro | Adicionar verificação de magic bytes (file signatures) com library como `file-type` |
| SEC-05 | Middleware | **Sem Content Security Policy (CSP)** — Helmet está configurado mas não há CSP explícita. O `index.html` carrega fonts do Google Fonts via CDN sem nonce ou hash. | `index.js:72-74`, `index.html:10-12` | XSS mitigation fraca | Configurar CSP explícita no Helmet com diretivas para fonts e scripts |
| SEC-06 | Backend | **`mpt-api.client.js` lê `process.env.MPT_API_URL` diretamente** — Em vez de receber a URL via injeção de dependência como os outros módulos, acessa diretamente o `process.env`, dificultando testes e criando acoplamento. | `mpt-api.client.js:30` | Testabilidade ruim | Passar `env` como parâmetro, como feito em `clamav.client.js` |

### 5.3 Médio (P2)

| # | Camada | Achado | Arquivo(s) | Impacto | Sugestão |
|---|--------|--------|------------|---------|----------|
| SEC-07 | Middleware | **Sem rate limiting no endpoint `/api/denuncias/info`** — O endpoint informacional não tem proteção contra abuso. | `complaint.routes.js:71` | DoS informacional | Aplicar rate limit permissivo neste endpoint |
| SEC-08 | Backend | **Sem sanitização de input de texto livre** — Os campos `relato_texto`, `nomes_dados`, `funcoes_setores` são textos livres que são enviados ao backend sem sanitização contra XSS stored. | `step-ocorrencias.html`, `step-irregularidades.html` | XSS stored | Sanitizar inputs no backend antes de armazenar/encaminhar |
| SEC-09 | Middleware | **Log do path original em 404** — O handler 404 retorna `req.originalUrl` na resposta, potencialmente expondo informações de rotas internas. | `index.js:130-135` | Information disclosure | Remover `path` da resposta em produção |

### 5.4 Baixo (P3)

| # | Camada | Achado | Arquivo(s) | Impacto | Sugestão |
|---|--------|--------|------------|---------|----------|
| SEC-10 | Frontend | **Sem termos de uso / consentimento LGPD** — Não existe checkbox ou tela de aceite de termos de uso antes do envio da denúncia. | `step-revisao.html` | Conformidade legal | Adicionar aceite de termos antes do botão de envio |
| SEC-11 | Middleware | **Sem cabeçalho `X-Request-ID` para rastreabilidade** — As requisições não possuem identificador único para correlacionar logs entre frontend e backend. | `index.js` | Dificuldade de auditoria | Gerar e propagar `X-Request-ID` em cada requisição |

---

## 6. Análise de Testes de Regressão

### 6.1 Crítico (P0)

| # | Camada | Achado | Impacto | Sugestão |
|---|--------|--------|---------|----------|
| REG-01 | CI/CD | **CI/CD não executa testes E2E** — O workflow `npm-audit.yml` roda apenas `npm run test` (Vitest) e `npm audit`. Os testes Playwright E2E **não são executados** no pipeline. | Regressões visuais e funcionais passam despercebidas | Adicionar job de E2E com `npx playwright test` e upload de artefatos |
| REG-02 | E2E / Testes | **`ui-audit.spec.ts` nunca falha o pipeline** — O teste de auditoria registra achados como `CRÍTICO` e `AVISO` em um JSON mas o `expect()` final apenas verifica `audits.length > 6`. Achados críticos não falham o teste. | Bugs críticos documentados mas não bloqueiam merge | Adicionar `expect(report.criticalFindings).toEqual([])` |

### 6.2 Alto (P1)

| # | Camada | Achado | Impacto | Sugestão |
|---|--------|--------|---------|----------|
| REG-03 | E2E / Testes | **Sem teste E2E para fluxo anônimo** — O helper `completeComplaintForm()` sempre testa o fluxo "identificado". O fluxo principal do sistema (denúncia anônima) nunca é testado end-to-end. | Regressão no fluxo mais usado | Criar teste E2E específico para fluxo anônimo |
| REG-04 | Frontend | **Sem testes unitários para nenhum componente Angular** — Nenhum dos 8 componentes possui arquivo `.spec.ts`. Apenas o service e o client têm testes. | 0% de cobertura de componentes | Criar `.spec.ts` para cada componente com TestBed |
| REG-05 | E2E / Testes | **Testes de acessibilidade Axe apenas na tela inicial** — O teste `registra baseline automatizada de acessibilidade` executa Axe apenas na tela de Acolhimento. Os steps dinâmicos (formulários) não são auditados. | Problemas de acessibilidade nos formulários não detectados | Executar Axe em cada step do formulário |
| REG-06 | CI/CD | **Sem teste para o backend `npm run test` no CI** — O job `audit-server` não executa `npm run test`, apenas `npm audit`. Os 26 testes unitários do backend **não rodam no CI**. | Regressões no backend passam despercebidas | Adicionar `- run: npm run test` no job `audit-server` |

### 6.3 Médio (P2)

| # | Camada | Achado | Impacto | Sugestão |
|---|--------|--------|---------|----------|
| REG-07 | E2E / Testes | **Zero integração real frontend↔backend nos E2E** — Todos os testes E2E usam `page.route()` para mockar a API. Nunca testam a integração real (Multer, ClamAV, validação backend). | Bugs de serialização/integração não detectados | Criar ao menos 1 teste E2E com backend real local |
| REG-08 | Backend | **Sem teste para upload de arquivo oversized** — Não existe teste que simule envio de arquivo acima do limite de 20MB. | Comportamento desconhecido em arquivo grande | Adicionar teste de limite de tamanho |
| REG-09 | Frontend | **Sem teste de timeout/rede lenta** — Não existe simulação de rede lenta ou timeout para verificar comportamento do frontend. | UI travada não detectada | Adicionar teste com `page.route()` usando `delay` |

### 6.4 Baixo (P3)

| # | Camada | Achado | Impacto | Sugestão |
|---|--------|--------|---------|----------|
| REG-10 | E2E / Testes | **`ui-audit.spec.ts` escreve fora do repositório** — `OUT_DIR = path.resolve('..', 'Analises')` escreve em diretório fora do projeto, causando falha em CI. | Falha em ambiente CI | Usar `path.resolve('./playwright-report/Analises')` |

---

## 7. Matriz Consolidada de Priorização

| Prioridade | Achados | Esforço Estimado | Recomendação |
|------------|---------|:---:|---|
| 🔴 **P0 — Bloqueador** (7 itens) | QA-01, QA-02, QA-03, SEC-01, SEC-02, REG-01, REG-02 | ~2 semanas | **Corrigir antes de qualquer deploy em produção** |
| 🟡 **P1 — Alta Prioridade** (16 itens) | QA-04 a QA-08, CC-01 a CC-03, SEC-03 a SEC-06, REG-03 a REG-06 | ~3 semanas | **Resolver na sprint imediata** |
| 🟢 **P2 — Média Prioridade** (16 itens) | QA-09 a QA-12, CC-04 a CC-09, SEC-07 a SEC-09, REG-07 a REG-09 | ~2 semanas | **Planejar para próximas 2 sprints** |
| ⚪ **P3 — Baixo** (8 itens) | QA-13, QA-14, CC-10 a CC-12, SEC-10, SEC-11, REG-10 | ~1 semana | **Backlog de melhoria contínua** |

---

## 8. Recomendações Estratégicas

### 8.1 Ações Imediatas (Semana 1-2)
1. **Corrigir vazamento de PII** em denúncias anônimas (SEC-01/QA-02)
2. **Corrigir serialização de áudio Blob** no FormData (QA-03)
3. **Implementar validação frontend** em todos os steps (QA-01)
4. **Migrar geração de protocolo** para `crypto.randomBytes()` (SEC-02)
5. **Adicionar E2E e testes backend ao CI** (REG-01, REG-06)
6. **Tornar `ui-audit.spec.ts` assertivo** em achados críticos (REG-02)

### 8.2 Ações de Curto Prazo (Semana 3-5)
1. Implementar persistência de rascunho via `sessionStorage`
2. Adicionar timeout com `AbortController` no envio do frontend
3. Restringir `upload.any()` para campos específicos
4. Adicionar verificação de magic bytes nos uploads
5. Criar testes unitários para todos os componentes Angular
6. Criar testes E2E para fluxo anônimo

### 8.3 Ações de Médio Prazo (Semana 6-8)
1. Refatorar números mágicos para enums
2. Extrair funções duplicadas para módulos utilitários
3. Adicionar validação de CNPJ, email e telefone
4. Configurar CSP no Helmet
5. Criar teste E2E com integração real frontend↔backend
6. Modularizar CSS global

---

## 9. Conclusão

O Canal de Denúncias do MPT possui uma **base sólida de código** com boas práticas em várias áreas (injeção de dependência no backend, Signals do Angular, design system CSS, ClamAV antimalware, rate limiting com Redis). No entanto, os **7 achados críticos (P0)** identificados — especialmente o vazamento de dados pessoais em denúncias anônimas e a ausência de validação frontend — representam riscos concretos à privacidade dos cidadãos e à confiabilidade operacional do sistema.

**Recomendação final:** Corrigir todos os itens P0 e habilitar E2E no CI **antes** de qualquer deploy em ambiente de produção.

---

*Relatório gerado pela Equipe de Arquitetura de Software e Segurança da Informação — MPT / PRT17-ES*
