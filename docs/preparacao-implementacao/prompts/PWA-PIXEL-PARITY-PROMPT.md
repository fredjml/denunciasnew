# Prompt — Paridade visual 100% com o mockup + PWA responsivo (formato ReAct)

> Gerado em 2026-09-05 a pedido do owner: "gere um prompt bem elaborado e específico para
> claude code com a mesma filosofia e espírito... aprimore o mesmo no formato ReAct". Este
> documento é auto-contido — uma sessão nova de Claude Code pode executá-lo sem precisar do
> histórico desta conversa.
>
> **O que já foi feito nesta sessão (não refazer):** header trocado para fundo vermelho
> institucional + logo branca (`frontend/public/brand/logo-mpt-branco.png`) + badge circular
> branco com ícone de sorriso no canto superior direito; card "Denunciar" do Acolhimento com
> label e alinhamento ajustados; PWA baseline (manifest, ícones, service worker hand-rolled,
> meta tags) já existe. Ver `git log` a partir do commit que adicionou
> `frontend/public/manifest.webmanifest` para o estado exato.

## 0. Persona e princípios (não negociáveis)

Você é um engenheiro de software com 20 anos de experiência em desenvolvimento moderno de
UI/UX, domínio profundo de CSS (Grid, Flexbox, custom properties, container queries), design
responsivo mobile-first, PWA (manifest, service worker, instalabilidade) e ferramentas de
teste em dispositivo real e emulado. Você também tem familiaridade com fluxos de ML aplicado
(ex.: Hugging Face) — **mas este projeto não usa nenhum modelo real hoje** (STT e
classificador são mocks determinísticos por decisão do owner, `DEC-DN-P-F5-6`); não introduza
uma dependência de ML real sem uma decisão `DEC-DN-*` explícita autorizando.

Princípios do projeto que continuam valendo integralmente (não são anulados por este prompt):

- `AGENTS.md` — persona, regras `R-DN-*`, `R-QA-01`, `R-SEC-01`, `R-SCOPE-01`, `R-GIT-01`.
- `contract/openapi.yaml` é imutável fora de PR revisado (`R-DN-06`/`DEC-DN-26`) — este
  trabalho é 100% visual/frontend; se um campo do mockup não existir no contrato, documente o
  gap (mesmo padrão já usado para "Nomes e Dados" e "CNPJ da Empresa"), não invente campo novo.
  Confira `docs/preparacao-implementacao/12-DECISIONS.delta-denunciasnew.md` antes de assumir
  que um campo visual do PDF pode virar campo funcional nesta rodada.
  - `contract/openapi.yaml` é imutável fora de PR revisado (`R-DN-06`/`DEC-DN-26`).
- Toda mudança precisa de evidência de teste antes de ser considerada concluída — unit
  (`npx ng test --watch=false`), e2e (`npx playwright test`), lint (`npx eslint .`), build
  (`npx ng build`), a11y (`npm run test:a11y` — Playwright + axe-core, WCAG 2.1 AA piso por
  `DEC-DN-07`).
- Nunca commitar/pushar sem autorização explícita do owner na conversa atual.

## 1. Objetivo desta rodada

As telas do app (rodando em `frontend/`) devem ficar **visualmente idênticas** às do mockup
oficial em `docs/Prototipacao/` — tanto o PDF (`Documento externo-outros 010970.2026.pdf`,
14 páginas, já lido nesta sessão) quanto os 4 PNGs de tela cheia:

- `docs/Prototipacao/modelo_tela_acolhimento.png`
- `docs/Prototipacao/modelo_tela_step1_irregularidades.png`
- `docs/Prototipacao/modelo_tela_step2_ocorrencias.png`
- `docs/Prototipacao/modelo_tela_step3_evidencias.png`

E o app precisa funcionar como **PWA instalável e responsivo** — testável tanto num navegador
desktop quanto num celular real (Android/iOS), com todos os alvos de toque, gestos de scroll
horizontal e comportamento de teclado virtual corretos.

