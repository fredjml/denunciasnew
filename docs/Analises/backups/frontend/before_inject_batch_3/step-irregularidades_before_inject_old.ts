import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ComplaintService } from '../../../../services/complaint.service';
import { IRREGULARIDADES, IrregularidadeOption } from '../../../../models/complaint.model';

@Component({
  selector: 'app-step-irregularidades',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './step-irregularidades.html',
  styleUrl: './step-irregularidades.css'
})
export class StepIrregularidadesComponent {
  readonly irregularidades = IRREGULARIDADES;
  readonly isRecording = signal(false);
  readonly audioRecorded = signal(false);
  readonly relatoTexto = signal('');
  readonly currentPage = signal(0);

  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];

  constructor(public svc: ComplaintService) {
    const complaint = this.svc.complaint();
    this.relatoTexto.set(complaint.relato_texto);
  }

  isSelected(id: string): boolean {
    return this.svc.complaint().irregularidades.includes(id);
  }

  toggleIrregularidade(id: string): void {
    const current = this.svc.complaint().irregularidades;
    const updated = current.includes(id)
      ? current.filter(i => i !== id)
      : [...current, id];
    this.svc.updateComplaint({ irregularidades: updated });
  }

  updateRelato(text: string): void {
    this.relatoTexto.set(text);
    this.svc.updateComplaint({ relato_texto: text });
  }

  async toggleRecording(): Promise<void> {
    if (this.isRecording()) {
      this.stopRecording();
    } else {
      await this.startRecording();
    }
  }

  private async startRecording(): Promise<void> {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('A gravação de áudio não é suportada neste navegador ou requer uma conexão segura (HTTPS).');
      }
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(stream);
      this.audioChunks = [];

      this.mediaRecorder.ondataavailable = (event) => {
        this.audioChunks.push(event.data);
      };

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        this.svc.updateComplaint({ relato_audio: audioBlob });
        this.audioRecorded.set(true);
        stream.getTracks().forEach(track => track.stop());
      };

      this.mediaRecorder.start();
      this.isRecording.set(true);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? error.message || error.name
        : String(error);
      console.error('Não foi possível acessar o microfone.');
      alert('Erro ao acessar o microfone:\n' + errorMessage);
    }
  }

  private stopRecording(): void {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
      this.isRecording.set(false);
    }
  }

  get pagedIrregularidades(): IrregularidadeOption[][] {
    const pageSize = 4;
    const pages: IrregularidadeOption[][] = [];
    for (let i = 0; i < this.irregularidades.length; i += pageSize) {
      pages.push(this.irregularidades.slice(i, i + pageSize));
    }
    return pages;
  }

  setPage(page: number): void {
    this.currentPage.set(page);
  }

  avancar(): void {
    this.svc.nextStep();
  }

  voltar(): void {
    this.svc.prevStep();
  }
}
