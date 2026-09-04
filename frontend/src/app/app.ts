import { Component, signal } from '@angular/core';
import { StepAcolhimento } from './steps/step-acolhimento/step-acolhimento';
import { StepRelatoGuiado } from './steps/step-relato-guiado/step-relato-guiado';

@Component({
  imports: [StepAcolhimento, StepRelatoGuiado],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly currentStep = signal<'ACOLHIMENTO' | 'RELATO'>('ACOLHIMENTO');
  protected startReport(choice: string): void {
    if (choice !== 'OUVIDORIA') this.currentStep.set('RELATO');
  }
}