**Definição de "pronto" desta rodada**: para cada tela, um screenshot do app rodando (mobile
viewport, build de produção) colocado lado a lado com o PNG/página do PDF correspondente não
deve ter nenhuma diferença perceptível de leigo — mesma cor, mesmo espaçamento relativo, mesma
tipografia (peso/tamanho), mesmos ícones, mesmo texto, mesma ordem de elementos. Diferenças de
pixel exato de fonte (por ausência da fonte exata do MPT, se houver uma) são aceitáveis desde
que a família seja visualmente equivalente (sans-serif humanista, geometria similar à do PDF).

## 2. Como validar cada tela (faça isto SEMPRE antes de declarar uma tela "pronta")

```bash
cd frontend
npx ng build
npx http-server dist/frontend/browser -p 4300 -c-1 -a 127.0.0.1 &
# em outro terminal / script Playwright:
# 1. new context com devices['Pixel 5'] (393x851, DPR 2.75) — mobile
# 2. new context com viewport 1440x900 — desktop
# navegar/clicar até a tela alvo, tirar screenshot, comparar visualmente com o PNG/PDF
```

Não existe pipeline automático de diff de imagem configurado neste repo — a comparação é
visual, feita por você lendo o screenshot gerado (ferramenta `Read` sobre o `.png`) lado a lado
com a referência. Não pule esta etapa: é o único jeito de saber se "ficou igual" de verdade,
sem depender de opinião sobre o CSS escrito.

## 3. Loop de execução (formato ReAct — Thought / Action / Observation)

Execute este loop **uma tela por vez**, na ordem da seção 4. Não avance para a próxima tela
sem terminar o ciclo completo da atual (Thought → Action → Observation → repita até convergir
→ Reflection final).

```
Thought: [o que difere entre o screenshot atual e a referência, em ordem de impacto visual —
          cor/estrutura primeiro, espaçamento fino por último]
Action: [uma mudança pontual e testável — 1 arquivo .html/.css por vez, nunca um refactor
          amplo "aproveitando que estou aqui"]
Observation: [rebuild, novo screenshot, o que mudou de fato — inclua o que NÃO resolveu]
... repita até o Thought não encontrar mais diferença perceptível ...
Reflection: [rodar a suíte de validação da tela — unit + e2e relacionados + a11y — antes de
             seguir para a próxima tela]
```

Isso existe para uma razão concreta: tentar acertar tudo de uma vez em um CSS grande, sem
comparação visual intermediária, é exatamente como esta sessão terminou com telas "bem
melhores" mas ainda não idênticas ao mockup depois de duas rodadas de trabalho — o ciclo
curto com observação visual a cada passo é o que efetivamente fecha a lacuna.

## 4. Gaps conhecidos por tela (ponto de partida do Thought inicial de cada uma)

### 4.1 Acolhimento (`frontend/src/app/steps/step-acolhimento/`)

Referência: `modelo_tela_acolhimento.png` + PDF págs. 5, 10.

- **Vídeo institucional** (`video-institucional.html/ts/css`): o mockup mostra um retângulo
  escuro sólido com um ícone de play centralizado e o texto "Vídeo Explicativo (45s)" abaixo —
  um *thumbnail com overlay*, não os controles nativos do `<video>` do navegador. A
  implementação atual usa `<video controls preload="metadata">` nativo (decisão de
  `DEC-DN-27` — self-hosted, sem cookie de terceiro — **isso continua valendo**, o gap é só a
  *aparência* do player antes do play, não a origem do arquivo). Ação sugerida: renderizar um
  `<button>` overlay customizado com ícone de play + legenda de duração por cima do `<video>`
  (`poster` ou uma camada absoluta), que remove os controles nativos até o primeiro play e os
  reativa depois — mantendo `preload="metadata"`, sem autoplay, sem iframe de terceiro.
- **Cards de escolha**: label/alinhamento já corrigidos nesta sessão (ver nota no topo). Falta
  conferir espaçamento vertical entre os 3 cards e o padding interno contra o PNG.
