import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComplaintService } from '../../../services/complaint.service';
import { IRREGULARIDADES } from '../../../models/complaint.model';

@Component({
  selector: 'app-step-revisao',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './step-revisao.html',
  styleUrl: './step-revisao.css'
})
export class StepRevisaoComponent {
  readonly irregularidadesMap = Object.fromEntries(
    IRREGULARIDADES.map(i => [i.id, i.label])
  );

  constructor(public svc: ComplaintService) {}

  get complaint() { return this.svc.complaint(); }

  get irregularidadesLabel(): string {
    const labels = this.complaint.irregularidades
      .map(id => this.irregularidadesMap[id] ?? id);
    return labels.length > 0 ? labels.join(', ') : 'Não informado';
  }

  get identificacaoLabel(): string {
    return this.complaint.tipo_identificacao === 'anonimo'
      ? 'Anônimo'
      : this.complaint.nome_completo || 'Identificado';
  }

  editStep(step: number): void {
    this.svc.goToStep(step);
  }

  async enviar(): Promise<void> {
    await this.svc.submitComplaint();
  }

  voltar(): void { this.svc.prevStep(); }
}
