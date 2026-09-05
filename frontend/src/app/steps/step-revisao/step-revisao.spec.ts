import { TestBed } from '@angular/core/testing';
import { StepRevisao } from './step-revisao';
import { ComplaintSubmissionService } from '../../services/complaint-submission.service';

describe('StepRevisao', () => {
  afterEach(() => sessionStorage.clear());

  it('envia a denúncia e emite o protocolo recebido', async () => {
    const submissionMock = {
      enviar: vi.fn().mockResolvedValue({ protocolo: 'SYN-AB3D5F7K', timestamp: '2026-09-05T00:00:00Z' }),
    };
    await TestBed.configureTestingModule({
      imports: [StepRevisao],
      providers: [{ provide: ComplaintSubmissionService, useValue: submissionMock }],
    }).compileComponents();
    const fixture = TestBed.createComponent(StepRevisao);
    fixture.detectChanges();
    let recebido: unknown;
    fixture.componentInstance.enviado.subscribe((valor) => (recebido = valor));

    (fixture.nativeElement.querySelector('[data-testid="enviar-denuncia"]') as HTMLButtonElement).click();
    await fixture.whenStable();

    expect(recebido).toEqual({ protocolo: 'SYN-AB3D5F7K', timestamp: '2026-09-05T00:00:00Z' });
  });

  it('mostra o erro da API sem emitir sucesso quando a submissão falha', async () => {
    const submissionMock = {
      enviar: vi.fn().mockResolvedValue({ erro: { codigo: 'X', mensagem: 'Falha sintética de envio' } }),
    };
    await TestBed.configureTestingModule({
      imports: [StepRevisao],
      providers: [{ provide: ComplaintSubmissionService, useValue: submissionMock }],
    }).compileComponents();
    const fixture = TestBed.createComponent(StepRevisao);
    fixture.detectChanges();
    let recebido: unknown;
    fixture.componentInstance.enviado.subscribe((valor) => (recebido = valor));

    (fixture.nativeElement.querySelector('[data-testid="enviar-denuncia"]') as HTMLButtonElement).click();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(recebido).toBeUndefined();
    expect(fixture.nativeElement.querySelector('[role="alert"]')?.textContent).toContain('Falha sintética de envio');
  });
});
