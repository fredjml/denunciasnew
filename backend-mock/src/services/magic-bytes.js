'use strict';

// FATIA-DN-CP3-04 — confere que os bytes iniciais do arquivo batem com o MIME declarado,
// mitigando spoof de extensão/Content-Type (T-DN-04).
const ASSINATURAS = {
  'application/pdf': [Buffer.from('%PDF')],
  'image/jpeg': [Buffer.from([0xff, 0xd8, 0xff])],
  'image/png': [Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])],
};

function magicBytesCorrespondem(mimetype, buffer) {
  const assinaturas = ASSINATURAS[mimetype];
  if (!assinaturas) return false;
  return assinaturas.some((assinatura) => buffer.subarray(0, assinatura.length).equals(assinatura));
}

module.exports = { magicBytesCorrespondem, ASSINATURAS };
