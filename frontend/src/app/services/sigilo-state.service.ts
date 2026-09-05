import { Injectable } from '@angular/core';
import { createPersistedSignal } from '../shared/persisted-signal';

export type TipoIdentificacao = 'ANONIMO' | 'IDENTIFICADO' | '';

@Injectable({ providedIn: 'root' })
export class SigiloStateService {
  private readonly avisoConfirmadoState = createPersistedSignal('sigilo_aviso_confirmado', false);
  private readonly tipoIdentificacaoState = createPersistedSignal<TipoIdentificacao>('sigilo_tipo', '');
  private readonly nomeCompletoState = createPersistedSignal('sigilo_nome', '');
  private readonly emailState = createPersistedSignal('sigilo_email', '');
  private readonly telefoneState = createPersistedSignal('sigilo_telefone', '');

  readonly avisoConfirmado = this.avisoConfirmadoState.value;
  readonly tipoIdentificacao = this.tipoIdentificacaoState.value;
  readonly nomeCompleto = this.nomeCompletoState.value;
  readonly email = this.emailState.value;
  readonly telefone = this.telefoneState.value;

  setAvisoConfirmado(value: boolean): void {
    this.avisoConfirmadoState.set(value);
  }

  setTipoIdentificacao(value: TipoIdentificacao): void {
    this.tipoIdentificacaoState.set(value);
    if (value === 'ANONIMO') {
      this.nomeCompletoState.set('');
      this.emailState.set('');
      this.telefoneState.set('');
    }
  }

  setNomeCompleto(value: string): void {
    this.nomeCompletoState.set(value);
  }

  setEmail(value: string): void {
    this.emailState.set(value);
  }

  setTelefone(value: string): void {
    this.telefoneState.set(value);
  }
}
