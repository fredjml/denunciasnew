# Análise inicial do codebase

Objetivo: construir uma baseline verificável antes de propor ou implementar correções. Esta análise é read-only por padrão e termina em GO, GO COM RISCOS ou NO-GO.

## Disciplina de evidência

Classifique cada conclusão:

- EVIDÊNCIA CONFIRMADA — sustentada diretamente por arquivo, linha, commit, comando ou resultado;
- EVIDÊNCIA PARCIAL — prova apenas parte relevante;
- INFERÊNCIA FORTE — explicação mais provável após cruzamento de fontes;
- HIPÓTESE — explicação falsificável ainda sem prova suficiente;
- NÃO FOI POSSÍVEL DETERMINAR — fonte necessária ausente.

Nunca transforme documento histórico em resultado atual nem use uma fonte derivada para eliminar requisito primário.

## Ordem de análise

1. Fonte primária, objetivo, atores, dados, entregáveis, restrições e ações proibidas.
2. Governança: AGENTS.md aplicável, regras, skills, Git, branch, remote, mudanças locais e arquivos ignorados.
3. Produto: planejamento, design, jornada, mensagens, acessibilidade e critérios de aceite.
4. Stack: manifests, lockfiles, engines, Angular config, proxy, lint, testes e Playwright.
5. Frontend: bootstrap, components, signals, modelo, estados, validação, cliente HTTP e FormData.
6. Backend: perímetro Express, rota, upload, controller, service, Redis, ClamAV e cliente MPT.
7. Contrato: campos, serialização, validação, status HTTP, protocolo, Swagger e erros.
8. Operação: env, health, logs, privacidade, observabilidade, temporários, retenção, deploy e dependências externas.
9. Evidência: testes existentes, cobertura de requisitos, estados offline/live/UI e lacunas.

## Inventário read-only

~~~powershell
git status --short
git -C cidadania-canal-denuncias status --short
rg --files cidadania-canal-denuncias -g '!node_modules' -g '!dist'
rg -n 'TODO|FIXME|HACK|bypassSecurityTrust|innerHTML|console\.|process\.env' cidadania-canal-denuncias
npm --prefix cidadania-canal-denuncias run
npm --prefix cidadania-canal-denuncias/server run
~~~

Não busque ou imprima valores de .env. Para dependências, use npm ls --depth=0 somente depois de confirmar que a instalação existente é confiável.

## Perguntas obrigatórias do Denúncias

- Quem é a fonte de verdade do aceite da denúncia?
- O protocolo é gerado pelo BFF ou retornado pela API MPT?
- Quais comportamentos diferem entre development, test e production?
- Um 201 local comprova aceite live da API MPT? Atualmente, não necessariamente em development.
- Anexos não escaneados podem ser aceitos? Atualmente, há fail-open em development e fail-closed em production.
- Limites e tipos coincidem entre UI, Multer, ClamAV, API MPT e infraestrutura?
- Quais campos são PII ou dados sensíveis, onde transitam, onde são registrados e por quanto tempo existem?
- CORS, trust proxy e rate limit representam a topologia real?
- O fluxo funciona com teclado, leitor de tela, zoom, reflow e viewport móvel?
- Qual teste prova cada caminho de erro e retry sem usar dados reais?

## Baseline e drift já detectado

Validar novamente no commit analisado:

| Fonte | Afirmação em conflito | Código/manifests observados em 26/08/2026 | Tratamento |
| --- | --- | --- | --- |
| AGENTS.md | Multer em memória | upload.js usa diskStorage em diretório temporário | corrigir governança em tarefa própria; até lá, código prevalece como comportamento |
| AGENTS.md | sucesso simulado no frontend | ComplaintService hoje expõe falha | tratar como histórico |
| planejamento.md | Angular 21.2 e HttpClient obrigatório | manifests usam Angular 22; cliente usa fetch | abrir decisão, não corrigir silenciosamente |
| arquitetura/documentos | API MPT fornece protocolo | BFF gera protocolo antes do envio; cliente ignora corpo | requisito/arquitetura precisam de decisão formal |
| regra genérica | toda falha é fail-closed | development aceita API MPT/ClamAV indisponíveis | separar ambiente e proibir uso como evidência live |
| baseline de 21/07 | Node/testes/lint antigos | manifests e suítes evoluíram | manter como histórico datado |

## Saídas obrigatórias

- template ANALYSIS preenchido;
- requisitos e matriz de rastreabilidade;
- baseline com commit, versões, comandos e resultados;
- conflitos de fonte e decisões pendentes;
- threat model e evidence plan proporcionais ao risco;
- ferramentas, autorizações, owners e fallbacks;
- decisão GO, GO COM RISCOS ou NO-GO com evidência.

## Condições de NO-GO

Fonte primária ausente; requisito crítico ambíguo; branch/target não identificado; dado real sem autorização; segredo exposto; ambiente live não isolado; dependência essencial sem owner/fallback; teste destrutivo ou externo sem consentimento.

## Limitações

Leitura estática não comprova runtime, infraestrutura ou produção. Um teste local não comprova Redis/ClamAV/API MPT reais. Git histórico ajuda a reconstruir eventos, mas commit não mede esforço humano.
