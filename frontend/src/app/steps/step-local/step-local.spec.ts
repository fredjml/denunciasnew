import { TestBed } from '@angular/core/testing';
import { StepLocal } from './step-local';
import { MunicipiosClientService } from '../../services/municipios-client.service';

describe('StepLocal', () => {
  const municipiosMock = {
    listar: vi.fn().mockResolvedValue([{ codigo_ibge: 'SP0001', nome: 'São Paulo', uf: 'SP' }]),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepLocal],
      providers: [{ provide: MunicipiosClientService, useValue: municipiosMock }],
    }).compileComponents();
  });

  it('bloqueia o avanço sem UF/município e exibe erro aria-live', () => {
    const fixture = TestBed.createComponent(StepLocal);
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;

    (host.querySelector('[data-testid="avancar-local"]') as HTMLButtonElement).click();
    fixture.detectChanges();

    expect(host.querySelector('[role="alert"]')?.textContent).toContain('Informe a UF');
  });

  it('carrega municípios ao escolher UF e permite avançar após selecionar', async () => {
    const fixture = TestBed.createComponent(StepLocal);
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;

    const ufSelect = host.querySelector('#uf') as HTMLSelectElement;
    ufSelect.value = 'SP';
    ufSelect.dispatchEvent(new Event('change'));
    await fixture.whenStable();
    fixture.detectChanges();

    expect(municipiosMock.listar).toHaveBeenCalledWith('SP');

    const municipioSelect = host.querySelector('#municipio') as HTMLSelectElement;
    municipioSelect.value = 'SP0001';
    municipioSelect.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    let advanced = false;
    fixture.componentInstance.advance.subscribe(() => (advanced = true));
    (host.querySelector('[data-testid="avancar-local"]') as HTMLButtonElement).click();

    expect(advanced).toBe(true);
  });
});
