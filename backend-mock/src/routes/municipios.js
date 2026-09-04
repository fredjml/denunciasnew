'use strict';

const express = require('express');

const router = express.Router();

/**
 * GET /api/municipios?uf=SP
 * Mock — retorna 3 municípios sintéticos por UF.
 * CP-4 (FATIA-DN-CP4-06) fará proxy real ao IBGE com fallback ao JSON local.
 */
router.get('/', (req, res) => {
  const uf = String(req.query.uf || '').toUpperCase();
  if (!/^[A-Z]{2}$/.test(uf)) {
    return res.status(400).json({
      codigo: 'UF_INVALIDA',
      mensagem: 'Parâmetro uf deve ser uma sigla de 2 letras maiúsculas',
    });
  }

  return res.status(200).json([
    { codigo_ibge: `${uf}0001`, nome: `Município Alfa (${uf})`, uf },
    { codigo_ibge: `${uf}0002`, nome: `Município Beta (${uf})`, uf },
    { codigo_ibge: `${uf}0003`, nome: `Município Gama (${uf})`, uf },
  ]);
});

module.exports = router;
