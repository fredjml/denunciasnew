# Quality Gates, DoR e DoD

Cada gate tem entrada, saída e condição de bloqueio. Não marque aprovado sem evidência observada.

| Gate | Entrada | Saída verificável | Bloqueia quando |
| --- | --- | --- | --- |
| 0 — Environment Ready | fonte + workspace | pre-flight, ferramentas, Git, acessos, owners | runtime/target/dependência essencial ausente |
| 1 — Requirements Ready | fonte primária | requisitos, aceite, conflitos, rastreabilidade | requisito crítico sem ID/aceite ou exclusão não aprovada |
| 2 — Architecture Ready | matriz aprovada | componentes, dados, trust boundaries, contrato, fallback, evidence plan | dado/integração/ameaça crítica não modelada |
| 3 — Implementation | fatia pronta | mudança pequena + validação focal | escopo expande ou teste mínimo falha |
| 4 — Testing | candidato | unidade, integração, contrato, E2E e regressão proporcionais | teste obrigatório falha/não é executado |
| 5 — Review | diff + fonte + resultados | findings independentes por severidade | crítico/alto não tratado ou review circular |
| 6 — Security/QA | candidato revisado | segurança, privacidade, a11y e evidência | segredo, PII, falha crítica, artifact inválido |
| 7 — Delivery Ready | DoD + autorização | pacote entregável/publicável + rollback | aceite, target, evidência ou autorização ausente |

## Baseline factual da suíte (RELATORIO_TESTES 24/07/2026)

Use como âncora de comparação. Reexecute antes de citar; se divergir, atualize o [drift](00-mapa-origens-baseline-drift.md) e o [baseline](15-baseline-analises-denuncias.md).

| Suíte | Ferramenta | Contagem declarada | Observação |
| --- | --- | --- | --- |
| Backend Vitest | Vitest 4.1.10 + Supertest | 30/30, ~1,79 s | doubles para ClamAV, Redis e API MPT |
| Frontend Vitest | Vitest 4.1.9 (Angular unit-test) | 8/8, ~15,89 s | serviço + cliente HTTP |
| E2E Playwright + axe | Playwright | 16/16 (4 projetos × 4 cenários) | API mockada; sem BFF/Redis/ClamAV/MPT live |
| ESLint frontend/backend | ESLint | 0 erros / 0 avisos | — |
| `npm audit --omit=dev` frontend | 99 deps de produção | 0 vulnerabilidades | dev tools mantêm alertas moderados |
| `npm audit --omit=dev` backend | 150 deps de produção | 0 vulnerabilidades | dev tools mantêm alertas moderados |

## Riscos prioritários P0/P1 (RELATORIO_ANALISE... 31/07/2026)

São condições necessárias para promover o Denúncias a produção. Cada linha vira requisito em `REQUIREMENTS.md`, com prova em `TESTING.md` e evidência sanitizada. Ver mapeamento completo em [15-baseline-analises-denuncias.md](15-baseline-analises-denuncias.md).

- **P0 SEC-01/QA-02** — PII persiste no payload em modo "anônimo"; violação LGPD. Bloqueia produção.
- **P0 QA-03** — Áudio Blob descartado pelo `JSON.stringify`; evidência do cidadão nunca chega ao BFF.
- **P0 QA-01** — Wizard permite avançar sem campos obrigatórios.
- **P0 SEC-02** — Protocolo com `Math.random()`; migrar para `crypto`.
- **P0 REG-01/REG-06** — CI não executa E2E nem `npm run test` do backend; regressão silenciosa.
- **P0 REG-02** — `ui-audit.spec.ts` não falha em achados críticos.
- **P1 QA-04** — Sem persistência de rascunho.
- **P1 QA-05** — `fetch` sem timeout/AbortController.
- **P1 QA-06** — Botões e cards sem ação.
- **P1 SEC-03/QA-07** — `upload.any()` sem restrição de campo.
- **P1 SEC-04** — MIME sem magic bytes.
- **P1 SEC-05** — CSP não configurada explicitamente.
- **P1 SEC-06** — `mpt-api.client.js` acessa `process.env` diretamente.
- **P1 REG-03/04/05** — Fluxo anônimo sem E2E, componentes Angular sem unit tests, axe apenas em Acolhimento.

