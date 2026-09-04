import { Injectable, signal } from '@angular/core';

export type AcolhimentoChoice = 'CIDADAO' | 'AGENTE_PUBLICO' | 'OUVIDORIA';

const STORAGE_KEY = 'denunciasnew.origem_acolhimento';
const VALID_CHOICES: readonly AcolhimentoChoice[] = ['CIDADAO', 'AGENTE_PUBLICO', 'OUVIDORIA'];

function isAcolhimentoChoice(value: string | null): value is AcolhimentoChoice {
  return value !== null && VALID_CHOICES.includes(value as AcolhimentoChoice);
}

@Injectable({ providedIn: 'root' })
export class AcolhimentoStateService {
  private readonly selectedState = signal<AcolhimentoChoice | null>(this.restore());
  readonly selected = this.selectedState.asReadonly();

  select(choice: AcolhimentoChoice): void {
    this.selectedState.set(choice);
    this.withStorage((storage) => storage.setItem(STORAGE_KEY, choice));
  }

  private restore(): AcolhimentoChoice | null {
    let restored: AcolhimentoChoice | null = null;

    this.withStorage((storage) => {
      const value = storage.getItem(STORAGE_KEY);
      if (isAcolhimentoChoice(value)) {
        restored = value;
      } else if (value !== null) {
        storage.removeItem(STORAGE_KEY);
      }
    });

    return restored;
  }

  private withStorage(operation: (storage: Storage) => void): void {
    try {
      if (typeof sessionStorage !== 'undefined') {
        operation(sessionStorage);
      }
    } catch {
      // Storage pode estar indisponível por política do navegador; o estado em memória permanece funcional.
    }
  }
}
