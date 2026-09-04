# Frontend — Angular/TypeScript

Este guia complementa o [baseline factual](../15-baseline-analises-denuncias.md), a [acessibilidade](acessibilidade.md), os [testes frontend](testes.md) e o [contrato compartilhado](../contrato/README.md).

## Topologia observada

Aplicação standalone Angular, wizard mobile-first, estado compartilhado em ComplaintService com signals e envio via ComplaintApiClient usando fetch/FormData para /api/denuncias.

Wizard atual: `Acolhimento → StepIrregularidades → StepOcorrencias → StepEvidencias → StepIdentificacao → StepLocal → StepRevisao → Confirmation` (7 etapas). O `ComplaintApiClient` foi extraído no incremento 13 e concentra multipart, chamada HTTP e validação do protocolo devolvido pelo BFF.

## Bundle e budgets (RELATORIO_FINAL §10 / RELATORIO_TESTES §5)

- Bundle inicial bruto: **601,09 kB → 384,38 kB** após substituir Bootstrap completo por módulos Sass necessários.
- Transferência estimada: **85,26 kB**.
- Budgets Angular alvo: 500 kB bruto / 120 kB transferido.
- Vitest frontend em 24/07/2026: **8/8 aprovados em ~15,89 s**; `npm audit --omit=dev` em 99 dependências de produção sem vulnerabilidades.

## Invariantes

- browser não recebe token ou URL interna MPT;
- modelo, defaults, formulário, revisão e serialização permanecem coerentes;
- erro mantém isSubmitted falso e protocolo vazio;
- confirmação requer protocolo string não vazio;
- navegação e estado continuam signal-driven salvo decisão arquitetural;
- design segue spec_design e WCAG 2.2 AA.

## Análise de mudança

1. mapeie componente, template, CSS, modelo, service e client;
2. teste estados vazio, válido, inválido, loading, erro, retry e reset;
3. confira FormData e contrato BFF;
4. procure DOM direto, innerHTML e bypassSecurityTrust;
5. revise responsividade, foco, teclado, erros e anúncio;
6. compare browser Baseline Angular 22 com política institucional;
7. avalie bundle/budgets, mídia e dependências.

## Comandos

~~~powershell
npm --prefix cidadania-canal-denuncias ci
npm --prefix cidadania-canal-denuncias run lint
npm --prefix cidadania-canal-denuncias test
npm --prefix cidadania-canal-denuncias run build
npm --prefix cidadania-canal-denuncias run e2e
npm --prefix cidadania-canal-denuncias audit --omit=dev
~~~

O E2E atual inicia somente Angular e intercepta POST /api/denuncias. Ele prova UI/jornada multi-browser, não BFF ou serviços live.

## Segurança Angular

Use templates/interpolação e sanitização contextual. AOT é padrão de produção. Avalie CSP e Trusted Types na infraestrutura; evite DOM direto e qualquer bypass sem revisão de segurança localizada. Não persista denúncia/PII em storage, analytics, erro ou trace sem requisito e avaliação de privacidade.

## Pontos de decisão

- planejamento exige HttpClient, mas implementação atual usa fetch;
- política de browser além do Baseline Angular;
- budgets e metas de performance;
- retenção do estado e comportamento ao recarregar;
- tratamento de áudio/microfone e privacidade;
- bloqueio de duplo envio;
- dependências runtime aparentemente sem uso na camada.

## Achados abertos priorizados (RELATORIO_ANALISE... 31/07/2026 + diagnóstico 26/07/2026)

Converta cada linha em requisito com aceite Dado/Quando/Então antes de ir para homologação/produção.

