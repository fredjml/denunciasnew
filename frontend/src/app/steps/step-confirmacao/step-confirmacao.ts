import { Component, input, output } from '@angular/core';
import { Icon } from '../../shared/icon';

@Component({
  selector: 'app-step-confirmacao',
  standalone: true,
  imports: [Icon],
  templateUrl: './step-confirmacao.html',
  styleUrl: './step-confirmacao.css',
})
export class StepConfirmacao {
  readonly protocolo = input.required<string>();
  readonly inicio = output<void>();

  protected voltarAoInicio(): void {
    this.inicio.emit();
  }
}
