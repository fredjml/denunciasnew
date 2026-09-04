import { Injectable, signal } from '@angular/core';

export type TranscricaoStatus = 'NAO_INICIADA' | 'CONCLUIDA' | 'FALHA' | 'TIMEOUT' | 'EDITADA_MANUALMENTE';

@Injectable({ providedIn: 'root' })
export class RelatoStateService {
  private readonly irregularidadesState = signal<readonly string[]>([]);
  private readonly relatoState = signal('');
  private readonly transcricaoState = signal('');
  private readonly transcricaoStatusState = signal<TranscricaoStatus>('NAO_INICIADA');

  readonly irregularidades = this.irregularidadesState.asReadonly();
  readonly relato = this.relatoState.asReadonly();
  readonly transcricao = this.transcricaoState.asReadonly();
  readonly transcricaoStatus = this.transcricaoStatusState.asReadonly();

  toggleIrregularidade(code: string): void {
    this.irregularidadesState.update((current) =>
      current.includes(code) ? current.filter((item) => item !== code) : [...current, code],
    );
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
