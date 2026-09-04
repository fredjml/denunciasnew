# Autorização de execução — CP-1 Tela de Acolhimento

## 1. Registro do estado

- **Data do registro:** 2026-09-04.
- **Owner do ciclo:** Frederico José Monteiro Leite.
- **Checkpoint anterior:** CP-0 — Fundação.
- **Decisão do gate CP-0:** `PASSOU COM RISCOS`.
- **Autorização vigente:** `CÓDIGO_FATIA CP-1`, limitada às tasks `T-CP1-01`, `T-CP1-02` e `T-CP1-04`.
- **Branch local no momento da autorização:** `main`.
- **Push e deploy:** não autorizados.

## 2. Evidências herdadas do CP-0

- Commit `b360f63`: reorganização `app/` → `frontend/` e `mock-api/` → `backend-mock/`.
- Commit `addbd7b`: infraestrutura de qualidade e segurança do CP-0.
- Lint agregado aprovado.
- Testes unitários aprovados: 4 frontend + 4 backend-mock.
- Build Angular aprovado.
- Workflow `.github/workflows/ci.yml` validado sintaticamente.
- Gate axe-core operacional; detectou três ocorrências sérias de contraste no template inicial do Angular, razão 3,88:1 para mínimo 4,5:1.
- Lighthouse mobile configurado; execução local Windows inconclusiva após 90 segundos. Validação permanece pendente no runner Linux do CI.
- Auditoria de dependências de produção: frontend sem vulnerabilidades; backend-mock com três vulnerabilidades moderadas transitivas em `express`/`body-parser`/`qs`.

## 3. Escopo autorizado

### `T-CP1-01` — `FATIA-DN-CP1-01`

Criar o componente standalone `StepAcolhimento` com três CTAs e avanço bloqueado enquanto nenhuma escolha estiver selecionada.

Arquivos permitidos:

- `frontend/src/app/steps/step-acolhimento/**`;
- arquivos mínimos de rota/composição necessários para exibir o componente;
- testes focais da própria fatia;
- estilos estritamente necessários ao componente e aos tokens existentes.

### `T-CP1-02` — `FATIA-DN-CP1-02`

Registrar a escolha de acolhimento como metadado de sessão e restaurá-la por `sessionStorage`.

Arquivos permitidos:

- serviço/modelo mínimo de estado da denúncia;
- testes focais de persistência e restauração;
- integração mínima com `StepAcolhimento`.

### `T-CP1-04` — `FATIA-DN-CP1-04`

Criar o componente de vídeo institucional acessível, sem autoplay com som, com suporte a legendas e transcrição textual visível.

Arquivos permitidos:

- subcomponente sob `frontend/src/app/steps/step-acolhimento/**`;
- fixture exclusivamente sintética ou placeholder local sem conteúdo institucional inventado;
- testes focais de acessibilidade e comportamento.

## 4. Itens explicitamente bloqueados

- **`T-CP1-03` / `FATIA-DN-CP1-03`:** não implementar redirecionamento para a Ouvidoria até o owner fornecer e aprovar a URL oficial.
- **`T-CP1-05` / `FATIA-DN-CP1-05`:** não integrar provedor nem hospedar vídeo até decisão registrada sobre auto-hospedagem versus provedor externo sem cookies.
- Não alterar `contract/openapi.yaml` nem `frontend/src/app/api/generated.ts`.
- Não usar dados pessoais, mídia real, URL interna, token ou secret.
- Não fazer push, PR, deploy ou acesso a backend real do MPT.
- Não iniciar CP-2 nesta autorização.

## 5. Critérios de aceite

1. Os testes das três fatias são escritos antes da implementação correspondente.
2. A tela apresenta exatamente as três opções sustentadas pelas fontes primárias; ausência de evidência textual interrompe a implementação e gera pergunta ao owner.
3. O botão de avanço permanece desabilitado sem seleção.
4. A escolha selecionada persiste e é restaurada via `sessionStorage` sem armazenar PII.
5. O player não inicia áudio automaticamente.
6. O vídeo expõe mecanismo de legendas e transcrição textual acessível; conteúdo institucional ausente permanece marcado como placeholder sintético.
7. `npm run lint`, `npm test`, `npm run build` e `npm --prefix frontend run test:a11y` são executados.
8. Violações sérias ou críticas de acessibilidade impedem o fechamento do gate CP-1.
9. O diff fica limitado aos arquivos autorizados e toda exceção é escalada ao owner.

