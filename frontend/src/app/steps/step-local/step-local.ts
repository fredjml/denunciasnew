import { Component, inject, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LocalStateService } from '../../services/local-state.service';
import { MunicipiosClientService, Municipio } from '../../services/municipios-client.service';

const UFS = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG',
  'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
] as const;

@Component({
  selector: 'app-step-local',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './step-local.html',
  styleUrl: './step-local.css',
})
export class StepLocal {
  protected readonly state = inject(LocalStateService);
  private readonly municipiosClient = inject(MunicipiosClientService);
  protected readonly ufs = UFS;
  protected readonly municipios = signal<readonly Municipio[]>([]);
  protected readonly erroValidacao = signal(false);
  readonly advance = output<void>();
  readonly voltar = output<void>();

  protected async onUfChange(uf: string): Promise<void> {
    this.state.setUf(uf);
    this.municipios.set(uf ? await this.municipiosClient.listar(uf) : []);
  }

  protected onMunicipioChange(codigoIbge: string): void {
    const municipio = this.municipios().find((item) => item.codigo_ibge === codigoIbge);
    this.state.setMunicipio(municipio?.nome ?? '', codigoIbge);
  }

  protected goNext(): void {
    if (!this.state.uf() || !this.state.municipio()) {
      this.erroValidacao.set(true);
      return;
    }
    this.erroValidacao.set(false);
    this.advance.emit();
  }

  protected goBack(): void {
    this.voltar.emit();
  }
}
