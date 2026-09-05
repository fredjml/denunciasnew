import { Injectable, signal } from '@angular/core';

export const MIME_PERMITIDOS = ['application/pdf', 'image/jpeg', 'image/png'] as const;
export const MAX_ARQUIVOS = 10;
export const MAX_TAMANHO_BYTES = 20 * 1024 * 1024; // 20 MiB por arquivo — default DEC-DN-15

export interface EvidenciaArquivo {
  readonly nome: string;
  readonly tamanho: number;
  readonly tipo: string;
  readonly arquivo: File;
}

@Injectable({ providedIn: 'root' })
export class EvidenciasStateService {
  private readonly arquivosState = signal<readonly EvidenciaArquivo[]>([]);
  private readonly errosState = signal<readonly string[]>([]);

  readonly arquivos = this.arquivosState.asReadonly();
  readonly erros = this.errosState.asReadonly();

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
