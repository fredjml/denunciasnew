import { TestBed } from '@angular/core/testing';
import { StepRelatoGuiado } from './step-relato-guiado';

describe('StepRelatoGuiado', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [StepRelatoGuiado] }).compileComponents();
  });

  it('renderiza checklist mock e exige ao menos uma irregularidade', () => {
    const fixture = TestBed.createComponent(StepRelatoGuiado);
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;

    expect(host.querySelectorAll('input[type="checkbox"][name="irregularidade"]')).toHaveLength(3);
    expect((host.querySelector('[data-testid="avancar-relato"]') as HTMLButtonElement).disabled).toBe(true);
  });

  it('permite relato do usuário e atualiza contador', () => {
    const fixture = TestBed.createComponent(StepRelatoGuiado);
    fixture.detectChanges();
    const textarea = fixture.nativeElement.querySelector('textarea') as HTMLTextAreaElement;
    textarea.value = 'Relato SYN do seu jeito';
    textarea.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[data-testid="contador-relato"]').textContent).toContain('23');
  });

  it('exige consentimento antes de habilitar o gravador', () => {
    const fixture = TestBed.createComponent(StepRelatoGuiado);
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;

    (host.querySelector('[data-testid="usar-audio"]') as HTMLButtonElement).click();
    fixture.detectChanges();

    expect(host.querySelector('[role="dialog"]')).toBeTruthy();
    expect(host.querySelector('app-audio-recorder')).toBeNull();
  });
});
