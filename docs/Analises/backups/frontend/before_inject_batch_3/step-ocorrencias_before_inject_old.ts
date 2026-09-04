import { Component, signal, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ComplaintService } from '../../../../services/complaint.service';

@Component({
  selector: 'app-step-ocorrencias',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './step-ocorrencias.html',
  styleUrl: './step-ocorrencias.css'
})
export class StepOcorrenciasComponent implements OnDestroy {
  periodo = signal('');
  modalidade = signal('');
  numeroPrejudicados = signal('');
  funcoesSentores = signal('');
  nomesDados = signal('');

  constructor(public svc: ComplaintService) {
    const c = this.svc.complaint();
    this.periodo.set(c.periodo_ocorrencia);
    this.modalidade.set(c.modalidade_trabalho);
    this.numeroPrejudicados.set(c.numero_prejudicados);
    this.funcoesSentores.set(c.funcoes_setores);
    this.nomesDados.set(c.nomes_dados);
  }

  save(): void {
    this.svc.updateComplaint({
      periodo_ocorrencia: this.periodo(),
      modalidade_trabalho: this.modalidade(),
      numero_prejudicados: this.numeroPrejudicados(),
      funcoes_setores: this.funcoesSentores(),
      nomes_dados: this.nomesDados()
    });
  }

  avancar(): void { this.save(); this.svc.nextStep(); }
  voltar(): void  { this.save(); this.svc.prevStep(); }

  ngOnDestroy(): void {
    this.save();
  }
}
