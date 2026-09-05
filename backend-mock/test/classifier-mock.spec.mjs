import { describe, expect, it } from 'vitest';
import classifierModule from '../src/services/classifier-mock.js';

const { classificar } = classifierModule;

describe('classificar (mock determinístico)', () => {
  it('classifica BAIXA com 1 irregularidade e nenhum grupo vulnerável', () => {
    const resultado = classificar({ irregularidades: [{ codigo: 'FALTA_EPI' }], grupos_vulneraveis: [] });

    expect(resultado.prioridade).toBe('BAIXA');
    expect(resultado.metodo).toBe('REGRA_DETERMINISTICA');
    expect(resultado.revisada_por_humano).toBe(false);
  });

  it('classifica MEDIA com 2 irregularidades distintas', () => {
    const resultado = classificar({
      irregularidades: [{ codigo: 'FALTA_EPI' }, { codigo: 'ASSEDIO' }],
    });

    expect(resultado.prioridade).toBe('MEDIA');
  });

  it('classifica ALTA com 3 ou mais irregularidades distintas', () => {
    const resultado = classificar({
      irregularidades: [{ codigo: 'FALTA_EPI' }, { codigo: 'ASSEDIO' }, { codigo: 'ATRASO_SALARIAL' }],
    });

    expect(resultado.prioridade).toBe('ALTA');
  });

  it('escala em +1 nível quando há grupos vulneráveis envolvidos', () => {
    const semGrupo = classificar({ irregularidades: [{ codigo: 'FALTA_EPI' }] });
    const comGrupo = classificar({ irregularidades: [{ codigo: 'FALTA_EPI' }], grupos_vulneraveis: ['CRIANCA'] });

    expect(semGrupo.prioridade).toBe('BAIXA');
    expect(comGrupo.prioridade).toBe('MEDIA');
  });

  it('classifica URGENTE no teto (3+ irregularidades + grupo vulnerável)', () => {
    const resultado = classificar({
      irregularidades: [{ codigo: 'FALTA_EPI' }, { codigo: 'ASSEDIO' }, { codigo: 'ATRASO_SALARIAL' }],
      grupos_vulneraveis: ['CRIANCA'],
    });

    expect(resultado.prioridade).toBe('URGENTE');
  });

  it('nunca marca revisada_por_humano=true automaticamente (R-DN-03)', () => {
    const resultado = classificar({
      irregularidades: [{ codigo: 'FALTA_EPI' }, { codigo: 'ASSEDIO' }, { codigo: 'ATRASO_SALARIAL' }],
      grupos_vulneraveis: ['CRIANCA'],
    });

    expect(resultado.revisada_por_humano).toBe(false);
  });

  it('não exige nenhum campo identificador — funciona só com códigos/enums (T-DN-05)', () => {
    // Nenhuma referência a nome/email/telefone é sequer possível: a função só lê os dois campos abaixo.
    const resultado = classificar({ irregularidades: [], grupos_vulneraveis: [] });

    expect(resultado.categoria).toBe('GERAL');
    expect(resultado.prioridade).toBe('BAIXA');
  });
});
