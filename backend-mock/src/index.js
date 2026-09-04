'use strict';

const express = require('express');
const cors = require('cors');
const logger = require('./logger');
const correlation = require('./middleware/correlation');
const denunciasRouter = require('./routes/denuncias');
const municipiosRouter = require('./routes/municipios');
const healthRouter = require('./routes/health');

function createApp() {
  const app = express();

  // CORS liberado para dev; produção do backend real DEVE restringir por origin
  app.use(
    cors({
      origin: ['http://localhost:4200', 'http://127.0.0.1:4200'],
      credentials: false,
    })
  );

  app.use(correlation);

  app.use('/health', healthRouter);
  app.use('/api/denuncias', denunciasRouter);
  app.use('/api/municipios', municipiosRouter);

  // 404 sem originalUrl em log (R-SEC-01)
  app.use((req, res) => {
    logger.warn({ requestId: req.requestId, method: req.method }, 'rota_nao_encontrada');
    res.status(404).json({
      codigo: 'NAO_ENCONTRADO',
      mensagem: 'Rota não encontrada',
    });
  });

  return app;
}

module.exports = { createApp };

if (require.main === module) {
  const port = Number.parseInt(process.env.PORT || '3001', 10);
  const app = createApp();
  app.listen(port, () => {
    logger.info({ port }, 'backend-mock iniciado');
    // Log amigável para dev
    console.log(`\n  backend-mock ▶  http://localhost:${port}`);
    console.log('  GET  /health');
    console.log('  POST /api/denuncias');
    console.log('  GET  /api/municipios?uf=SP\n');
  });
}
