'use strict';

const pino = require('pino');
const noir = require('pino-noir');

// Campos redigidos automaticamente (nunca aparecem em log)
const redactedKeys = [
  'nome_completo',
  'email',
  'telefone',
  'nome_referencial',
  'contato_opcional',
  'cpf',
  'cnpj',
  'authorization',
  'password',
  'token',
  'apiKey',
  'MPT_API_TOKEN',
];

const loggerOptions = {
    level: process.env.LOG_LEVEL || 'info',
    base: { service: 'backend-mock', version: '0.1.0' },
    timestamp: pino.stdTimeFunctions.isoTime,
    serializers: noir(redactedKeys, '[REDIGIDO]'),
  };

function createLogger(destination) {
  return pino(loggerOptions, destination);
}

const logger = createLogger();

module.exports = logger;
module.exports.createLogger = createLogger;
