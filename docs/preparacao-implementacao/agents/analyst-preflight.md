# Subagente — analyst-preflight

## Princípios

- Não inventar.
- Preservar mudanças locais.
- Fonte primária vence documento derivado.
- Menor escopo possível.
- Sem secrets, PII ou logs brutos.
- Validar antes de concluir.

## Subtarefa

- **Objetivo/pergunta**: executar o pre-flight `docs/licoesaprendidas/07-preflight.md` com os comandos listados em `02-PRE-FLIGHT.md` e atualizar os documentos com estado `EVIDÊNCIA CONFIRMADA` onde aplicável.
- **Fora de escopo**: instalar dependências; alterar código; ler valores de secrets; acessar API MPT / ClamAV / Redis reais; escrever fora dos arquivos listados abaixo.
- **Fontes obrigatórias**: `cidadania-canal-denuncias/AGENTS.md`, `frontend/AGENTS.md`, `package.json` (raiz e `server/`), lockfiles, workflows `.github/`, `docs/licoesaprendidas/07-preflight.md`, `docs/preparacao-implementacao/02-PRE-FLIGHT.md`.
- **Arquivos read-only**: todo o resto do repositório, incluindo `docs/Analises/`.
- **Arquivos exclusivos de escrita**:
  - `docs/preparacao-implementacao/01-ANALYSIS.md`
  - `docs/preparacao-implementacao/02-PRE-FLIGHT.md`
  - `docs/preparacao-implementacao/03-TOOLS.md`
  - `docs/preparacao-implementacao/04-MCP.md`
- **Tools/autorização**: shell local com Node/npm/Git/rg. Nenhuma chamada de rede além de `git remote -v`. Autorização vigente: leitura.
- **Ações proibidas**: `npm install`, `npm ci`, `npm audit` (rede), `npx playwright install`, `git commit`, `git push`, edição fora dos arquivos exclusivos.
- **Saída/evidência**: relatório em tabela conforme §Resultado do `02-PRE-FLIGHT.md`; decisão `GO / GO COM RISCOS / NO-GO` com justificativa em uma linha por área.
- **Critério de parada**: qualquer comando exigir autenticação/rede/permissão não concedida; qualquer arquivo esperado ausente; drift novo detectado (registrar em `00-MAPA-ORIGENS.md` como observação, **não** corrigir).
- **Integrador**: owner humano do ciclo.

## Comando canônico sugerido pelo integrador

```powershell
powershell -NoProfile -File docs/licoesaprendidas/scripts/preflight-denuncias.ps1
```

O subagente pode também executar comandos read-only individuais listados em `docs/preparacao-implementacao/02-PRE-FLIGHT.md`, um por vez, registrando saída sanitizada.

## Limitações

- Não decide autorizações.
- Não substitui review de segurança.
- Exit code zero **não** prova requisito ou integração live.
