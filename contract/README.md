# Contrato compartilhado — `denunciasnew`

Este diretório contém o **contrato OpenAPI 3.1** entre o frontend Angular (`app/`) e qualquer backend que respeite o mesmo formato — hoje é o `mock-api/`, amanhã será o backend real feito por outra equipe.

## Fonte de verdade

`openapi.yaml` é a **única** fonte de verdade. Ele define:

- Endpoints (`POST /api/denuncias`, `GET /api/municipios`, `GET /health`).
- Schemas (`Complaint`, `Classificacao`, `Municipio`, `DenunciaAceita`, `Irregularidade`, `Testemunha`, `ErroApi`).
- Constraints (formatos, enums, pattern do protocolo `SYN-*`, limites de tamanho).
- Servidores (mock local, preview Vercel, produção futura).

## Regras (`R-DN-06`)

1. **Mudanças exigem PR + review.** Não editar diretamente em `main`.
2. **O backend real futuro pode ACRESCENTAR campos**, mas nunca **REMOVER** os declarados.
3. **`app/src/app/api/generated.ts` é AUTOGERADO** por `openapi-typescript` a partir deste arquivo. Nunca editar manualmente.
4. **CI valida drift** (`.github/workflows/contract-drift.yml`) — se `generated.ts` estiver defasado, falha.
5. **Toda mudança de contrato deve gerar changelog** aqui em `CHANGELOG.md` (a criar quando primeira alteração acontecer).

## Como validar localmente

```powershell
npx @redocly/cli lint contract/openapi.yaml
# ou
npx @apidevtools/swagger-cli validate contract/openapi.yaml
```

## Como regenerar tipos TypeScript

```powershell
npx openapi-typescript contract/openapi.yaml --output app/src/app/api/generated.ts
```

## Convenções

- **Prefixo de operação:** verbo em português + substantivo (`submeterDenuncia`, `listarMunicipios`).
- **Tag por domínio:** `denuncias`, `localidades`, `operacao`.
- **Enums em MAIÚSCULAS_COM_UNDERSCORE.**
- **Datas em ISO 8601** (`format: date-time`).
- **PII marcada** no `description` do schema.
- **Códigos HTTP:** 201 (aceita), 400 (validação), 413 (tamanho), 422 (antimalware/MIME), 429 (rate limit).

## Ligação com deltas de planejamento

Este contrato reflete as decisões técnicas dos deltas:

- [../docs/preparacao-implementacao/06-REQUIREMENTS.delta-denunciasnew.md](../docs/preparacao-implementacao/06-REQUIREMENTS.delta-denunciasnew.md) — origem de cada campo
- [../docs/preparacao-implementacao/08-TDD.delta-denunciasnew.md](../docs/preparacao-implementacao/08-TDD.delta-denunciasnew.md) — contratos §D3
- [../docs/preparacao-implementacao/09-THREAT-MODEL.delta-denunciasnew.md](../docs/preparacao-implementacao/09-THREAT-MODEL.delta-denunciasnew.md) — controles de PII e HMAC
- [../docs/preparacao-implementacao/12-DECISIONS.delta-denunciasnew.md](../docs/preparacao-implementacao/12-DECISIONS.delta-denunciasnew.md) — decisões de formato (protocolo `SYN-*`, WCAG 2.2 AA, etc.)
