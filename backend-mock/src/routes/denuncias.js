'use strict';

const express = require('express');
const multer = require('multer');
const { gerarProtocolo } = require('../services/protocolo');
const logger = require('../logger');

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 20 * 1024 * 1024 } });
const camposArquivo = upload.fields([
  { name: 'arquivo_1', maxCount: 1 },
  { name: 'arquivo_2', maxCount: 1 },
  { name: 'arquivo_3', maxCount: 1 },
  { name: 'arquivo_audio', maxCount: 1 },
]);

/**
 * POST /api/denuncias
 *
 * Envelope multipart/form-data conforme contract/openapi.yaml: campo `denuncia` com o JSON do
 * objeto Complaint + até 3 anexos (`arquivo_1..3`) e um áudio opcional (`arquivo_audio`).
 * Retorna 201 + protocolo SYN-* (mock).
 *
 * Regras aplicadas:
 * - R-DN-01: envelope de saída não vaza PII em log.
 * - R-DN-02: prioridade/classificação só são setadas server-side (nunca aceitas do cliente).
 */
router.post('/', camposArquivo, (req, res) => {
  let body;
  try {
    body = JSON.parse(req.body.denuncia || '{}');
  } catch {
    return res.status(400).json({ codigo: 'DENUNCIA_INVALIDA', mensagem: 'Campo denuncia não é um JSON válido' });
  }

  const camposObrigatorios = ['origem', 'irregularidades', 'tipo_identificacao', 'uf', 'municipio'];
  const faltando = camposObrigatorios.filter((c) => !(c in body));
  if (faltando.length > 0) {
    return res.status(400).json({
      codigo: 'CAMPO_OBRIGATORIO_AUSENTE',
      mensagem: `Campos obrigatórios ausentes: ${faltando.join(', ')}`,
      detalhes: { faltando },
    });
  }

  // R-DN-02: rejeitar campos setados só server-side vindos do cliente
  if (body.classificacao) {
    return res.status(400).json({
      codigo: 'CAMPO_NAO_ACEITO',
      mensagem: 'classificacao é definida no servidor (R-DN-02)',
    });
  }

  const protocolo = gerarProtocolo();
  const timestamp = new Date().toISOString();

  const classificacao = {
    categoria: 'GERAL',
    subcategoria: 'REVISAO_INICIAL',
    prioridade: 'BAIXA',
    metodo: 'REGRA_DETERMINISTICA',
    versao_classificador: 'mock-0.1.0',
    revisada_por_humano: false,
  };

  const arquivosRecebidos = Object.keys(req.files || {});

  logger.info(
    {
      requestId: req.requestId,
      protocolo,
      origem: body.origem,
      irregularidades_count: Array.isArray(body.irregularidades) ? body.irregularidades.length : 0,
      tipo_identificacao: body.tipo_identificacao,
      uf: body.uf,
      anexos: arquivosRecebidos,
    },
    'denuncia_aceita'
  );

  return res.status(201).json({
    protocolo,
    timestamp,
    classificacao,
  });
});

module.exports = router;
