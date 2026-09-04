'use strict';

const { randomUUID } = require('node:crypto');

/**
 * Middleware que garante X-Request-ID em toda requisição.
 * Se o cliente enviar o header, respeitamos; senão geramos um UUID v4.
 * Sempre eco no header de resposta e disponibilizado em req.requestId.
 */
function correlation(req, res, next) {
  const incoming = req.headers['x-request-id'];
  const id = typeof incoming === 'string' && incoming.length > 0 && incoming.length <= 128
    ? incoming
    : randomUUID();
  req.requestId = id;
  res.setHeader('X-Request-ID', id);
  next();
}

module.exports = correlation;
