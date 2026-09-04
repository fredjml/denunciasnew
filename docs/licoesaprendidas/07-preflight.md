# Project Pre-Flight Check

Executar antes de editar. Ações são read-only, salvo instalação ou correção explicitamente autorizada.

## 1. Fonte e escopo

- [ ] fonte primária lida integralmente;
- [ ] objetivo, entregáveis, dados, atores e ações proibidas;
- [ ] AGENTS.md/rules/skills aplicáveis lidos;
- [ ] hipótese inicial falsificável;
- [ ] requisitos e aceite identificados.

## 2. Git e targets

~~~powershell
git status --short
git branch --show-current
git remote -v
git -C cidadania-canal-denuncias status --short
git -C cidadania-canal-denuncias branch --show-current
git -C cidadania-canal-denuncias remote -v
~~~

- [ ] raiz e possível repositório aninhado diferenciados;
- [ ] mudanças preexistentes reconhecidas;
- [ ] branch/remote/destino confirmados;
- [ ] estratégia de checkpoint e rollback;
- [ ] commit/push/deploy fora do pre-flight, salvo autorização específica.

## 3. Estrutura, runtime e dependências

~~~powershell
rg --files cidadania-canal-denuncias -g '!node_modules' -g '!dist'
node --version
npm --version
npm --prefix cidadania-canal-denuncias run
npm --prefix cidadania-canal-denuncias/server run
~~~

- [ ] versões atendem ao manifesto e à compatibilidade Angular;
- [ ] dois package.json e lockfiles identificados;
- [ ] CI usa runtime compatível;
- [ ] dependências no manifesto da camada correta;
- [ ] cache/node_modules não é tratado como prova de instalação limpa.

## 4. Configuração e serviços

Verifique apenas presença de variáveis, nunca valores. O template atual é server/env.template; há documentação antiga que menciona .env.example.

| Dependência | Necessidade | Owner | Health check seguro | Fallback/estado |
| --- | --- | --- | --- | --- |
| API MPT | envio live | integração MPT | endpoint controlado/contrato | mock não comprova live |
| ClamAV | anexos production | infraestrutura | EICAR somente em ambiente aprovado | bloquear production |
| Redis | rate limit compartilhado | infraestrutura | conexão/TLS/TTL | memória só fora de production |
| Browser | UI/E2E | QA | Playwright/version | manual autorizado |

## 5. Ferramentas

Preencha templates/tools.md. Confirme Git, Node/npm, rg, ESLint, Vitest, Playwright browsers e ferramentas específicas. Redocly/Prettier instalados sem script não são automaticamente gates.

## 6. MCP/IA

- [ ] conector necessário, não apenas conveniente;
- [ ] configurado, autenticado, health check read-only;
- [ ] menor permissão e dados enviados;
- [ ] escrita/custo/mutação exigem autorização just-in-time;
- [ ] fallback;
- [ ] sobreposição Miro local/oficial avaliada;
- [ ] disponibilidade atual não usada como fato histórico.

## 7. Autorizações e dependências humanas

| Ação | Owner | Momento | Risco/custo | Status |
| --- | --- | --- | --- | --- |
| secret/configuração segura |  | antes de live | segredo | pendente |
| dados reais | DPO/data owner | antes de uso | privacidade | pendente |
| rede/serviço externo |  | antes do health live | egress/custo | pendente |
| teste de carga/DAST | owner do ambiente | antes da execução | disponibilidade | pendente |
| commit/push/deploy | owner do repo/ambiente | entrega | mutação | pendente |

Antecipar owner não concede autorização ampla.

## 8. Testabilidade e evidência

- [ ] cada aceite tem modo de validação;
- [ ] fixtures sintéticas e determinísticas;
- [ ] teste focal, integração, E2E e manual separados;
- [ ] evidence manifest, redaction, retenção e owner;
- [ ] live/UI/publicação somente se exigidos;
- [ ] E2E atual reconhecido como UI com API mockada.

## Resultado

| Área | Status | Evidência | Pendência/owner |
| --- | --- | --- | --- |
| Fonte/requisitos |  |  |  |
| Git/target |  |  |  |
| Runtime/deps |  |  |  |
| Ferramentas |  |  |  |
| Config/serviços |  |  |  |
| MCP/IA |  |  |  |
| Autorizações |  |  |  |
| Testes/evidência |  |  |  |

Decisão:

- GO — essenciais verificados;
- GO COM RISCOS — trabalho local pode prosseguir, com riscos/owners explícitos;
- NO-GO — implementação bloqueada.

## Script

scripts/preflight-denuncias.ps1 automatiza apenas parte read-only: estrutura, manifests, ferramentas, versões, scripts e presença de arquivos. Ele não autentica, instala, lê valores secretos, testa produção nem toma a decisão final.

## Limitações

Pre-flight envelhece; associe a commit/data. Exit code zero não prova requisito, segurança ou integração live. Falha de ferramenta pode ser do sandbox/proxy, não do produto.