## 6. Prompt autorizado para execução

```prompt
Projeto: Canal de Denúncias MPT — MVP standalone.
Workspace: F:\ProjetosMPT\denunciasnew.
Owner do ciclo: Frederico José Monteiro Leite.
Autorização vigente: CÓDIGO_FATIA CP-1, exclusivamente T-CP1-01,
T-CP1-02 e T-CP1-04.

Objetivo:
Implementar a Tela de Acolhimento do CP-1 por TDD estrito, usando Angular 22
standalone e signals, preservando os gates de qualidade estabelecidos no CP-0.

Antes de agir:
1. Leia integralmente AGENTS.md.
2. Verifique git status e preserve alterações locais não relacionadas.
3. Reabra as fontes primárias aplicáveis: PDF de UX/mobile, requisitos delta,
   plano incremental e decisões CP-1.
4. Confirme textualmente quais são os três CTAs. Se a fonte não os determinar,
   pare e solicite decisão ao owner; não invente conteúdo institucional.
5. Use somente dados, texto, protocolo e mídia sintéticos.

Execute nesta ordem:
1. T-CP1-01 / FATIA-DN-CP1-01:
   - escreva primeiro os testes do StepAcolhimento;
   - implemente três CTAs;
   - mantenha Avançar desabilitado sem escolha;
   - valide semântica, teclado, foco e contraste.
2. T-CP1-02 / FATIA-DN-CP1-02:
   - escreva primeiro os testes de persistência/restauração;
   - implemente estado com signals;
   - persista apenas origem_acolhimento em sessionStorage, sem PII;
   - trate valor ausente ou inválido com fallback seguro.
3. T-CP1-04 / FATIA-DN-CP1-04:
   - escreva primeiro os testes do player acessível;
   - proíba autoplay com som;
   - ofereça legendas e transcrição textual visível;
   - use mídia sintética/placeholder até a decisão institucional.

Bloqueios obrigatórios:
- Não execute T-CP1-03: URL oficial da Ouvidoria não aprovada.
- Não execute T-CP1-05: estratégia de hospedagem do vídeo não aprovada.
- Não altere contract/openapi.yaml nem o tipo gerado.
- Não faça push, PR, deploy, instalação não justificada ou chamada live.
- Não avance ao CP-2.

Validação obrigatória:
- npm run lint
- npm test
- npm run build
- npm --prefix frontend run test:a11y
- git diff --check

Entrega:
1. Relacione arquivos alterados por task.
2. Anexe resultados objetivos dos testes e do axe-core.
3. Registre limitações, placeholders e decisões pendentes.
4. Atualize o plano/playbook apenas com evidência concluída.
5. Emita gate CP-1: PASSOU, PASSOU COM RISCOS ou BLOQUEADO.
6. Pare no gate humano antes de CP-2.
```

## 7. Decisão registrada

O owner autorizou a execução integral de `T-CP1-01`, `T-CP1-02` e `T-CP1-04` nos limites deste documento. Esta autorização não desbloqueia `T-CP1-03`, `T-CP1-05`, CP-2, push ou deploy.

## 8. Evidências da execução

- Fonte primária reaberta: página 6 do PDF externo confirmou os três CTAs e o vídeo opcional de 45–60 segundos.
- TDD registrado: suíte inicialmente falhou pela ausência dos componentes e serviço; implementação mínima aplicada em seguida.
- Testes unitários frontend: 11/11 aprovados em 6 arquivos.
- Testes E2E Chromium mobile: 4/4 aprovados.
- Axe-core WCAG 2.1 AA: nenhuma violação `serious` ou `critical`.
- Lint frontend/backend-mock: aprovado.
- Build Angular: aprovado; bundle inicial de 217,43 kB.
- `T-CP1-03` e `T-CP1-05`: não executadas.
- Mídia institucional: permanece como placeholder sintético local; nenhuma URL externa foi integrada.

**Decisão técnica proposta para o gate CP-1:** `PASSOU COM RISCOS` até o owner decidir a URL da Ouvidoria e a estratégia de hospedagem/mídia institucional.
