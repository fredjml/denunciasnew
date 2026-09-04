# Scripts do kit

## preflight-denuncias.ps1

Executa inventário read-only e gera JSON na saída padrão.

~~~powershell
powershell -NoProfile -File docs/licoesaprendidas/scripts/preflight-denuncias.ps1
~~~

Opcionalmente informe -ProjectPath. O script não escreve arquivos, instala dependências, executa testes, mostra git status detalhado, lê valores de .env ou acessa serviços.

Exit code 0 indica somente que arquivos, versões e ferramentas locais essenciais foram encontrados; 2 indica bloqueio estrutural ou de runtime. A decisão GO/GO COM RISCOS/NO-GO continua humana e usa 07-preflight.md.

Limitações: não valida semver profundamente, autenticação, rede, serviços, MCP, segurança, requisitos nem produção. Revise o JSON antes de armazenar, pois paths locais aparecem no output.

## validate-kit.ps1

Valida arquivos obrigatórios, vazios, links Markdown locais e frontmatter básico da skill:

~~~powershell
powershell -NoProfile -File docs/licoesaprendidas/scripts/validate-kit.ps1
~~~

Não acessa links externos nem prova correção técnica, renderização ou comportamento da skill. Use também o validador oficial da skill quando disponível.
