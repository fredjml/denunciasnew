'use strict';

const express = require('express');
const { upload } = require('../middleware/upload');
const { validarAnexo } = require('../services/attachment-validation');
const logger = require('../logger');

const router = express.Router();

/**
 * POST /api/evidencias
 *
 * Endpoint de teste do backend-mock para FATIA-DN-CP3-04/05/06 (upload MIME/magic-bytes +
 * ClamAV mock). NÃO faz parte de contract/openapi.yaml — a integração real de evidências com
 * o backend definitivo (de outra equipe) depende de PR de contrato coordenado (R-DN-06).
 *
 * Rejeita (422): extensão bloqueada, MIME não permitido, magic bytes divergentes do MIME
 * declarado, ou conteúdo com assinatura EICAR (mock de malware).
 */
router.post('/', (req, res) => {
  upload.array('arquivos', 10)(req, res, (err) => {
    if (err) {
      const codigo = err.code === 'LIMIT_FILE_SIZE' || err.code === 'LIMIT_FILE_COUNT'
        ? 'LIMITE_EXCEDIDO'
        : err.code || 'UPLOAD_INVALIDO';
      logger.warn({ requestId: req.requestId, codigo }, 'evidencia_rejeitada');
      return res.status(422).json({ codigo, mensagem: 'Arquivo rejeitado.' });
    }

    const arquivos = req.files || [];
    for (const arquivo of arquivos) {
      const resultado = validarAnexo(arquivo);
      if (!resultado.ok) {
        logger.warn({ requestId: req.requestId, codigo: resultado.codigo }, 'evidencia_rejeitada');
        return res.status(422).json({ codigo: resultado.codigo, mensagem: resultado.mensagem });
      }
    }

    logger.info({ requestId: req.requestId, quantidade: arquivos.length }, 'evidencias_aceitas');
    return res.status(201).json({
      aceitos: arquivos.map((arquivo) => ({ nome: arquivo.originalname, tamanho: arquivo.size })),
    });
  });
});

module.exports = router;
