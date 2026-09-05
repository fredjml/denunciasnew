import { TestBed } from '@angular/core/testing';
import { MunicipiosClientService } from './municipios-client.service';

describe('MunicipiosClientService', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('retorna a lista da API quando disponível', async () => {
    const mockResponse = [{ codigo_ibge: 'SP0001', nome: 'Município Alfa (SP)', uf: 'SP' }];
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve(mockResponse) }),
    );
    const service = TestBed.inject(MunicipiosClientService);

    const resultado = await service.listar('SP');

    expect(resultado).toEqual(mockResponse);
  });

  it('usa fallback local quando a API falha', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }));
    const service = TestBed.inject(MunicipiosClientService);

    const resultado = await service.listar('SP');

    expect(resultado.some((m) => m.nome === 'São Paulo')).toBe(true);
  });

  it('usa fallback local quando a API lança erro de rede', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network')));
    const service = TestBed.inject(MunicipiosClientService);

    const resultado = await service.listar('RJ');

    expect(resultado.some((m) => m.nome === 'Rio de Janeiro')).toBe(true);
  });
});
