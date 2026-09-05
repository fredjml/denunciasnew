import { Injectable } from '@angular/core';
import { createPersistedSignal } from '../shared/persisted-signal';

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
  private readonly periodoOcorrenciaState = createPersistedSignal('detalhamento_periodo', '');
  private readonly numeroTrabalhadoresState = createPersistedSignal<NumeroTrabalhadores>(
    'detalhamento_numero_trabalhadores',
    '',
  );
  private readonly modalidadeTrabalhoState = createPersistedSignal<ModalidadeTrabalho>(
    'detalhamento_modalidade',
    '',
  );
  private readonly funcoesSetoresState = createPersistedSignal('detalhamento_funcoes_setores', '');
  private readonly gruposVulneraveisState = createPersistedSignal<readonly string[]>(
    'detalhamento_grupos_vulneraveis',
    [],
  );

  readonly periodoOcorrencia = this.periodoOcorrenciaState.value;
  readonly numeroTrabalhadores = this.numeroTrabalhadoresState.value;
  readonly modalidadeTrabalho = this.modalidadeTrabalhoState.value;
  readonly funcoesSetores = this.funcoesSetoresState.value;
  readonly gruposVulneraveis = this.gruposVulneraveisState.value;

  setPeriodoOcorrencia(value: string): void {
    this.periodoOcorrenciaState.set(value);
  }

  setFuncoesSetores(value: string): void {
    this.funcoesSetoresState.set(value);
  }

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
