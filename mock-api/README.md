# mock-api

Backend mock (Express + Node.js) do MVP `denunciasnew`. **Não é o backend final.** Serve para o frontend rodar como protótipo e para publicar o contrato OpenAPI que o backend real futuro deve respeitar.

## Rodar

```powershell
npm install
npm run dev     # sobe em http://localhost:3001 com --watch
```

## Endpoints

| Método | Rota | O que faz |
| --- | --- | --- |
| `GET`  | `/health` | Health check |
| `POST` | `/api/denuncias` | Aceita `Complaint` JSON, retorna 201 + protocolo `SYN-*` |
| `GET`  | `/api/municipios?uf=SP` | Lista mock de 3 municípios sintéticos |

Contrato completo: [`../contract/openapi.yaml`](../contract/openapi.yaml).

## Regras aplicadas

- **R-DN-01**: envelope processado sem PII em log (`pino-noir`).
- **R-DN-02**: prioridade sempre server-side. Cliente enviar `classificacao` → 400.
- **R-DN-06**: contrato imutável sem PR + review.
- **R-SEC-01**: nunca log de payload real; nunca exposição de `originalUrl` em 404.

## Teste rápido (curl)

```powershell
curl.exe http://localhost:3001/health

curl.exe -X POST http://localhost:3001/api/denuncias `
  -H "Content-Type: application/json" `
  -d '{"origem":"WEB","irregularidades":[{"codigo":"FALTA_EPI"}],"tipo_identificacao":"ANONIMO","uf":"SP","municipio":"São Paulo"}'
```

Resposta esperada:

```json
{
  "protocolo": "SYN-AB3D5F7K",
  "timestamp": "2026-09-04T18:00:00.000Z",
  "classificacao": {
    "categoria": "GERAL",
    "subcategoria": "REVISAO_INICIAL",
    "prioridade": "BAIXA",
    "metodo": "REGRA_DETERMINISTICA",
    "versao_classificador": "mock-0.1.0",
    "revisada_por_humano": false
  }
}
```

## Próximas fatias

- CP-3: adicionar multer + validação MIME + magic bytes + ClamAV mock.
- CP-4: proxy real IBGE + fallback local.
- CP-6: `applyAnonimizationRules()` + Classificador mock diferenciando categorias + AlertDispatcher mock com throttle.
