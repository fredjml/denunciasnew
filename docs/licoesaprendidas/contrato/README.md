# Contrato compartilhado frontend–BFF–MPT

Esta fronteira não pertence exclusivamente ao frontend ou backend. Toda mudança em campo/status percorre:

Complaint model/defaults/UI → ComplaintApiClient/FormData → route/upload → validateComplaint → buildComplaintPayload → mpt-api client → Swagger → testes.

## Contrato observado

- endpoint browser: POST /api/denuncias;
- content type multipart/form-data;
- denuncia: JSON string sem anexos;
- arquivo_N: zero ou mais anexos;
- BFF mínimo: UF, município e irregularidade ou relato;
- sucesso browser: HTTP 201 com protocolo string não vazio;
- erros relevantes: 400, 413, 422, 429, 502, 503;
- protocolo atual: gerado localmente no BFF, não extraído da resposta MPT.

## Checklist de mudança

- [ ] requisito/owner e compatibilidade;
- [ ] modelo TypeScript e defaults;
- [ ] formulário/revisão/acessibilidade;
- [ ] serialização e filename;
- [ ] validação servidor e mensagens;
- [ ] payload/semântica da API MPT;
- [ ] status e schema Swagger;
- [ ] logs/PII;
- [ ] testes dos dois lados, integração e E2E;
- [ ] versionamento/migração/rollback;
- [ ] documentação/env quando aplicável.

## Conflitos a decidir

Documentos sugerem “aceite + protocolo da API MPT”, enquanto o código gera protocolo antes do envio e aceita qualquer resolução do Axios. A decisão deve definir:

- fonte e unicidade do protocolo;
- o que constitui aceite;
- schema da resposta externa;
- idempotência/duplicidade;
- comportamento development;
- compatibilidade e observabilidade.

Até a decisão, não afirme que o protocolo veio da API MPT nem que um 201 de development prova aceite live.

## Testes de contrato

Use schemas/exemplos sintéticos e lint OpenAPI. Teste resposta MPT vazia/malformada/erro/timeout conforme contrato aprovado. Consumer-driven contract pode ser avaliado, mas não adicione ferramenta sem owner e benefício.

## Limitações

Swagger gerado de comentários pode divergir do runtime. Teste de contrato com mock não prova serviço real. O contrato interno da API MPT não foi fornecido neste kit.
