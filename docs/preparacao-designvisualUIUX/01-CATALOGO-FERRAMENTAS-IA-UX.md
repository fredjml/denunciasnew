# 01 — Catálogo de ferramentas de design de IA/UX

> Lista curada a pedido do owner em 2026-09-05. Cada entrada marcada **[verificado]** foi
> checada ao vivo nesta sessão via `WebFetch`; entradas marcadas **[não verificado]** descrevem
> a ferramenta por conhecimento geral do modelo e **precisam ser confirmadas** ao acessar o site
> antes de qualquer decisão que dependa delas (`R-SRC-01`, `R-EVD-01`). Nenhuma dessas
> ferramentas deve receber dado real de denunciante — ver `R-DVX-03` em `AGENTS.md`.

## 1. Frameworks e diretrizes de design para IA (referência conceitual)

Usar para: entender padrões de interação humano-IA, não para gerar telas deste projeto
diretamente (este projeto não tem features de IA visíveis ao usuário final — STT e
classificador são mocks/back-office — mas os princípios de transparência e confiança se aplicam
à comunicação do que acontece com a denúncia, ex.: tela de Confirmação).

| Ferramenta | O que é | Quando usar aqui |
| --- | --- | --- |
| **Google PAIR** (`pair.withgoogle.com`) [verificado] | Time de pesquisa humano+IA do Google. Publica o *People + AI Guidebook* (boas práticas de produto de IA responsável), *AI Explorables* (explicações visuais interativas) e ferramentas open-source de interpretabilidade/fairness. | Consultar o Guidebook ao desenhar qualquer tela que explique uma decisão automatizada ao usuário (ex.: por que uma denúncia foi priorizada) — ainda que a classificação seja mock hoje, o padrão de comunicação vale desde já. |
| **Microsoft HAX Toolkit** (`microsoft.com/haxtoolkit`) [verificado] | *Guidelines for Human-AI Interaction* (boas práticas comportamentais), *Design Library* (padrões e exemplos), *Workbook* (planejamento de equipe) e *Playbook* (como lidar com falhas de IA/NLP). | O *Playbook* de falhas é diretamente aplicável ao fluxo de STT (transcrição de áudio) — como comunicar ao usuário que a transcrição falhou (já implementado como estado `FALHA` no mock) sem culpar o usuário. |
| **IBM Carbon for AI** (`carbondesignsystem.com`) [não verificado — página específica de AI não resolveu no fetch desta sessão] | Sistema de design open-source da IBM; a área de "AI" do Carbon cobre padrões visuais para indicar conteúdo gerado por IA, confiança e explicabilidade. | Referência de padrão visual (não de código — o projeto não usa Carbon) para como sinalizar "isto é uma classificação automatizada, revisão humana pendente" de forma consistente com o mercado. |
| **The Shape of AI** (`shapeof.ai`) [verificado] | Catálogo de padrões de UX para produtos de IA, organizado em 6 categorias: *Wayfinders, Inputs, Tuners, Governors, Trust Builders, Identifiers*. | Categoria **Trust Builders** e **Identifiers** são as mais relevantes aqui — como sinalizar visualmente "não identificado", "sigiloso", "revisão pendente" (o projeto já faz isso com badges como "DADOS SIGILOSOS" no mockup). |

## 2. Bibliotecas de referência visual e padrões de mercado

Usar para: benchmarking de como produtos reais (não necessariamente de IA) resolvem um
componente ou fluxo específico — ex.: "como outros formulários públicos de denúncia fazem o
upload de evidência".

| Ferramenta | O que é | Quando usar aqui |
| --- | --- | --- |
| **Mobbin** (`mobbin.com`) [não verificado — bloqueio de acesso automatizado (403) nesta sessão; é amplamente conhecido como biblioteca de screenshots reais de apps mobile/web organizados por fluxo e componente] | Biblioteca de referência visual de apps reais publicados. | Benchmarking de fluxos de formulário multi-etapa, upload de arquivo em mobile, telas de confirmação — comparar com o que este projeto já implementa. |
| **Refero.design** (`refero.design`) [verificado] | Plataforma de inspiração de UI/UX — coleção curada de referências visuais para apoiar o processo de design. | Mesma finalidade de benchmarking do Mobbin, escopo mais amplo (não só mobile). |
| **AI UX Playground** [não verificado — não localizado com confiança nesta sessão; nome sugere um espaço de experimentação de padrões de UX para produtos de IA] | A confirmar ao acessar. | Não usar como fonte até verificado. |

