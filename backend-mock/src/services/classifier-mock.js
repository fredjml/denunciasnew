'use strict';

// FATIA-DN-CP6-01/02/04 — classificador mock determinístico (DEC-DN-12: regra determinística no
// MVP, não modelo ML). Recebe SOMENTE campos não identificadores (códigos de irregularidade e
// grupos vulneráveis) — nunca nome/e-mail/telefone (T-DN-05, R-DN-01).
const VERSAO_CLASSIFICADOR = 'mock-0.2.0';

const NIVEIS = ['BAIXA', 'MEDIA', 'ALTA', 'URGENTE'];

/**
 * @param {{ irregularidades?: Array<{codigo: string}>, grupos_vulneraveis?: string[] }} envelope
 *   Envelope já livre de PII — o chamador (rota) é responsável por nunca repassar
 *   nome_completo/email/telefone/testemunhas para esta função.
 */
function classificar(envelope) {
  const irregularidades = Array.isArray(envelope.irregularidades) ? envelope.irregularidades : [];
  const gruposVulneraveis = Array.isArray(envelope.grupos_vulneraveis) ? envelope.grupos_vulneraveis : [];

  const quantidadeIrregularidades = new Set(irregularidades.map((item) => item.codigo)).size;
  let nivel = quantidadeIrregularidades >= 3 ? 2 : quantidadeIrregularidades === 2 ? 1 : 0;
  if (gruposVulneraveis.length > 0) {
    nivel += 1;
  }
  nivel = Math.min(nivel, NIVEIS.length - 1);

  return {
    categoria: quantidadeIrregularidades > 0 ? 'IRREGULARIDADE_TRABALHISTA' : 'GERAL',
    subcategoria: 'REVISAO_INICIAL',
    prioridade: NIVEIS[nivel],
    metodo: 'REGRA_DETERMINISTICA',
    versao_classificador: VERSAO_CLASSIFICADOR,
    // Nunca setado automaticamente aqui — exige revisão humana explícita (R-DN-03), que este MVP
    // ainda não tem interface para registrar.
    revisada_por_humano: false,
  };
}

module.exports = { classificar, VERSAO_CLASSIFICADOR };
