const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { rateLimit } = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./swagger.config');
require('dotenv').config();

const complaintRoutes = require('./routes/complaint.routes');

const DEFAULT_RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const DEFAULT_RATE_LIMIT_MAX = 20;
const REQUIRED_PRODUCTION_ENVIRONMENT_VARIABLES = ['MPT_API_URL', 'FRONTEND_URL'];

function parsePositiveInteger(value, fallback) {
  const parsedValue = Number.parseInt(value, 10);
  return Number.isInteger(parsedValue) && parsedValue > 0 ? parsedValue : fallback;
}

function getAllowedOrigins(env) {
  if (env.NODE_ENV === 'production') {
    return env.FRONTEND_URL ? [env.FRONTEND_URL] : [];
  }

  return [...new Set([
    'http://localhost:4200',
    'http://localhost:4201',
    env.FRONTEND_URL,
  ].filter(Boolean))];
}

function isApiDocsEnabled(env) {
  return env.NODE_ENV !== 'production' || env.ENABLE_API_DOCS === 'true';
}

function assertProductionConfiguration(env) {
  if (env.NODE_ENV !== 'production') {
    return;
  }

  const missingVariables = REQUIRED_PRODUCTION_ENVIRONMENT_VARIABLES.filter(
    (variableName) => !env[variableName],
  );

  if (missingVariables.length > 0) {
    throw new Error(
      `Configuração obrigatória ausente em produção: ${missingVariables.join(', ')}`,
    );
  }
}

function createApp(env = process.env) {
  const app = express();
  const trustProxyHops = parsePositiveInteger(env.TRUST_PROXY_HOPS, 0);

  if (trustProxyHops > 0) {
    app.set('trust proxy', trustProxyHops);
  }

  // ============================================
  // Security Middleware
  // ============================================
  app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' }
  }));

  app.use(cors({
    origin: getAllowedOrigins(env),
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));

  // ============================================
  // Request parsing
  // ============================================
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // ============================================
  // Logging
  // ============================================
  if (env.NODE_ENV !== 'test') {
    const logFormat = env.NODE_ENV === 'production' ? 'combined' : 'dev';
    app.use(morgan(logFormat));
  }

  // ============================================
  // Routes
  // ============================================
  if (isApiDocsEnabled(env)) {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
  }

  const complaintRateLimiter = rateLimit({
    windowMs: parsePositiveInteger(env.RATE_LIMIT_WINDOW_MS, DEFAULT_RATE_LIMIT_WINDOW_MS),
    limit: parsePositiveInteger(env.RATE_LIMIT_MAX, DEFAULT_RATE_LIMIT_MAX),
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: {
      erro: 'Muitas tentativas de envio',
      detalhe: 'Aguarde alguns minutos antes de tentar enviar outra denúncia.'
    }
  });

  app.post('/api/denuncias', complaintRateLimiter);
  app.use('/api', complaintRoutes);

  // Health check
  app.get('/health', (req, res) => {
    res.json({
      status: 'ok',
      servico: 'Canal de Denúncias — MPT',
      timestamp: new Date().toISOString(),
      ambiente: env.NODE_ENV || 'development'
    });
  });

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({
      erro: 'Endpoint não encontrado',
      path: req.originalUrl
    });
  });

  // Global error handler
  app.use((err, req, res, _next) => {
    console.error('[Erro]', err.message);

    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({
        erro: 'Arquivo muito grande',
        detalhe: `Tamanho máximo permitido: ${(env.MAX_FILE_SIZE || 20971520) / 1024 / 1024}MB`
      });
    }

    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        erro: 'Muitos arquivos',
        detalhe: `Máximo de ${env.MAX_FILES || 10} arquivos por denúncia`
      });
    }

    return res.status(500).json({
      erro: 'Erro interno do servidor',
      detalhe: env.NODE_ENV === 'development' ? err.message : undefined
    });
  });

  return app;
}

// ============================================
// Start server
// ============================================
function startServer(appToStart = app, env = process.env) {
  assertProductionConfiguration(env);
  const port = env.PORT || 3000;
  return appToStart.listen(port, () => {
    console.log(`\n╔══════════════════════════════════════╗`);
    console.log(`║  Canal de Denúncias — MPT Backend    ║`);
    console.log(`╠══════════════════════════════════════╣`);
    console.log(`║  Porta:     ${port.toString().padEnd(26)}║`);
    console.log(`║  Ambiente:  ${(env.NODE_ENV || 'development').padEnd(26)}║`);
    console.log(`║  API MPT:   ${(env.MPT_API_URL || 'não configurada').substring(0, 26).padEnd(26)}║`);
    console.log(`╚══════════════════════════════════════╝\n`);
  });
}

const app = createApp();

if (require.main === module) {
  startServer();
}

module.exports = app;
module.exports.createApp = createApp;
module.exports.startServer = startServer;
