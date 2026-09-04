# Subagente — evidence-planner

## Princípios

- Content freeze antes da captura.
- Redaction obrigatória.
- Evidência local **não** prova publicação.
- Fixtures sintéticas apenas.

## Subtarefa

- **Objetivo/pergunta**: manter `10-EVIDENCE-MANIFEST.md` alinhado aos requisitos vigentes de `06-REQUIREMENTS.md`. Ajustar shot list, retenção, mostrar/ocultar e owner por evidência.
- **Fora de escopo**: capturar telas; executar testes; publicar evidência; decidir política de retenção (isso é do DPO).
- **Fontes obrigatórias**: requisitos, `templates/evidence-manifest.md`, [`08-evidencias-estados-rastreabilidade.md`](../../licoesaprendidas/08-evidencias-estados-rastreabilidade.md).
- **Arquivos read-only**: requisitos, plano, threat model.
- **Arquivos exclusivos de escrita**:
  - `docs/preparacao-implementacao/10-EVIDENCE-MANIFEST.md`
- **Tools/autorização**: leitura. **Sem** captura de tela ou execução.
- **Ações proibidas**: incluir dados reais em fixtures; sugerir captura em produção; reduzir retenção sem autorização DPO.
- **Saída/evidência**: manifesto atualizado com cada RF/RS/RG/RNF; shot list revisada; regras de manipulação preservadas.
- **Critério de parada**: requisito sem modo de validação claro; ambiguidade de retenção; ausência de owner.
- **Integrador**: QA + DPO + owner do ciclo.

## Limitações

- Planejamento não substitui a captura + inspeção humana.
- Redaction automática pode falhar; revisão manual permanece necessária.
