'use strict';

const { magicBytesCorrespondem } = require('./magic-bytes');
const { scanBuffer } = require('./clamav-mock');

/**
 * Única porta de validação de conteúdo de anexo (magic bytes + antivírus mock) — usada por
 * TODA rota que recebe upload (`/api/evidencias`, `/api/denuncias`), para que nenhum caminho de
 * envio real fique sem a mesma checagem aplicada às evidências de teste.
 */
function validarAnexo(arquivo) {
  if (!magicBytesCorrespondem(arquivo.mimetype, arquivo.buffer)) {
    return {
      ok: false,
      codigo: 'MAGIC_BYTES_DIVERGENTE',
      mensagem: `Conteúdo de "${arquivo.originalname}" não corresponde ao tipo declarado.`,
    };
  }
  if (scanBuffer(arquivo.buffer).infected) {
    return {
      ok: false,
      codigo: 'ARQUIVO_INFECTADO',
      mensagem: `"${arquivo.originalname}" foi bloqueado pela varredura antivírus.`,
    };
  }
  return { ok: true };
}

module.exports = { validarAnexo };
