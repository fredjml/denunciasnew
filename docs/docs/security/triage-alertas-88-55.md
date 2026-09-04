# Laudo de Triagem de Segurança — Alertas Dependabot #88 e #55

**Data:** 2026-07-03
**Autor:** Agente 1 — Triage
**Alertas endereçados:** Dependabot #88 (@babel/core) e #55 (esbuild)

---

## Seção 1 — Alerta #88: @babel/core

**Identificador:** GHSA-4x5r-pxfx-6jf8 / CVE-2026-49356
**CVSS:** 3.6 (Low)
**Pacote:** `@babel/core` (transitivo de `@angular/compiler-cli@22.0.5` e `@angular/build@22.0.5`)
**Versão instalada:** 7.29.7 / 7.29.0
**Versão-alvo:** `^7.29.7` (maior disponível dentro do range `>=7.29.6 <8.0.0`)

### Vetor de ataque

Leitura arbitrária de arquivo local durante o processo de build via comment `//# sourceMappingURL=...` em código-fonte processado pelo Babel. Um arquivo malicioso contendo esse comment poderia instruir o compilador a ler arquivos do sistema de arquivos do servidor de build.

### Exposição neste repositório

**Muito baixa.** O pipeline de build do Angular processa exclusivamente código do próprio time de desenvolvimento. Não há input externo (ex.: código fornecido por usuário final) processado durante o build. Para explorar a vulnerabilidade, um atacante precisaria comprometer o repositório ou o ambiente de CI — o que já constitui comprometimento do sistema. Não há exposição de dados de denunciantes.

### Impacto LGPD

**Não aplicável.** A vulnerabilidade é exclusiva ao ambiente de build/desenvolvimento. Não toca dados de denunciantes, não afeta o runtime de produção e não envolve processamento de dados pessoais.

### Decisão

**CORRIGIR via `npm overrides`** para `^7.29.7` (versão patched disponível dentro de `7.29.x`, conforme range corrigido `>=7.29.6` definido no advisory). A subida para `8.x` foi descartada por risco de breaking change.

> **Nota:** A versão `7.29.8` não estava disponível no npm no momento deste triage (2026-07-03). A versão `7.29.7` satisfaz o range corrigido do advisory (`>=7.29.6`). Monitorar publicação de `7.29.8+` em ciclos futuros.

---

## Seção 2 — Alerta #55: esbuild

**Identificador:** GHSA-g7r4-m6w7-qqqr
**CVSS:** 2.5 (Low)
**Pacote:** `esbuild` (transitivo de `@angular/build@22.0.5`)
**Versão instalada:** 0.28.1
**Versão-alvo:** `^0.28.1` (última disponível em `0.28.x` no momento do triage)

### Vetor de ataque

