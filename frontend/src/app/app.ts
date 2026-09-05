import { Component, computed } from '@angular/core';
import { createPersistedSignal } from './shared/persisted-signal';
import { StepAcolhimento } from './steps/step-acolhimento/step-acolhimento';
import { StepRelatoGuiado } from './steps/step-relato-guiado/step-relato-guiado';
import { StepDetalhamento } from './steps/step-detalhamento/step-detalhamento';
import { StepEvidencias } from './steps/step-evidencias/step-evidencias';
import { StepSigiloAnonimato } from './steps/step-sigilo-anonimato/step-sigilo-anonimato';
import { StepLocal } from './steps/step-local/step-local';
import { StepRevisao } from './steps/step-revisao/step-revisao';
import { StepConfirmacao } from './steps/step-confirmacao/step-confirmacao';
import { DenunciaAceita } from './services/complaint-submission.service';
import { AcolhimentoChoice } from './services/acolhimento-state.service';

type WizardStep =
  | 'ACOLHIMENTO'
  | 'RELATO'
  | 'DETALHAMENTO'
  | 'EVIDENCIAS'
  | 'SIGILO'
  | 'LOCAL'
  | 'REVISAO'
  | 'CONFIRMACAO';
type WizardTab = 'ACOLHIMENTO' | 'RELATO' | 'EMPRESA' | 'REVISAO';

const RELATO_STEPS: readonly WizardStep[] = ['RELATO', 'DETALHAMENTO', 'EVIDENCIAS', 'SIGILO'];

// FATIA-DN-CP1-03 — URL fornecida pelo owner em 2026-09-05. Não é um domínio do MPT; confirmada
// explicitamente pelo owner após alerta (ver docs/preparacao-implementacao/12-DECISIONS.delta-denunciasnew.md).
const URL_OUVIDORIA = 'https://www.proteste.org.br/';

@Component({
  imports: [
    StepAcolhimento,
    StepRelatoGuiado,
    StepDetalhamento,
    StepEvidencias,
    StepSigiloAnonimato,
    StepLocal,
    StepRevisao,
    StepConfirmacao,
  ],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  private readonly currentStepState = createPersistedSignal<WizardStep>('wizard_step', 'ACOLHIMENTO');
  private readonly protocoloState = createPersistedSignal('protocolo', '');
  protected readonly currentStep = this.currentStepState.value;
  protected readonly protocolo = this.protocoloState.value;

  protected readonly currentTab = computed<WizardTab>(() => {
    const step = this.currentStep();
    if (step === 'ACOLHIMENTO') return 'ACOLHIMENTO';
    if (step === 'LOCAL') return 'EMPRESA';
    if (step === 'REVISAO' || step === 'CONFIRMACAO') return 'REVISAO';
    return 'RELATO';
  });

  protected readonly totalRelatoSteps = RELATO_STEPS.length;
  protected readonly relatoStepIndex = computed(() => RELATO_STEPS.indexOf(this.currentStep()));

  /** Único ponto de transição entre passos — adicionar um passo novo não exige um método a mais. */
  protected goTo(step: WizardStep): void {
    this.currentStepState.set(step);
  }

  protected startReport(choice: AcolhimentoChoice): void {
    if (choice === 'OUVIDORIA') {
      window.open(URL_OUVIDORIA, '_blank', 'noopener,noreferrer');
      return;
    }
    this.goTo('RELATO');
  }

  protected onEnviado(resultado: DenunciaAceita): void {
    this.protocoloState.set(resultado.protocolo);
    this.goTo('CONFIRMACAO');
  }

  protected reiniciar(): void {
    sessionStorage.clear();
    location.reload();
  }
}
