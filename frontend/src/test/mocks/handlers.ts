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
];
