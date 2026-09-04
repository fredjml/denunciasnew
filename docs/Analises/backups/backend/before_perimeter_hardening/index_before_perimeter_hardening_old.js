const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./swagger.config');
require('dotenv').config();

const complaintRoutes = require('./routes/complaint.routes');

const app = express();
const PORT = process.env.PORT || 3000;

// ============================================
// Security Middleware
// ============================================
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

// CORS — aceita requisições do Angular em desenvolvimento
app.use(cors({
  origin: [
    'http://localhost:4200',
    'http://localhost:4201',
    process.env.FRONTEND_URL || 'http://localhost:4200'
  ],
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
const logFormat = process.env.NODE_ENV === 'production' ? 'combined' : 'dev';
app.use(morgan(logFormat));

// ============================================
// Routes
// ============================================
// Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

app.use('/api', complaintRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    servico: 'Canal de Denúncias — MPT',
    timestamp: new Date().toISOString(),
    ambiente: process.env.NODE_ENV || 'development'
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
      detalhe: `Tamanho máximo permitido: ${(process.env.MAX_FILE_SIZE || 20971520) / 1024 / 1024}MB`
    });
  }

  if (err.code === 'LIMIT_FILE_COUNT') {
    return res.status(400).json({
      erro: 'Muitos arquivos',
      detalhe: `Máximo de ${process.env.MAX_FILES || 10} arquivos por denúncia`
    });
  }

  res.status(500).json({
    erro: 'Erro interno do servidor',
    detalhe: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// ============================================
// Start server
// ============================================
app.listen(PORT, () => {
  console.log(`\n╔══════════════════════════════════════╗`);
  console.log(`║  Canal de Denúncias — MPT Backend    ║`);
  console.log(`╠══════════════════════════════════════╣`);
  console.log(`║  Porta:     ${PORT.toString().padEnd(26)}║`);
  console.log(`║  Ambiente:  ${(process.env.NODE_ENV || 'development').padEnd(26)}║`);
  console.log(`║  API MPT:   ${(process.env.MPT_API_URL || 'não configurada').substring(0, 26).padEnd(26)}║`);
  console.log(`╚══════════════════════════════════════╝\n`);
});

module.exports = app;
