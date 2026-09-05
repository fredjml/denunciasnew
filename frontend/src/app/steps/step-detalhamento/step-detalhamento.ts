import { Component, inject, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  DetalhamentoStateService,
  ModalidadeTrabalho,
  NumeroTrabalhadores,
} from '../../services/detalhamento-state.service';
import { Icon } from '../../shared/icon';

@Component({
  selector: 'app-step-detalhamento',
  standalone: true,
  imports: [FormsModule, Icon],
  templateUrl: './step-detalhamento.html',
  styleUrl: './step-detalhamento.css',
})
export class StepDetalhamento {
  protected readonly state = inject(DetalhamentoStateService);
  readonly advance = output<void>();
  readonly voltar = output<void>();

  protected setPeriodo(value: string): void {
    this.state.setPeriodoOcorrencia(value);
  }

  protected setNumero(value: string): void {
    this.state.setNumeroTrabalhadores(value as NumeroTrabalhadores);
  }

  protected setModalidade(value: string): void {
    this.state.setModalidadeTrabalho(value as ModalidadeTrabalho);
  }

  protected setFuncoes(value: string): void {
    this.state.setFuncoesSetores(value);
  }

  protected goNext(): void {
    this.advance.emit();
  }

  protected goBack(): void {
    this.voltar.emit();
  }
}
