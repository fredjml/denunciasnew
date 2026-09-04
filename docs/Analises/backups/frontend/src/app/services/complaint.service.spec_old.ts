import { TestBed } from '@angular/core/testing';
import { ComplaintService } from './complaint.service';

describe('ComplaintService', () => {
  let service: ComplaintService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComplaintService);
  });

  it('starts with the welcome step and empty complaint defaults', () => {
    expect(service.currentStep()).toBe(0);
    expect(service.progress()).toBe(0);
    expect(service.isSubmitting()).toBe(false);
    expect(service.isSubmitted()).toBe(false);
    expect(service.protocol()).toBe('');
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
});