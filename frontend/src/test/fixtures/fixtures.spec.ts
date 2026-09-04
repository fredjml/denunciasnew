import { syntheticComplaint, syntheticMunicipalities } from './fixtures';

describe('fixtures sintéticas centrais', () => {
  it('usa somente identificadores e domínios sintéticos', () => {
    expect(syntheticComplaint.protocolo).toMatch(/^SYN-/);
    expect(syntheticComplaint.nome_completo).toMatch(/^SYN-/);
    expect(syntheticComplaint.email).toMatch(/@example\.com$/);
    expect(syntheticMunicipalities.every(({ codigo }) => codigo.startsWith('SYN-'))).toBe(true);
  });
});
