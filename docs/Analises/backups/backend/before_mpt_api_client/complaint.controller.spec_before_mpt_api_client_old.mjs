import { createRequire } from 'node:module';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const require = createRequire(import.meta.url);
const axios = require('axios');
const { receberDenuncia } = require('./complaint.controller.js');

function createResponse() {
  const response = {
    status: vi.fn(),
    json: vi.fn(),
  };
  response.status.mockReturnValue(response);
  response.json.mockReturnValue(response);
  return response;
}

function createValidRequest() {
  return {
    body: {
      denuncia: JSON.stringify({
        uf: 'SP',
        municipio: 'São Paulo',
        irregularidades: ['assedio'],
        relato_texto: 'Relato de teste',
        tipo_identificacao: 'anonimo',
      }),
    },
    files: [],
  };
}

describe('receberDenuncia', () => {
  beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation(() => undefined);
    vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    delete process.env.MPT_API_URL;
    delete process.env.MPT_API_TOKEN;
  });

  afterEach(() => {
    vi.restoreAllMocks();
    delete process.env.MPT_API_URL;
    delete process.env.MPT_API_TOKEN;
  });

  it('returns 400 when the complaint field is not valid JSON', async () => {
    const request = { body: { denuncia: '{invalid' }, files: [] };
    const response = createResponse();
    const next = vi.fn();

    await receberDenuncia(request, response, next);

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({ erro: 'Dados da denúncia inválidos' }),
    );
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 422 when required complaint data is missing', async () => {
    const request = { body: { denuncia: '{}' }, files: [] };
    const response = createResponse();
    const next = vi.fn();

    await receberDenuncia(request, response, next);

    expect(response.status).toHaveBeenCalledWith(422);
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({ erro: 'Dados incompletos' }),
    );
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 201 after the internal MPT API accepts the complaint', async () => {
    process.env.MPT_API_URL = 'https://mpt.invalid/denuncias';
    const post = vi.spyOn(axios, 'post').mockResolvedValue({ status: 201 });
    const request = createValidRequest();
    const response = createResponse();
    const next = vi.fn();

    await receberDenuncia(request, response, next);

    expect(post).toHaveBeenCalledOnce();
    expect(response.status).toHaveBeenCalledWith(201);
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({ sucesso: true, protocolo: expect.stringMatching(/^MPT-/) }),
    );
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 502 without a success response when the internal MPT API fails', async () => {
    process.env.MPT_API_URL = 'https://mpt.invalid/denuncias';
    vi.spyOn(axios, 'post').mockRejectedValue(new Error('API indisponível'));
    const request = createValidRequest();
    const response = createResponse();
    const next = vi.fn();

    await receberDenuncia(request, response, next);

    expect(response.status).toHaveBeenCalledWith(502);
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({ erro: 'Falha ao encaminhar denúncia' }),
    );
    expect(response.json).not.toHaveBeenCalledWith(expect.objectContaining({ sucesso: true }));
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 503 without a success response when MPT_API_URL is absent', async () => {
    const post = vi.spyOn(axios, 'post');
    const request = createValidRequest();
    const response = createResponse();
    const next = vi.fn();

    await receberDenuncia(request, response, next);

    expect(post).not.toHaveBeenCalled();
    expect(response.status).toHaveBeenCalledWith(503);
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({ erro: 'Serviço de recebimento indisponível' }),
    );
    expect(response.json).not.toHaveBeenCalledWith(expect.objectContaining({ sucesso: true }));
    expect(next).not.toHaveBeenCalled();
  });
});