- **Botão "Avançar"**: no mockup não aparece na tela de Acolhimento (a escolha já avança
  sozinha, ao que parece, ou o botão está fora da área visível do PNG) — confirme contra o PDF
  se o padrão de "Avançar" explícito desta tela deve mudar para avanço automático ao
  selecionar; **não mude esse comportamento sem confirmar com o owner**, é uma mudança de UX,
  não só visual.

### 4.2 Relato Guiado (`frontend/src/app/steps/step-relato-guiado/`)

Referência: `modelo_tela_step1_irregularidades.png` + PDF pág. 11.

- **Caixa de relato**: no mockup, a caixa mostra diretamente texto de exemplo
  ("Transcrição de áudio: Presenciei um caso de...") com o botão de microfone vermelho
  circular sobreposto no canto inferior direito da própria caixa — bem diferente da
  implementação atual, que tem textarea vazio + botão de mic fora da caixa parcialmente
  sobreposto (o botão de mic hoje já está dentro do `.relato-box`, confirme se o
  posicionamento bate). O contador "0 caracteres" e o rótulo "Descreva os fatos do seu jeito"
  **não aparecem no mockup** — o mockup pula direto para o textarea preenchido. Considere se
  esses elementos devem ficar visualmente mais discretos (ex.: contador menor, cinza, sem
  label visível — só `aria-label`) em vez de removê-los (eles têm valor de usabilidade real
  que o mockup, sendo uma tela de exemplo já preenchida, não precisa mostrar).
- **Checklist de tipos de irregularidade**: no mockup, os cards são quadrados/arredondados
  maiores, com o ícone centralizado acima do rótulo, checkbox no canto superior direito de
  cada card (não ao lado do ícone), 2 cards visíveis por vez + indicador de paginação em
  bolinhas (dots) abaixo do carrossel horizontal. A implementação atual (`checklist-scroll`)
  já faz scroll horizontal mas sem os dots de paginação nem o checkbox posicionado no canto.
  Ação: adicionar indicador de dots (pode ser CSS puro com `scroll-snap` + um pequeno signal
  computado a partir do scroll position, sem biblioteca nova) e reposicionar o checkbox via
  CSS absoluto no canto superior direito do card.
- **Botões de navegação**: no mockup, "Avançar" é um botão vermelho sólido full-width, "Voltar"
  é outline abaixo dele — confirme se o CSS atual (`.primary-action`/`.secondary-action`) já
  bate exatamente essa hierarquia (parece que sim, mas confirme a cor/raio exatos no
  screenshot).

### 4.3 Detalhamento (`frontend/src/app/steps/step-detalhamento/`)

Referência: `modelo_tela_step2_ocorrencias.png` + PDF pág. 12.

- **Ordem/seções**: o mockup mostra "Relato" (ícone relógio) → "Trabalhadores prejudicados"
  (ícone pessoas) → **"Nomes e Dados" (badge "🔒 DADOS SIGILOSOS")** como uma 3ª seção. A
  implementação atual tem só as 2 primeiras seções — o campo "Nomes e Dados" foi
  **deliberadamente omitido** por `DEC-DN-16` (o owner decidiu coletar só um sim/não de
  testemunha, sem nome/contato, para não expor PII de terceiro num formulário público). **Não
  reintroduza esse campo sem uma nova decisão do owner revertendo `DEC-DN-16`** — isso é um
  gap intencional entre mockup e app, documentado, não um bug. Se quiser reduzir a diferença
  visual sem reabrir a decisão de PII, considere adicionar uma seção "Nomes e Dados" com um
  texto explicando por que esse dado não é coletado aqui (em vez de omitir a seção por
  completo) — mas isso também é uma decisão de produto, não puramente visual: pergunte ao
  owner antes de adicionar texto novo nessa tela.
- **Estilo dos campos**: no mockup os `input`/`select` têm bordas bem sutis, fundo levemente
  acinzentado (não branco puro), cantos arredondados maiores que o padrão atual. Comparar
  `--radius-md`/`--radius-lg` em `frontend/src/styles/tokens.css` contra o raio real do PNG.

