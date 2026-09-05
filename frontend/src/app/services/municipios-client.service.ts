import { Injectable } from '@angular/core';
import fallback from '../../assets/municipios-ibge-fallback.json';

export interface Municipio {
  readonly codigo_ibge: string;
  readonly nome: string;
  readonly uf: string;
}

@Injectable({ providedIn: 'root' })
export class MunicipiosClientService {
  async listar(uf: string): Promise<Municipio[]> {
    try {
      const response = await fetch(`/api/municipios?uf=${encodeURIComponent(uf)}`);
      if (!response.ok) throw new Error('IBGE_INDISPONIVEL');
      return (await response.json()) as Municipio[];
    } catch {
      return fallback.filter((municipio) => municipio.uf === uf);
    }
  }
}
