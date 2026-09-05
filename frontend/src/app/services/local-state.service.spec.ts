import { TestBed } from '@angular/core/testing';
import { LocalStateService } from './local-state.service';

describe('LocalStateService', () => {
  beforeEach(() => TestBed.resetTestingModule());

  it('persiste UF e município selecionados', () => {
    const service = TestBed.inject(LocalStateService);

    service.setUf('SP');
    service.setMunicipio('São Paulo', '3550308');

    expect(service.uf()).toBe('SP');
    expect(service.municipio()).toBe('São Paulo');
    expect(service.municipioIbge()).toBe('3550308');
  });

  it('limpa o município ao trocar de UF', () => {
    const service = TestBed.inject(LocalStateService);
    service.setUf('SP');
    service.setMunicipio('São Paulo', '3550308');

    service.setUf('RJ');

    expect(service.municipio()).toBe('');
    expect(service.municipioIbge()).toBe('');
  });

  it('persiste dados opcionais da empresa', () => {
    const service = TestBed.inject(LocalStateService);

    service.setNomeEmpresa('SYN-EMPRESA-001');
    service.setEnderecoEmpresa('Rua de Teste, 123');

    expect(service.nomeEmpresa()).toBe('SYN-EMPRESA-001');
    expect(service.enderecoEmpresa()).toBe('Rua de Teste, 123');
  });
});
