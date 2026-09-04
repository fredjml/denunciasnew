import { Component, signal, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ComplaintService } from '../../../../services/complaint.service';
import { FileAttachment } from '../../../../models/complaint.model';

@Component({
  selector: 'app-step-evidencias',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './step-evidencias.html',
  styleUrl: './step-evidencias.css'
})
export class StepEvidenciasComponent implements OnDestroy {
  gruposVulneraveis = signal<string[]>([]);
  procurouOutroOrgao = signal<boolean | null>(null);

  constructor(public svc: ComplaintService) {
    const c = this.svc.complaint();
    this.gruposVulneraveis.set([...c.grupos_vulneraveis]);
    this.procurouOutroOrgao.set(c.procurou_outro_orgao);
  }

  isGrupoSelected(grupo: string): boolean {
    return this.gruposVulneraveis().includes(grupo);
  }

  toggleGrupo(grupo: string): void {
    const current = this.gruposVulneraveis();
    const updated = current.includes(grupo)
      ? current.filter(g => g !== grupo)
      : [...current, grupo];
    this.gruposVulneraveis.set(updated);
  }

  setOrgao(value: boolean): void {
    this.procurouOutroOrgao.set(value);
  }

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;
    Array.from(input.files).forEach(file => {
      const attachment: FileAttachment = {
        file,
        type: this.getFileType(file)
      };
      if (attachment.type === 'image') {
        const reader = new FileReader();
        reader.onload = e => {
          attachment.preview = e.target?.result as string;
        };
        reader.readAsDataURL(file);
      }
      this.svc.addAttachment(attachment);
    });
    input.value = '';
  }

  private getFileType(file: File): FileAttachment['type'] {
    if (file.type.startsWith('image/')) return 'image';
    if (file.type.startsWith('audio/')) return 'audio';
    if (file.type.startsWith('video/')) return 'video';
    return 'document';
  }

  getFileIcon(type: FileAttachment['type']): string {
    switch (type) {
      case 'image': return 'bi-image';
      case 'audio': return 'bi-mic-fill';
      case 'video': return 'bi-camera-video-fill';
      default: return 'bi-file-earmark-text';
    }
  }

  removeFile(index: number): void {
    this.svc.removeAttachment(index);
  }

  save(): void {
    this.svc.updateComplaint({
      grupos_vulneraveis: this.gruposVulneraveis(),
      procurou_outro_orgao: this.procurouOutroOrgao()
    });
  }

  avancar(): void { this.save(); this.svc.nextStep(); }
  voltar(): void  { this.save(); this.svc.prevStep(); }

  ngOnDestroy(): void {
    this.save();
  }
}