### 4.4 Evidências (`frontend/src/app/steps/step-evidencias/`)

Referência: `modelo_tela_step3_evidencias.png` + PDF pág. 8.

- **Ordem de seções**: mockup mostra "Há grupos vulneráveis envolvidos?" → "Anexos
  (Opcional)" → "Outros Órgãos" (pergunta se já procurou outro órgão, Sim/Não). A
  implementação atual tem "grupos vulneráveis" → **"Há testemunhas?"** → anexos — sem a seção
  "Outros Órgãos" do mockup. A seção de testemunhas existe por `DEC-DN-16` (implementada
  corretamente, é funcionalmente necessária) mas não está no mockup nesta posição — mantenha-a
  (é decisão de produto já fechada), e avalie com o owner se "Outros Órgãos" deve ser
  adicionada como um campo novo (**verifique primeiro se existe no `contract/openapi.yaml`** —
  se não existir, é o mesmo padrão de gap "mockup à frente do contrato" já visto 2x nesta sessão
  para "Nomes e Dados" e "CNPJ da Empresa"; documente em vez de inventar o campo).
- **Checkboxes de grupos vulneráveis**: no mockup são quadrados com borda fina, sem preenchimento
  quando não marcados — confirme contra o CSS atual (`checklist` fieldset) se o estilo do input
  nativo foi customizado ou se é o checkbox padrão do navegador (o mockup sugere um componente
  customizado, o padrão do navegador varia entre Chrome/Safari/Firefox e não fica idêntico ao
  desenho — considere estilizar com `appearance: none` + SVG de check próprio).
- **Dropzone de anexos**: mockup usa borda tracejada com ícone de "clipe/anexo" (não é bem uma
  seta de upload) e texto em 2 linhas centralizado — comparar com `.upload-dropzone` atual.

### 4.5 Telas sem PNG dedicado mas cobertas pelo PDF (Sigilo, Local/Empresa, Revisão, Confirmação)

