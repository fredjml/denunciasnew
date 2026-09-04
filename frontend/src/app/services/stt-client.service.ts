import { Injectable } from '@angular/core';
import { TranscricaoStatus } from './relato-state.service';

export type SttScenario = 'CONCLUIDA' | 'FALHA' | 'TIMEOUT';
export interface SttResult { readonly status: TranscricaoStatus; readonly texto: string; }

@Injectable({ providedIn: 'root' })
export class SttClientService {
  async transcribe(audio: Blob, scenario: SttScenario = 'CONCLUIDA'): Promise<SttResult> {
    const response = await fetch('/api/stt', {
      method: 'POST',
      body: audio,
      headers: { 'x-synthetic-stt-scenario': scenario },
    });
    if (!response.ok) return { status: 'FALHA', texto: '' };
    return response.json() as Promise<SttResult>;
  }
}
