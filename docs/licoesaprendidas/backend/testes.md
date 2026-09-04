# Estratégia de testes do backend

| Área | Casos mínimos |
| --- | --- |
| service | campos, payload, sigilo, protocolo determinístico |
| MPT client | configuração, multipart, token, arquivo, timeout, erro/resposta |
| ClamAV | framing, clean, threat, resposta inválida, timeout |
| upload | limite, tipo, temp, cleanup e falha parcial |
| controller | 400, 422, 201, 502, 503, threat, scanner indisponível |
| perimeter | rate limit, CORS, docs, produção fail-fast, Redis |
| contrato | OpenAPI, exemplos e compatibilidade frontend |

Adicione testes para diferenças por ambiente e para o contrato do protocolo após decisão. Live requer ambiente nomeado, dados sintéticos, owner e autorização. Registre doubles usados; mock aprovado não é live.
