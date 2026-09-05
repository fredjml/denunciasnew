import { describe, expect, it } from 'vitest';
import request from 'supertest';
import indexModule from '../src/index.js';

const { createApp } = indexModule;

function denunciaValida(overrides = {}) {
  return JSON.stringify({
    origem: 'WEB',
    irregularidades: [{ codigo: 'FALTA_EPI' }],
    tipo_identificacao: 'ANONIMO',
    uf: 'SP',
    municipio: 'São Paulo',
    ...overrides,
  });
}

describe('POST /api/denuncias', () => {
  it('aceita multipart com denuncia válida e retorna protocolo SYN-*', async () => {
    const res = await request(createApp())
      .post('/api/denuncias')
      .field('denuncia', denunciaValida())
      .attach('arquivo_1', Buffer.from('%PDF-1.4 conteudo'), 'SYN-laudo.pdf');

    expect(res.status).toBe(201);
    expect(res.body.protocolo).toMatch(/^SYN-[A-Z0-9]{8}$/);
    expect(res.body.timestamp).toBeTruthy();
  });

  it('aceita denuncia sem nenhum anexo', async () => {
    const res = await request(createApp()).post('/api/denuncias').field('denuncia', denunciaValida());

    expect(res.status).toBe(201);
  });

  it('rejeita quando falta campo obrigatório', async () => {
    const res = await request(createApp())
      .post('/api/denuncias')
      .field('denuncia', denunciaValida({ uf: undefined }));

    expect(res.status).toBe(400);
    expect(res.body.codigo).toBe('CAMPO_OBRIGATORIO_AUSENTE');
  });

  it('rejeita quando o cliente tenta setar classificacao (R-DN-02)', async () => {
    const res = await request(createApp())
      .post('/api/denuncias')
      .field('denuncia', denunciaValida({ classificacao: { prioridade: 'URGENTE' } }));

    expect(res.status).toBe(400);
    expect(res.body.codigo).toBe('CAMPO_NAO_ACEITO');
  });

  it('rejeita JSON inválido no campo denuncia', async () => {
    const res = await request(createApp()).post('/api/denuncias').field('denuncia', '{invalido');

    expect(res.status).toBe(400);
    expect(res.body.codigo).toBe('DENUNCIA_INVALIDA');
  });
});
