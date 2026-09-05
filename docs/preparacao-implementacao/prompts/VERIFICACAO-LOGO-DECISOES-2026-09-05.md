# Verificação — Logo oficial + decisões DEC-DN-16/20/26 (sessão 2026-09-05)

> Owner: Frederico José Monteiro Leite.

## 1. Logo oficial do MPT

- Arquivo recebido pelo owner (`logo_padrao.png`, vermelho sobre fundo transparente) copiado
  para `frontend/public/brand/logo-mpt.png` (servido em `/brand/logo-mpt.png`).
- **Ajuste necessário:** o header da aplicação era vermelho (`--color-primary`). Como o logo é
  vermelho sobre transparente, colocá-lo direto sobre o header vermelho o deixaria praticamente
  invisível. Troquei o fundo do header para branco (`--color-bg`), mantendo o vermelho como cor
  de destaque nas abas, na barra de progresso e nos botões — o logo agora tem contraste correto.
- Verificado visualmente em mobile (Pixel 5) e desktop (1440×900): logo legível e proporcional
  nos dois.
- `frontend/src/app/app.ts`: removida a importação/uso do ícone placeholder (`shield-lock`) do
  header, agora substituído pela `<img>` real.

## 2. Decisões do owner registradas

Três decisões que estavam pendentes foram respondidas pelo owner nesta sessão e estão agora
formalizadas em `12-DECISIONS.delta-denunciasnew.md`:

| Decisão | Resposta do owner | Ação tomada |
| --- | --- | --- |
| `DEC-DN-16` (testemunhas) | Só "há testemunhas? sim/não", sem nome/contato | **Implementado.** Novo toggle Sim/Não em Evidências (`EvidenciasStateService.temTestemunhas`), enviado ao contrato como `testemunhas: [{ tem_testemunhas: true\|false }]` — formato que o contrato já suportava. `FATIA-DN-CP3-07` sai de BLOQUEADA para IMPLEMENTADA. |
| `DEC-DN-20` (SLA) | Não prometer prazo | **Nenhuma mudança de código** — a tela de confirmação já não promete prazo. `FATIA-DN-CP5-07` passa de BLOQUEADA para DESCARTADA (só reabre com SLA formal). |
| `DEC-DN-26` (novo — processo de contrato) | Todo PR de `contract/openapi.yaml` passa por revisão das duas equipes | **Princípio fechado, detalhe operacional pendente** (repositório/aprovadores só quando a equipe do backend real for identificada). |

## 3. Evidência

| Comando | Resultado |
| --- | --- |
| `npm run lint` | 0 erros |
| `npm test` | frontend: 67/67 (+3 desde a última rodada) |
| `npm run build` | sem erros |
| `npx playwright test` | 11/11, incluindo axe-core no wizard completo (nova pergunta de testemunhas não introduziu violação) |
| `git diff --check` | sem avisos |

## 4. Próximos passos

1. Nenhuma pendência de código relacionada a `DEC-DN-16`/`DEC-DN-20` — ambas fechadas.
2. `DEC-DN-26`: quando a equipe do backend real for identificada, definir com eles onde e como
   revisar mudanças de contrato (repositório compartilhado, CODEOWNERS, etc.).
3. Restam como próximos blocos, quando quiser avançar: CP-6 (classificador + alertas, todas as
   fatias bloqueadas por decisões de arquitetura ainda não tomadas) e CP-a11y-alvo/CP-mobile-perf.
