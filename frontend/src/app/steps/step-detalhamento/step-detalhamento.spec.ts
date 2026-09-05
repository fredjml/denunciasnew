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

  it('persiste período, nº de trabalhadores, modalidade e funções/setores', () => {
    const fixture = TestBed.createComponent(StepDetalhamento);
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;

    const periodo = host.querySelector('#periodo-ocorrencia') as HTMLInputElement;
    periodo.value = 'Desde jan/2026';
    periodo.dispatchEvent(new Event('input'));

    const numero = host.querySelector('#numero-trabalhadores') as HTMLSelectElement;
    numero.value = '6-20';
    numero.dispatchEvent(new Event('change'));

    fixture.detectChanges();

    expect(fixture.componentInstance['state'].periodoOcorrencia()).toBe('Desde jan/2026');
    expect(fixture.componentInstance['state'].numeroTrabalhadores()).toBe('6-20');
  });

  it('emite advance ao clicar em Avançar e voltar ao clicar em Voltar', () => {
    const fixture = TestBed.createComponent(StepDetalhamento);
    fixture.detectChanges();
    let advanced = false;
    let voltou = false;
    fixture.componentInstance.advance.subscribe(() => (advanced = true));
    fixture.componentInstance.voltar.subscribe(() => (voltou = true));

    fixture.nativeElement.querySelector('[data-testid="avancar-detalhamento"]').click();
    fixture.nativeElement.querySelector('.secondary-action').click();

    expect(advanced).toBe(true);
    expect(voltou).toBe(true);
  });
});
