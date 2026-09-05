import { TestBed } from '@angular/core/testing';
import { StepEvidencias } from './step-evidencias';

function makeFileList(files: File[]): FileList {
  const list = files as unknown as FileList & File[];
  Object.defineProperty(list, 'item', { value: (i: number) => files[i] });
  return list;
}

describe('StepEvidencias', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [StepEvidencias] }).compileComponents();
  });

  it('permite avançar sem anexar nada (evidências são opcionais)', () => {
    const fixture = TestBed.createComponent(StepEvidencias);
    fixture.detectChanges();

    expect(
      (fixture.nativeElement.querySelector('[data-testid="avancar-evidencias"]') as HTMLButtonElement).disabled,
    ).toBe(false);
  });

  it('adiciona um PDF válido e permite removê-lo', () => {
    const fixture = TestBed.createComponent(StepEvidencias);
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    const input = host.querySelector('#evidencias-input') as HTMLInputElement;
    const file = new File(['conteudo'], 'SYN-laudo.pdf', { type: 'application/pdf' });
    Object.defineProperty(input, 'files', { value: makeFileList([file]) });

    input.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(host.querySelectorAll('.lista-arquivos li')).toHaveLength(1);

    (host.querySelector('.lista-arquivos button') as HTMLButtonElement).click();
    fixture.detectChanges();

    expect(host.querySelectorAll('.lista-arquivos li')).toHaveLength(0);
  });

  it('mostra erro para MIME não permitido', () => {
    const fixture = TestBed.createComponent(StepEvidencias);
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    const input = host.querySelector('#evidencias-input') as HTMLInputElement;
    const file = new File(['x'], 'SYN-virus.exe', { type: 'application/x-msdownload' });
    Object.defineProperty(input, 'files', { value: makeFileList([file]) });

    input.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(host.querySelector('[role="alert"]')?.textContent).toContain('não permitido');
  });

  it('permite marcar grupos vulneráveis envolvidos (opcional)', () => {
    const fixture = TestBed.createComponent(StepEvidencias);
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;

    (host.querySelectorAll('input[name="grupo-vulneravel"]')[0] as HTMLInputElement).click();
    fixture.detectChanges();

    expect(fixture.componentInstance['detalhamento'].gruposVulneraveis()).toContain('IDOSOS');
  });

  it('permite responder sim/não sobre testemunhas sem pedir nome ou contato', () => {
    const fixture = TestBed.createComponent(StepEvidencias);
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;

    (host.querySelector('[data-testid="testemunhas-sim"]') as HTMLInputElement).click();
    fixture.detectChanges();

    expect(fixture.componentInstance['state'].temTestemunhas()).toBe('SIM');
    expect(host.querySelector('input[name*="nome"]')).toBeNull();
    expect(host.querySelector('input[name*="contato"]')).toBeNull();
  });
});
