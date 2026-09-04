# 📊 Relatório Técnico de Sugestões de Melhorias — UI/UX, Acessibilidade (WCAG 2.1 AA) e Validações de Formulário

**Projeto:** Canal de Denúncias MPT (Ministério Público do Trabalho)  
**Data:** 26 de Julho de 2026  
**Status:** Análise Diagnóstica e Propostas de Aprimoramento  

---

## 🎯 1. Sumário Executivo

Este documento reúne o diagnóstico técnico completo e um catálogo detalhado de **sugestões de melhorias de Interface de Usuário (UI), Experiência do Usuário (UX/Legal Design), Acessibilidade Web (WCAG 2.1 Nível AA)** e **Integridade de Validações de Formulário** para a aplicação web do Canal de Denúncias do MPT.

O objetivo deste relatório é fornecer uma folha de rota (roadmap) estruturada para que a equipe de desenvolvimento possa aprimorar a usabilidade, a segurança de dados e a inclusão digital sem impactar a arquitetura existente.

---

## ♿ 2. Acessibilidade Web (WCAG 2.1 AA) e Inclusão Digital

### 2.1. Navegação por Teclado e Foco Visível (`:focus-visible`)
* **Situação Atual:** Nem todos os componentes customizados (ex: cards de seleção de irregularidades, botões de stepper, cards de modalidade e botões de paginação) exibem anel de foco destacado ao serem navegados pela tecla `Tab`.
* **Recomendação:**
  - Implementar um estilo global de `:focus-visible` em `src/styles.css` com borda/outline de alto contraste (ex: `outline: 3px solid #1A2744; outline-offset: 2px;`).
  - Garantir que todos os elementos clicáveis que utilizam `<div>` ou `<span>` tenham `tabindex="0"` e tratadores de eventos de teclado `(keydown.enter)` e `(keydown.space)`.

### 2.2. Semântica HTML, Rótulos (`<label>`) e Associação ARIA
* **Situação Atual:** Em alguns passos do wizard (como no detalhamento de ocorrências e na busca de municípios), os campos de formulário `<input>`, `<textarea>` e `<select>` dependem apenas de placeholders visuais ou rótulos desacoplados sem a tag `<label for="...">`.
* **Recomendação:**
  - Associar rigorosamente `<label for="ID">` a cada campo de entrada para suporte nativo a leitores de tela (ex: NVDA, JAWS, VoiceOver).
  - Conectar textos de ajuda e mensagens de erro aos inputs usando `aria-describedby="msg-id"` e sinalizar estado de erro com `aria-invalid="true"`.

### 2.3. Leitores de Tela e Anúncio Dinâmico de Mudança de Estado
* **Situação Atual:** Ao avançar entre as etapas do wizard ou ao gerar o número de protocolo no envio, o leitor de tela não anuncia automaticamente a mudança de tela nem a emissão do protocolo.
* **Recomendação:**
  - Adicionar uma região `aria-live="polite"` e `role="status"` no componente principal para anunciar transições de passo (ex: *"Etapa 2 de 6: Detalhamento da Ocorrência"*).
  - Implementar movimentação automática do foco para o título `<h1>` da nova etapa no carregamento de cada subcomponente.
  - Na tela de confirmação (`confirmation`), definir `aria-live="assertive"` no elemento do protocolo para leitura imediata.

---

## 🎨 3. Experiência do Usuário (UX) & Legal Design

### 3.1. Validação Estrita do Wizard (Bloqueio de Avanço em Passos Incompletos)
* **Situação Atual:** A auditoria E2E identificou que é possível avançar por alguns passos do formulário sem selecionar categorias de irregularidades, sem descrever o relato ou sem preencher dados obrigatórios de identificação.
* **Recomendação:**
  - **Passo 1 (Irregularidades):** Exigir obrigatoriamente a seleção de ao menos 1 tipo de irregularidade OU o preenchimento descritivo do relato (mínimo de caracteres).
  - **Passo 4 (Identificação):** Caso a opção "Identificado" seja marcada, exigir obrigatoriamente o preenchimento do Nome Completo e um e-mail/telefone válido antes de habilitar o botão "Avançar".
  - **Passo 5 (Local):** Exigir a seleção da UF e o preenchimento do Município da ocorrência para liberar o botão "Revisar Denúncia".
  - Exibir alertas visuais claros em banner ou toast caso o usuário tente clicar em "Avançar" com campos pendentes.

