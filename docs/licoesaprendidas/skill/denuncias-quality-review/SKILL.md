---
name: denuncias-quality-review
description: Faz análise, triagem, planejamento ou review baseado em evidências no Canal de Denúncias Angular/Express, cobrindo contrato, QA, testes, segurança, privacidade e acessibilidade. Use ao investigar ou corrigir este projeto; não use para operar produção, publicar ou executar testes ofensivos sem autorização.
---

# Denúncias quality review

## Entradas mínimas

Pedido/achado, fonte primária e aceite, commit/ambiente, escopo de arquivos e autorização vigente. Leia primeiro cidadania-canal-denuncias/AGENTS.md e 00-mapa-origens-baseline-drift.md.

Se a fonte primária canônica não estiver identificada, registre a lacuna; código e testes descrevem comportamento, mas não substituem decisão de Produto.

## Modos

- Review/diagnóstico é somente leitura por padrão.
- Correção/implementação só ocorre quando o pedido inclui mudança.
- Falta de evidência bloqueia a entrega, mas não prova sozinha defeito do produto.
- Falha reproduzida contrariando aceite sustenta finding do produto.

## Fluxo

1. Identifique modo: análise/readiness, correção solicitada, review adversarial ou post-mortem.
2. Reabra a fonte primária e classifique fatos, inferências e lacunas.
3. Reproduza com o menor diagnóstico seguro antes de editar.
4. Mapeie fonte → requisito → artefato → implementação → teste → evidência → estado.
5. Se correção foi pedida, faça a menor fatia reversível e teste de regressão proporcional.
6. Execute validações aplicáveis e relate resultado, modo e limite separadamente.
7. Termine com findings, decisão, evidências, riscos residuais e próximo passo.

## Referências sob demanda

- Descoberta, drift e readiness: references/discovery.md.
- Angular/UI/a11y: references/frontend.md.
- Express/upload/integrações: references/backend.md.
- Mudança de campos/status ou alegação externa: references/contract-evidence.md.
- Gates, review e entrega: references/gates.md.

## Ações proibidas sem autorização específica

Instalar dependência; ler/expor secret ou PII; usar dado real; atingir serviço live; DAST/carga; ampliar upload/limite; alterar arquitetura/escopo; commit, push, PR, deploy ou exclusão. Aprovar plano não autoriza essas ações.

## Saída

Achados por severidade com arquivo/linha; confiança; requisitos afetados; proposta/diff quando autorizado; comandos e resultados reais; estados offline/live/UI/evidenciado; testes omitidos; riscos e bloqueios.

## Conclusão e parada

Concluir somente quando aceite e gates aplicáveis tiverem evidência. Parar após duas falhas iguais sem nova hipótese, três diagnósticos distintos sem progresso, conflito material de requisito ou ausência de autorização/dado/owner.

