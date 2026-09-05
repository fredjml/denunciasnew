import { Injectable, inject } from '@angular/core';
import { buscarIrregularidade } from '../shared/taxonomia';
import { RelatoStateService } from './relato-state.service';
import { DetalhamentoStateService } from './detalhamento-state.service';
import { EvidenciasStateService, MAX_ANEXOS_ENVIO } from './evidencias-state.service';
import { SigiloStateService } from './sigilo-state.service';
import { LocalStateService } from './local-state.service';

const NUMERO_TRABALHADORES_MAP: Record<string, string> = {
  '1': 'UM',
  '2-5': 'DOIS_A_CINCO',
  '6-20': 'SEIS_A_VINTE',
  '21-100': 'VINTE_UM_A_CEM',
  '100+': 'MAIS_DE_CEM',
};

const MODALIDADE_MAP: Record<string, string> = {
  presencial: 'PRESENCIAL',
  remoto: 'REMOTO',
  hibrido: 'HIBRIDO',
  informal: 'INFORMAL',
  terceirizado: 'TERCEIRIZADO',
  outra: 'OUTRA',
};

const GRUPO_VULNERAVEL_MAP: Record<string, string> = {
  IDOSOS: 'IDOSO',
  CRIANCAS: 'CRIANCA',
  PCD: 'PESSOA_COM_DEFICIENCIA',
};

const TRANSCRICAO_STATUS_MAP: Record<string, string> = {
  NAO_INICIADA: 'NAO_APLICAVEL',
  CONCLUIDA: 'CONCLUIDA',
  FALHA: 'FALHA',
  TIMEOUT: 'FALHA',
  EDITADA_MANUALMENTE: 'EDITADA_MANUALMENTE',
};

export interface DenunciaAceita {
  readonly protocolo: string;
  readonly timestamp: string;
}

export interface SubmissaoErro {
  readonly codigo: string;
  readonly mensagem: string;
}

@Injectable({ providedIn: 'root' })
export class ComplaintSubmissionService {
  private readonly relato = inject(RelatoStateService);
  private readonly detalhamento = inject(DetalhamentoStateService);
  private readonly evidencias = inject(EvidenciasStateService);
  private readonly sigilo = inject(SigiloStateService);
  private readonly local = inject(LocalStateService);

  /** Monta o objeto `Complaint` exatamente no formato de `contract/openapi.yaml` — nunca inventar campos fora dele (R-DN-06). */
  buildPayload(): Record<string, unknown> {
    const identificado = this.sigilo.tipoIdentificacao() === 'IDENTIFICADO';
    // Regra única "só preenche quando identificado" — evita repetir o mesmo ternário por campo.
    const soSeIdentificado = (valor: string): string | undefined => (identificado ? valor || undefined : undefined);

    const payload: Record<string, unknown> = {
      origem: 'WEB',
      irregularidades: this.relato.irregularidades().map((codigo) => {
        const item = buscarIrregularidade(codigo);
        return { codigo, rotulo: item?.rotulo, icone: item?.icone };
      }),
      relato_texto: this.relato.relato() || undefined,
      relato_audio_transcricao: this.relato.transcricao() || undefined,
      relato_audio_transcricao_status: TRANSCRICAO_STATUS_MAP[this.relato.transcricaoStatus()],
      numero_prejudicados: NUMERO_TRABALHADORES_MAP[this.detalhamento.numeroTrabalhadores()],
      modalidade_trabalho: MODALIDADE_MAP[this.detalhamento.modalidadeTrabalho()],
      grupos_vulneraveis: this.detalhamento
        .gruposVulneraveis()
        .map((codigo) => GRUPO_VULNERAVEL_MAP[codigo])
        .filter(Boolean),
      tipo_identificacao: this.sigilo.tipoIdentificacao() || 'ANONIMO',
      nome_completo: soSeIdentificado(this.sigilo.nomeCompleto()),
      email: soSeIdentificado(this.sigilo.email()),
      telefone: soSeIdentificado(this.sigilo.telefone()),
      uf: this.local.uf(),
      municipio: this.local.municipio(),
      municipio_ibge: this.local.municipioIbge() || undefined,
      nome_empresa: this.local.nomeEmpresa() || undefined,
      endereco_empresa: this.local.enderecoEmpresa() || undefined,
      // DEC-DN-16: só sim/não — nome/contato da testemunha não são coletados neste formulário.
      testemunhas:
        this.evidencias.temTestemunhas() === ''
          ? undefined
          : [{ tem_testemunhas: this.evidencias.temTestemunhas() === 'SIM' }],
      consentimento_lgpd: this.sigilo.avisoConfirmado(),
    };

    return Object.fromEntries(Object.entries(payload).filter(([, value]) => value !== undefined));
  }

  async enviar(): Promise<DenunciaAceita | { erro: SubmissaoErro }> {
    const formData = new FormData();
    formData.append('denuncia', JSON.stringify(this.buildPayload()));

    // contract/openapi.yaml só reserva `MAX_ANEXOS_ENVIO` slots nomeados; o restante, se houver,
    // já foi avisado ao usuário na tela de Evidências (`EvidenciasStateService.excedeLimiteEnvio`).
    this.evidencias
      .arquivos()
      .slice(0, MAX_ANEXOS_ENVIO)
      .forEach((arquivo, index) => {
        formData.append(`arquivo_${index + 1}`, arquivo.arquivo, arquivo.nome);
      });

    const audio = this.relato.audioOriginal();
    if (audio) {
      formData.append('arquivo_audio', audio, 'relato-audio.webm');
    }

    const response = await fetch('/api/denuncias', { method: 'POST', body: formData });
    const body = await response.json();
    if (!response.ok) {
      return { erro: body as SubmissaoErro };
    }
    return body as DenunciaAceita;
  }
}
