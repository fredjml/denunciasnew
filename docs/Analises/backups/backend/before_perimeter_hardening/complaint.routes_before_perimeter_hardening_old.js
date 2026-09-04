const express = require('express');
const router = express.Router();
const { upload } = require('../middleware/upload');
const { receberDenuncia } = require('../controllers/complaint.controller');

/**
 * @swagger
 * /api/denuncias:
 *   post:
 *     summary: Recebe e encaminha uma nova denúncia
 *     description: Recebe os dados do formulário (JSON) e arquivos anexos, gerando um protocolo e encaminhando para a API interna do MPT se configurada.
 *     tags: [Denúncias]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               denuncia:
 *                 type: string
 *                 description: JSON string com os dados da denúncia.
 *                 example: '{"uf": "RJ", "municipio": "Rio de Janeiro", "irregularidades": ["trabalho_escravo"], "relato_texto": "...", "tipo_identificacao": "anonimo"}'
 *               arquivo_0:
 *                 type: string
 *                 format: binary
 *                 description: Primeiro arquivo anexo (opcional).
 *     responses:
 *       201:
 *         description: Denúncia recebida com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sucesso:
 *                   type: boolean
 *                 protocolo:
 *                   type: string
 *                 mensagem:
 *                   type: string
 *                 timestamp:
 *                   type: string
 *       400:
 *         description: Dados inválidos ou campo "denuncia" malformado.
 *       422:
 *         description: Erro de validação (campos obrigatórios ausentes).
 *       502:
 *         description: A API interna do MPT não aceitou ou não pôde receber a denúncia.
 *       503:
 *         description: O serviço de recebimento está indisponível por ausência de configuração da API interna.
 */
router.post(
  '/denuncias',
  upload.any(), // aceita qualquer campo de arquivo (arquivo_0, arquivo_1, ...)
  receberDenuncia
);

/**
 * @swagger
 * /api/denuncias/info:
 *   get:
 *     summary: Obtém informações sobre os campos e limites da API
 *     tags: [Denúncias]
 *     responses:
 *       200:
 *         description: Lista de campos aceitos e tipos de arquivos permitidos.
 */
router.get('/denuncias/info', (req, res) => {
  res.json({
    servico: 'Canal de Denúncias — MPT',
    versao: '1.0.0',
    endpoint: 'POST /api/denuncias',
    contentType: 'multipart/form-data',
    campos: {
      denuncia: 'JSON string com dados do formulário (obrigatório)',
      arquivo_N: 'Arquivo anexado (opcional, máx. 10 arquivos, 20MB cada)'
    },
    tiposPermitidos: [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'audio/mpeg', 'audio/mp4', 'audio/webm', 'audio/ogg', 'audio/wav',
      'video/mp4', 'video/webm', 'video/quicktime',
      'application/pdf', 'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]
  });
});

module.exports = router;