Nenhum destes é aprovado "por leitura" ou "por confiança em relatório antigo"; exigem execução recente com evidência sanitizada.

## Definition of Ready

- [ ] fonte primária e objetivo;
- [ ] IDs, tipos, aceite e escopo negativo;
- [ ] conflitos, hipóteses e exclusões decididos;
- [ ] ambiente, versões, Git/branch/target e lockfiles;
- [ ] tools/MCPs validados ou fallback;
- [ ] secrets/dados/custos identificados sem valores e com owner;
- [ ] arquitetura, fluxo de dados, contrato e threat model;
- [ ] plano incremental, testes, evidência e rollback;
- [ ] dependências humanas e autorizações no momento certo;
- [ ] mudanças locais reconhecidas.

## Estratégia de testes do Denúncias

| Nível | Prova | Não prova |
| --- | --- | --- |
| unitário frontend | signals, estado, validação, FormData, erros | BFF ou browser real |
| unitário backend | regras, protocolo, clientes/doubles | infraestrutura live |
| integração BFF/Supertest | rota/middleware/status e doubles | Redis/ClamAV/MPT reais salvo conexão explícita |
| integração secure upload | fluxo do endpoint com scanner controlado | ClamAV de produção |
| E2E Playwright atual | wizard e UX multi-browser com API interceptada | BFF, Redis, ClamAV ou API MPT |
| axe | parte das violações detectáveis | conformidade WCAG completa |
| live autorizado | integração real no ambiente nomeado | produção inteira ou resiliência |
| UI/manual | experiência observada | todos os usuários/tecnologias assistivas |

## Comandos candidatos

~~~powershell
npm --prefix cidadania-canal-denuncias run lint
npm --prefix cidadania-canal-denuncias test
npm --prefix cidadania-canal-denuncias run build
npm --prefix cidadania-canal-denuncias run e2e
npm --prefix cidadania-canal-denuncias audit --omit=dev

npm --prefix cidadania-canal-denuncias/server run lint
npm --prefix cidadania-canal-denuncias/server test
npm --prefix cidadania-canal-denuncias/server audit --omit=dev
~~~

Execute somente gates aplicáveis e registre versões. O E2E atual sobe Angular, não o BFF.

## Gate de segurança

- [ ] threat model atualizado quando muda dado, fluxo, upload, integração ou trust boundary;
- [ ] entrada validada no servidor;
- [ ] logs/evidências sem denúncia, PII, anexos, tokens e URL interna indevida;
- [ ] CORS, proxy, rate limit, Redis, Helmet e docs por ambiente;
- [ ] upload: limite, allowlist, conteúdo, scanner, temporário, cleanup, concorrência e falha;
- [ ] timeouts/egress/SSRF e respostas externas malformadas;
- [ ] dependências, lockfiles, advisories e licenças;
- [ ] comportamento development nunca promovido como prova production.

## Gate de QA/a11y

- [ ] happy path, negativo, retry e protocolo inválido;
- [ ] loading, prevenção de duplo envio e preservação de estado;
- [ ] teclado, foco visível/não oculto, labels, erros anunciados;
- [ ] contraste, zoom/reflow, target size e viewport móvel;
- [ ] browser matrix aprovada;
- [ ] axe mais teste manual e tecnologia assistiva definida;
- [ ] artifact visual inspecionado após content freeze.

## Definition of Done

- [ ] cobertura de requisitos completa ou exceções aprovadas;
- [ ] lint, teste, build e validações obrigatórias aprovados;
- [ ] estado offline/live/UI alegado corretamente;
- [ ] evidências sanitizadas, rastreáveis e retidas conforme política;
- [ ] contrato, env template, Swagger e docs sincronizados;
- [ ] nenhum achado crítico aberto;
- [ ] review adversarial e diff/untracked conferidos;
- [ ] risco residual, rollback/fallback e monitoramento;
- [ ] target/publicação confirmados quando no escopo;
- [ ] aceite humano registrado.

## Limitações

Cobertura estrutural de requisitos não garante interpretação correta; a contraprova continua necessária. Gates não substituem pentest, homologação, revisão legal/DPO, teste de carga ou tecnologia assistiva real.
