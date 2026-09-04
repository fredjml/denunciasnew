import { TestBed } from '@angular/core/testing';
import { ComplaintService } from './complaint.service';

describe('ComplaintService', () => {
  let service: ComplaintService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComplaintService);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('starts with the welcome step and empty complaint defaults', () => {
    expect(service.currentStep()).toBe(0);
    expect(service.progress()).toBe(0);
    expect(service.isSubmitting()).toBe(false);
    expect(service.isSubmitted()).toBe(false);
    expect(service.protocol()).toBe('');
    expect(service.submissionError()).toBe('');
    expect(service.complaint()).toEqual(
      expect.objectContaining({
        irregularidades: [],
        relato_texto: '',
        anexos: [],
        procurou_outro_orgao: null,
        tipo_identificacao: 'anonimo'
      })
    );
  });

  it('updates complaint data and keeps step navigation within bounds', () => {
    service.updateComplaint({ relato_texto: 'Relato de teste', uf: 'SP' });

    expect(service.complaint().relato_texto).toBe('Relato de teste');
    expect(service.complaint().uf).toBe('SP');

    service.prevStep();
    expect(service.currentStep()).toBe(0);

    service.nextStep();
    service.nextStep();
    expect(service.currentStep()).toBe(2);
    expect(service.progress()).toBe(33);

    service.goToStep(99);
    expect(service.currentStep()).toBe(2);

    service.goToStep(service.totalSteps);
    service.nextStep();
    expect(service.currentStep()).toBe(service.totalSteps);
    expect(service.progress()).toBe(100);
  });

  it('serializes the complaint and attachments as multipart data on successful submission', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({ protocolo: 'MPT-TESTE123' })
    } as unknown as Response);
    vi.stubGlobal('fetch', fetchMock);

    const attachment = new File(['evidencia'], 'evidencia.txt', { type: 'text/plain' });
    service.updateComplaint({ relato_texto: 'Relato de teste', uf: 'SP' });
    service.addAttachment({ file: attachment, type: 'document' });

    await service.submitComplaint();

    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, request] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe('/api/denuncias');
    expect(request.method).toBe('POST');
    expect(request.body).toBeInstanceOf(FormData);

    const formData = request.body as FormData;
    const serializedComplaint = JSON.parse(String(formData.get('denuncia')));
    expect(serializedComplaint).toEqual(
      expect.objectContaining({ relato_texto: 'Relato de teste', uf: 'SP' })
    );
    expect(serializedComplaint).not.toHaveProperty('anexos');
    expect(formData.get('arquivo_0')).toBeInstanceOf(File);
    expect(service.protocol()).toBe('MPT-TESTE123');
    expect(service.isSubmitted()).toBe(true);
    expect(service.isSubmitting()).toBe(false);
  });

  it('exposes a visible failure after an HTTP error without simulating success', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false } as Response));

    await service.submitComplaint();

    expect(service.protocol()).toBe('');
    expect(service.isSubmitted()).toBe(false);
    expect(service.submissionError()).toBe(
      'Não foi possível enviar sua denúncia. Verifique sua conexão e tente novamente.'
    );
    expect(service.isSubmitting()).toBe(false);
  });

  it('rejects a successful HTTP response without a valid protocol', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({ sucesso: true })
    } as unknown as Response));

    await service.submitComplaint();

    expect(service.protocol()).toBe('');
    expect(service.isSubmitted()).toBe(false);
    expect(service.submissionError()).toBe(
      'Não foi possível enviar sua denúncia. Verifique sua conexão e tente novamente.'
    );
    expect(service.isSubmitting()).toBe(false);
  });

  it('exposes a visible failure after a network error without simulating success', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Falha de rede')));

    await service.submitComplaint();

    expect(service.protocol()).toBe('');
    expect(service.isSubmitted()).toBe(false);
    expect(service.submissionError()).toBe(
      'Não foi possível enviar sua denúncia. Verifique sua conexão e tente novamente.'
    );
    expect(service.isSubmitting()).toBe(false);
  });

  it('clears the visible failure when a retry succeeds', async () => {
    const fetchMock = vi
      .fn()
      .mockRejectedValueOnce(new Error('Falha de rede'))
      .mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({ protocolo: 'MPT-RETRY123' })
      } as unknown as Response);
    vi.stubGlobal('fetch', fetchMock);

    await service.submitComplaint();
    expect(service.submissionError()).not.toBe('');

    await service.submitComplaint();

    expect(service.submissionError()).toBe('');
    expect(service.protocol()).toBe('MPT-RETRY123');
    expect(service.isSubmitted()).toBe(true);
  });
});
