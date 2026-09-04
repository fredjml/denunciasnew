# 06-REQUIREMENTS — Delta `denunciasnew` (proposta de novo leiaute)

> **Delta proposto.** Não substitui [`06-REQUIREMENTS.md`](06-REQUIREMENTS.md). Adiciona requisitos derivados **exclusivamente** do PDF externo [`../Documento externo-outros 010970.2026.pdf`](../Documento%20externo-outros%20010970.2026.pdf) (fonte primária vigente para UX/navegabilidade/mobile, ver D-DN-03 e P-F1-2 em [`prompts/fases/F1-descoberta-preflight.md`](prompts/fases/F1-descoberta-preflight.md)).
>
> **Fase:** F2 — Engenharia reversa de requisitos.
> **Subagente:** `requirements-engineer` ([agents/requirements-engineer.md](agents/requirements-engineer.md)).
> **Autorização:** `SOMENTE_LEITURA + DOCUMENTAÇÃO` (arquivo autorizado por instrução do owner de 2026-09-03).
> **Fontes citadas:** `docs/Documento externo-outros 010970.2026.pdf` (páginas 1–15, transcritas em [`prompts/fases/F2-pdf-transcript.md`](prompts/fases/F2-pdf-transcript.md)).
> **Fontes não usadas nesta fase:** `cidadania-canal-denuncias/**` (ausente), `docs/Analises/backups/**` (fora do escopo autorizado). Consequência: requisitos que dependeriam do código atual estão marcados como `ND`.

## 1. Convenção

| Campo | Valores |
| --- | --- |
| Tipo | `RF` (funcional), `RS` (sistema/integração), `RG` (governança/negócio), `RNF` (não-funcional) |
| Classificação | `CONF` (confirmado pela fonte primária), `PART` (parcial), `INF` (inferido), `HIP` (hipótese), `ND` (indeterminado) |
| Prefixo do ID | `DN-*` (`DN-RF-*`, `DN-RS-*`, `DN-RG-*`, `DN-RNF-*`) — para não colidir com IDs de [`06-REQUIREMENTS.md`](06-REQUIREMENTS.md) |
| Fonte | Página do PDF ou `PDF Meta` para metadados |

**Regra de aceite:** todo requisito atômico contém Dado/Quando/Então testável.

## 2. Requisitos derivados do PDF

### 2.1 Princípios de design (Página 2–3)

#### DN-RG-001 — Legal Design e Visual Law como fundamento
- **Tipo:** RG.
- **Classificação:** CONF.
- **Fonte:** PDF pág. 2.
- **Texto:** o formulário deve ser reestruturado sob os princípios de **Legal Design** e **Visual Law**, transformando o canal de coleta em ferramenta de acesso à Justiça.
- **Aceite:**
  - **Dado** um cidadão comum sem letramento jurídico,
  - **Quando** ele acessa o formulário,
  - **Então** todo texto de UI deve ser revisado por um curador de Legal Design antes do deploy, sem termos técnicos não explicados.
- **Owner esperado:** UX / Legal.

#### DN-RG-002 — Progressive Disclosure obrigatório
- **Tipo:** RG.
- **Classificação:** CONF.
- **Fonte:** PDF pág. 2 (itens 3–4).
- **Texto:** o formulário deve dividir-se em **etapas lógicas**, apresentando informações e campos apenas quando necessários, para reduzir sobrecarga cognitiva.
- **Aceite:**
  - **Dado** que existem N passos definidos no wizard,
  - **Quando** o usuário está no passo K,
  - **Então** somente os campos do passo K são visíveis; navegação linear com voltar/avançar; nenhum campo do passo K+1 é renderizado antes do avanço.
- **Owner esperado:** Frontend.

#### DN-RNF-001 — Conformidade WCAG 2.1 (mínimo)
- **Tipo:** RNF.
- **Classificação:** CONF.
- **Fonte:** PDF pág. 3.
- **Texto:** o design deve adotar **WCAG 2.1** (alto contraste, tipografia legível, compatibilidade com leitores de tela).
- **Aceite:**
  - **Dado** o formulário em qualquer viewport,
  - **Quando** submetido a `axe-core` no modo `wcag21aa`,
  - **Então** zero violações críticas e zero sérias; contraste mínimo 4.5:1 (texto normal) e 3:1 (texto grande); todos os controles atingíveis por teclado; leitor de tela lê labels acessíveis.
