'use strict';

const express = require('express');
const pkg = require('../../package.json');

const router = express.Router();

router.get('/', (req, res) => {
  return res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: pkg.version,
    service: 'mock-api',
  });
});

module.exports = router;
