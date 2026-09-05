import { Component, inject, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  DetalhamentoStateService,
  ModalidadeTrabalho,
  NumeroTrabalhadores,
} from '../../services/detalhamento-state.service';

const GRUPOS_VULNERAVEIS = [
  { codigo: 'IDOSOS', rotulo: 'Pessoas idosas' },
  { codigo: 'CRIANCAS', rotulo: 'Crianças e adolescentes' },
  { codigo: 'PCD', rotulo: 'Pessoas com deficiência' },
] as const;

@Component({
  selector: 'app-step-detalhamento',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './step-detalhamento.html',
  styleUrl: './step-detalhamento.css',
})
export class StepDetalhamento {
  protected readonly state = inject(DetalhamentoStateService);
  protected readonly gruposVulneraveis = GRUPOS_VULNERAVEIS;
  readonly advance = output<void>();

  protected setNumero(value: string): void {
    this.state.setNumeroTrabalhadores(value as NumeroTrabalhadores);
  }

  protected setModalidade(value: string): void {
    this.state.setModalidadeTrabalho(value as ModalidadeTrabalho);
  }

  protected toggleGrupo(codigo: string): void {
    this.state.toggleGrupoVulneravel(codigo);
  }

  protected goNext(): void {
    this.advance.emit();
  }
}
