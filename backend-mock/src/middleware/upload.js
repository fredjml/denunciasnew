'use strict';

const multer = require('multer');

const MIME_PERMITIDOS = new Set(['application/pdf', 'image/jpeg', 'image/png']);
// Mantido em sincronia com as assinaturas conhecidas em services/magic-bytes.js — um MIME
// aceito aqui sem assinatura correspondente lá reprova todo upload desse tipo (ver histórico).
const MIME_AUDIO_PERMITIDOS = new Set(['audio/webm', 'audio/wav', 'audio/ogg']);
const EXTENSOES_BLOQUEADAS = new Set(['.exe', '.bat', '.cmd', '.sh', '.ps1']);
const MAX_ARQUIVOS = 10;
const MAX_TAMANHO_BYTES = 20 * 1024 * 1024; // 20 MiB — default DEC-DN-15
const CAMPO_AUDIO = 'arquivo_audio';

function extensaoDe(nomeArquivo) {
  const idx = nomeArquivo.lastIndexOf('.');
  return idx === -1 ? '' : nomeArquivo.slice(idx).toLowerCase();
}

/**
 * Única definição de política de upload do backend-mock — usada tanto por `/api/evidencias`
 * quanto por `/api/denuncias` (anexos da denúncia), para que as duas rotas apliquem exatamente
 * as mesmas regras de extensão/MIME (nenhuma rota de upload deve ficar sem esse filtro).
 */
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_TAMANHO_BYTES, files: MAX_ARQUIVOS },
  fileFilter(req, file, callback) {
    if (EXTENSOES_BLOQUEADAS.has(extensaoDe(file.originalname))) {
      return callback(Object.assign(new Error('EXTENSAO_BLOQUEADA'), { code: 'EXTENSAO_BLOQUEADA' }));
    }
    const permitidos = file.fieldname === CAMPO_AUDIO ? MIME_AUDIO_PERMITIDOS : MIME_PERMITIDOS;
    if (!permitidos.has(file.mimetype)) {
      return callback(Object.assign(new Error('MIME_NAO_PERMITIDO'), { code: 'MIME_NAO_PERMITIDO' }));
    }
    return callback(null, true);
  },
});

module.exports = {
  upload,
  MIME_PERMITIDOS,
  MIME_AUDIO_PERMITIDOS,
  EXTENSOES_BLOQUEADAS,
  MAX_ARQUIVOS,
  MAX_TAMANHO_BYTES,
  CAMPO_AUDIO,
};
