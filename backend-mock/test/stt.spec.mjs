import { describe, expect, it } from 'vitest';
import request from 'supertest';
import indexModule from '../src/index.js';

const { createApp } = indexModule;

describe('POST /api/stt', () => {
  it('retorna CONCLUIDA por padrão sem cenário informado', async () => {
    const res = await request(createApp())
      .post('/api/stt')
      .set('Content-Type', 'audio/webm')
      .send(Buffer.from('SYN-AUDIO'));

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      status: 'CONCLUIDA',
      texto: expect.stringContaining('SYN-TRANSCRICAO'),
    });
  });

  it('retorna FALHA quando o cenário sintético pede falha', async () => {
    const res = await request(createApp())
      .post('/api/stt')
      .set('x-synthetic-stt-scenario', 'FALHA')
      .set('Content-Type', 'audio/webm')
      .send(Buffer.from('SYN-AUDIO'));

    expect(res.status).toBe(503);
    expect(res.body).toEqual({ status: 'FALHA', texto: '' });
  });

  it('retorna TIMEOUT quando o cenário sintético pede timeout', async () => {
    const res = await request(createApp())
      .post('/api/stt')
      .set('x-synthetic-stt-scenario', 'TIMEOUT')
      .set('Content-Type', 'audio/webm')
      .send(Buffer.from('SYN-AUDIO'));

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'TIMEOUT', texto: '' });
  });
});