- **Ambiguidade DEC-DN-07:** o PDF declara WCAG 2.1; o pacote existente adota WCAG 2.2 AA em [`../diagramas-mermaid/README.md`](../diagramas-mermaid/README.md) e nos padrões de acessibilidade do kit. Owner deve decidir a versão-alvo (2.1 ou 2.2 AA).
- **Owner esperado:** UX / Acessibilidade.

#### DN-RG-003 — Linguagem simples (anti-juridiquês)
- **Tipo:** RG.
- **Classificação:** CONF.
- **Fonte:** PDF pág. 3.
- **Texto:** substituir jargão jurídico por **termos simples e diretos**, acompanhados de exemplos práticos.
- **Aceite:**
  - **Dado** um glossário de termos técnicos vetados (a definir),
  - **Quando** um label, hint ou mensagem de erro é publicado,
  - **Então** deve conter equivalente em linguagem cotidiana + pelo menos 1 exemplo prático quando exigir termo técnico inevitável.
- **Owner esperado:** UX / Legal.

### 2.2 Mobile-first (Página 4)

#### DN-RNF-002 — Design mobile-first
- **Tipo:** RNF.
- **Classificação:** CONF.
- **Fonte:** PDF pág. 4.
- **Texto:** a plataforma deve ser redesenhada **mobile-first** para atender ~92 milhões de brasileiros que acessam internet exclusivamente por celular.
- **Aceite:**
  - **Dado** um viewport ≤ 360 px,
  - **Quando** o usuário navega pelo wizard completo,
  - **Então** todos os passos são utilizáveis sem scroll horizontal, sem overlap de controles, com áreas de toque ≥ 44×44 px (WCAG 2.5.5).
- **Owner esperado:** Frontend.

#### DN-RNF-003 — Performance mobile alvo
- **Tipo:** RNF.
- **Classificação:** INF.
- **Fonte:** PDF pág. 4 (inferido do público-alvo mobile de baixa conectividade).
- **Texto:** o formulário deve carregar e permanecer usável em rede móvel de baixa velocidade.
- **Aceite:**
  - **Dado** rede simulada `Slow 3G` (400 Kbps down, 400 ms RTT),
  - **Quando** o usuário abre a tela de acolhimento,
  - **Então** LCP ≤ 4 s; TTI ≤ 6 s; primeiro passo funcional sem carregar assets não críticos.
- **Ambiguidade DEC-DN-08:** SLA de performance mobile não está declarado no PDF; owner deve fixar alvo.
- **Owner esperado:** Frontend / Arquitetura.

### 2.3 Chatbot alternativo (Página 5)

#### DN-RS-001 — Chatbot via WhatsApp como porta de entrada
- **Tipo:** RS.
- **Classificação:** PART.
- **Fonte:** PDF pág. 5.
- **Texto:** implementar chatbot via WhatsApp como interface conversacional alternativa para cidadãos com baixo letramento digital.
- **Aceite:**
  - **Dado** um cidadão que envia uma mensagem para o número oficial do MPT no WhatsApp,
  - **Quando** o bot responde,
  - **Então** o fluxo cobre acolhimento, relato guiado, evidências opcionais, sigilo/anonimato, revisão e confirmação; o resultado é registrado com o mesmo modelo de dados do formulário web.
- **Ambiguidade DEC-DN-09:** o PDF **propõe** o chatbot como estratégia, mas não fixa provedor (WhatsApp Business API, gateway parceiro), custo, LGPD dos metadados de WhatsApp nem sequenciamento com o web. Owner deve decidir escopo, roadmap (MVP × iteração futura) e provedor.
- **Owner esperado:** Produto / Segurança / DPO / Arquitetura.

### 2.4 Tela 1 — Acolhimento (Página 6)

#### DN-RF-001 — Filtro inteligente na tela de acolhimento
- **Tipo:** RF.
- **Classificação:** CONF.
- **Fonte:** PDF pág. 6.
- **Texto:** a tela inicial deve apresentar 3 caminhos:
  1. **"Denuncie"** — cidadão comum;
  2. **"Faz parte de um órgão público e quer denunciar"** — servidor/agente público;
  3. **"Tem dúvida? Fale com a Ouvidoria"** — desvio para canal de ouvidoria.
