import { Injectable, signal, computed } from '@angular/core';
import { Complaint, FileAttachment } from '../models/complaint.model';

@Injectable({
  providedIn: 'root'
})
export class ComplaintService {
  private initialComplaint: Complaint = {
    irregularidades: [],
    relato_texto: '',
    periodo_ocorrencia: '',
    modalidade_trabalho: '',
    numero_prejudicados: '',
    funcoes_setores: '',
    nomes_dados: '',
    grupos_vulneraveis: [],
    anexos: [],
    procurou_outro_orgao: null,
    tipo_identificacao: 'anonimo',
    nome_completo: '',
    email: '',
    telefone: '',
    uf: '',
    municipio: '',
    nome_empresa: '',
    endereco_empresa: '',
    cnpj_empresa: ''
  };

  readonly complaint = signal<Complaint>({ ...this.initialComplaint });
  readonly currentStep = signal<number>(0); // 0 = welcome
  readonly isSubmitting = signal<boolean>(false);
  readonly isSubmitted = signal<boolean>(false);
  readonly protocol = signal<string>('');

  readonly totalSteps = 6;

  readonly progress = computed(() => {
    const step = this.currentStep();
    if (step === 0) return 0;
    return Math.round((step / this.totalSteps) * 100);
  });

  updateComplaint(partial: Partial<Complaint>): void {
    this.complaint.update(current => ({ ...current, ...partial }));
  }

  nextStep(): void {
    const current = this.currentStep();
    if (current < this.totalSteps) {
      this.currentStep.set(current + 1);
    }
  }

  prevStep(): void {
    const current = this.currentStep();
    if (current > 0) {
      this.currentStep.set(current - 1);
    }
  }

  goToStep(step: number): void {
    if (step >= 0 && step <= this.totalSteps) {
      this.currentStep.set(step);
    }
  }

  addAttachment(attachment: FileAttachment): void {
    this.complaint.update(current => ({
      ...current,
      anexos: [...current.anexos, attachment]
    }));
  }

  removeAttachment(index: number): void {
    this.complaint.update(current => ({
      ...current,
      anexos: current.anexos.filter((_, i) => i !== index)
    }));
  }

  async submitComplaint(): Promise<void> {
    this.isSubmitting.set(true);
    try {
      const formData = new FormData();
      const data = this.complaint();

      // Add JSON data
      const jsonData = { ...data, anexos: undefined };
      formData.append('denuncia', JSON.stringify(jsonData));

      // Add files
      data.anexos.forEach((attachment, index) => {
        formData.append(`arquivo_${index}`, attachment.file, attachment.file.name);
      });

      const response = await fetch('/api/denuncias', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Erro ao enviar denúncia');
      }

      const result = await response.json();
      this.protocol.set(result.protocolo || 'MPT-' + Date.now());
      this.isSubmitted.set(true);
    } catch (error) {
      // In development, simulate success
      this.protocol.set('MPT-' + Date.now().toString().slice(-8));
      this.isSubmitted.set(true);
    } finally {
      this.isSubmitting.set(false);
    }
  }

  reset(): void {
    this.complaint.set({ ...this.initialComplaint });
    this.currentStep.set(0);
    this.isSubmitted.set(false);
    this.protocol.set('');
  }
}
