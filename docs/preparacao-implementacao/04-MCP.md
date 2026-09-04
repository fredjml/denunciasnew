# Passo 1 — MCP

Template original: [`templates/mcp.md`](../licoesaprendidas/templates/mcp.md).
Regra do kit: configuração **não** prova saúde; saúde **não** autoriza mutação. OAuth, envio, criação, edição, exclusão e publicação são avaliados separadamente.

## Estados operacionais (obrigatórios por conector)

1. **descoberto** — necessidade identificada.
2. **configurado** — conector adicionado à ferramenta de IA.
3. **autenticado** — OAuth/token válido.
4. **health check** — chamada read-only mínima retornou.
5. **autorizado** para a ação específica (just-in-time).
6. **fallback** testado.

## Inventário candidato

| MCP/app | Fonte/finalidade | Configurado | Autenticado | Health read-only | Permissões/dados | Escrita/custo | Fallback | Owner | Última validação |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| GitHub MCP | PR, run, artifact, code review | **a decidir** | pendente | pendente | somente repo `MP-Trabalho/cidadania-canal-denuncias`; read-only por padrão | escrita PR requer autorização | `gh` CLI local | Dev | — |
| Browser/Playwright MCP | UI autorizada e diagnóstico UX | **a decidir** | n/a | pendente | somente URLs listadas | mutação DOM só em ambiente de teste | manual + Playwright local | QA | drift D-12 (fallback desabilitado) |
| Miro (oficial) | arquitetura, board colaborativo | **a decidir** | pendente | pendente | somente board `Denúncias` | criação/edição só autorizada | export local | Arquitetura | drift D-12 (sobreposição local/oficial) |
| Drive/Docs/Sheets | fontes corporativas | **a decidir** | pendente | pendente | somente pasta explícita | edição só autorizada | download manual | Produto/Compliance | — |
| Sistema de tickets (Jira/Redmine) | rastreamento de bug/decisão | **a decidir** | pendente | pendente | somente projeto ativo | mudança de estado autorizada | interface web | Produto/QA | — |

## MCPs **não** recomendados

- MCP direto para **Redis** do BFF — não há necessidade justificada; superfície de risco.
- MCP direto para **ClamAV** — cliente já é código do projeto.
- MCP direto para **API MPT** — token só no BFF; segurança institucional.
- MCP com escrita em produção — bloqueado por padrão.

## Necessários e bloqueios

- GitHub MCP é **útil**, não obrigatório: `gh` CLI + Copilot integrado atende maior parte dos casos.
- Nenhum MCP é pré-requisito para Passos 0–4.
- Antes de configurar qualquer MCP: aprovação de Segurança + Compliance sobre política de retenção do provedor.

## Allowlist de operações (proposta)

| Operação | Requer autorização just-in-time? | Nível |
| --- | --- | --- |
| listar PR / issue / run | não | read-only |
| ler arquivo do repo | não | read-only |
| baixar artifact | sim (se contiver evidência sensível) | leitura sensível |
| criar/editar comentário em PR | sim | mutação leve |
| abrir PR | sim | mutação estrutural |
| merge / release / deploy | sim (owner do ambiente) | mutação alta |
| navegação em URL externa | sim (URL específica) | rede |
| screenshot / gravação de UI | sim (redaction obrigatória) | mídia |

## Decisões / sobreposições

- **D-12 (kit)**: Miro local vs oficial e Playwright MCP com fallback desabilitado seguem como drift; decidir com owner antes de habilitar qualquer um em produção.
- Skill deste pacote ([`skills/denuncias-preparacao-implementacao/SKILL.md`](skills/denuncias-preparacao-implementacao/SKILL.md)) opera **sem** MCP externo; qualquer conector é opcional.

## Limitações

- Configurado ≠ autenticado; autenticado ≠ autorizado.
- Presença de MCP na ferramenta de IA **não** substitui verificação de escopo e política.
- Logs do MCP podem conter dados enviados; auditar retenção do provedor.
