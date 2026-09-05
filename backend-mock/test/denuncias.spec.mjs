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

  it('rejeita anexo com extensão bloqueada — mesma política de /api/evidencias', async () => {
    const res = await request(createApp())
      .post('/api/denuncias')
      .field('denuncia', denunciaValida())
      .attach('arquivo_1', Buffer.from('binario'), { filename: 'SYN-malicioso.exe', contentType: 'application/octet-stream' });

    expect(res.status).toBe(422);
    expect(res.body.codigo).toBe('EXTENSAO_BLOQUEADA');
  });

  it('rejeita anexo cujo conteúdo não bate com o MIME declarado (spoof)', async () => {
    const res = await request(createApp())
      .post('/api/denuncias')
      .field('denuncia', denunciaValida())
      .attach('arquivo_1', Buffer.from('nao e um pdf de verdade'), {
        filename: 'SYN-falso.pdf',
        contentType: 'application/pdf',
      });

    expect(res.status).toBe(422);
    expect(res.body.codigo).toBe('MAGIC_BYTES_DIVERGENTE');
  });

  it('rejeita áudio com assinatura EICAR (mock ClamAV) mesmo vindo pelo caminho real de envio', async () => {
    const audioInfectado = Buffer.concat([
      Buffer.from('RIFF'),
      Buffer.from('X5O!P%@AP[4\\PZX54(P^)7CC)7}$EICAR-STANDARD-ANTIVIRUS-TEST-FILE!$H+H*'),
    ]);
    const res = await request(createApp())
      .post('/api/denuncias')
      .field('denuncia', denunciaValida())
      .attach('arquivo_audio', audioInfectado, { filename: 'relato-audio.wav', contentType: 'audio/wav' });

    expect(res.status).toBe(422);
    expect(res.body.codigo).toBe('ARQUIVO_INFECTADO');
  });

  it('aceita um áudio de relato válido (WAV) como arquivo_audio', async () => {
    const audioValido = Buffer.concat([Buffer.from('RIFF'), Buffer.from('conteudo sintetico de audio')]);
    const res = await request(createApp())
      .post('/api/denuncias')
      .field('denuncia', denunciaValida())
      .attach('arquivo_audio', audioValido, { filename: 'relato-audio.wav', contentType: 'audio/wav' });

    expect(res.status).toBe(201);
  });
});
