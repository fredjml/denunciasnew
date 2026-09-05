import { Injectable, signal } from '@angular/core';

export type NumeroTrabalhadores = '1' | '2-5' | '6-20' | '21-100' | '100+' | '';
export type ModalidadeTrabalho =
  | 'presencial'
  | 'remoto'
  | 'hibrido'
  | 'informal'
  | 'terceirizado'
  | 'outra'
  | '';

@Injectable({ providedIn: 'root' })
export class DetalhamentoStateService {
  private readonly numeroTrabalhadoresState = signal<NumeroTrabalhadores>('');
  private readonly modalidadeTrabalhoState = signal<ModalidadeTrabalho>('');
  private readonly gruposVulneraveisState = signal<readonly string[]>([]);

  readonly numeroTrabalhadores = this.numeroTrabalhadoresState.asReadonly();
  readonly modalidadeTrabalho = this.modalidadeTrabalhoState.asReadonly();
  readonly gruposVulneraveis = this.gruposVulneraveisState.asReadonly();

  setNumeroTrabalhadores(value: NumeroTrabalhadores): void {
    this.numeroTrabalhadoresState.set(value);
  }

  setModalidadeTrabalho(value: ModalidadeTrabalho): void {
    this.modalidadeTrabalhoState.set(value);
  }

  toggleGrupoVulneravel(codigo: string): void {
    this.gruposVulneraveisState.update((current) =>
      current.includes(codigo) ? current.filter((item) => item !== codigo) : [...current, codigo],
    );
  }
}
