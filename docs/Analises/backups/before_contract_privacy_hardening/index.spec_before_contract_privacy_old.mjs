import { createRequire } from 'node:module';
import { describe, expect, it } from 'vitest';
import request from 'supertest';

const require = createRequire(import.meta.url);
const { createApp } = require('./index.js');

function createEnvironment(overrides = {}) {
  return {
    NODE_ENV: 'test',
    RATE_LIMIT_WINDOW_MS: '60000',
    RATE_LIMIT_MAX: '20',
    TRUST_PROXY_HOPS: '0',
    ...overrides,
  };
}

describe('application perimeter', () => {
  it('keeps the health endpoint outside the submission rate limit', async () => {
    const app = createApp(createEnvironment({ RATE_LIMIT_MAX: '1' }));

    await request(app).get('/health').expect(200);
    await request(app).get('/health').expect(200);
  });

  it('limits repeated complaint submissions', async () => {
    const app = createApp(createEnvironment({ RATE_LIMIT_MAX: '2' }));

    await request(app).post('/api/denuncias').send({ denuncia: '{invalid' }).expect(400);
    await request(app).post('/api/denuncias').send({ denuncia: '{invalid' }).expect(400);
    const response = await request(app)
      .post('/api/denuncias')
      .send({ denuncia: '{invalid' })
      .expect(429);

    expect(response.body).toEqual(
      expect.objectContaining({ erro: 'Muitas tentativas de envio' }),
    );
  });

  it('allows only the configured frontend origin in production', async () => {
    const frontendUrl = 'https://denuncias.mpt.mp.br';
    const app = createApp(createEnvironment({
      NODE_ENV: 'production',
      FRONTEND_URL: frontendUrl,
    }));

    const allowedResponse = await request(app)
      .get('/health')
      .set('Origin', frontendUrl)
      .expect(200);
    const localResponse = await request(app)
      .get('/health')
      .set('Origin', 'http://localhost:4201')
      .expect(200);

    expect(allowedResponse.headers['access-control-allow-origin']).toBe(frontendUrl);
    expect(localResponse.headers['access-control-allow-origin']).toBeUndefined();
  });

  it('keeps Swagger disabled by default in production', async () => {
    const app = createApp(createEnvironment({ NODE_ENV: 'production' }));

    await request(app).get('/api-docs/').expect(404);
  });

  it('allows an explicit Swagger opt-in in production', async () => {
    const app = createApp(createEnvironment({
      NODE_ENV: 'production',
      ENABLE_API_DOCS: 'true',
    }));

    await request(app).get('/api-docs/').expect(200);
  });
});
