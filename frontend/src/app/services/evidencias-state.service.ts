import { Injectable, signal } from '@angular/core';
import { createPersistedSignal } from '../shared/persisted-signal';

export const MIME_PERMITIDOS = ['application/pdf', 'image/jpeg', 'image/png'] as const;
export const MAX_ARQUIVOS = 10;
export const MAX_TAMANHO_BYTES = 20 * 1024 * 1024; // 20 MiB por arquivo — default DEC-DN-15

export interface EvidenciaArquivo {
  readonly nome: string;
  readonly tamanho: number;
  readonly tipo: string;
  readonly arquivo: File;
}

/**
 * DEC-DN-16: só coletamos "há testemunhas? sim/não". Nome/contato da testemunha NÃO são
 * coletados neste formulário — ficam para a investigação formal, fora do app (decisão do owner
 * de 2026-09-05, ver 12-DECISIONS.delta-denunciasnew.md).
 */
export type TemTestemunhas = 'SIM' | 'NAO' | '';

@Injectable({ providedIn: 'root' })
export class EvidenciasStateService {
  private readonly arquivosState = signal<readonly EvidenciaArquivo[]>([]);
  private readonly errosState = signal<readonly string[]>([]);
  private readonly temTestemunhasState = createPersistedSignal<TemTestemunhas>('evidencias_tem_testemunhas', '');

  readonly arquivos = this.arquivosState.asReadonly();
  readonly erros = this.errosState.asReadonly();
  readonly temTestemunhas = this.temTestemunhasState.value;

  setTemTestemunhas(value: TemTestemunhas): void {
    this.temTestemunhasState.set(value);
  }

  adicionar(files: readonly File[]): void {
    const erros: string[] = [];
    const aceitos: EvidenciaArquivo[] = [];
    const totalAtual = this.arquivosState().length;

    for (const file of files) {
      if (totalAtual + aceitos.length >= MAX_ARQUIVOS) {
        erros.push(`Limite de ${MAX_ARQUIVOS} arquivos atingido: "${file.name}" não foi adicionado.`);
        continue;
      }
      if (!MIME_PERMITIDOS.includes(file.type as (typeof MIME_PERMITIDOS)[number])) {
        erros.push(`Tipo de arquivo não permitido: "${file.name}". Envie PDF, JPG ou PNG.`);
        continue;
      }
      if (file.size > MAX_TAMANHO_BYTES) {
        erros.push(`"${file.name}" excede o limite de 20 MB.`);
        continue;
      }
      aceitos.push({ nome: file.name, tamanho: file.size, tipo: file.type, arquivo: file });
    }

    if (aceitos.length > 0) {
      this.arquivosState.update((current) => [...current, ...aceitos]);
    }
    this.errosState.set(erros);
  }

  remover(nome: string): void {
    this.arquivosState.update((current) => current.filter((item) => item.nome !== nome));
  }
}
