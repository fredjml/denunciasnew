# Canal de Denúncias — Backend

## Variáveis de Ambiente

Crie um arquivo `.env` na pasta `server/` baseado no `.env.example`:

```bash
cp .env.example .env
```

Preencha com as informações reais da API interna do MPT.

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
```json
{
  "sucesso": true,
  "protocolo": "MPT-12345678",
  "mensagem": "Denúncia recebida com sucesso"
}
```

### GET /health

Verifica se o servidor está ativo.
