import { TestBed } from '@angular/core/testing';
import { ComplaintSubmissionService } from './complaint-submission.service';
import { RelatoStateService } from './relato-state.service';
import { DetalhamentoStateService } from './detalhamento-state.service';
import { SigiloStateService } from './sigilo-state.service';
import { LocalStateService } from './local-state.service';
import { EvidenciasStateService } from './evidencias-state.service';

describe('ComplaintSubmissionService', () => {
  beforeEach(() => {
    sessionStorage.clear();
    TestBed.resetTestingModule();
  });
  afterEach(() => vi.unstubAllGlobals());

  function montarEstadoBasico() {
    const relato = TestBed.inject(RelatoStateService);
    const detalhamento = TestBed.inject(DetalhamentoStateService);
    const sigilo = TestBed.inject(SigiloStateService);
    const local = TestBed.inject(LocalStateService);

    relato.toggleIrregularidade('FALTA_EPI');
    relato.setRelato('SYN relato de teste');
    detalhamento.setNumeroTrabalhadores('6-20');
    detalhamento.setModalidadeTrabalho('remoto');
    detalhamento.toggleGrupoVulneravel('IDOSOS');
    sigilo.setTipoIdentificacao('ANONIMO');
    sigilo.setAvisoConfirmado(true);
    local.setUf('SP');
    local.setMunicipio('São Paulo', '3550308');

    return { relato, detalhamento, sigilo, local };
  }

  it('monta o payload traduzindo os códigos internos para os enums do contrato', () => {
    montarEstadoBasico();
    const service = TestBed.inject(ComplaintSubmissionService);

    const payload = service.buildPayload();

    expect(payload['origem']).toBe('WEB');
    expect(payload['numero_prejudicados']).toBe('SEIS_A_VINTE');
    expect(payload['modalidade_trabalho']).toBe('REMOTO');
    expect(payload['grupos_vulneraveis']).toEqual(['IDOSO']);
    expect(payload['tipo_identificacao']).toBe('ANONIMO');
    expect(payload['uf']).toBe('SP');
    expect(payload['municipio']).toBe('São Paulo');
    expect(payload['nome_completo']).toBeUndefined();
    expect((payload['irregularidades'] as unknown[])[0]).toMatchObject({ codigo: 'FALTA_EPI' });
    expect(payload['testemunhas']).toBeUndefined();
  });

  it('inclui testemunhas apenas como sim/não, sem nome ou contato (DEC-DN-16)', () => {
    montarEstadoBasico();
    const evidencias = TestBed.inject(EvidenciasStateService);
    evidencias.setTemTestemunhas('SIM');
    const service = TestBed.inject(ComplaintSubmissionService);

    const payload = service.buildPayload();

    expect(payload['testemunhas']).toEqual([{ tem_testemunhas: true }]);
  });

  it('inclui dados de contato somente quando identificado', () => {
    const { sigilo } = montarEstadoBasico();
    sigilo.setTipoIdentificacao('IDENTIFICADO');
    sigilo.setNomeCompleto('SYN-CIDADAO-001');
    const service = TestBed.inject(ComplaintSubmissionService);

    const payload = service.buildPayload();

    expect(payload['nome_completo']).toBe('SYN-CIDADAO-001');
  });

  it('envia multipart e retorna o protocolo em caso de sucesso', async () => {
    montarEstadoBasico();
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ protocolo: 'SYN-AB3D5F7K', timestamp: '2026-09-05T00:00:00Z' }),
    });
    vi.stubGlobal('fetch', fetchMock);
    const service = TestBed.inject(ComplaintSubmissionService);

    const resultado = await service.enviar();

    expect(fetchMock).toHaveBeenCalledWith('/api/denuncias', expect.objectContaining({ method: 'POST' }));
    expect(resultado).toEqual({ protocolo: 'SYN-AB3D5F7K', timestamp: '2026-09-05T00:00:00Z' });
  });

  it('retorna o erro da API quando a submissão falha', async () => {
    montarEstadoBasico();
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        json: () => Promise.resolve({ codigo: 'CAMPO_OBRIGATORIO_AUSENTE', mensagem: 'Faltou algo' }),
      }),
    );
    const service = TestBed.inject(ComplaintSubmissionService);

    const resultado = await service.enviar();

    expect(resultado).toEqual({ erro: { codigo: 'CAMPO_OBRIGATORIO_AUSENTE', mensagem: 'Faltou algo' } });
  });
});
