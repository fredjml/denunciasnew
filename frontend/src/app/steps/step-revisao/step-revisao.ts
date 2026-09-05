import { Component, inject, output, signal } from '@angular/core';
import taxonomia from '../../../assets/taxonomia-mock.json';
import { RelatoStateService } from '../../services/relato-state.service';
import { DetalhamentoStateService } from '../../services/detalhamento-state.service';
import { EvidenciasStateService } from '../../services/evidencias-state.service';
import { SigiloStateService } from '../../services/sigilo-state.service';
import { LocalStateService } from '../../services/local-state.service';
import { ComplaintSubmissionService, DenunciaAceita } from '../../services/complaint-submission.service';

@Component({
  selector: 'app-step-revisao',
  standalone: true,
  templateUrl: './step-revisao.html',
  styleUrl: './step-revisao.css',
})
export class StepRevisao {
  protected readonly relato = inject(RelatoStateService);
  protected readonly detalhamento = inject(DetalhamentoStateService);
  protected readonly evidencias = inject(EvidenciasStateService);
  protected readonly sigilo = inject(SigiloStateService);
  protected readonly local = inject(LocalStateService);
  private readonly submission = inject(ComplaintSubmissionService);

  protected readonly enviando = signal(false);
  protected readonly erroEnvio = signal<string | null>(null);

  readonly editarRelato = output<void>();
  readonly editarDetalhamento = output<void>();
  readonly editarEvidencias = output<void>();
  readonly editarSigilo = output<void>();
  readonly editarLocal = output<void>();
  readonly enviado = output<DenunciaAceita>();

  protected rotuloIrregularidade(codigo: string): string {
    return taxonomia.find((item) => item.codigo === codigo)?.rotulo ?? codigo;
  }

  protected async enviar(): Promise<void> {
    this.enviando.set(true);
    this.erroEnvio.set(null);
    const resultado = await this.submission.enviar();
    this.enviando.set(false);

    if ('erro' in resultado) {
      this.erroEnvio.set(resultado.erro.mensagem);
      return;
    }
    this.enviado.emit(resultado);
  }
}
