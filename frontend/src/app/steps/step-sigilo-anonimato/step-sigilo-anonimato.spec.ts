import { TestBed } from '@angular/core/testing';
import { StepSigiloAnonimato } from './step-sigilo-anonimato';

describe('StepSigiloAnonimato', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [StepSigiloAnonimato] }).compileComponents();
  });

  it('bloqueia o avanço até confirmar o aviso e escolher uma opção', () => {
    const fixture = TestBed.createComponent(StepSigiloAnonimato);
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    const avancar = host.querySelector('[data-testid="avancar-sigilo"]') as HTMLButtonElement;

    expect(avancar.disabled).toBe(true);

    (host.querySelector('[data-testid="opcao-anonimo"]') as HTMLInputElement).click();
    fixture.detectChanges();
    expect(avancar.disabled).toBe(true);

    (host.querySelector('[data-testid="confirmar-aviso"]') as HTMLInputElement).click();
    fixture.detectChanges();

    expect(avancar.disabled).toBe(false);
  });

  it('oculta campos de contato ao escolher anônimo e mostra ao escolher identificado', () => {
    const fixture = TestBed.createComponent(StepSigiloAnonimato);
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;

    (host.querySelector('[data-testid="opcao-identificado"]') as HTMLInputElement).click();
    fixture.detectChanges();
    expect(host.querySelector('#nome-completo')).toBeTruthy();

    (host.querySelector('[data-testid="opcao-anonimo"]') as HTMLInputElement).click();
    fixture.detectChanges();
    expect(host.querySelector('#nome-completo')).toBeNull();
  });
});
