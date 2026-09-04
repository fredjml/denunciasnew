# Contrato e evidência

Para campos/status, alinhe modelo/defaults/UI → FormData → upload/validação → payload/cliente MPT → Swagger → testes.

Matriz: fonte, requisito, artefato, implementação, teste/mode, resultado, evidência, entrega, owner. Offline/mock não satisfaz live; screenshot não prova contrato; arquivo local não prova publicação.

Para fluxo de anexo, percorra explicitamente: E2E UI mockado → integração BFF controlada → ClamAV clean/threat/unavailable → cliente MPT chamado ou não chamado → live autorizado, se exigido. Protocolo isolado não prova que o mesmo anexo foi escaneado e encaminhado; exija correlação sanitizada entre as etapas.

Antes de live/UI, defina evidence manifest, dados autorizados, redaction, retenção e shot list. Nunca exponha denúncia, PII, anexo, token, URL interna ou identificador privado.
