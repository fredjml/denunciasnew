# Fontes, precedência e atualização

Consulta: 26/08/2026. Revalidar após upgrades, mudança de política ou incidente relevante.

## Precedência

1. pedido atual e decisões formalmente aprovadas;
2. fonte primária do produto e critérios de aceite;
3. AGENTS.md e políticas institucionais;
4. código, testes, manifests e configuração do commit analisado;
5. documentação oficial ou normativa aplicável;
6. documentos derivados, relatórios históricos e referências de terceiros.

Conflitos ficam explícitos. Uma fonte derivada nunca pode silenciosamente remover requisito da fonte primária.

## Fontes externas

- [Angular — Version compatibility](https://angular.dev/reference/versions): Angular 22, Node, TypeScript, RxJS e Baseline de browsers.
- [Angular — Security](https://angular.dev/best-practices/security): sanitização, AOT, CSP, Trusted Types e APIs de risco.
- [Angular — Accessibility](https://angular.dev/best-practices/a11y): atributos acessíveis, foco e recursos do CDK.
- [Angular — Testing](https://angular.dev/guide/testing): estratégia e cobertura de testes.
- [Playwright — Best Practices](https://playwright.dev/docs/best-practices): isolamento, locators e testes orientados ao usuário.
- [Playwright — Accessibility testing](https://playwright.dev/docs/accessibility-testing): axe e limites da automação.
- [Vitest — Guide](https://vitest.dev/guide/): execução, mocking e cobertura.
- [Node.js — Permission Model](https://nodejs.org/api/permissions.html): defesa adicional e limites do modelo.
- [Express — Security best practices](https://expressjs.com/en/advanced/best-practice-security.html): TLS, Helmet, entrada, cookies e dependências.
- [npm — npm audit](https://docs.npmjs.com/cli/commands/npm-audit): alcance e uso da auditoria.
- [OpenAPI Specification](https://spec.openapis.org/oas/latest.html): contrato de API.
- [OWASP ASVS 5.0](https://owasp.org/www-project-application-security-verification-standard/): requisitos verificáveis de segurança.
- [OWASP SAMM](https://owasp.org/www-project-samm/): maturidade de desenvolvimento seguro.
- [OWASP File Upload Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html): controles em uploads.
- [OWASP REST Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html): controles para APIs REST.
- [OWASP Threat Modeling Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html): modelagem contínua.
- [W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/): critérios normativos de acessibilidade.
- [LGPD — Lei 13.709/2018](https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm): referência legal; interpretação cabe às áreas jurídica e de privacidade.
- [Model Context Protocol](https://modelcontextprotocol.io/docs/getting-started/intro): arquitetura de conectores.
- [Agent Skills specification](https://github.com/agentskills/agentskills): referência de portabilidade; o formato efetivo da skill segue também a skill-creator instalada.

## Fontes locais do projeto

- `cidadania-canal-denuncias/AGENTS.md`
- `cidadania-canal-denuncias/planejamento.md`
- `cidadania-canal-denuncias/spec_design.md`
- `cidadania-canal-denuncias/angular.json`, `eslint.config.js`, `playwright.config.ts`, `proxy.conf.json`
- `cidadania-canal-denuncias/package.json` e `cidadania-canal-denuncias/server/package.json` (com lockfiles)
- `cidadania-canal-denuncias/server/env.template` e `swagger.config.js`
- Testes: `src/**/*.spec.ts`, `e2e/*.spec.ts`, `server/**/*.spec.mjs`

## Fontes internas de processo

- [`docs/licoesaprendidasN1B/`](../licoesaprendidasN1B/README.md) — processo operacional, gates, DoR/DoD, matrizes reutilizáveis, Five Whys, contexto/tokens, protocolo de escalonamento, framework operacional Codex, templates de `AGENTS.md`, skills, rules, MD e MCP.
- [`docs/licoesaprendidasN3B/`](../licoesaprendidasN3B/README.md) — post‑mortem forense do desafio Calmaria; framework operacional com gates 0–7; checklist do próximo projeto; plano de redução de tokens; ferramentas e telemetria; guia de reutilização.

Regra: relatórios em `Analises/` e post‑mortems anteriores são histórico, não estado atual. Reexecute a verificação antes de qualquer afirmação — resultados devem indicar `EVIDÊNCIA CONFIRMADA`, `EVIDÊNCIA PARCIAL`, `INFERÊNCIA FORTE`, `HIPÓTESE` ou `NÃO FOI POSSÍVEL DETERMINAR` (N3B).

Skills.sh, Claude Skills e TLC spec-driven são inspiração registrada em N1B/N3B, não autoridade do Codex. Antes de instalar skill externa, audite origem, licença, instruções, scripts, dependências, permissões e telemetria.

## Limitações

- A consulta não congela o conteúdo futuro dos links.
- Recomendação oficial não comprova implementação local.
- N1B/N3B fornecem método, não fatos, métricas, estados ou autorizações do Denúncias.
