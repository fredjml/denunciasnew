'use strict';

const express = require('express');
const { gerarProtocolo } = require('../services/protocolo');
const logger = require('../logger');

const router = express.Router();

/**
 * POST /api/denuncias
 *
 * MVP mock: aceita application/json (multipart adicionado em CP-3).
 * Retorna 201 + protocolo SYN-*.
 *
 * Regras aplicadas:
 * - R-DN-01: envelope de saída não vaza PII em log.
 * - R-DN-02: prioridade só é setada server-side (nunca aceita do cliente).
 * - Classificação mock determinística: sempre BAIXA + REGRA_DETERMINISTICA.
 */
router.post('/', express.json({ limit: '1mb' }), (req, res) => {
  const body = req.body || {};

  // Validação mínima (schema completo virá em CP-3 via zod)
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

  logger.info(
    {
      requestId: req.requestId,
      protocolo,
      origem: body.origem,
      irregularidades_count: Array.isArray(body.irregularidades) ? body.irregularidades.length : 0,
      tipo_identificacao: body.tipo_identificacao,
      uf: body.uf,
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