- **Aceite:**
  - **Dado** o usuário na tela de acolhimento,
  - **Quando** clica em cada opção,
  - **Então** é direcionado ao fluxo correspondente; escolha registrada como metadado da sessão; ausência de escolha bloqueia avanço.
- **Owner esperado:** Frontend / Produto.

#### DN-RF-002 — Vídeo institucional opcional
- **Tipo:** RF.
- **Classificação:** CONF.
- **Fonte:** PDF pág. 6.
- **Texto:** oferecer vídeo institucional curto (**45–60 s**), de visualização **opcional**, explicando MPT, atribuições e como denunciar.
- **Aceite:**
  - **Dado** a tela de acolhimento,
  - **Quando** o usuário decide não assistir,
  - **Então** consegue avançar sem qualquer bloqueio; o player não inicia autoplay com som; possui legendas (WCAG 1.2.2) e transcrição textual acessível.
- **Owner esperado:** Frontend / Acessibilidade.

### 2.5 Tela 2 — Relato Guiado (Página 7)

#### DN-RF-003 — Relato Guiado (checklist visual de irregularidades)
- **Tipo:** RF.
- **Classificação:** CONF.
- **Fonte:** PDF pág. 7.
- **Texto:** substituir campos de texto aberto por **checklist visual com ícones** para irregularidades (falta de EPI, assédio, atraso de salários etc.).
- **Aceite:**
  - **Dado** a tela de relato,
  - **Quando** o usuário seleciona uma ou mais categorias,
  - **Então** cada categoria fica visível como chip removível; obrigatório selecionar pelo menos 1; erro de validação exibe mensagem em linguagem simples.
- **Ambiguidade DEC-DN-10:** taxonomia oficial de irregularidades não está no PDF; owner deve fornecer/aprovar.
- **Owner esperado:** Produto / Jurídico.

#### DN-RF-004 — Descrição livre "do seu jeito" (texto ou áudio)
- **Tipo:** RF.
- **Classificação:** CONF.
- **Fonte:** PDF pág. 7.
- **Texto:** permitir que o usuário descreva os fatos **por texto ou áudio**.
- **Aceite:**
  - **Dado** a tela de relato,
  - **Quando** o usuário escolhe texto,
  - **Então** campo textarea sem limite artificial baixo; contador de caracteres não bloqueia.
  - **Quando** o usuário escolhe áudio,
  - **Então** gravador in-app funciona em navegadores modernos (Chromium, Firefox, WebKit); permissão de microfone solicitada com contexto; áudio é limitado por duração/tamanho declarados no futuro (P-F2-1).
- **Owner esperado:** Frontend.

#### DN-RS-002 — Transcrição automática de áudio
- **Tipo:** RS.
- **Classificação:** PART.
- **Fonte:** PDF pág. 7.
- **Texto:** a plataforma deve contar com **tecnologia de transcrição automática de áudio**.
- **Aceite:**
  - **Dado** um áudio submetido pelo usuário,
  - **Quando** enviado para transcrição,
  - **Então** o texto retorna com marcação temporal opcional e é anexado ao relato como campo editável pelo usuário antes do envio; o áudio original permanece anexado como evidência.
- **Ambiguidade DEC-DN-11:** o PDF exige transcrição mas não fixa provedor (Google STT, Azure Speech, on-prem, MPT-interno), retenção do áudio, tratamento de PII em fala, LGPD, custo. Owner deve decidir provedor, contrato de operação, retenção e política de correção manual pelo usuário.
- **Owner esperado:** Arquitetura / Segurança / DPO / Produto.

#### DN-RS-003 — Categorização automática e priorização
- **Tipo:** RS.
- **Classificação:** PART.
- **Fonte:** PDF pág. 7.
- **Texto:** o sistema deve realizar **categorização automática** dos relatos e **priorizar** casos conforme diretrizes institucionais do MPT.
- **Aceite:**
  - **Dado** um relato submetido,
  - **Quando** processado,
  - **Então** recebe classificação (categoria, subcategoria) e prioridade (baixa/média/alta) com registro de método (regra determinística × modelo estatístico) e versão do classificador.
