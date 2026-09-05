'use strict';

const multer = require('multer');

const MIME_PERMITIDOS = new Set(['application/pdf', 'image/jpeg', 'image/png']);
const EXTENSOES_BLOQUEADAS = new Set(['.exe', '.bat', '.cmd', '.sh', '.ps1']);
const MAX_ARQUIVOS = 10;
const MAX_TAMANHO_BYTES = 20 * 1024 * 1024; // 20 MiB — default DEC-DN-15

function extensaoDe(nomeArquivo) {
  const idx = nomeArquivo.lastIndexOf('.');
  return idx === -1 ? '' : nomeArquivo.slice(idx).toLowerCase();
}

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_TAMANHO_BYTES, files: MAX_ARQUIVOS },
  fileFilter(req, file, callback) {
    if (EXTENSOES_BLOQUEADAS.has(extensaoDe(file.originalname))) {
      return callback(Object.assign(new Error('EXTENSAO_BLOQUEADA'), { code: 'EXTENSAO_BLOQUEADA' }));
    }
    if (!MIME_PERMITIDOS.has(file.mimetype)) {
      return callback(Object.assign(new Error('MIME_NAO_PERMITIDO'), { code: 'MIME_NAO_PERMITIDO' }));
    }
    return callback(null, true);
  },
});

module.exports = { upload, MIME_PERMITIDOS, EXTENSOES_BLOQUEADAS, MAX_ARQUIVOS, MAX_TAMANHO_BYTES };
