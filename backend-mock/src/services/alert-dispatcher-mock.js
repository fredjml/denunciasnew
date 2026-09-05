'use strict';

const logger = require('../logger');

// FATIA-DN-CP6-06 — janela deslizante simples para evitar rajada de despachos (ex.: revisão
// humana em lote setando várias URGENTEs de uma vez). Estado em memória do processo: aceitável
// para um mock de instância única; um canal real (DEC-DN-22) precisará de um limitador
// compartilhado (Redis, etc.) se rodar em múltiplas instâncias.
const JANELA_MS = 60_000;
const LIMITE_POR_JANELA = 5;
let despachosNaJanela = [];

function despachosPermitidos(agora) {
  despachosNaJanela = despachosNaJanela.filter((timestamp) => agora - timestamp < JANELA_MS);
  return despachosNaJanela.length < LIMITE_POR_JANELA;
}

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

  const agora = Date.now();
  if (!despachosPermitidos(agora)) {
    logger.warn(
      { requestId, protocolo, prioridade: classificacao.prioridade, categoria: classificacao.categoria },
      'alerta_limitado_por_taxa'
    );
    return { despachado: false, motivo: 'LIMITE_DE_TAXA_EXCEDIDO' };
  }

  despachosNaJanela.push(agora);
  logger.warn(
    { requestId, protocolo, prioridade: classificacao.prioridade, categoria: classificacao.categoria },
    'alerta_despachado'
  );
  return { despachado: true, motivo: 'DESPACHADO' };
}

function _resetParaTeste() {
  despachosNaJanela = [];
}

module.exports = { avaliarAlerta, _resetParaTeste };