- **Ambiguidade DEC-DN-12:** o PDF não define diretrizes institucionais nem se a classificação é determinística ou baseada em modelo ML; owner deve fornecer taxonomia oficial, política de auditoria de decisões automatizadas (LGPD art. 20) e revisão humana.
- **Owner esperado:** Produto / Jurídico / Arquitetura / Segurança.

### 2.6 Tela 3 — Detalhamento da ocorrência (Página 8)

#### DN-RF-005 — Nº estimado de trabalhadores envolvidos
- **Tipo:** RF.
- **Classificação:** CONF.
- **Fonte:** PDF pág. 8.
- **Texto:** solicitar **número estimado de trabalhadores envolvidos**.
- **Aceite:**
  - **Dado** a tela de detalhamento,
  - **Quando** o usuário informa faixa (ex.: 1, 2–5, 6–20, 21–100, 100+),
  - **Então** valor persiste no relato; ausência de resposta não bloqueia (opcional) — ver DEC-DN-13.
- **Ambiguidade DEC-DN-13:** obrigatoriedade não declarada no PDF; owner decide.
- **Owner esperado:** Produto.

#### DN-RF-006 — Modalidade de trabalho
- **Tipo:** RF.
- **Classificação:** CONF.
- **Fonte:** PDF pág. 8.
- **Texto:** solicitar **modalidade de trabalho** (presencial, remoto, híbrido, informal, terceirizado etc. — taxonomia oficial pendente).
- **Aceite:**
  - **Dado** a tela de detalhamento,
  - **Quando** o usuário escolhe modalidade,
  - **Então** valor persiste; obrigatoriedade e opções conforme DEC-DN-14.
- **Owner esperado:** Produto / Jurídico.

#### DN-RF-007 — Identificação de grupos vulneráveis afetados
- **Tipo:** RF.
- **Classificação:** CONF.
- **Fonte:** PDF pág. 8.
- **Texto:** permitir identificação de **grupos vulneráveis afetados** (idosos, crianças, pessoas com deficiência).
- **Aceite:**
  - **Dado** a tela de detalhamento,
  - **Quando** o usuário marca zero ou mais grupos,
  - **Então** valores persistem; nenhum campo obrigatório automático (denúncia sobre trabalhadores adultos sem vulnerabilidade específica é válida).
- **Owner esperado:** Produto.

### 2.7 Tela 4 — Evidências anexadas (Página 9)

#### DN-RF-008 — Upload de evidências multimodais
- **Tipo:** RF.
- **Classificação:** CONF.
- **Fonte:** PDF pág. 9.
- **Texto:** permitir anexar **fotos, áudios, vídeos e documentos**.
- **Aceite:**
  - **Dado** a tela de evidências,
  - **Quando** o usuário seleciona arquivos,
  - **Então** cada arquivo é validado por MIME allowlist; feedback de progresso; possibilidade de remover antes do envio; limite total configurável (a definir — DEC-DN-15).
- **Ambiguidade DEC-DN-15:** limites (tamanho por arquivo, quantidade, tamanho total) não estão no PDF. Owner deve fixar antes de F4/F6.
- **Owner esperado:** Arquitetura / Segurança.

#### DN-RF-009 — Declaração de testemunhas
- **Tipo:** RF.
- **Classificação:** CONF.
- **Fonte:** PDF pág. 9.
- **Texto:** permitir **indicar a existência de testemunhas**.
- **Aceite:**
  - **Dado** a tela de evidências,
  - **Quando** o usuário confirma existência de testemunhas,
  - **Então** aparece formulário opcional para contato/perfil da testemunha; a testemunha é tratada como sujeito LGPD independente do denunciante.
- **Ambiguidade DEC-DN-16:** dados de testemunha (nome, contato) exigem tratamento LGPD específico; owner deve fixar consentimento, retenção e escopo.
- **Owner esperado:** Segurança / DPO / Jurídico.

#### DN-RG-004 — Redução de retrabalho pela robustez das evidências
- **Tipo:** RG.
- **Classificação:** CONF.
- **Fonte:** PDF pág. 9.
- **Texto:** a coleta deve ser **robusta desde o primeiro contato**, minimizando pedidos posteriores de complementação por procuradores.
- **Aceite:**
  - **Dado** um relatório de indicadores mensal,
  - **Quando** comparado o número de solicitações de complemento antes/depois do novo leiaute,
  - **Então** o número deve tender a reduzir (KPI de negócio — meta em DEC-DN-17).
