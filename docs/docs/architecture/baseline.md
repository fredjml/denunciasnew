# Baseline arquitetural e de qualidade

Data da coleta: 2026-07-21

## Escopo

Esta baseline registra o comportamento e a estrutura existentes antes da
refatoração. Ela não define funcionalidades novas e deve ser atualizada a cada
fase somente com resultados verificáveis.

## Topologia atual

- SPA Angular standalone com wizard controlado por signals.
- BFF Node.js/Express em `server/`.
- Submissão multipart para `POST /api/denuncias`.
- Integração externa e `MPT_API_TOKEN` restritos ao BFF.

## Ambiente reproduzível

- Node.js: 22.22.3, mínimo compatível com Angular 22 na linha Node 22.
- Gerenciador: npm, conforme `packageManager` do manifesto.
- Frontend e BFF possuem lockfiles independentes.

## Resultado inicial

| Verificação | Resultado |
| --- | --- |
| Testes frontend | 2 aprovados em 1 arquivo |
| Build de produção | aprovado |
| Bundle inicial | 597,76 kB |
| Budget de aviso | 500 kB |
| Testes BFF | inexistentes |
| Testes E2E | inexistentes |
| Lint automatizado | inexistente |
| Validação OpenAPI | inexistente |

## Riscos conhecidos

- Angular 22 e Angular CLI 21 estão desalinhados.
- `ComplaintService` combina estado, navegação, serialização e transporte HTTP.
- Falhas de submissão são convertidas em sucesso simulado.
- Há um `any` explícito e usos de `$any` em templates.
- O contrato é duplicado entre modelo TypeScript, validação Express e Swagger.
- O build excede o budget inicial em 97,77 kB.
- A auditoria inicial aponta 2 vulnerabilidades no frontend e 4 no BFF.

## Gates para cada fase

1. Instalação reproduzível com `npm ci` na raiz e em `server/`.
2. Build de produção aprovado.
3. Testes existentes e novos aprovados.
4. Nenhuma redução silenciosa de cobertura ou de validação.
5. Nenhum segredo, payload de denúncia ou anexo em logs e artefatos.
6. Um commit isolado e reversível por fase.
