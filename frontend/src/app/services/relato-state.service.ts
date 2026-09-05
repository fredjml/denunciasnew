import { Injectable, signal } from '@angular/core';
import { createPersistedSignal } from '../shared/persisted-signal';

export type TranscricaoStatus = 'NAO_INICIADA' | 'CONCLUIDA' | 'FALHA' | 'TIMEOUT' | 'EDITADA_MANUALMENTE';

@Injectable({ providedIn: 'root' })
export class RelatoStateService {
  private readonly irregularidadesState = createPersistedSignal<readonly string[]>('relato_irregularidades', []);
  private readonly relatoState = createPersistedSignal('relato_texto', '');
  private readonly transcricaoState = createPersistedSignal('relato_transcricao', '');
  private readonly transcricaoStatusState = createPersistedSignal<TranscricaoStatus>(
    'relato_transcricao_status',
    'NAO_INICIADA',
  );
  // Blob de áudio não é persistido em sessionStorage (não serializável); some ao recarregar a página.
  private readonly audioOriginalState = signal<Blob | null>(null);

  readonly irregularidades = this.irregularidadesState.value;
  readonly relato = this.relatoState.value;
  readonly transcricao = this.transcricaoState.value;
  readonly transcricaoStatus = this.transcricaoStatusState.value;
  readonly audioOriginal = this.audioOriginalState.asReadonly();

  setAudioOriginal(audio: Blob): void {
    this.audioOriginalState.set(audio);
  }

  toggleIrregularidade(code: string): void {
    this.irregularidadesState.update((current) =>
      current.includes(code) ? current.filter((item) => item !== code) : [...current, code],
    );
  }

  isIrregularidadeSelecionada(code: string): boolean {
    return this.irregularidadesState.value().includes(code);
  }

  setRelato(value: string): void {
    // eslint-disable-next-line no-control-regex -- sanitizacao intencional de caracteres de controle
    this.relatoState.set(value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, ''));
  }

  setTranscricao(value: string, status: TranscricaoStatus): void {
    this.transcricaoState.set(value);
    this.transcricaoStatusState.set(status);
  }

  editTranscricao(value: string): void {
    this.transcricaoState.set(value);
    this.transcricaoStatusState.set('EDITADA_MANUALMENTE');
  }
}