### 3.2. Validação Científica e Formatador de CNPJ
* **Situação Atual:** A máscara atual de CNPJ aceita números fictícios ou inválidos com dígitos repetidos (ex: `11.111.111/1111-11`).
* **Recomendação:**
  - Incluir função de validação de Dígito Verificador (DV) para CNPJ no frontend e no backend.
  - Apresentar feedback em tempo real ("CNPJ válido" / "CNPJ com formato ou digito inválido") sem bloquear caso o usuário opte por denunciar entidade sem CNPJ.

### 3.3. Gestão e Upload de Anexos (Provas Documentais)
* **Situação Atual:** A zona de upload aceita a seleção visual de extensões inadequadas (como `.js` ou `.exe`), deixando a rejeição exclusivamente para a validação do backend.
* **Recomendação:**
  - Adicionar restrição client-side de atributo `accept` e validação imediata de tipo MIME/extensão no evento de seleção de arquivo.
  - Exibir barra de progresso visual para uploads de arquivos maiores (ex: vídeos ou áudios).
  - Adicionar resumo acessível da lista de arquivos anexados com botão de remoção legível por leitores de tela.

---

## 🔒 4. Segurança, Performance e Integridade de Dados

### 4.1. Alinhamento de Contrato de Dados (Frontend / BFF / Backend)
* **Recomendação:**
  - Garantir que todos os campos de entrada possuam correspondência exata de nomes no modelo TypeScript (`src/app/models/complaint.model.ts`), na montagem do `FormData` e nos Schemas de validação Express/Swagger do servidor.
  - Manter sanitização contra XSS/HTML Injection nos campos de relato de texto.

### 4.2. Tratamento de Conexão e Fallback Amigável
* **Recomendação:**
  - Tratar falhas de conexão de rede durante o envio da denúncia exibindo instruções claras de como tentar novamente sem perder os dados preenchidos no formulário (mantendo o estado via Angular Signals).

---

## 📋 5. Tabela Resumo de Sugestões por Prioridade

| Item | Componente | Descrição da Sugestão | Prioridade | Impacto |
| :--- | :--- | :--- | :--- | :--- |
| **1** | `app.html` / `styles.css` | Adicionar indicação visual de foco (`:focus-visible`) em todos os botões e cards | 🔴 Alta | Acessibilidade / WCAG |
| **2** | `step-irregularidades` | Bloquear avanço sem seleção de tema ou relato de texto | 🔴 Alta | UX / Qualidade do dado |
| **3** | `step-identificacao` | Tornar Nome e E-mail/Telefone obrigatórios se "Identificado" estiver selecionado | 🔴 Alta | Integridade de dados |
| **4** | `step-local` | Validar obrigatoriedade de UF e Município + validação lógica de CNPJ (DV) | 🟡 Média | Validação / UX |
| **5** | `step-evidencias` | Adicionar validação client-side de extensão/MIME de anexos (.pdf, .jpg, .mp3, etc) | 🟡 Média | Segurança / UX |
| **6** | `app.html` / Stepper | Implementar anúncios `aria-live` e controle de foco no `h1` ao mudar de etapa | 🟡 Média | Acessibilidade / WCAG |
| **7** | `confirmation` | Mover foco automaticamente para a mensagem de confirmação e ler o protocolo | 🟢 Baixa | Acessibilidade / UX |

---

> [!NOTE]
> Este relatório serve como documentação de referência e pode ser revisado pela equipe técnica para priorização das próximas sprints. Nenhuma alteração foi realizada no código-fonte do projeto durante esta análise.
