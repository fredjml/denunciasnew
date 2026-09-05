import { TestBed } from '@angular/core/testing';
import { StepDetalhamento } from './step-detalhamento';

describe('StepDetalhamento', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [StepDetalhamento] }).compileComponents();
  });

  it('permite avançar sem preencher nenhum campo (tudo opcional)', () => {
    const fixture = TestBed.createComponent(StepDetalhamento);
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;

    expect((host.querySelector('[data-testid="avancar-detalhamento"]') as HTMLButtonElement).disabled).toBe(false);
  });

  it('persiste nº de trabalhadores, modalidade e grupos vulneráveis selecionados', () => {
    const fixture = TestBed.createComponent(StepDetalhamento);
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;

    const numero = host.querySelector('#numero-trabalhadores') as HTMLSelectElement;
    numero.value = '6-20';
    numero.dispatchEvent(new Event('change'));

    const grupo = host.querySelectorAll('input[name="grupo-vulneravel"]')[0] as HTMLInputElement;
    grupo.click();
    fixture.detectChanges();

    expect(fixture.componentInstance['state'].numeroTrabalhadores()).toBe('6-20');
    expect(fixture.componentInstance['state'].gruposVulneraveis()).toContain('IDOSOS');
  });

  it('emite advance ao clicar em Avançar', () => {
    const fixture = TestBed.createComponent(StepDetalhamento);
    fixture.detectChanges();
    let advanced = false;
    fixture.componentInstance.advance.subscribe(() => (advanced = true));

    (fixture.nativeElement.querySelector('[data-testid="avancar-detalhamento"]') as HTMLButtonElement).click();

    expect(advanced).toBe(true);
  });
});
