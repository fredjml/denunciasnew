# Verificação — Alinhamento visual com o PDF (sessão 2026-09-05)

> Auditoria da sessão que respondeu à pergunta do owner: "a interface está completamente
> diferente do PDF `Documento externo-outros 010970.2026.pdf`". Owner: Frederico José Monteiro
> Leite.

## 1. Diagnóstico

Reli o PDF completo (15 páginas, incluindo os mockups mobile). Confirmado: a interface
implementada em CP-0..CP-3 é HTML acessível funcional, sem nenhuma identidade visual (cor
institucional, header, navegação por abas, ícones). Isso **não é uma regressão** — nenhum
checkpoint até então incluía uma fatia de "design visual"; os deltas de requisitos e o plano de
implementação descrevem comportamento e critérios de aceite, não o layout pixel a pixel. O gap
é real e a reclamação do owner procede.

## 2. Achado de conformidade (resolvido com o owner antes de codar)

A página 8 do PDF mostra um campo de texto livre **"Nomes e Dados" com selo "DADOS SIGILOSOS"**
na tela de Detalhamento, para o usuário informar nomes/e-mails de terceiros. Esse campo:

- **não está em `06-REQUIREMENTS.delta-denunciasnew.md`** (DN-RF-005..007 não o mencionam);
- colide com **`DEC-DN-16`** (tratamento LGPD de testemunhas), que está **bloqueada** e impede
  `FATIA-DN-CP3-07`.

Perguntei ao owner antes de implementar. Decisão: **reproduzir o layout da tela sem esse campo**
até `DEC-DN-16` ser resolvida. Nenhum campo de coleta de PII de terceiro foi adicionado.

## 3. O que foi alterado

| Área | Mudança |
| --- | --- |
| `frontend/src/styles/tokens.css` | Paleta trocada de azul genérico para o vermelho institucional do MPT (`--color-primary: #8c1d2c` e variações), conforme cor observada no mockup. |
| `frontend/src/app/shared/icon.ts` (novo) | Componente `<app-icon>` com 13 ícones inline SVG (sem biblioteca externa — nenhuma dependência nova instalada), usados em todas as telas. |
| `frontend/src/app/app.ts` / `app.html` / `app.css` | Shell persistente novo: header vermelho com marca "MPT" + botão de ajuda, navegação por abas (Acolhimento/Relato/Empresa/Revisão — as duas últimas visíveis mas ainda não implementadas, CP-4/CP-5), barra de progresso segmentada dentro da aba Relato. |
| `step-acolhimento` | Título alterado para "Denuncie ao MPT" (texto do mockup); os 3 caminhos viraram cards com ícone (megafone/prédio/balão de fala) em vez de cards só de texto. |
| `step-relato-guiado` | Reordenado para bater com o mockup: descrição "do seu jeito" com botão de microfone embutido no campo de texto, depois o checklist de irregularidades como cards horizontais com ícone (usando o campo `icone` que já existia em `taxonomia-mock.json` mas nunca era renderizado), botões "Avançar"/"Voltar". |
| `step-detalhamento` | Layout em seções com ícone (relógio "Relato", pessoas "Trabalhadores prejudicados"); adicionados os campos **"Período da ocorrência"** e **"Funções ou setores afetados"** (novos no mockup, sem conflito de PII/LGPD); removido "grupos vulneráveis" desta tela. |
| `step-evidencias` | "Há grupos vulneráveis envolvidos?" movido para cá (é onde o mockup realmente mostra esse bloco, não em Detalhamento); dropzone tracejada com ícone de upload, lista de anexos com ícone de lixeira. |
| Navegação "Voltar" | Adicionada em Relato Guiado, Detalhamento e Evidências (existia só "Avançar" antes). |
| `frontend/e2e/accessibility.spec.ts`, `detalhamento-evidencias.spec.ts` | Ajustados para clicar no card do checklist (agora com checkbox visualmente oculto) em vez do input bruto. |

## 4. Verificação visual real

Além dos testes automatizados, subi a aplicação (`npm start`) e capturei screenshots reais das
4 telas com Playwright (mobile, Pixel 5) para conferência visual manual — não apenas testes
verdes. Confirmado visualmente: header vermelho, abas, ícones, cards e botões batem com o
padrão do mockup nas 4 telas que já existem no código (Acolhimento, Relato, Detalhamento,
Evidências).

## 5. Evidência automatizada

| Comando | Resultado |
| --- | --- |
| `npm run lint` | 0 erros |
| `npm run build` | sem erros |
| `npm test` | frontend 39/39 · backend-mock 13/13 |
| `npx playwright test` | 10/10 (incluindo axe-core no wizard completo) |
| `git diff --check` | sem avisos |

## 6. O que NÃO foi feito (fora do escopo desta rodada)

- **Sigilo e Anonimato, Empresa/Local, Revisão, Confirmação**: essas telas do mockup (páginas
  10–13) ainda não existem no código — são escopo de CP-4 e CP-5, não autorizados ainda. As abas
  "Empresa" e "Revisão" já aparecem no header (fiéis ao mockup), mas desabilitadas/inativas.
- **Logo oficial do MPT**: não tenho o arquivo de marca oficial (SVG/PNG). Usei um ícone
  genérico de escudo + texto "MPT" como aproximação. Quando o owner fornecer o arquivo de logo
  oficial, é uma troca simples no header.
- **Chatbot WhatsApp**: fora de escopo do MVP (DEC-DN-09, não decidido).
- **Campo "Nomes e Dados" da tela de Detalhamento**: omitido por decisão do owner (ver §2), até
  `DEC-DN-16`.

## 7. Próximos passos

1. Quando `DEC-DN-16` for decidida, revisitar se o campo de nomes/dados de testemunha entra na
   tela de Detalhamento (como no mockup) ou continua isolado em um subformulário com consentimento
   próprio (`FATIA-DN-CP3-07`).
2. Obter o arquivo de logo oficial do MPT para substituir o ícone placeholder do header.
3. Ao autorizar CP-4/CP-5, aplicar o mesmo padrão visual (tokens, `<app-icon>`, shell) já
   estabelecido nesta sessão às novas telas (Sigilo, Empresa/Local, Revisão, Confirmação).