- **Owner esperado:** Produto.

### 2.8 Tela 5 — Sigilo e Anonimato (Página 10)

#### DN-RG-005 — Não compartilhamento com empregadores
- **Tipo:** RG.
- **Classificação:** CONF.
- **Fonte:** PDF pág. 10.
- **Texto:** deixar **claro que as informações fornecidas não serão compartilhadas com os empregadores**.
- **Aceite:**
  - **Dado** a tela de sigilo,
  - **Quando** exibida,
  - **Então** contém aviso destacado (nível de contraste WCAG AAA para o texto crítico) explicando o não-compartilhamento em linguagem simples; navegação para próxima etapa requer reconhecimento explícito do aviso.
- **Owner esperado:** Legal / UX.

#### DN-RF-010 — Opção de denúncia anônima
- **Tipo:** RF.
- **Classificação:** CONF.
- **Fonte:** PDF pág. 10.
- **Texto:** permitir **denúncia anônima**.
- **Aceite:**
  - **Dado** a tela de sigilo,
  - **Quando** o usuário seleciona "anônima",
  - **Então** exibe aviso claro: "o MPT não poderá entrar em contato para obter detalhes adicionais"; todos os campos identificadores subsequentes são ocultados; o metadado `anonymous=true` é persistido; nenhum e-mail/telefone é solicitado.
- **Owner esperado:** Frontend / DPO.

#### DN-RNF-004 — Privacy by design em toda a jornada
- **Tipo:** RNF.
- **Classificação:** INF.
- **Fonte:** PDF pág. 10 (inferido do princípio geral do documento).
- **Texto:** aplicar **privacy by design** — minimização de coleta, sanitização de logs, retenção limitada.
- **Aceite:**
  - **Dado** um evento operacional gerado por qualquer passo do wizard,
  - **Quando** persistido em log,
  - **Então** nenhum PII é gravado em claro; identificadores são hasheados/pseudonimizados; retenção conforme política a fixar (DEC-DN-18).
- **Owner esperado:** Segurança / DPO.

### 2.9 Tela 6 — Onde o fato ocorreu (Página 11)

#### DN-RF-011 — Local do fato (município/estado obrigatório)
- **Tipo:** RF.
- **Classificação:** CONF.
- **Fonte:** PDF pág. 11.
- **Texto:** o local (município/estado) é **obrigatório** para determinar competência de análise.
- **Aceite:**
  - **Dado** a tela de local,
  - **Quando** o usuário tenta avançar sem escolher município e estado,
  - **Então** exibe erro em linguagem simples; foco vai ao primeiro campo inválido; leitor de tela anuncia o erro (WCAG 3.3.1).
- **Owner esperado:** Frontend / Produto.

#### DN-RF-012 — Identificação da empresa opcional
- **Tipo:** RF.
- **Classificação:** CONF.
- **Fonte:** PDF pág. 11.
- **Texto:** dados de identificação da empresa (nome, referência) são **opcionais**, com instrução clara de que "se o usuário não souber, pode deixar em branco".
- **Aceite:**
  - **Dado** a tela de local,
  - **Quando** os campos de empresa estão vazios,
  - **Então** o usuário consegue avançar; hint "não sabe? pode deixar em branco" visível.
- **Owner esperado:** Frontend / UX.

### 2.10 Tela 7 — Revisão (Página 12)

#### DN-RF-013 — Revisão consolidada antes do envio
- **Tipo:** RF.
- **Classificação:** CONF.
- **Fonte:** PDF pág. 12.
- **Texto:** apresentar **vista consolidada de todas as respostas** antes do envio, permitindo edição de qualquer campo.
- **Aceite:**
  - **Dado** o usuário na tela de revisão,
  - **Quando** clica em "editar" ao lado de qualquer campo,
  - **Então** retorna ao passo correspondente sem perder os demais dados; ao voltar, o valor editado é refletido; envio só ocorre após confirmação explícita nessa tela.
- **Owner esperado:** Frontend.

### 2.11 Tela 8 — Confirmação (Página 13)

