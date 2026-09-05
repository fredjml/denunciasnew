import { TestBed } from '@angular/core/testing';
import { SigiloStateService } from './sigilo-state.service';

describe('SigiloStateService', () => {
  beforeEach(() => TestBed.resetTestingModule());

  it('exige confirmação explícita do aviso', () => {
    const service = TestBed.inject(SigiloStateService);

    expect(service.avisoConfirmado()).toBe(false);
    service.setAvisoConfirmado(true);
    expect(service.avisoConfirmado()).toBe(true);
  });

  it('zera dados identificadores ao escolher anônimo', () => {
    const service = TestBed.inject(SigiloStateService);

    service.setTipoIdentificacao('IDENTIFICADO');
    service.setNomeCompleto('SYN-CIDADÃO-001');
    service.setEmail('cidadao@example.com');

    service.setTipoIdentificacao('ANONIMO');

    expect(service.nomeCompleto()).toBe('');
    expect(service.email()).toBe('');
  });

  it('persiste dados de contato quando identificado', () => {
    const service = TestBed.inject(SigiloStateService);

    service.setTipoIdentificacao('IDENTIFICADO');
    service.setNomeCompleto('SYN-CIDADÃO-001');
    service.setTelefone('+55 00 00000-0000');

    expect(service.nomeCompleto()).toBe('SYN-CIDADÃO-001');
    expect(service.telefone()).toBe('+55 00 00000-0000');
  });
});
