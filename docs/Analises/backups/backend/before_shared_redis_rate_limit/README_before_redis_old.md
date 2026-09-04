# Canal de Denúncias — Backend

## Variáveis de Ambiente

Crie um arquivo `.env` na pasta `server/` baseado no `.env.example`:

```bash
cp .env.example .env
```

Preencha com as informações reais da API interna do MPT.

Em produção, configure também:

- `FRONTEND_URL` com a origem HTTPS exata do frontend;
- `RATE_LIMIT_WINDOW_MS` e `RATE_LIMIT_MAX` conforme a política de uso;
- `TRUST_PROXY_HOPS` com a quantidade de proxies reversos confiáveis;
- `ENABLE_API_DOCS=true` somente se a documentação Swagger precisar ser pública.

O processo recusa a inicialização em `production` quando `MPT_API_URL` ou
`FRONTEND_URL` não estão configuradas, evitando uma implantação aparentemente
saudável que não consiga receber denúncias.

## Instalação

```bash
cd server
npm install
```

## Executar em desenvolvimento

```bash
npm run dev
```

## Executar em produção

```bash
npm start
```

O servidor roda na porta `3000` por padrão (configurável via variável `PORT`).

## Endpoints

### POST /api/denuncias

Recebe uma denúncia com os dados do formulário e os arquivos anexados.

**Content-Type:** `multipart/form-data`

**Campos:**
- `denuncia` (string JSON) — Dados completos do formulário
- `arquivo_0`, `arquivo_1`, ... — Arquivos anexados (opcional)

**Resposta de sucesso (201):**

O status `201` é retornado somente depois que a API interna do MPT aceita a denúncia.

```json
{
  "sucesso": true,
  "protocolo": "MPT-12345678",
  "mensagem": "Denúncia recebida com sucesso"
}
```

**Respostas de indisponibilidade:**

- `502` — a API interna do MPT não aceitou ou não pôde receber a denúncia;
- `503` — `MPT_API_URL` não está configurada e o serviço de recebimento está indisponível.
- `429` — o limite de tentativas de envio por endereço IP foi excedido.

Nesses casos, o backend não retorna protocolo nem indica sucesso. O usuário deve
permanecer na revisão e tentar novamente mais tarde.

### GET /health

Verifica se o servidor está ativo.

### GET /api-docs

Disponível em desenvolvimento. Em produção, fica desabilitado por padrão e exige
`ENABLE_API_DOCS=true` para ser exposto.
