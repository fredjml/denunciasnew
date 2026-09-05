import { TestBed } from '@angular/core/testing';
import { StepAcolhimento } from './step-acolhimento';

describe('StepAcolhimento', () => {
  beforeEach(async () => {
    sessionStorage.clear();
    await TestBed.configureTestingModule({ imports: [StepAcolhimento] }).compileComponents();
  });

  it('renderiza exatamente os três caminhos definidos no requisito', () => {
    const fixture = TestBed.createComponent(StepAcolhimento);
    fixture.detectChanges();
    const buttons = Array.from(
      fixture.nativeElement.querySelectorAll('[data-testid="caminho-acolhimento"]'),
    ) as HTMLButtonElement[];

    expect(buttons.map((button) => button.querySelector('.choice-title')?.textContent?.trim())).toEqual([
      'Denuncie',
      'Faz parte de um órgão público e quer denunciar',
      'Tem dúvida? Fale com a Ouvidoria',
    ]);
  });

  it('bloqueia o avanço até uma escolha ser registrada', () => {
    const fixture = TestBed.createComponent(StepAcolhimento);
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    const advance = host.querySelector('[data-testid="avancar"]') as HTMLButtonElement;

    expect(advance.disabled).toBe(true);

    (host.querySelectorAll('[data-testid="caminho-acolhimento"]')[0] as HTMLButtonElement).click();
    fixture.detectChanges();

    expect(advance.disabled).toBe(false);
    expect(sessionStorage.getItem('denunciasnew.origem_acolhimento')).toBe(JSON.stringify('CIDADAO'));
  });
});
