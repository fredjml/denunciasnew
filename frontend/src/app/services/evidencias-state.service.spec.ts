import { TestBed } from '@angular/core/testing';
import { EvidenciasStateService, MAX_ARQUIVOS, MAX_TAMANHO_BYTES } from './evidencias-state.service';

function makeFile(name: string, type: string, size: number): File {
  const blob = new Blob([new Uint8Array(size)], { type });
  return new File([blob], name, { type });
}

describe('EvidenciasStateService', () => {
  beforeEach(() => {
    sessionStorage.clear();
    TestBed.resetTestingModule();
  });

  it('aceita arquivo PDF/JPG/PNG dentro do limite', () => {
    const service = TestBed.inject(EvidenciasStateService);

    service.adicionar([makeFile('SYN-laudo.pdf', 'application/pdf', 1024)]);

    expect(service.arquivos()).toHaveLength(1);
    expect(service.erros()).toEqual([]);
  });

  it('rejeita MIME não permitido', () => {
    const service = TestBed.inject(EvidenciasStateService);

    service.adicionar([makeFile('SYN-malicioso.exe', 'application/x-msdownload', 1024)]);

    expect(service.arquivos()).toHaveLength(0);
    expect(service.erros()[0]).toContain('não permitido');
  });

  it('rejeita arquivo acima do limite de tamanho', () => {
    const service = TestBed.inject(EvidenciasStateService);

    service.adicionar([makeFile('SYN-grande.png', 'image/png', MAX_TAMANHO_BYTES + 1)]);

    expect(service.arquivos()).toHaveLength(0);
    expect(service.erros()[0]).toContain('20 MB');
  });

  it('rejeita além do limite de quantidade de arquivos', () => {
    const service = TestBed.inject(EvidenciasStateService);
    const arquivos = Array.from({ length: MAX_ARQUIVOS + 1 }, (_, i) =>
      makeFile(`SYN-${i}.pdf`, 'application/pdf', 10),
    );

    service.adicionar(arquivos);

    expect(service.arquivos()).toHaveLength(MAX_ARQUIVOS);
    expect(service.erros()[0]).toContain(`Limite de ${MAX_ARQUIVOS}`);
  });

  it('remove arquivo pelo nome', () => {
    const service = TestBed.inject(EvidenciasStateService);
    service.adicionar([makeFile('SYN-laudo.pdf', 'application/pdf', 10)]);

    service.remover('SYN-laudo.pdf');

    expect(service.arquivos()).toHaveLength(0);
  });

  it('persiste apenas sim/não para testemunhas, sem nome ou contato', () => {
    const service = TestBed.inject(EvidenciasStateService);

    expect(service.temTestemunhas()).toBe('');

    service.setTemTestemunhas('SIM');
    expect(service.temTestemunhas()).toBe('SIM');

    service.setTemTestemunhas('NAO');
    expect(service.temTestemunhas()).toBe('NAO');
  });
});
