# denunciasnew — MVP standalone

> Protótipo executável do novo formulário do **Canal de Denúncias MPT**, baseado em Legal Design, Visual Law, mobile-first e Progressive Disclosure.
>
> **Status:** MVP em construção. Frontend Angular 22 + backend mock Express. Contrato OpenAPI compartilhado com o backend real futuro.

## Visão rápida

| O quê | Onde |
| --- | --- |
| Frontend | `app/` — Angular 22 standalone + signals |
| Backend mock | `mock-api/` — Express + pino |
| Contrato compartilhado | `contract/openapi.yaml` |
| Governança | [`AGENTS.md`](AGENTS.md) |
| Planejamento | [`docs/`](docs/) (F1–F7) |
| Estratégia | [`docs/preparacao-implementacao/prompts/ESTRATEGIA-MVP-STANDALONE.md`](docs/preparacao-implementacao/prompts/ESTRATEGIA-MVP-STANDALONE.md) |

## Como rodar localmente

Pré-requisitos: Node.js ≥ 22.15, npm ≥ 11.

```powershell
# 1. Clonar
git clone https://github.com/fredjml/denunciasnew.git
cd denunciasnew

# 2. Instalar dependências (raiz + app + mock-api)
npm install
npm --prefix app install
npm --prefix mock-api install

# 3. Rodar frontend + backend mock em paralelo
npm run dev
```

- App abre em <http://localhost:4200>
- Mock API responde em <http://localhost:3001>
- `GET :3001/health` → `200 { "status": "ok" }`
- `POST :3001/api/denuncias` (multipart) → `201 { "protocolo": "SYN-XXXXXXXX", ... }`

## Scripts principais (raiz)

| Script | O que faz |
| --- | --- |
| `npm run dev` | Sobe frontend + mock em paralelo |
| `npm run build` | Build de produção do frontend |
| `npm test` | Vitest unit em `app/` e `mock-api/` |
| `npm run e2e` | Playwright multi-browser em `app/e2e/` |
| `npm run lint` | ESLint em ambos |

## Estrutura de diretórios

```
denunciasnew/
├── AGENTS.md               governança local (leitura obrigatória para IA)
├── README.md               este arquivo
├── package.json            meta-scripts orquestrando app + mock-api
├── .gitignore
├── .editorconfig
├── contract/               contrato OpenAPI 3.1 (fonte de verdade)
│   ├── openapi.yaml
│   └── README.md
├── app/                    frontend Angular 22
│   ├── src/
│   │   ├── app/            wizard de 8 telas + serviços
│   │   ├── assets/         fixtures sintéticas + tokens
│   │   └── styles/         tokens.css
│   ├── e2e/
│   └── package.json
├── mock-api/               backend mock Express
│   ├── src/
│   ├── test/
│   └── package.json
├── .github/workflows/      CI/CD (lint, unit, e2e, a11y, Lighthouse, contract-drift)
└── docs/                   planejamento F1–F7 (preservado, não alterar)
```

## Contrato OpenAPI (imutável sem PR)

Toda comunicação frontend ↔ backend passa por `contract/openapi.yaml`. Ele é o **único** artefato que o backend real futuro precisa respeitar para se acoplar.

**Regra R-DN-06:** mudanças no contrato exigem PR + review. O arquivo `app/src/app/api/generated.ts` é auto-gerado por `openapi-typescript` e **não** deve ser editado manualmente.

## Deploy

- **Preview automático por PR** em Vercel (configuração em `vercel.json` — a ativar quando o owner conectar a conta Vercel).
- **Produção** dispara em push para `main` (após MVP público liberado).

## Governança e regras

Antes de qualquer alteração, leia:

1. [`AGENTS.md`](AGENTS.md) — persona, regras, comandos permitidos/proibidos.
2. [`docs/preparacao-implementacao/prompts/ESTRATEGIA-MVP-STANDALONE.md`](docs/preparacao-implementacao/prompts/ESTRATEGIA-MVP-STANDALONE.md) — estratégia executiva.
3. [`docs/preparacao-implementacao/11-IMPLEMENTATION-PLAN.delta-denunciasnew.md`](docs/preparacao-implementacao/11-IMPLEMENTATION-PLAN.delta-denunciasnew.md) — 47 fatias verticais.

## Licença

A definir com o owner.

## Contato

Owner do ciclo: a nomear.
Frontend / Backend mock / Segurança / A11y: a nomear.
