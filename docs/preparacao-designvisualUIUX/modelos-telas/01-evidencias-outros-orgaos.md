# 01 — Evidências: seção "Outros Órgãos" (proposta, não implementada)

- **Status:** rascunho — não aprovado, não implementado.
- **Referência oficial:** `docs/Prototipacao/modelo_tela_step3_evidencias.png` e PDF pág. 8
  (seção "Outros Órgãos", pergunta "Você já procurou outro órgão para denunciar este mesmo
  fato? (ex.: Sindicato, Ministério do Trabalho)" com opções Sim/Não).
- **Campos usados:** um booleano `ja_procurou_outro_orgao` (ou similar) — **gap de contrato**:
  este campo **não existe** em `contract/openapi.yaml` hoje. Não pode ser implementado sem
  antes passar pelo processo de PR de contrato (`DEC-DN-26`).
- **Navegação:** nenhuma mudança de navegação — a seção entraria dentro da tela de Evidências já
  existente, entre "Anexos (Opcional)" e os botões de ação. Não requer novo diagrama em
  `../diagramas-navegacao/`.

## Descrição do layout

Seguindo o mockup oficial, a seção ficaria:

1. Título "Outros Órgãos" (mesmo estilo de `<h2>` das demais seções da tela).
2. Texto de apoio: "Você já procurou outro órgão para denunciar este mesmo fato? (ex.:
   Sindicato, Ministério do Trabalho)".
3. Dois botões de opção lado a lado, estilo já estabelecido nesta tela para Sim/Não (radio
   customizado, ver `step-evidencias.css` — `input[type='radio']` com `appearance: none` +
   preenchimento vermelho quando marcado).

Posição: depois do dropzone de anexos, antes dos botões "Avançar"/"Voltar".

## Trade-offs considerados

Não houve rodada de variações (Fase 3) para este item — o layout do mockup já é direto o
suficiente para reaproveitar o padrão de radio Sim/Não já implementado em duas outras telas
(Sigilo e Anonimato, e a própria Evidências para "Há testemunhas?").

A única decisão em aberto é se `ja_procurou_outro_orgao` deve ser adicionado ao contrato como
campo opcional (mesmo padrão de `tem_testemunhas`) ou se a pergunta deve ser descartada do MVP
por não ter valor de triagem suficiente para justificar a mudança de contrato — isso é uma
decisão de produto, não de layout.

## Aprovação

- **Owner:** — (pendente)
- **Data:** —
- **Registro:** nenhum ainda — este arquivo existe para tornar o gap visível e citável, não
  para autorizar implementação. Abrir um `AUTORIZACAO-*.md` em `../prompts/` só depois que o
  owner decidir se o campo entra no contrato.
