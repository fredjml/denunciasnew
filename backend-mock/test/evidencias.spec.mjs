import { describe, expect, it } from 'vitest';
import request from 'supertest';
import indexModule from '../src/index.js';
import clamavMockModule from '../src/services/clamav-mock.js';

const { createApp } = indexModule;
const { EICAR_SIGNATURE } = clamavMockModule;

const PDF_VALIDO = Buffer.concat([Buffer.from('%PDF-1.4\n'), Buffer.from('conteudo sintetico')]);
const PNG_VALIDO = Buffer.concat([
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  Buffer.from('conteudo sintetico'),
]);

describe('POST /api/evidencias', () => {
  it('aceita PDF dentro do limite com MIME e magic bytes corretos', async () => {
    const res = await request(createApp())
      .post('/api/evidencias')
      .attach('arquivos', PDF_VALIDO, { filename: 'SYN-laudo.pdf', contentType: 'application/pdf' });

    expect(res.status).toBe(201);
    expect(res.body.aceitos).toEqual([{ nome: 'SYN-laudo.pdf', tamanho: PDF_VALIDO.length }]);
  });

  it('rejeita extensão bloqueada (.exe)', async () => {
    const res = await request(createApp())
      .post('/api/evidencias')
      .attach('arquivos', Buffer.from('binario'), {
        filename: 'SYN-malicioso.exe',
        contentType: 'application/octet-stream',
      });

    expect(res.status).toBe(422);
    expect(res.body.codigo).toBe('EXTENSAO_BLOQUEADA');
  });

  it('rejeita MIME não permitido', async () => {
    const res = await request(createApp())
      .post('/api/evidencias')
      .attach('arquivos', Buffer.from('binario'), { filename: 'SYN-doc.docx', contentType: 'application/msword' });

    expect(res.status).toBe(422);
    expect(res.body.codigo).toBe('MIME_NAO_PERMITIDO');
  });

  it('rejeita quando magic bytes divergem do MIME declarado (spoof)', async () => {
    const res = await request(createApp())
      .post('/api/evidencias')
      .attach('arquivos', Buffer.from('nao e um pdf de verdade'), {
        filename: 'SYN-falso.pdf',
        contentType: 'application/pdf',
      });

    expect(res.status).toBe(422);
    expect(res.body.codigo).toBe('MAGIC_BYTES_DIVERGENTE');
  });

  it('rejeita conteúdo com assinatura EICAR (mock ClamAV)', async () => {
    const conteudoInfectado = Buffer.concat([
      Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
      Buffer.from(EICAR_SIGNATURE),
    ]);

    const res = await request(createApp())
      .post('/api/evidencias')
      .attach('arquivos', conteudoInfectado, { filename: 'SYN-infectado.png', contentType: 'image/png' });

    expect(res.status).toBe(422);
    expect(res.body.codigo).toBe('ARQUIVO_INFECTADO');
  });

  it('rejeita além do limite de 10 arquivos', async () => {
    const req = request(createApp()).post('/api/evidencias');
    for (let i = 0; i < 11; i += 1) {
      req.attach('arquivos', PNG_VALIDO, { filename: `SYN-${i}.png`, contentType: 'image/png' });
    }
    const res = await req;

    expect(res.status).toBe(422);
    expect(res.body.codigo).toBe('LIMITE_EXCEDIDO');
  });
});
