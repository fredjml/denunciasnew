import { Component, signal } from '@angular/core';
import { StepAcolhimento } from './steps/step-acolhimento/step-acolhimento';
import { StepRelatoGuiado } from './steps/step-relato-guiado/step-relato-guiado';
import { StepDetalhamento } from './steps/step-detalhamento/step-detalhamento';
import { StepEvidencias } from './steps/step-evidencias/step-evidencias';

type WizardStep = 'ACOLHIMENTO' | 'RELATO' | 'DETALHAMENTO' | 'EVIDENCIAS';

@Component({
  imports: [StepAcolhimento, StepRelatoGuiado, StepDetalhamento, StepEvidencias],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly currentStep = signal<WizardStep>('ACOLHIMENTO');

  protected startReport(choice: string): void {
    if (choice !== 'OUVIDORIA') this.currentStep.set('RELATO');
  }

  protected goToDetalhamento(): void {
    this.currentStep.set('DETALHAMENTO');
  }

  protected goToEvidencias(): void {
    this.currentStep.set('EVIDENCIAS');
  }
}
