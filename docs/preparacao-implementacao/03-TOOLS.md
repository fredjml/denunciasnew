# Passo 1 — TOOLS

Template original: [`templates/tools.md`](../licoesaprendidas/templates/tools.md).
Regra do kit: **instalar somente o que o requisito e o plano de testes exigem**. Disponível ≠ autenticado; instalado ≠ autorizado.

## Inventário P0 (obrigatório)

| Ferramenta | Finalidade | Owner | Requerida | Versão requerida/observada | Health check | Licença/telemetria/dados | Permissão | Status | Fallback |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Git | estado, diff, histórico, rollback | Dev/owner do repo | sim | corporativo | `git --version` / `status` / `branch` | corporativa | local | validada (assumir) | — |
| Node | runtime Angular + BFF | Infra/Dev | sim | `^24.15 || >=26` (manifest); CI observado `22.22.3` (drift D-07) | `node --version` | MIT | local | **a verificar** | — |
| npm | manager de pacotes | Infra/Dev | sim | compatível com Volta `11.19` (raiz) / `11.11.0` (CI relatado) | `npm --version` | Artistic-2.0 | local | **a verificar** | — |
| ripgrep (`rg`) | inventário e busca | Dev | sim | ≥ 13 | `rg --version` | MIT | local | **a verificar** | `git grep` |
| Editor + ESLint + TS | análise estática local | Dev | sim | ESLint 10, TS 6.0.2 | `npm run lint` | MIT | local | validada por camada | — |
| Playwright + browsers | UI/E2E multi-browser | QA | sim | 1.61 (kit) | `npx playwright --version` | Apache-2.0 | local + rede (install) | **a verificar** | manual autorizado |
| Vitest | unit backend/frontend | Dev/QA | sim | 4.x | `npm test` | MIT | local | **a verificar** | — |
| axe-core (Playwright) | a11y automatizado | QA/A11Y | sim | 4.12 (kit) | via spec | MPL-2.0 | local | **a verificar** | Lighthouse manual |
| Swagger JSDoc + Redocly CLI | contrato OpenAPI | Dev/QA | condicional | conforme manifest | `redocly --version` | MIT | local | **a verificar** | inspeção manual |
| `npm audit` | advisories npm | Dev/Sec | sim | integrada ao npm | `npm audit --omit=dev` | MIT | local + rede | **a verificar** | Snyk/OSV opcional |

## Inventário P1/P2 (adotar após decisão)

| Categoria | Ferramenta candidata | Gate/limite | Owner |
| --- | --- | --- | --- |
| SAST | CodeQL ou Semgrep | ruleset, licença, baseline e triagem antes de bloquear CI | Segurança |
| Segredos | Gitleaks | achado exige validação e rotação; limpar histórico é destrutivo | Segurança |
| DAST | OWASP ZAP | somente alvo autorizado, ambiente isolado, dados sintéticos | Segurança + Infra |
| Carga | k6 | limite, janela, observação e autorização do owner do ambiente | Infra + QA |
| Performance | Lighthouse | sinal de laboratório, não SLO real | QA |
| Supply chain | Dependabot/Renovate, CycloneDX | PRs pequenos, owner e política | Dev + Segurança |
| Container/infra | Docker + scanner de imagem/IaC | somente se deployment usar esses artefatos | Infra |
| Observabilidade | métricas/logs/traces aprovados | proibir conteúdo da denúncia; definir retenção | Infra + DPO |

## Ferramentas de IA (Copilot / Codex / Claude)

Pré-requisitos antes de uso:

- Fornecedor e plano aprovados por Segurança/Compliance.
- Política de retenção e uso para treinamento conhecida.
- Repositório e dados classificados.
- **Nenhuma** PII, denúncia, anexo, segredo ou log bruto enviado.
- Escopo de arquivos, comandos e ações externas explícito.
- Saída revisada e validada por ferramenta determinística (ESLint, testes, revisão humana).

Instalação reproduzível (não executada nesta compilação):

```powershell
npm --prefix cidadania-canal-denuncias ci
npm --prefix cidadania-canal-denuncias/server ci
npx --prefix cidadania-canal-denuncias playwright install
```

## Scripts do projeto (observados/inferidos)

| Script | Manifest | Efeito | Pré-condição | Resultado atual |
| --- | --- | --- | --- | --- |
| `npm run lint` | `cidadania-canal-denuncias/package.json` | ESLint frontend | `npm ci` | 0/0 na janela histórica |
| `npm test` | idem | Vitest frontend | `npm ci` | 8/8 na janela histórica |
| `npm run build` | idem | build Angular | `npm ci` | bundle 384,38 kB (janela) |
| `npm run e2e` | idem | Playwright multi-browser | `npm ci` + browsers | 16/16 (janela) — **API mockada** |
| `npm audit --omit=dev` | idem | advisories produção | rede | 0 na janela |
| `npm run lint` (server) | `cidadania-canal-denuncias/server/package.json` | ESLint backend | `npm ci` | 0/0 na janela |
| `npm test` (server) | idem | Vitest + Supertest | `npm ci` | 30/30 (janela) — usa `passWithNoTests` (**drift D-09**) |
| `npm audit --omit=dev` (server) | idem | advisories produção | rede | 0 na janela |
| `npm start` / `npm run server` | ambos | inicia app | Node compatível | — |
| Redocly / Prettier | ambos | **sem script observado** (drift D-09) | — | manual |

## Instalações / mudanças propostas

**Nenhuma** linha desta seção autoriza instalação. Toda proposta exige aprovação e rollback.

| Proposta | Motivo | Aprovador | Rollback |
| --- | --- | --- | --- |
| Adicionar CodeQL/Semgrep | fechar gate SAST (SEC-05 relacionados) | Segurança + Infra | remover workflow |
| Adicionar Gitleaks | fechar gate de segredos | Segurança | remover workflow |
| Adicionar script `redocly lint` | fechar drift D-09 | Dev + QA | remover script |
| Adicionar CI job E2E + `test` backend | fechar REG-01/REG-06 | Dev + Infra | reverter workflow |
| Trocar CI para Node ≥ 24.15 | fechar drift D-07 | Infra + Dev | reverter versão |

## Limitações

- `npm audit` não encontra lógica insegura, config cloud ou zero-day.
- SAST/DAST/secret scanning produzem falso positivo e negativo.
- Node Permission Model é cinto de segurança para código confiável, não sandbox contra código malicioso.
- Instalação global ou download exige autorização explícita.
