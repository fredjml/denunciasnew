# Changelog de Segurança

Todas as remediações de vulnerabilidades relevantes deste projeto são registradas aqui.
O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/).

## [Não lançado]

### Corrigido

- **@babel/core** 7.29.7 → 7.29.7 (override `^7.29.7`, satisfaz range corrigido `>=7.29.6`) via `overrides` — GHSA-4x5r-pxfx-6jf8 / CVE-2026-49356. Fecha alerta Dependabot #88. Dev-only.
- **esbuild** 0.28.1 → 0.28.1 (override `^0.28.1`, última disponível em `0.28.x`) via `overrides` — GHSA-g7r4-m6w7-qqqr. Fecha alerta Dependabot #55. Dev-only, Windows-only. Ver TODO em `triage-alertas-88-55.md` sobre disponibilidade de `0.28.2+`.

### Segurança

- Ciclo dos 69 alertas do Dependabot encerrado com este PR.
- Adicionado workflow `.github/workflows/npm-audit.yml` com gate bloqueante `--audit-level=high` para raiz e `/server`.
- Documentado guardrail de desenvolvimento para uso de `start:proxy` em Windows em `docs/security/README.md`.

---

## Histórico anterior

### [Onda 1-2 — Dependabot PRs mergeados]

Resolvidos 67 dos 69 alertas originais via merge dos PRs do Dependabot:

- `brace-expansion`, `form-data`, `tar`, `js-yaml`, `@sigstore/*`, `sigstore`, `hono` — transitivos de devDependencies (Bloco A).
- `axios`, `multer` (raiz e `/server`), `qs`, `express` — runtime backend (Bloco B).
- `@angular` grouped bump, `uuid` — frontend e utilitários (Bloco C).