Path traversal no dev server do esbuild (`ng serve`) em **Windows**. O esbuild usa `path.Clean()` que não normaliza corretamente barras invertidas (`\`) em Windows, permitindo que um atacante com acesso à rede local acesse arquivos fora do diretório de projeto via requisições com `..\..\` no path.

### Exposição neste repositório

**Baixa, mas relevante.** O script `start:proxy` no `package.json` executa `ng serve --host 0.0.0.0`, expondo o dev server em todos os adaptadores de rede. Em máquinas Windows de desenvolvedores, isso amplia a superfície: qualquer dispositivo na mesma rede local poderia tentar explorar o path traversal. Em ambientes Linux/macOS (onde a maioria do CI roda), a vulnerabilidade não é aplicável pois `path.Clean()` normaliza barras corretamente. Não há exposição em produção (dev-only).

### Impacto LGPD

**Não aplicável.** A vulnerabilidade afeta apenas o servidor de desenvolvimento. Não há processamento de dados de denunciantes durante `ng serve`, e o ambiente de produção não utiliza o dev server do esbuild.

### Decisão

**CORRIGIR via `npm overrides`** com `^0.28.1`, que é a versão mais recente disponível no minor `0.28.x` no momento deste triage.

> **TODO — Monitorar versão corrigida do esbuild:**
>
> Em 2026-07-03, a última versão publicada em `0.28.x` é `0.28.1` — a mesma versão reportada como vulnerável pelo Dependabot. A versão `0.28.2` ou superior **não estava disponível** no npm no momento deste triage.
>
> **Ações de acompanhamento:**
> 1. Monitorar o npm para publicação de `esbuild@0.28.2+`: `npm view esbuild versions --json | grep "0.28"`.
> 2. Ao disponibilizar-se `0.28.2+`, atualizar o override para `^0.28.2` e regenerar o lockfile.
> 3. Caso `0.28.2+` não seja publicado e o alerta permaneça ativo, avaliar **dismiss formal** com as seguintes justificativas:
>    - Vulnerabilidade **dev-only** (não afeta build de produção nem runtime).
>    - Vulnerabilidade **Windows-only** (path traversal com barras invertidas `\`).
>    - Exposição limitada à rede local do desenvolvedor.
>    - Mitigação alternativa documentada: uso de `npm start` em vez de `start:proxy` em ambientes não confiáveis.
>
> **Não subir para `esbuild@0.29.x` ou superior** — quebraria compatibilidade com `@angular/build@22.0.5`.

---

## Seção 3 — Estratégia técnica: por que `overrides`

Ambos os pacotes (`@babel/core` e `esbuild`) são **transitivos** — não são declarados diretamente no `package.json` da raiz, mas puxados como dependências internas de `@angular/compiler-cli@22.0.5` e `@angular/build@22.0.5`.

O Angular 22 **pina as versões exatas** de suas dependências internas, impedindo que um simples `npm update` ou `npm audit fix` resolva os alertas. O Dependabot, por isso, não consegue abrir PRs automáticos para esses transitivos pinados.

A estratégia técnica correta é usar o campo `"overrides"` do npm (v8.3+), que força uma versão específica de um pacote transitivo independentemente do que o pacote-pai declara. Isso permite:

1. Aplicar a versão corrigida sem alterar `@angular/build` ou `@angular/compiler-cli`.
2. Manter compatibilidade com Angular 22 (não subindo esbuild para `0.29.x` nem @babel/core para `8.x`).
3. Registrar formalmente a decisão de segurança no código-fonte versionado.

---

## Seção 4 — Plano de rollback

Antes do merge deste PR, criar tag de pré-merge no repositório:

```bash
git tag pre-final-security-$(date +%Y%m%d)
git push origin pre-final-security-$(date +%Y%m%d)
```

Em caso de regressão pós-merge:

1. Reverter o commit do `package.json` (remover o bloco `overrides`).
2. Executar `npm install --legacy-peer-deps` para restaurar o lockfile anterior.
3. Verificar `npm ls @babel/core` e `npm ls esbuild` para confirmar retorno às versões originais.
4. Abrir issue rastreando o problema de compatibilidade identificado.

---

## Seção 5 — TODO: esbuild 0.28.2+

Conforme descrito na **Seção 2** deste laudo, a versão `esbuild@0.28.2+` não estava disponível em 2026-07-03. Caso essa versão não seja publicada pelo mantenedor do esbuild:

**Justificativa para dismiss formal do alerta Dependabot #55:**

- **Dev-only:** o esbuild é usado exclusivamente pelo `@angular/build` durante `ng serve` e `ng build`. Não compõe o bundle de produção.
- **Windows-only:** o path traversal explora o comportamento específico de `path.Clean()` em Windows com barras invertidas. Em Linux/macOS (onde o CI roda e onde a maioria dos desenvolvadores deste projeto trabalha), a vulnerabilidade não é reproduzível.
- **Rede local:** a exploração requer acesso à rede local do desenvolvedor durante `ng serve`. Não é explorável remotamente nem em produção.
- **Mitigação alternativa disponível:** uso de `npm start` (escuta apenas em `localhost`) em vez de `npm run start:proxy` quando não é necessário acesso externo.

Esta justificativa pode ser submetida ao Dependabot via "Dismiss alert" com motivo "Vulnerable code is not actually executed" ou "This vulnerability applies to a different environment".
