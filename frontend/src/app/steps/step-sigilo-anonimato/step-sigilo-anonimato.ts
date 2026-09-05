import { Component, inject, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SigiloStateService, TipoIdentificacao } from '../../services/sigilo-state.service';

@Component({
  selector: 'app-step-sigilo-anonimato',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './step-sigilo-anonimato.html',
  styleUrl: './step-sigilo-anonimato.css',
})
export class StepSigiloAnonimato {
  protected readonly state = inject(SigiloStateService);
  readonly advance = output<void>();
  readonly voltar = output<void>();

  protected setTipo(value: TipoIdentificacao): void {
    this.state.setTipoIdentificacao(value);
  }

  protected onConfirmarAvisoChange(checked: boolean): void {
    this.state.setAvisoConfirmado(checked);
  }

  protected goNext(): void {
    this.advance.emit();
  }

  protected goBack(): void {
    this.voltar.emit();
  }
}
