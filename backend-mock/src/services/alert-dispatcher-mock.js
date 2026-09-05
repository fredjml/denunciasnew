'use strict';

const logger = require('../logger');

// FATIA-DN-CP6-05/07 — mock de despacho de alerta para pautas urgentes (DEC-DN-22: canal real
// não decidido; este mock só registra a decisão em log, sem PII, sem webhook real).
//
// R-DN-03: uma classificação automatizada URGENTE nunca despacha alerta sozinha — exige
// `revisada_por_humano=true`. Como este MVP não tem interface administrativa para setar essa
// flag (P-F4-sec-3, fora de escopo), toda ocorrência URGENTE fica sempre em
// "pendente de revisão humana", nunca em "despachado" — o que é o comportamento seguro esperado
// até essa interface existir, não uma falha.
function avaliarAlerta({ protocolo, classificacao, requestId }) {
  if (classificacao.prioridade !== 'URGENTE') {
    return { despachado: false, motivo: 'PRIORIDADE_NAO_URGENTE' };
  }

  if (!classificacao.revisada_por_humano) {
    logger.warn(
      { requestId, protocolo, prioridade: classificacao.prioridade, categoria: classificacao.categoria },
      'alerta_pendente_revisao_humana'
    );
    return { despachado: false, motivo: 'AGUARDANDO_REVISAO_HUMANA' };
  }

  logger.warn(
    { requestId, protocolo, prioridade: classificacao.prioridade, categoria: classificacao.categoria },
    'alerta_despachado'
  );
  return { despachado: true, motivo: 'DESPACHADO' };
}

module.exports = { avaliarAlerta };
