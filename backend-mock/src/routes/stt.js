'use strict';

const express = require('express');
const logger = require('../logger');

const router = express.Router();

/**
 * POST /api/stt
 *
 * Mock de FATIA-DN-CP2-06 (SttProxy). Nunca chama provedor real (DEC-DN-P-F5-6).
 * Cenário escolhido via header `x-synthetic-stt-scenario`: CONCLUIDA (default), FALHA, TIMEOUT.
 * Corpo (áudio binário) é descartado sem log — R-DN-01 (sem PII/áudio em log).
 */
router.post('/', express.raw({ type: '*/*', limit: '15mb' }), (req, res) => {
  const scenario = req.headers['x-synthetic-stt-scenario'] || 'CONCLUIDA';

  logger.info({ requestId: req.requestId, scenario }, 'stt_mock_solicitado');

  if (scenario === 'FALHA') {
    return res.status(503).json({ status: 'FALHA', texto: '' });
  }
  if (scenario === 'TIMEOUT') {
    return res.status(200).json({ status: 'TIMEOUT', texto: '' });
  }
  return res.status(200).json({
    status: 'CONCLUIDA',
    texto: 'SYN-TRANSCRICAO: relato de teste gerado artificialmente.',
  });
});

module.exports = router;
