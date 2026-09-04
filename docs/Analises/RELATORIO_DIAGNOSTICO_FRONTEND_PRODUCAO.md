# 📊 Relatório de Diagnóstico de Prontidão para Produção do Frontend — Canal de Denúncias MPT

**Projeto:** Canal de Denúncias MPT (Ministério Público do Trabalho)  
**Data:** 26 de Julho de 2026  
**Status:** Diagnóstico Técnico de Prontidão e Matriz de Gaps para Produção  

---

## 🎯 1. Sumário Executivo

Este documento apresenta uma análise técnica aprofundada dos **requisitos e melhorias estritamente necessários para que o código-fonte do frontend (SPA Angular) possa ser implantado em ambiente de produção de forma segura, funcional, inclusiva e em conformidade com a LGPD**.

A análise revelou que, além das adequações essenciais de UI/UX e Acessibilidade Web (WCAG 2.1 AA), existem **bugs técnicos de transmissão de dados, riscos de vazamento de dados pessoais por falha de estado e fragilidades de resiliência em dispositivos móveis** que hoje impedem o lançamento seguro da plataforma em produção.

---

## 🚨 2. Impeditivos Críticos de Produção (Bugs Técnicos & Falhas de Envio — P0)

### 2.1. Descarte Silencioso do Áudio Gravado (`relato_audio`)
* **Diagnóstico no Código:** No componente `StepIrregularidadesComponent`, o usuário pode gravar um áudio do relato que é armazenado na propriedade `relato_audio` (um objeto `Blob`). No entanto, na classe de envio `ComplaintApiClient`, o código executa `JSON.stringify(complaintData)`. Como objetos `Blob` não são serializados por `JSON.stringify`, a propriedade é convertida em um JSON vazio `{}` e **o áudio nunca é anexado ao `FormData` nem transmitido ao servidor**.
* **Impacto:** O cidadão grava o relato acreditando que o MPT receberá a mídia, mas o arquivo é descartado silenciosamente.
* **Ação Corretiva:** Ajustar a serialização em `ComplaintApiClient` para converter o `Blob` em um arquivo de áudio multipart e anexá-lo ao `FormData` como uma evidência de áudio.

### 2.2. Vazamento de Dados Pessoais ao Alternar para Modo Anônimo (Falha LGPD)
* **Diagnóstico no Código:** Se o cidadão selecionar a opção "Identificado", preencher seu Nome, E-mail e Telefone, mas antes do envio alterar a opção para "Denúncia Anônima", o serviço de estado (`ComplaintService`) **preserva os dados pessoais na memória**. Ao submeter, o `JSON.stringify` transmite o Nome e E-mail no payload do servidor mesmo com o atributo `tipo_identificacao = 'anonimo'`.
* **Impacto:** Violação direta da garantia de anonimato e da Lei Geral de Proteção de Dados Pessoais (LGPD).
* **Ação Corretiva:** Implementar a limpeza imediata (`reset`) dos campos de identificação pessoal sempre que a opção de anonimato for selecionada.

---

## 📱 3. Resiliência e Experiência Operacional em Dispositivos Móveis (P1)

### 3.1. Ausência de Persistência Temporária de Rascunho (Perda de Dados)
* **Diagnóstico no Código:** Todo o estado do formulário reside exclusivamente na memória RAM da aplicação (via Angular Signals). Se o usuário estiver no 5º passo do wizard e a página for recarregada (F5), se o navegador mobile fechar por economia de memória ou se houver perda de foco, **todos os dados e anexos digitados são perdidos**.
* **Impacto:** Alta taxa de abandono do formulário por cidadãos acessando via smartphones.
* **Ação Corretiva:** Implementar salvamento automático do rascunho em `sessionStorage` (com limpeza ao enviar ou encerrar a sessão).

### 3.2. Chamadas HTTP sem Timeout (`AbortController`) e Falta de Detecção Offline
* **Diagnóstico no Código:** A função `fetch('/api/denuncias')` no `ComplaintApiClient` não possui limite de tempo de espera. Em conexões instáveis, o envio pode travar por tempo indeterminado sem apresentar erro ao usuário. Além disso, não há checagem de `navigator.onLine`.
* **Impacto:** A interface congela no estado de carregamento sem resposta.
* **Ação Corretiva:** Adicionar `AbortController` com timeout de 30 segundos e checar a conexão antes de disparar a submissão.

