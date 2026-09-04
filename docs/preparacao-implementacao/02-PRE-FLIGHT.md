# Passo 1 — PRE-FLIGHT

Template original: [`07-preflight.md`](../licoesaprendidas/07-preflight.md).
Este documento é o **roteiro** a ser executado por operador humano ou agente **autorizado**. Este pacote apenas o **prepara**; nenhum comando foi rodado nesta compilação.

## 1. Fonte e escopo

- [ ] fonte primária lida integralmente (raiz `AGENTS.md`, `frontend/AGENTS.md`, `planejamento.md`, `spec_design.md`, código, testes, Swagger)
- [ ] objetivo, entregáveis, dados, atores e ações proibidas confirmados com owner de Produto
- [ ] `docs/licoesaprendidas/README.md` e templates aplicáveis lidos
- [ ] hipótese inicial falsificável documentada
- [ ] requisitos e aceite (ver [06-REQUIREMENTS.md](06-REQUIREMENTS.md)) revisados

## 2. Git e targets

```powershell
git status --short
git branch --show-current
git remote -v
git -C cidadania-canal-denuncias status --short
git -C cidadania-canal-denuncias branch --show-current
git -C cidadania-canal-denuncias remote -v
```

- [ ] raiz e possível repositório aninhado diferenciados
- [ ] mudanças preexistentes reconhecidas
- [ ] branch/remote/destino confirmados (default `stg`)
- [ ] estratégia de checkpoint e rollback
- [ ] commit/push/deploy **fora** do pre-flight, salvo autorização específica

Owner de Git/branch: pendente.

## 3. Estrutura, runtime e dependências

```powershell
rg --files cidadania-canal-denuncias -g '!node_modules' -g '!dist'
node --version
npm --version
npm --prefix cidadania-canal-denuncias run
npm --prefix cidadania-canal-denuncias/server run
```

- [ ] Node atende ao `engines` (frontend `^24.15 || >=26`)
- [ ] Node atende ao `engines` do BFF em `cidadania-canal-denuncias/server/package.json`
- [ ] `npm` compatível
- [ ] dois `package.json` e lockfiles identificados
- [ ] CI (`.github/workflows`) usa runtime compatível — **drift D-07** aberto
- [ ] dependências no manifesto da camada correta (**drift D-10** aberto: `multer`/`opencode-ai` no frontend)
- [ ] cache/`node_modules` **não** é tratado como prova de instalação limpa

Owner de Runtime/CI: pendente.

## 4. Configuração e serviços

Verifique **apenas presença** de variáveis, nunca valores.
Template atual: `cidadania-canal-denuncias/server/env.template`. Documentação antiga menciona `.env.example` (**drift**).

| Dependência | Necessidade | Owner | Health check seguro | Fallback/estado |
| --- | --- | --- | --- | --- |
| API MPT | envio live | Integração MPT (pendente) | endpoint controlado / contrato oficial | mock não comprova live |
| ClamAV | anexos production | Infra (pendente) | EICAR **somente** em ambiente aprovado | bloquear production se ausente |
| Redis | rate limit compartilhado | Infra (pendente) | conexão/TLS/TTL | memória apenas fora de production |
| Browser | UI/E2E | QA (pendente) | `npx playwright --version` | manual autorizado |

## 5. Ferramentas

Preencha [03-TOOLS.md](03-TOOLS.md).

- [ ] Git — versão e configuração
- [ ] Node/npm — versão observada vs. requerida
- [ ] ripgrep — presente
- [ ] Editor + ESLint/TS — extensão ativa
- [ ] Playwright browsers instalados (`npx playwright install` **pode** exigir rede/proxy — autorizar)
- [ ] Redocly disponível se contrato for revisto (kit sinaliza: sem script no manifest — **drift D-09**)
- [ ] Prettier disponível (sem script — não é gate automaticamente)

## 6. MCP / IA

- [ ] conector **necessário**, não apenas conveniente
- [ ] configurado, autenticado, health check read-only
- [ ] menor permissão e dados enviados
- [ ] escrita/custo/mutação exigem autorização just-in-time
- [ ] fallback
- [ ] sobreposição Miro local/oficial avaliada (**drift D-12**)
- [ ] disponibilidade atual **não** usada como fato histórico

Ver [04-MCP.md](04-MCP.md) para inventário.

## 7. Autorizações e dependências humanas

| Ação | Owner | Momento | Risco/custo | Status |
| --- | --- | --- | --- | --- |
| Secret/configuração segura | Segurança | antes de live | segredo | pendente |
| Dados reais | DPO / data owner | antes de uso | privacidade | pendente |
| Rede/serviço externo | Infra | antes do health live | egress/custo | pendente |
| Teste de carga / DAST | Owner do ambiente | antes da execução | disponibilidade | pendente |
| Commit/push/deploy | Owner do repo/ambiente | entrega | mutação | pendente |
| Instalar skill/MCP local | Owner do ambiente do agente | antes do uso | superfície | pendente |

Antecipar owner **não concede** autorização ampla.

## 8. Testabilidade e evidência

- [ ] cada aceite tem modo de validação (ver [06-REQUIREMENTS.md](06-REQUIREMENTS.md))
- [ ] fixtures sintéticas e determinísticas planejadas
- [ ] teste focal, integração, E2E e manual separados
- [ ] evidence manifest ([10-EVIDENCE-MANIFEST.md](10-EVIDENCE-MANIFEST.md)) com redaction, retenção e owner
- [ ] live/UI/publicação **somente** se exigidos
- [ ] E2E atual reconhecido como UI com API mockada (Drift D-06)

## Resultado esperado (após execução real)

| Área | Status | Evidência | Pendência/owner |
| --- | --- | --- | --- |
| Fonte/requisitos | | | |
| Git/target | | | |
| Runtime/deps | | | |
| Ferramentas | | | |
| Config/serviços | | | |
| MCP/IA | | | |
| Autorizações | | | |
| Testes/evidência | | | |

Decisão obrigatória:

- `GO` — essenciais verificados;
- `GO COM RISCOS` — trabalho local prossegue com riscos/owners explícitos;
- `NO-GO` — implementação bloqueada.

## Script auxiliar

O kit oferece [`scripts/preflight-denuncias.ps1`](../licoesaprendidas/scripts/preflight-denuncias.ps1) para automatizar parte **read-only**:

```powershell
powershell -NoProfile -File docs/licoesaprendidas/scripts/preflight-denuncias.ps1
```

Ele **não** autentica, instala, lê secrets, testa produção nem toma a decisão final.

## Limitações

Pre-flight envelhece; associe cada execução a commit + data.
Exit code zero **não** prova requisito, segurança ou integração live.
Falha de ferramenta pode ser do sandbox/proxy, não do produto.
