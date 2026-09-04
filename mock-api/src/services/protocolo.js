'use strict';

const { randomBytes } = require('node:crypto');

// Alfabeto sem I/O/0/1 para evitar confusão de leitura
const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

/**
 * Gera um protocolo no formato SYN-XXXXXXXX (regra R-DN-06, DEC-DN-P-F5-3).
 * Prefixo neutro deixa claro que é síntese/mock; formato real do MPT
 * será decidido em DEC-DN-19 quando o backend real for acoplado.
 * @returns {string} protocolo no padrão ^SYN-[A-Z0-9]{8}$
 */
function gerarProtocolo() {
  const bytes = randomBytes(8);
  let out = '';
  for (let i = 0; i < 8; i += 1) {
    out += ALPHABET[bytes[i] % ALPHABET.length];
  }
  return `SYN-${out}`;
}

module.exports = { gerarProtocolo };
