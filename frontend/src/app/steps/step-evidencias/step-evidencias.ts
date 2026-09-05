import { Component, inject, output } from '@angular/core';
import { EvidenciasStateService, TemTestemunhas } from '../../services/evidencias-state.service';
import { DetalhamentoStateService } from '../../services/detalhamento-state.service';
import { Icon } from '../../shared/icon';

const GRUPOS_VULNERAVEIS = [
  { codigo: 'IDOSOS', rotulo: 'Pessoas idosas' },
  { codigo: 'CRIANCAS', rotulo: 'Crianças e adolescentes' },
  { codigo: 'PCD', rotulo: 'Pessoas com deficiência' },
] as const;

@Component({
  selector: 'app-step-evidencias',
  standalone: true,
  imports: [Icon],
  templateUrl: './step-evidencias.html',
  styleUrl: './step-evidencias.css',
})
export class StepEvidencias {
  protected readonly state = inject(EvidenciasStateService);
  protected readonly detalhamento = inject(DetalhamentoStateService);
  protected readonly gruposVulneraveis = GRUPOS_VULNERAVEIS;
  readonly advance = output<void>();
  readonly voltar = output<void>();

  protected onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.state.adicionar(Array.from(input.files));
    }
    input.value = '';
  }

  protected remover(id: number): void {
    this.state.remover(id);
  }

  protected toggleGrupo(codigo: string): void {
    this.detalhamento.toggleGrupoVulneravel(codigo);
  }

  protected setTemTestemunhas(value: TemTestemunhas): void {
    this.state.setTemTestemunhas(value);
  }

  protected goNext(): void {
    this.advance.emit();
  }

  protected goBack(): void {
    this.voltar.emit();
  }
}
