'use strict';

// Mock de FATIA-DN-CP3-06. Nunca conecta a um ClamAV real (INSTREAM/TCP fica para o backend
// final). Simula detecção via assinatura EICAR — padrão de teste de antivírus, sintético por
// definição (não é malware real).
const EICAR_SIGNATURE = 'X5O!P%@AP[4\\PZX54(P^)7CC)7}$EICAR-STANDARD-ANTIVIRUS-TEST-FILE!$H+H*';

function scanBuffer(buffer) {
  const infected = buffer.includes(EICAR_SIGNATURE);
  return { infected };
}

module.exports = { scanBuffer, EICAR_SIGNATURE };
