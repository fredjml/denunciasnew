import { TestBed } from '@angular/core/testing';
import { SttClientService } from './stt-client.service';

describe('SttClientService mock', () => {
  it.each([
    ['CONCLUIDA', 'CONCLUIDA'],
    ['FALHA', 'FALHA'],
    ['TIMEOUT', 'TIMEOUT'],
  ] as const)('retorna o cenário sintético %s', async (scenario, expected) => {
    const service = TestBed.inject(SttClientService);
    const result = await service.transcribe(new Blob(['SYN-AUDIO']), scenario);

    expect(result.status).toBe(expected);
  });
});