Use as páginas correspondentes do PDF (já lidas nesta sessão, páginas com título "Sigilo e
Anonimato", "Onde o fato ocorreu?", "Revisão", "Tela de Confirmação") como referência. Padrões
gerais observados nessas páginas que provavelmente também se aplicam às 4 telas com PNG
dedicado:

- Radio buttons customizados (círculo vermelho preenchido quando selecionado, não o radio
  nativo do navegador).
- Botão primário sempre vermelho sólido full-width, botão secundário sempre outline vermelho
  full-width, nessa ordem (primário acima, secundário abaixo) — confirmar que é consistente em
  todas as 8 telas do wizard, não só nas 4 com PNG.
- Cards de resumo na tela de Revisão têm um link "Editar" em vermelho alinhado à direita do
  título de cada seção — confirmar contra `step-revisao.html` atual.
- Tela de Confirmação mostra um diagrama horizontal de 3 etapas (Recebimento → Triagem →
  Investigação) com ícones circulares vermelhos conectados por uma linha — confirmar contra
  `step-confirmacao.html`/o SVG de infográfico atual, e lembrar que `DEC-DN-20` fechou como
  "sem SLA numérico", então o texto das etapas pode mudar mas não deve incluir prazo.

## 5. PWA e responsividade — trabalho já iniciado, o que falta

Já existe (não refazer): `frontend/public/manifest.webmanifest`, ícones em
`frontend/public/icons/` (192/512/maskable/apple-touch), `frontend/public/sw.js` (service
worker hand-rolled: cache-first para assets estáticos same-origin, network-first com fallback
de shell para navegação, **nunca** intercepta `/api/*`), registro em `frontend/src/main.ts`
guardado por `!isDevMode()`.

Falta, nesta ordem de prioridade:

1. **Testar a instalabilidade de verdade**: Chrome DevTools → Application → Manifest deve
   mostrar "Installable" sem erros; testar "Adicionar à tela inicial" num Android real ou
   emulado, e em Safari iOS (que usa as meta tags `apple-mobile-web-app-*` já adicionadas em
   vez do manifest para o ícone da tela inicial — comportamento diferente do Android, teste os
   dois separadamente).
2. **Auditoria Lighthouse PWA** (`npx lighthouse http://127.0.0.1:4300/ --only-categories=pwa`
   contra o build de produção servido estaticamente, mesmo padrão já usado para
   `lighthouse:ci`) — resolver qualquer item reprovado antes de considerar a PWA "pronta".
3. **Avaliar migrar para `@angular/service-worker`** (`ng add @angular/pwa`) em vez do
   `sw.js` hand-rolled atual. Vantagem: gera e mantém automaticamente o manifesto de assets
   com hash, evita cache obsoleto após deploy. **Isso instala uma dependência nova — precisa de
   autorização just-in-time do owner antes de rodar `ng add`** (`AGENTS.md` §6); até lá, o
   `sw.js` manual é suficiente para o MVP, só documente a limitação (cache por nome fixo,
   não por hash de conteúdo) se decidir manter.
4. **Testar em dispositivo real**: nem todo comportamento de teclado virtual, safe-area
   (notch/home indicator do iPhone via `env(safe-area-inset-*)`), scroll momentum e gesto de
   swipe do carrossel de irregularidades aparece certo num emulador Chrome DevTools — pelo
   menos um teste manual num celular Android e um iPhone reais (ou BrowserStack/similar, se
   disponível) antes de considerar "testável em celular" cumprido de fato. Documente o
   resultado (`docs/preparacao-implementacao/prompts/VERIFICACAO-*.md`, mesmo padrão desta
   sessão).
5. **`viewport-fit=cover` já foi adicionado ao `index.html`** — falta usar
   `env(safe-area-inset-top/bottom)` no CSS do header/footer sticky para não ficar atrás do
   notch/home indicator em iPhones com tela borda-a-borda.

## 6. Ordem de execução recomendada

1. Acolhimento (maior visibilidade, primeira impressão, menor risco de tocar em campo que não
   existe no contrato).
2. Relato Guiado (checklist com dots é o item de maior esforço desta rodada).
3. Detalhamento e Evidências (cuidado redobrado com `DEC-DN-16`/gaps de contrato).
4. Sigilo, Local, Revisão, Confirmação (usar só o PDF como referência, sem PNG dedicado).
5. PWA (seção 5), em paralelo ou depois — não bloqueia o trabalho visual acima.
6. Rodar a suíte completa (`npm run lint && npm test && npm run build && npx playwright test`
   na raiz do monorepo) e o Lighthouse mobile (`npm run lighthouse:ci` em `frontend/`) antes de
   considerar a rodada inteira concluída.
7. Registrar tudo em um novo `docs/preparacao-implementacao/prompts/VERIFICACAO-*.md` (ação →
   motivo, mesmo padrão já estabelecido nesta sessão) e atualizar
   `11-IMPLEMENTATION-PLAN.delta-denunciasnew.md`/`12-DECISIONS.delta-denunciasnew.md` se
   alguma fatia/decisão for fechada.

## 7. O que NÃO fazer

- Não reabrir `DEC-DN-16` (PII de testemunha) ou adicionar "CNPJ da Empresa" ao contrato só
  para bater com o mockup — isso exige decisão do owner + PR de contrato revisado
  (`DEC-DN-26`), não é trabalho visual.
- Não trocar `<video>` self-hosted por um player/embed de terceiro para "facilitar" o visual
  do thumbnail — `DEC-DN-27` já fechou isso como self-hosted; construa o overlay customizado
  em cima do elemento nativo.
- Não instalar `@angular/pwa` ou qualquer outra dependência nova sem autorização just-in-time
  explícita do owner na conversa (`AGENTS.md` §6).
- Não declarar uma tela "pronta" sem o ciclo Thought/Action/Observation da seção 3 ter
  realmente gerado um screenshot novo comparado à referência — uma mudança de CSS sem
  verificação visual é exatamente o padrão que já levou a duas rodadas de "ficou melhor, mas
  não idêntico".
