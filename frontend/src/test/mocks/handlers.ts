import { http, HttpResponse } from 'msw';
import { syntheticMunicipalities } from '../fixtures/fixtures';

export const handlers = [
  http.get('*/api/municipios', ({ request }) => {
    const uf = new URL(request.url).searchParams.get('uf');

    if (uf !== 'SP') {
      return HttpResponse.json({ erro: 'UF_NAO_SUPORTADA_NO_MOCK' }, { status: 400 });
    }

    return HttpResponse.json(syntheticMunicipalities);
  }),
  http.post('*/api/stt', ({ request }) => {
    const scenario = request.headers.get('x-synthetic-stt-scenario');
    if (scenario === 'FALHA') {
      return HttpResponse.json({ status: 'FALHA', texto: '' }, { status: 503 });
    }
    if (scenario === 'TIMEOUT') {
      return HttpResponse.json({ status: 'TIMEOUT', texto: '' });
    }
    return HttpResponse.json({
      status: 'CONCLUIDA',
      texto: 'SYN-TRANSCRICAO: relato de teste gerado artificialmente.',
    });
  }),
];
