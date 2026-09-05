import { TestBed } from '@angular/core/testing';
import { StepConfirmacao } from './step-confirmacao';

describe('StepConfirmacao', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [StepConfirmacao] }).compileComponents();
  });

  it('exibe o protocolo recebido', () => {
    const fixture = TestBed.createComponent(StepConfirmacao);
    fixture.componentRef.setInput('protocolo', 'SYN-AB3D5F7K');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[data-testid="protocolo"]').textContent).toContain(
      'SYN-AB3D5F7K',
    );
  });

  it('emite inicio ao clicar em Início', () => {
    const fixture = TestBed.createComponent(StepConfirmacao);
    fixture.componentRef.setInput('protocolo', 'SYN-AB3D5F7K');
    fixture.detectChanges();
    let emitiu = false;
    fixture.componentInstance.inicio.subscribe(() => (emitiu = true));

    (fixture.nativeElement.querySelector('[data-testid="voltar-inicio"]') as HTMLButtonElement).click();

    expect(emitiu).toBe(true);
  });
});
