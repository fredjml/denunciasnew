# Checklist de segurança do backend

## Perímetro

- [ ] HTTPS/TLS no edge e headers adequados;
- [ ] CORS allowlist exata; sem wildcard com credenciais;
- [ ] trust proxy igual à topologia, testado contra spoofing;
- [ ] rate limit compartilhado, fail-closed e observado;
- [ ] Swagger/erros internos desabilitados em production;
- [ ] health não revela segredo/dependência indevida.

## API/integração

- [ ] validação estrutural, tamanho e semântica;
- [ ] status e schema documentados;
- [ ] timeout/egress/DNS/SSRF;
- [ ] token em secret manager/config segura;
- [ ] resposta MPT validada conforme contrato;
- [ ] idempotência/retry/duplicidade decididos;
- [ ] logs e métricas sanitizados.

## Upload

- [ ] quantidade/tamanho total e por arquivo;
- [ ] extensão, MIME e assinatura/conteúdo;
- [ ] filename não controla path;
- [ ] temporário com permissão e quota;
- [ ] ClamAV privado, assinatura atual, StreamMaxLength e timeout;
- [ ] ameaça/indisponibilidade por ambiente;
- [ ] cleanup em sucesso, erro, abort e crash;
- [ ] proteção a zip bomb, arquivo poliglota e consumo concorrente;
- [ ] encaminhamento por streaming e backpressure.

## Supply chain/operação

- [ ] lockfile correto e npm ci;
- [ ] advisories/SBOM/licenças;
- [ ] Node/CI alinhados;
- [ ] secret scan;
- [ ] princípio de menor privilégio;
- [ ] backup/retention/incident response definidos externamente.

Mapeie requisitos OWASP ASVS aplicáveis; não declare conformidade só por preencher checklist.

