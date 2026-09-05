import dados from '../../assets/taxonomia-mock.json';
import { IconName } from './icon';

export interface Irregularidade {
  readonly codigo: string;
  readonly rotulo: string;
  readonly icone: IconName;
}

export const taxonomia = dados as readonly Irregularidade[];

const PORCODIGO = new Map(taxonomia.map((item) => [item.codigo, item]));

/** Única fonte de busca de irregularidade por código — evita repetir `taxonomia.find(...)` em cada consumidor. */
export function buscarIrregularidade(codigo: string): Irregularidade | undefined {
  return PORCODIGO.get(codigo);
}

export function rotuloIrregularidade(codigo: string): string {
  return buscarIrregularidade(codigo)?.rotulo ?? codigo;
}
