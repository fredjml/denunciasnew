import { describe, expect, it } from 'vitest';
import loggerModule from '../src/logger.js';

const { createLogger } = loggerModule;

function captureLog(payload) {
  const lines = [];
  const destination = { write: (line) => lines.push(JSON.parse(line)) };
  createLogger(destination).info(payload, 'evento sintético');
  return lines[0];
}

describe('logger redaction', () => {
  it.each([
    ['nome_completo', 'SYN-CIDADÃO-001'],
    ['email', 'cidadao.001@example.com'],
    ['telefone', '+55 00 00000-0000'],
    ['token', 'SYN-TOKEN-001'],
  ])('redige o campo sensível %s', (key, value) => {
    const entry = captureLog({ [key]: value });

    expect(entry[key]).toBe('[REDIGIDO]');
    expect(JSON.stringify(entry)).not.toContain(value);
  });
});
