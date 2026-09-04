// Gera fixture de áudio 100% sintética (ruído branco, PCM 16-bit mono) para testes do CP-2.
// Sem dependências externas e sem TTS: reprodutível via `npm run generate:audio-fixture`.
// Ver docs/preparacao-implementacao/10-EVIDENCE-MANIFEST.delta-denunciasnew.md §5.
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const OUTPUT_PATH = join(
  dirname(fileURLToPath(import.meta.url)),
  '..',
  'src/test/fixtures/audio/sample-syn.wav',
);

const SAMPLE_RATE = 8000;
const DURATION_SECONDS = 5;
const SEED = 42; // determinístico: mesma saída a cada execução

function nextRandom(state) {
  // LCG determinístico (Numerical Recipes) — evita dependência de Math.random.
  const next = (state * 1664525 + 1013904223) >>> 0;
  return [next, next / 0xffffffff];
}

function buildPcmSamples() {
  const total = SAMPLE_RATE * DURATION_SECONDS;
  const samples = new Int16Array(total);
  let state = SEED;
  for (let i = 0; i < total; i += 1) {
    const [next, r] = nextRandom(state);
    state = next;
    samples[i] = Math.round((r * 2 - 1) * 3000); // ruído branco de baixa amplitude
  }
  return samples;
}

function buildWavFile(samples) {
  const dataSize = samples.length * 2;
  const buffer = Buffer.alloc(44 + dataSize);

  buffer.write('RIFF', 0, 'ascii');
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8, 'ascii');

  buffer.write('fmt ', 12, 'ascii');
  buffer.writeUInt32LE(16, 16); // tamanho do subchunk fmt
  buffer.writeUInt16LE(1, 20); // PCM
  buffer.writeUInt16LE(1, 22); // mono
  buffer.writeUInt32LE(SAMPLE_RATE, 24);
  buffer.writeUInt32LE(SAMPLE_RATE * 2, 28); // byte rate
  buffer.writeUInt16LE(2, 32); // block align
  buffer.writeUInt16LE(16, 34); // bits por amostra

  buffer.write('data', 36, 'ascii');
  buffer.writeUInt32LE(dataSize, 40);
  for (let i = 0; i < samples.length; i += 1) {
    buffer.writeInt16LE(samples[i], 44 + i * 2);
  }

  return buffer;
}

mkdirSync(dirname(OUTPUT_PATH), { recursive: true });
writeFileSync(OUTPUT_PATH, buildWavFile(buildPcmSamples()));
console.log(`Fixture sintética gerada em ${OUTPUT_PATH}`);