#### DN-RF-014 — Confirmação com infográfico do fluxo interno
- **Tipo:** RF.
- **Classificação:** CONF.
- **Fonte:** PDF pág. 13.
- **Texto:** ao final, apresentar **diagrama ou infográfico** explicando o caminho da denúncia dentro do MPT (análise inicial, possível investigação, como o denunciante será contatado).
- **Aceite:**
  - **Dado** o envio concluído,
  - **Quando** a tela de confirmação carrega,
  - **Então** exibe protocolo local (formato a decidir — DEC-DN-19), infográfico do fluxo, canais oficiais de acompanhamento, tempo estimado de análise (a definir — DEC-DN-20); infográfico tem descrição textual acessível.
- **Ambiguidade DEC-DN-19:** formato do protocolo (o pacote histórico cita `MPT-XXXXXXXX` gerado pelo BFF, ver [`../00-MAPA-ORIGENS.md`](00-MAPA-ORIGENS.md); PDF não define). Owner decide.
- **Ambiguidade DEC-DN-20:** SLA de análise inicial não está no PDF. Owner decide.
- **Owner esperado:** Produto / Frontend.

### 2.12 KPIs e considerações finais (Página 14)

#### DN-RG-006 — Métricas de sucesso do novo leiaute
- **Tipo:** RG.
- **Classificação:** CONF.
- **Fonte:** PDF pág. 14.
- **Texto:** o programa deve monitorar KPIs: **taxa de conclusão do formulário**, **precisão dos dados coletados**, **percepção social** sobre o MPT, **redução do retrabalho**.
- **Aceite:**
  - **Dado** telemetria de uso,
  - **Quando** consolidada trimestralmente,
  - **Então** relatório inclui as 4 métricas com baseline pré-novo-leiaute e delta pós-implantação; nenhuma métrica revela PII.
- **Ambiguidade DEC-DN-21:** baselines pré-implantação não estão declaradas. Owner decide fonte da baseline.
- **Owner esperado:** Produto / Dados.

#### DN-RS-004 — Indicadores estratégicos e alertas inteligentes
- **Tipo:** RS.
- **Classificação:** PART.
- **Fonte:** PDF pág. 14.
- **Texto:** os dados coletados devem gerar **indicadores estratégicos** e permitir **monitoramento em tempo real de pautas urgentes** (trabalho infantil, escravo) por meio de **alertas inteligentes**.
- **Aceite:**
  - **Dado** um relato classificado em pauta urgente,
  - **Quando** submetido,
  - **Então** um alerta operacional é despachado ao canal responsável em < X minutos (DEC-DN-22); alerta contém metadados agregados sem PII em canais não seguros.
- **Ambiguidade DEC-DN-22:** SLA de alerta, canal (e-mail, SIEM, plantão), lista de pautas urgentes com regras de disparo e revisão humana não estão no PDF. Owner decide.
- **Owner esperado:** Produto / Segurança / Arquitetura.

### 2.13 Metadados do documento (Página 1 e rodapé)

#### DN-RG-007 — Autoridade da fonte primária
- **Tipo:** RG.
- **Classificação:** CONF.
- **Fonte:** PDF metadata (title, modDate).
- **Texto:** este PDF (`Formulário de Denúncias MPT — Proposta de novo leiaute`, modDate `2026-03-25`) é a **fonte primária** de requisitos de UX/navegabilidade/mobile para o ciclo `denunciasnew`.
- **Aceite:**
  - **Dado** conflito entre este PDF e documentação derivada,
  - **Quando** identificado durante qualquer fase,
  - **Então** o PDF prevalece até que o owner emita decisão contrária.
- **Depende de:** P-F1-2 / DEC-DN-03 (promover PDF a Ordem 1).
- **Owner esperado:** owner do ciclo.

## 3. Requisitos derivados do código atual (obrigatoriamente ND)

Por instrução do owner ("Workspace do produto não disponível — trate requisitos derivados do código como ND" e "Não utilize nada do workspace irmão cidadania-canal-denuncias/"), os seguintes tópicos herdados de [`06-REQUIREMENTS.md`](06-REQUIREMENTS.md) permanecem **NÃO FOI POSSÍVEL DETERMINAR** nesta fase e serão reavaliados quando o owner autorizar acesso:

