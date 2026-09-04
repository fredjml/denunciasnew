# Segurança — Canal de Denúncias

Este diretório contém a documentação de segurança do projeto `cidadania-canal-denuncias`.

## Arquivos

| Arquivo | Descrição |
|---|---|
| `triage-alertas-88-55.md` | Laudo formal dos alertas Dependabot #88 (@babel/core) e #55 (esbuild) |
| `CHANGELOG-security.md` | Histórico de remediações de vulnerabilidades (formato Keep a Changelog) |

## Política resumida

- Vulnerabilidades **Critical/High** em runtime devem ser corrigidas em até **7 dias**.
- Vulnerabilidades **Medium** em até **30 dias**.
- Vulnerabilidades **Low** em até **90 dias** ou no próximo release.
- Todas as remediações são registradas em `CHANGELOG-security.md`.
- PRs de segurança devem passar no gate `npm audit --audit-level=high` configurado em `.github/workflows/npm-audit.yml`.

---

## Guardrails de desenvolvimento

### Windows + `npm run start:proxy`

O script `npm run start:proxy` inicia o dev server do Angular com `--host 0.0.0.0`,
tornando-o acessível a outros dispositivos na rede local. Em máquinas **Windows**,
o esbuild anterior a 0.28.2 sofria de path traversal no dev server
([GHSA-g7r4-m6w7-qqqr](https://github.com/advisories/GHSA-g7r4-m6w7-qqqr)).

Recomendações:

1. Mantenha `esbuild` atualizado (garantido pelo `overrides` no `package.json`).
2. **Só use `start:proxy` em redes confiáveis.** Para desenvolvimento local sem
   necessidade de acesso externo, prefira `npm start`, que escuta apenas em `localhost`.
3. Se precisar expor o dev server em rede pública, use túnel autenticado (ex.: cloudflared,
   ngrok com auth) em vez de `--host 0.0.0.0`.
