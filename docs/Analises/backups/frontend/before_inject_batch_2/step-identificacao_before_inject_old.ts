import { Component, signal, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ComplaintService } from '../../../../services/complaint.service';

@Component({
  selector: 'app-step-identificacao',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './step-identificacao.html',
  styleUrl: './step-identificacao.css'
})
export class StepIdentificacaoComponent implements OnDestroy {
  tipoIdentificacao = signal<'anonimo' | 'identificado'>('anonimo');
  nome = signal('');
  email = signal('');
  telefone = signal('');

  constructor(public svc: ComplaintService) {
    const c = this.svc.complaint();
    this.tipoIdentificacao.set(c.tipo_identificacao);
    this.nome.set(c.nome_completo ?? '');
    this.email.set(c.email ?? '');
    this.telefone.set(c.telefone ?? '');
  }

  setTipo(tipo: 'anonimo' | 'identificado'): void {
    this.tipoIdentificacao.set(tipo);
  }

  save(): void {
    this.svc.updateComplaint({
      tipo_identificacao: this.tipoIdentificacao(),
      nome_completo: this.nome(),
      email: this.email(),
      telefone: this.telefone()
    });
  }

  avancar(): void { this.save(); this.svc.nextStep(); }
  voltar(): void  { this.save(); this.svc.prevStep(); }

  ngOnDestroy(): void {
    this.save();
  }
}
