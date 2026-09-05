import { Component, computed, signal } from '@angular/core';
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
  protected readonly currentStep = this.currentStepState.value;
  protected readonly protocolo = signal('');

  protected readonly currentTab = computed<WizardTab>(() => {
    const step = this.currentStep();
    if (step === 'ACOLHIMENTO') return 'ACOLHIMENTO';
    if (step === 'LOCAL') return 'EMPRESA';
    if (step === 'REVISAO' || step === 'CONFIRMACAO') return 'REVISAO';
    return 'RELATO';
  });

  protected readonly totalRelatoSteps = RELATO_STEPS.length;
  protected readonly relatoStepIndex = computed(() => RELATO_STEPS.indexOf(this.currentStep()));

  protected startReport(choice: string): void {
    if (choice !== 'OUVIDORIA') this.currentStepState.set('RELATO');
  }

  protected goToDetalhamento(): void {
    this.currentStepState.set('DETALHAMENTO');
  }

  protected goToEvidencias(): void {
    this.currentStepState.set('EVIDENCIAS');
  }

  protected goToSigilo(): void {
    this.currentStepState.set('SIGILO');
  }

  protected goToLocal(): void {
    this.currentStepState.set('LOCAL');
  }

  protected goToRevisao(): void {
    this.currentStepState.set('REVISAO');
  }

  protected goToAcolhimento(): void {
    this.currentStepState.set('ACOLHIMENTO');
  }

  protected goToRelato(): void {
    this.currentStepState.set('RELATO');
  }

  protected onEnviado(resultado: DenunciaAceita): void {
    this.protocolo.set(resultado.protocolo);
    this.currentStepState.set('CONFIRMACAO');
  }

  protected reiniciar(): void {
    sessionStorage.clear();
    location.reload();
  }
}
