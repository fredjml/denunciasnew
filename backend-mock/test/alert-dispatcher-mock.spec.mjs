import { describe, expect, it } from 'vitest';
import dispatcherModule from '../src/services/alert-dispatcher-mock.js';

const { avaliarAlerta } = dispatcherModule;

function classificacao(overrides = {}) {
  return {
    categoria: 'IRREGULARIDADE_TRABALHISTA',
    subcategoria: 'REVISAO_INICIAL',
    prioridade: 'URGENTE',
    metodo: 'REGRA_DETERMINISTICA',
    versao_classificador: 'mock-0.2.0',
    revisada_por_humano: false,
    ...overrides,
  };
}

describe('avaliarAlerta (mock de despacho)', () => {
  it('não despacha quando a prioridade não é URGENTE', () => {
    const resultado = avaliarAlerta({
      protocolo: 'SYN-AAAAAAAA',
      classificacao: classificacao({ prioridade: 'ALTA' }),
      requestId: 'req-1',
    });

    expect(resultado).toEqual({ despachado: false, motivo: 'PRIORIDADE_NAO_URGENTE' });
  });

  it('fica pendente de revisão humana quando URGENTE sem revisada_por_humano (R-DN-03)', () => {
    const resultado = avaliarAlerta({
      protocolo: 'SYN-AAAAAAAA',
      classificacao: classificacao({ prioridade: 'URGENTE', revisada_por_humano: false }),
      requestId: 'req-1',
    });

    expect(resultado).toEqual({ despachado: false, motivo: 'AGUARDANDO_REVISAO_HUMANA' });
  });

  it('despacha somente quando URGENTE e revisada_por_humano=true', () => {
    const resultado = avaliarAlerta({
      protocolo: 'SYN-AAAAAAAA',
      classificacao: classificacao({ prioridade: 'URGENTE', revisada_por_humano: true }),
      requestId: 'req-1',
    });

    expect(resultado).toEqual({ despachado: true, motivo: 'DESPACHADO' });
  });

  it('o payload avaliado nunca contém campo de PII (só protocolo/categoria/prioridade)', () => {
    const entrada = { protocolo: 'SYN-AAAAAAAA', classificacao: classificacao(), requestId: 'req-1' };
    const camposPermitidos = ['protocolo', 'classificacao', 'requestId'];

    expect(Object.keys(entrada)).toEqual(camposPermitidos);
    expect(JSON.stringify(entrada)).not.toMatch(/@|nome_completo|telefone/i);
  });
});