---

## 🎨 4. Elementos Inativos na Interface ("Controles Mortos") (P1)

### 4.1. Botão de Acessibilidade no Cabeçalho (`#btn-accessibility`)
* **Situação:** O botão no topo da página possui um ícone visual de acessibilidade, mas não possui função ou ação vinculada.
* **Ação:** Implementar o modal/menu de ajustes de acessibilidade (como alto contraste e tamanho de fonte) ou ocultá-lo temporariamente.

### 4.2. Placeholder de Vídeo Institucional (`#video-institucional`)
* **Situação:** O container do vídeo na tela inicial exibe um botão de *Play*, mas trata-se apenas de um elemento estático sem vídeo integrado.
* **Ação:** Vincular um vídeo institucional real com transcrição e Libras ou substituir por um banner informativo.

### 4.3. Cards de "Órgão Público" (`#btn-orgao-publico`) e "Ouvidoria" (`#btn-ouvidoria`)
* **Situação:** Na tela de acolhimento, estes dois cards são estáticos e não redirecionam o usuário.
* **Ação:** Adicionar as URLs/rotas de direcionamento para o canal de Ouvidoria e formulário de Órgãos Públicos.

---

## ⚖️ 5. Governança Jurídica e Privacidade LGPD (P1)

### 5.1. Consentimento e Ciência dos Termos de Privacidade
* **Situação:** O formulário de envio não apresenta caixa de confirmação ou links para os Termos de Uso e Política de Privacidade do MPT.
* **Ação:** Incluir checkbox obrigatório de ciência antes do envio final da denúncia.

---

## 📋 6. Matriz de Prontidão para Produção (Roadmap por Prioridade)

| ID | Item de Melhoria | Prioridade | Categoria | Impacto da Ausência em Produção |
| :--- | :--- | :--- | :--- | :--- |
| **P0-1** | Corrigir transmissão do Blob de áudio (`relato_audio`) no `FormData` | 🔴 Bloqueador | Bug Técnico | Áudio gravado pelo cidadão é perdido |
| **P0-2** | Limpar dados pessoais ao selecionar "Denúncia Anônima" | 🔴 Bloqueador | Privacidade LGPD | Vazamento de dados em denúncias anônimas |
| **P1-1** | Implementar anéis de foco visível (`:focus-visible`) e navegação por teclado | 🟡 Alta | Acessibilidade (WCAG) | Impedimento de uso por pessoas com deficiência motora |
| **P1-2** | Bloquear avanço em etapas do wizard sem dados obrigatórios | 🟡 Alta | Validação UX | Envio de denúncias incompletas/inválidas |
| **P1-3** | Implementar salvamento temporário de rascunho (`sessionStorage`) | 🟡 Alta | Resiliência Mobile | Perda total de dados ao recarregar página |
| **P1-4** | Adicionar timeout de 30s (`AbortController`) e detecção de rede offline | 🟡 Alta | Robustez HTTP | UI travada em conexões instáveis |
| **P1-5** | Validação de Dígito Verificador (DV) de CNPJ e obrigatoriedade de UF/Município | 🟡 Alta | Integridade de Dados | Cadastro de CNPJs fictícios ou locais vazios |
| **P1-6** | Filtro client-side de extensões permitidas no upload de anexos | 🟡 Alta | Segurança / UX | Seleção de arquivos nocivos ou incompatíveis |
| **P2-1** | Conectar ou ocultar botões e cards sem ação (Acessibilidade, Vídeo, Ouvidoria) | 🟢 Média | Interface / UX | Frustração do usuário ao clicar em botões inativos |
| **P2-2** | Incluir checkbox de aceite dos Termos de Privacidade e LGPD | 🟢 Média | Governança | Exposição jurídica institucional |

---

## 💡 7. Recomendação Executiva

A equipe técnica recomenda que o lançamento em produção seja precedido da resolução dos **itens P0 (Bloqueadores)** e **P1 (Alta Prioridade)**. O tempo estimado de desenvolvimento para cobrir a totalidade desta matriz é de **3 semanas**, garantindo um sistema resiliente, seguro, acessível e juridicamente resguardado.