| Tópico | Estado nesta fase |
| --- | --- |
| Versões (Angular 22.0.5, TS 6.0.2, Express 4.22, Node ≥26) | ND |
| Comportamento atual de `diskStorage` vs `memoryStorage` (D-01) | ND |
| Contrato atual do BFF/API MPT (D-04) | ND |
| Limites atuais de upload em código | ND |
| Runtime real de CI (Node 22.22.3 × manifest ≥26, D-07) | ND |
| Cobertura atual dos testes (Vitest/Playwright/axe) | ND |
| Presença de ClamAV/Redis em produção | ND |
| Autenticação/autorização atual | ND |

## 4. Perguntas ao owner geradas em F2 (P-F2-\*)

| ID | Pergunta | Owner esperado |
| --- | --- | --- |
| **P-F2-1** | Quais os limites (duração, tamanho, formatos) permitidos para gravação de áudio in-app e para arquivos anexados? | Arquitetura / Segurança |
| **P-F2-2** | Autoriza WCAG 2.2 AA como alvo (mais forte que WCAG 2.1 do PDF)? | UX / Acessibilidade |
| **P-F2-3** | Qual a taxonomia oficial de irregularidades (DN-RF-003) e de modalidades de trabalho (DN-RF-006)? | Produto / Jurídico |
| **P-F2-4** | Chatbot WhatsApp (DN-RS-001) entra no MVP ou fica para iteração posterior? | Produto |
| **P-F2-5** | Provedor de transcrição de áudio (DN-RS-002) e política de retenção do áudio original? | Arquitetura / DPO |
| **P-F2-6** | Categorização automática (DN-RS-003) é determinística ou por ML? Política de revisão humana obrigatória? | Produto / Jurídico / Segurança |
| **P-F2-7** | Formato oficial do protocolo entregue na confirmação (DN-RF-014)? | Produto |
| **P-F2-8** | SLA de análise inicial e SLA de alerta para pautas urgentes (DN-RS-004)? | Produto / Operações |
| **P-F2-9** | Baseline pré-implantação para KPIs (DN-RG-006)? Origem e método de coleta? | Produto / Dados |
| **P-F2-10** | Tratamento LGPD de dados de testemunhas (DN-RF-009) — consentimento, retenção, minimização? | DPO / Jurídico |

## 5. Decisões pendentes criadas em F2 (DEC-DN-07..22)

| ID | Assunto | Ligada a |
| --- | --- | --- |
| DEC-DN-07 | WCAG 2.1 (PDF) × WCAG 2.2 AA (pacote) | DN-RNF-001 |
| DEC-DN-08 | SLA de performance mobile | DN-RNF-003 |
| DEC-DN-09 | Escopo/roadmap/provedor do chatbot WhatsApp | DN-RS-001 |
| DEC-DN-10 | Taxonomia oficial de irregularidades | DN-RF-003 |
| DEC-DN-11 | Provedor + retenção da transcrição de áudio | DN-RS-002 |
| DEC-DN-12 | Categorização determinística vs ML + revisão humana | DN-RS-003 |
| DEC-DN-13 | Obrigatoriedade de nº estimado de trabalhadores | DN-RF-005 |
| DEC-DN-14 | Taxonomia de modalidade de trabalho | DN-RF-006 |
| DEC-DN-15 | Limites de upload | DN-RF-008 |
| DEC-DN-16 | Tratamento LGPD de testemunhas | DN-RF-009 |
| DEC-DN-17 | Meta quantitativa de redução de retrabalho | DN-RG-004 |
| DEC-DN-18 | Política de retenção de logs | DN-RNF-004 |
| DEC-DN-19 | Formato do protocolo local | DN-RF-014 |
| DEC-DN-20 | SLA de análise inicial | DN-RF-014 |
| DEC-DN-21 | Fonte da baseline pré-implantação | DN-RG-006 |
| DEC-DN-22 | SLA e canal de alertas inteligentes | DN-RS-004 |

## 6. Estatística sumária

| Métrica | Valor |
| --- | --- |
| Requisitos criados | 24 (`DN-RF-*`: 14, `DN-RS-*`: 4, `DN-RG-*`: 7, `DN-RNF-*`: 4 — DN-RG-007 duplicado como âncora) |
| Classificação `CONF` | 19 |
| Classificação `PART` | 4 |
| Classificação `INF` | 2 |
| Classificação `ND` (delta explícito no Cap. 3) | 8 tópicos |
| Perguntas P-F2-\* geradas | 10 |
| DEC-DN-\* abertas em F2 | 16 (07 → 22) |