| Prio | ID | Descrição | Ação sugerida |
| --- | --- | --- | --- |
| P0 | QA-03 | `relato_audio` (Blob) descartado pelo `JSON.stringify`; nunca chega ao BFF | Anexar áudio como parte multipart nomeada (ex.: `arquivo_audio`) no `ComplaintApiClient` |
| P0 | QA-02 / SEC-01 | PII persiste após alternar wizard para "anônimo" — violação LGPD | Zerar `nome`, `email`, `telefone` no `ComplaintService` ao marcar anônimo; adicionar teste de regressão |
| P0 | QA-01 | Wizard permite avançar sem preencher campos obrigatórios | Bloquear `nextStep()` sem validação; feedback acessível de erro |
| P0 | REG-01 | E2E Playwright não roda no CI | Adicionar job com upload de report/traces |
| P0 | REG-02 | `ui-audit.spec.ts` nunca falha em achados críticos | Assertivar `criticalFindings.length === 0` |
| P1 | QA-04 | Sem persistência de rascunho (perda em recarga/backgrounding mobile) | Auto-save por step em `sessionStorage`, com limpeza no sucesso |
| P1 | QA-05 | `fetch` sem `AbortController`/timeout — UI trava | Timeout de 30 s + verificação `navigator.onLine` |
| P1 | QA-06 | Botão de acessibilidade, vídeo institucional e cards "Órgão"/"Ouvidoria" sem função | Implementar ou remover/desabilitar visualmente |
| P1 | QA-08 | Stepper permite pular para qualquer etapa | Restringir a steps já visitados/completos |
| P1 | REG-03 | Fluxo anônimo nunca é testado end‑to‑end | Duplicar helper `completeComplaintForm` para modo anônimo |
| P1 | REG-04 | Zero testes unitários para componentes Angular | Cobertura mínima com `TestBed` por componente |
| P1 | REG-05 | axe só cobre a tela de Acolhimento | Rodar axe em cada step, com filtro `wcag2a/wcag2aa` `critical`+`serious` |
| P1 | UX/A11Y (Sugestões §2/§3) | `:focus-visible`, `<label for>`, `aria-describedby`, `aria-live` de transição, foco no `h1` da etapa | Implementar em `styles.css` global + template dos steps |
| P2 | QA-09 | Validação de CNPJ sem DV — aceita `11.111.111/1111-11` | Adicionar validação de dígito verificador (frontend + BFF) |
| P2 | QA-10 | Email aceito sem validação de formato | `Validators.email` do Angular ou regex |
| P2 | QA-11 | Telefone aceita texto livre | Máscara e validação de formato BR |
| P2 | QA-12 | Inputs sem `<label>` associado | Adicionar `<label for>` e `aria-describedby` |
| P2 | UX (Sugestões §3.3) | Upload aceita `.exe`/`.js` (rejeição só no BFF) | Restringir `accept` no `<input>` e validar tipo no `change` |
| P3 | QA-13/14 | Sem indicação de obrigatoriedade e sem feedback de upload | Padronizar asterisco/`aria-required` e barra de progresso |
| P3 | SEC-10 | Sem aceite explícito de Termos/LGPD | Checkbox obrigatório antes do envio |

Referências completas: [Analises/RELATORIO_ANALISE_QA_CLEANCODE_SECURITY_REGRESSAO.md](../../../Analises/RELATORIO_ANALISE_QA_CLEANCODE_SECURITY_REGRESSAO.md), [Analises/RELATORIO_DIAGNOSTICO_FRONTEND_PRODUCAO.md](../../../Analises/RELATORIO_DIAGNOSTICO_FRONTEND_PRODUCAO.md), [Analises/RELATORIO_SUGESTOES_MELHORIAS_UI_UX_ACESSABILIDADE.md](../../../Analises/RELATORIO_SUGESTOES_MELHORIAS_UI_UX_ACESSABILIDADE.md).

## E2E — cobertura atual (RELATORIO_TESTES §4)

- 4 projetos Playwright: `chromium-desktop`, `chromium-mobile` (Pixel 7), `firefox-desktop`, `webkit-desktop` (Desktop Safari).
- 4 cenários por projeto = **16 execuções aprovadas**: jornada completa; regressão do falso sucesso (503 → retry → 201); regressão do contrato (`201` sem protocolo); baseline axe (`wcag2a/wcag2aa`, filtro `critical`+`serious`).
- Todos os cenários usam `page.route` para mockar a API — não comprovam BFF/Redis/ClamAV/API MPT reais.
- Safari real (macOS/iPhone) e integração live continuam pendentes.

## Limitações

Build e testes unitários não comprovam UX. Playwright não substitui tecnologia assistiva real. Angular sanitiza contextos conhecidos, mas não torna qualquer dado/API de DOM seguro. Achados abertos são leitura de 26–31/07/2026; reexecute contra o commit atual antes de citar o estado.
