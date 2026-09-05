import { TestBed } from '@angular/core/testing';
import { AcolhimentoStateService } from './acolhimento-state.service';

describe('AcolhimentoStateService', () => {
  beforeEach(() => {
    sessionStorage.clear();
    TestBed.resetTestingModule();
  });

  it('persiste somente a origem de acolhimento selecionada', () => {
    const service = TestBed.inject(AcolhimentoStateService);

    service.select('CIDADAO');

    expect(service.selected()).toBe('CIDADAO');
    expect(sessionStorage.length).toBe(1);
    expect(sessionStorage.getItem('denunciasnew.origem_acolhimento')).toBe(JSON.stringify('CIDADAO'));
  });

  it('restaura uma escolha válida da sessão', () => {
    sessionStorage.setItem('denunciasnew.origem_acolhimento', JSON.stringify('AGENTE_PUBLICO'));

    const service = TestBed.inject(AcolhimentoStateService);

    expect(service.selected()).toBe('AGENTE_PUBLICO');
  });

  it('descarta valor de sessão inválido', () => {
    sessionStorage.setItem('denunciasnew.origem_acolhimento', JSON.stringify('VALOR_INVALIDO'));

    const service = TestBed.inject(AcolhimentoStateService);

    expect(service.selected()).toBeNull();
  });
});
