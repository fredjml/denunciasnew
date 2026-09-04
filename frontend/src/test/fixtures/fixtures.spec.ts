import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { syntheticComplaint, syntheticMunicipalities } from './fixtures';

describe('fixtures sintéticas centrais', () => {
  it('usa somente identificadores e domínios sintéticos', () => {
    expect(syntheticComplaint.protocolo).toMatch(/^SYN-/);
    expect(syntheticComplaint.nome_completo).toMatch(/^SYN-/);
    expect(syntheticComplaint.email).toMatch(/@example\.com$/);
    expect(syntheticMunicipalities.every(({ codigo }) => codigo.startsWith('SYN-'))).toBe(true);
  });
});

describe('fixture de áudio sintética (T-CP2-08)', () => {
  it('é um WAV PCM válido de ruído branco, gerado sem TTS externo', () => {
    const path = join(__dirname, 'audio', 'sample-syn.wav');
    const buffer = readFileSync(path);

    expect(buffer.subarray(0, 4).toString('ascii')).toBe('RIFF');
    expect(buffer.subarray(8, 12).toString('ascii')).toBe('WAVE');

    const sampleRate = buffer.readUInt32LE(24);
    const bitsPerSample = buffer.readUInt16LE(34);
    const dataSize = buffer.readUInt32LE(40);
    const durationSeconds = dataSize / (sampleRate * (bitsPerSample / 8));

    expect(durationSeconds).toBeCloseTo(5, 0);
  });
});
