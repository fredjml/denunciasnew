import { Signal, signal } from '@angular/core';

function withStorage(operation: (storage: Storage) => void): void {
  try {
    if (typeof sessionStorage !== 'undefined') {
      operation(sessionStorage);
    }
  } catch {
    // Storage pode estar indisponível por política do navegador; o estado em memória permanece funcional.
  }
}

export interface PersistedSignal<T> {
  readonly value: Signal<T>;
  set(next: T): void;
  update(fn: (current: T) => T): void;
}

/**
 * Signal que sobrevive a reload/backgrounding via sessionStorage (T-DN-18, FATIA-DN-CP5-03).
 * Chaves usam o prefixo `denunciasnew.` para não colidir com outras aplicações na mesma origem.
 */
export function createPersistedSignal<T>(key: string, initial: T): PersistedSignal<T> {
  const storageKey = `denunciasnew.${key}`;
  let restored = initial;

  withStorage((storage) => {
    const raw = storage.getItem(storageKey);
    if (raw === null) return;
    try {
      restored = JSON.parse(raw) as T;
    } catch {
      storage.removeItem(storageKey);
    }
  });

  const state = signal(restored);

  function persist(next: T): void {
    withStorage((storage) => storage.setItem(storageKey, JSON.stringify(next)));
  }

  return {
    value: state.asReadonly(),
    set(next: T): void {
      state.set(next);
      persist(next);
    },
    update(fn: (current: T) => T): void {
      state.update(fn);
      persist(state());
    },
  };
}
