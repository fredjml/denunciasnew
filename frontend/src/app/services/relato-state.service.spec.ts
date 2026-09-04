import { TestBed } from '@angular/core/testing';
import { RelatoStateService } from './relato-state.service';

describe('RelatoStateService', () => {
  beforeEach(() => TestBed.resetTestingModule());

  it('adiciona e remove irregularidades sem duplicar', () => {
    const service = TestBed.inject(RelatoStateService);
    service.toggleIrregularidade('FALTA_EPI');
    service.toggleIrregularidade('FALTA_EPI');
    service.toggleIrregularidade('ASSEDIO');

    expect(service.irregularidades()).toEqual(['ASSEDIO']);
  });

  it('remove caracteres de controle do relato sem executar HTML', () => {
    const service = TestBed.inject(RelatoStateService);
    service.setRelato('Texto\u0000 <script>alert(1)</script>');

    expect(service.relato()).not.toContain('\u0000');
    expect(service.relato()).toContain('<script>alert(1)</script>');
  });

  it('marca a transcrição como editada manualmente', () => {
    const service = TestBed.inject(RelatoStateService);
    service.setTranscricao('Transcrição SYN inicial', 'CONCLUIDA');
    service.editTranscricao('Transcrição SYN revisada');

    expect(service.transcricao()).toBe('Transcrição SYN revisada');
    expect(service.transcricaoStatus()).toBe('EDITADA_MANUALMENTE');
  });
});
