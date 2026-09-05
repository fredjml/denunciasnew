import { Injectable } from '@angular/core';
import { createPersistedSignal } from '../shared/persisted-signal';

export type AcolhimentoChoice = 'CIDADAO' | 'AGENTE_PUBLICO' | 'OUVIDORIA';

const VALID_CHOICES: readonly AcolhimentoChoice[] = ['CIDADAO', 'AGENTE_PUBLICO', 'OUVIDORIA'];

function isAcolhimentoChoice(value: unknown): value is AcolhimentoChoice {
  return typeof value === 'string' && VALID_CHOICES.includes(value as AcolhimentoChoice);
}

@Injectable({ providedIn: 'root' })
export class AcolhimentoStateService {
  private readonly selectedState = createPersistedSignal<AcolhimentoChoice | null>('origem_acolhimento', null);
  readonly selected = this.selectedState.value;

  constructor() {
    // Descarta valor restaurado que não seja uma das opções válidas (ex.: chave adulterada).
    const restaurado = this.selectedState.value();
    if (restaurado !== null && !isAcolhimentoChoice(restaurado)) {
      this.selectedState.set(null);
    }
  }

  select(choice: AcolhimentoChoice): void {
    this.selectedState.set(choice);
  }
}