## 3. Ferramentas de geração de UI assistida por IA

Usar para: gerar **rascunhos** de wireframe/modelo de tela a partir de descrição textual ou de
um mockup existente, acelerando a etapa de `modelos-telas/` — nunca como saída final sem
revisão (`R-DVX-04`).

| Ferramenta | O que é | Quando usar aqui |
| --- | --- | --- |
| **Figma (AI/Figma Make)** (`figma.com/.../ux-design-ia`) [verificado] | *Figma Make*: gera protótipos interativos a partir de prompt em linguagem natural, dentro do Figma. | Se a equipe tiver licença Figma, é a opção mais integrada ao fluxo real de design (exporta direto para handoff). Preferível quando o modelo de tela precisa virar um protótipo clicável para validar navegação. |
| **Lovable** (`lovable.dev`) [não verificado — bloqueio de acesso (403) nesta sessão; conhecido como construtor de aplicações web completas via prompt, incluindo geração de UI e algo de lógica] | Gera aplicação (não só tela) a partir de descrição. | Usar com cautela — o output tende a incluir lógica/backend que não deve ser copiado para este projeto (o backend real é de outra equipe); útil só para a camada visual/wireframe. |
| **Banani** (`banani.co`) [verificado] | Gera protótipos multi-tela editáveis a partir de texto, imagem ou referência de design; exporta para Figma, HTML/CSS ou imagem. Público-alvo inclui não-designers (PMs, founders). | Boa opção para gerar rapidamente 2-3 variações de layout de uma tela nova antes de escolher uma para refinar manualmente — export para HTML/CSS facilita comparar com os tokens CSS já existentes do projeto. |
| **21st.dev** [verificado] | Registro comunitário de componentes de UI prontos, com prompts "AI-ready" para integrar via Claude Code, Cursor ou v0 — o código é copiado para o repositório (você é dono dele), não importado como dependência. | Fonte de componentes soltos (ex.: um dropzone de upload, um stepper) para inspiração de implementação — nunca copiar código diretamente sem adaptar aos tokens/convenções deste projeto (`R-SCOPE-01`). |
| **Beautiful UI** [não verificado — site não resolveu nesta sessão] | A confirmar ao acessar. | Não usar como fonte até verificado. |

## 4. Leitura de contexto (não é ferramenta, é artigo de referência)

| Fonte | Conteúdo | Uso |
| --- | --- | --- |
| **IxDF — "AI tools for UX designers"** (`ixdf.org/literature/article/ai-tools-for-ux-designers`) [verificado] | Artigo cobrindo 8 ferramentas de IA para fluxos de UX: **Uizard** (wireframe/conversão de design), **Attention Insight** (predição de atenção via heatmap), **Khroma** (paleta de cores por IA), **Adobe Firefly** (prototipagem interativa), **Galileo AI** (geração por prompt), **Stable Diffusion**, **Design AI** (montagem drag-and-drop). Posição do artigo: IA acelera o trabalho, não substitui o julgamento humano de design. | Leitura de contexto/onboarding para quem for conduzir a fase de design deste projeto — não citar como fonte de requisito, só como panorama de mercado. |

## 5. Regra de uso destas ferramentas neste projeto

1. Nenhuma delas é fonte de verdade sobre o que uma tela do Canal de Denúncias deve mostrar —
   isso vem só do PDF/PNG oficiais do MPT (`docs/Prototipacao/`) ou de decisão do owner.
2. Nenhuma recebe dado real ou mesmo mock de denunciante — só descrição textual do problema ou,
   no máximo, um PNG do mockup oficial (que já é público/institucional).
3. Toda saída de ferramenta de geração por IA é rascunho: precisa virar um arquivo em
   `modelos-telas/` com o mesmo padrão dos demais, revisado contra WCAG e aprovado pelo owner
   antes de qualquer código ser escrito a partir dela.
4. Entradas marcadas **[não verificado]** neste catálogo devem ser reconfirmadas (acessar o
   site, ler a documentação) antes de a equipe investir tempo real na ferramenta — não adotar
   uma ferramenta só com base na descrição deste documento.
