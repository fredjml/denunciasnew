import { createPersistedSignal } from './persisted-signal';

describe('createPersistedSignal', () => {
  beforeEach(() => sessionStorage.clear());

  it('inicia com o valor padrão quando não há nada salvo', () => {
    const state = createPersistedSignal('teste_a', 'inicial');
    expect(state.value()).toBe('inicial');
  });

  it('persiste e restaura o valor entre instâncias (simulando reload)', () => {
    const primeira = createPersistedSignal('teste_b', { texto: '' });
    primeira.set({ texto: 'SYN-relato salvo' });

    const segunda = createPersistedSignal('teste_b', { texto: '' });

    expect(segunda.value()).toEqual({ texto: 'SYN-relato salvo' });
  });

  it('update também persiste o resultado', () => {
    const primeira = createPersistedSignal<string[]>('teste_c', []);
    primeira.update((atual) => [...atual, 'IDOSOS']);

    const segunda = createPersistedSignal<string[]>('teste_c', []);

    expect(segunda.value()).toEqual(['IDOSOS']);
  });

  it('ignora valor corrompido no storage e usa o padrão', () => {
    sessionStorage.setItem('denunciasnew.teste_d', '{invalido');

    const state = createPersistedSignal('teste_d', 'padrao');

    expect(state.value()).toBe('padrao');
  });
});
