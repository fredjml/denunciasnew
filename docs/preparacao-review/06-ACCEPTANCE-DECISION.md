# 06-ACCEPTANCE-DECISION — Passo 9 (Entregar/publicar)

## Decisão

**ENTREGAR** o escopo CP-0 a CP-5 (wizard completo: Acolhimento → Relato Guiado → Detalhamento →
Evidências → Sigilo e Anonimato → Local → Revisão → Confirmação, com envio real ao backend-mock e
protocolo `SYN-*` genuíno) como estado local do repositório, **sem publicação remota** nesta
rodada.

## O que está pronto para uso/demo

- Fluxo completo de denúncia, testável rodando `npm start` na raiz e percorrendo as 8 telas.
- Identidade visual do MPT aplicada (logo oficial, cor institucional, ícones).
- 3 decisões do owner fechadas nesta sessão (`DEC-DN-16`, `DEC-DN-20`) e uma aberta com princípio
  definido (`DEC-DN-26`).
- 1 vulnerabilidade de segurança encontrada e corrigida, com confirmação formal independente.

## O que explicitamente NÃO está incluído nesta entrega

| Item | Motivo | Quem destrava |
| --- | --- | --- |
| CP-6 (classificador + alertas mock) | Todas as fatias já bloqueadas no plano original por decisões de arquitetura nunca tomadas | Owner (provedor de classificação, canal de alerta) |
| `FATIA-DN-CP1-03` (redirect Ouvidoria) | URL real não definida | Owner/Produto |
| `FATIA-DN-CP1-05` (vídeo sem cookie de terceiro) | Decisão de hosting pendente (`DEC-DN-25`) | Owner/DPO |
| `FATIA-DN-MOBILE-03` (Lighthouse Slow 3G no CI) | SLA de performance não definido (`DEC-DN-08`) | Owner/Arquitetura |
| `FATIA-DN-CP3-02` (novos campos no contrato) | Requer PR coordenado com a equipe do backend real (`DEC-DN-26`, detalhe operacional pendente) | Owner + equipe do backend real |
| `FATIA-DN-CP4-05` (`applyAnonimizationRules()` no BFF) | É lógica do backend de produção, não do mock de teste | Equipe do backend real |
| Publicação remota (`git push`) | Não solicitada nesta sessão | Owner |

## Autorização e rastreabilidade

- Owner presente durante toda a execução; nenhuma ação de escrita fora do workspace local foi
  tomada sem confirmação implícita ou explícita do owner na conversa.
- Nenhum comando destrutivo (`git push --force`, `reset --hard`, `rm -rf`) foi usado.
- Todos os commits têm mensagem descritiva e co-autoria declarada (`Co-Authored-By: Claude
  Sonnet 5`).

## Riscos residuais aceitos para esta entrega

Ver `04-REVIEW.md` §Riscos residuais/exceções — nenhum bloqueia o escopo entregue; todos são
either (a) decisões de arquitetura fora deste MVP, ou (b) limitações de plataforma documentadas.

## Próximo gate

Antes de autorizar `CP-6` ou publicação remota, o owner precisa:

1. Decidir o detalhe operacional de `DEC-DN-26` (quando a equipe do backend real existir).
2. Decidir `DEC-DN-08` (SLA de performance) se quiser fechar `CP-mobile-perf`.
3. Fornecer a URL real da Ouvidoria e a decisão de hosting do vídeo, se quiser fechar `CP-1`
   por completo.
4. Explicitamente autorizar `git push` quando quiser publicar em `origin/main`.
