import { Injectable } from '@angular/core';
import { createPersistedSignal } from '../shared/persisted-signal';

@Injectable({ providedIn: 'root' })
export class LocalStateService {
  private readonly ufState = createPersistedSignal('local_uf', '');
  private readonly municipioState = createPersistedSignal('local_municipio', '');
  private readonly municipioIbgeState = createPersistedSignal('local_municipio_ibge', '');
  private readonly nomeEmpresaState = createPersistedSignal('local_nome_empresa', '');
  private readonly enderecoEmpresaState = createPersistedSignal('local_endereco_empresa', '');

  readonly uf = this.ufState.value;
  readonly municipio = this.municipioState.value;
  readonly municipioIbge = this.municipioIbgeState.value;
  readonly nomeEmpresa = this.nomeEmpresaState.value;
  readonly enderecoEmpresa = this.enderecoEmpresaState.value;

  setUf(value: string): void {
    this.ufState.set(value);
    this.municipioState.set('');
    this.municipioIbgeState.set('');
  }

  setMunicipio(nome: string, codigoIbge: string): void {
    this.municipioState.set(nome);
    this.municipioIbgeState.set(codigoIbge);
  }

  setNomeEmpresa(value: string): void {
    this.nomeEmpresaState.set(value);
  }

  setEnderecoEmpresa(value: string): void {
    this.enderecoEmpresaState.set(value);
  }
}
