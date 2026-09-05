import { Component, computed, signal } from '@angular/core';
import { StepAcolhimento } from './steps/step-acolhimento/step-acolhimento';
import { StepRelatoGuiado } from './steps/step-relato-guiado/step-relato-guiado';
import { StepDetalhamento } from './steps/step-detalhamento/step-detalhamento';
import { StepEvidencias } from './steps/step-evidencias/step-evidencias';
import { Icon } from './shared/icon';

type WizardStep = 'ACOLHIMENTO' | 'RELATO' | 'DETALHAMENTO' | 'EVIDENCIAS';
type WizardTab = 'ACOLHIMENTO' | 'RELATO' | 'EMPRESA' | 'REVISAO';

const RELATO_STEPS: readonly WizardStep[] = ['RELATO', 'DETALHAMENTO', 'EVIDENCIAS'];

@Component({
  imports: [StepAcolhimento, StepRelatoGuiado, StepDetalhamento, StepEvidencias, Icon],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly currentStep = signal<WizardStep>('ACOLHIMENTO');

  protected readonly currentTab = computed<WizardTab>(() =>
    this.currentStep() === 'ACOLHIMENTO' ? 'ACOLHIMENTO' : 'RELATO',
  );

  protected readonly totalRelatoSteps = RELATO_STEPS.length;
  protected readonly relatoStepIndex = computed(() => RELATO_STEPS.indexOf(this.currentStep()));

  protected startReport(choice: string): void {
    if (choice !== 'OUVIDORIA') this.currentStep.set('RELATO');
  }

  protected goToDetalhamento(): void {
    this.currentStep.set('DETALHAMENTO');
  }

  protected goToEvidencias(): void {
    this.currentStep.set('EVIDENCIAS');
  }

  protected goToAcolhimento(): void {
    this.currentStep.set('ACOLHIMENTO');
  }

  protected goToRelato(): void {
    this.currentStep.set('RELATO');
  }
}
