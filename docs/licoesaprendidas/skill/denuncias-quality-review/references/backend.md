# Backend

Siga routes → upload → controller → service → clients. Revise validação, protocolo, status, timeout, CORS, trust proxy, rate limit/Redis, logs, Swagger e config por ambiente.

Upload atual usa disco temporário: limites, conteúdo, nome aleatório, ClamAV, cleanup, quota/concorrência e fail-open/fail-closed. Production deve preservar segredos e integração no BFF.

O BFF gera protocolo localmente; development pode aceitar indisponibilidade MPT/ClamAV. Não apresente isso como live/production. Use doubles explicitamente rotulados; rede, carga e produção exigem autorização.

