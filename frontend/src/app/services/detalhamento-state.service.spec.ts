import { TestBed } from '@angular/core/testing';
import { DetalhamentoStateService } from './detalhamento-state.service';

describe('DetalhamentoStateService', () => {
  beforeEach(() => TestBed.resetTestingModule());

  it('persiste nº de trabalhadores e modalidade', () => {
    const service = TestBed.inject(DetalhamentoStateService);

    service.setNumeroTrabalhadores('6-20');
    service.setModalidadeTrabalho('terceirizado');

    expect(service.numeroTrabalhadores()).toBe('6-20');
    expect(service.modalidadeTrabalho()).toBe('terceirizado');
  });

  it('alterna grupos vulneráveis sem exigir nenhum selecionado', () => {
    const service = TestBed.inject(DetalhamentoStateService);

    expect(service.gruposVulneraveis()).toEqual([]);

    service.toggleGrupoVulneravel('IDOSOS');
    expect(service.gruposVulneraveis()).toEqual(['IDOSOS']);

    service.toggleGrupoVulneravel('IDOSOS');
    expect(service.gruposVulneraveis()).toEqual([]);
  });
});
