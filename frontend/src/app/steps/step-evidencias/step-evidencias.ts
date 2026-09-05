import { Component, inject, output } from '@angular/core';
import { EvidenciasStateService } from '../../services/evidencias-state.service';

@Component({
  selector: 'app-step-evidencias',
  standalone: true,
  templateUrl: './step-evidencias.html',
  styleUrl: './step-evidencias.css',
})
export class StepEvidencias {
  protected readonly state = inject(EvidenciasStateService);
  readonly advance = output<void>();

  protected onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.state.adicionar(Array.from(input.files));
    }
    input.value = '';
  }

  protected remover(nome: string): void {
    this.state.remover(nome);
  }

  protected goNext(): void {
    this.advance.emit();
  }
}
