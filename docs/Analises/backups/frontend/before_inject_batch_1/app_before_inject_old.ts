import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComplaintService } from './services/complaint.service';
import { AcolhimentoComponent } from './components/acolhimento/acolhimento';
import { StepIrregularidadesComponent } from './components/form-steps/relato-section/step-irregularidades/step-irregularidades';
import { StepOcorrenciasComponent } from './components/form-steps/relato-section/step-ocorrencias/step-ocorrencias';
import { StepEvidenciasComponent } from './components/form-steps/relato-section/step-evidencias/step-evidencias';
import { StepIdentificacaoComponent } from './components/form-steps/relato-section/step-identificacao/step-identificacao';
import { StepLocalComponent } from './components/empresa-section/step-local/step-local';
import { StepRevisaoComponent } from './components/revisao-section/step-revisao/step-revisao';
import { ConfirmationComponent } from './components/confirmation/confirmation';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    AcolhimentoComponent,
    StepIrregularidadesComponent,
    StepOcorrenciasComponent,
    StepEvidenciasComponent,
    StepIdentificacaoComponent,
    StepLocalComponent,
    StepRevisaoComponent,
    ConfirmationComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  readonly currentYear = new Date().getFullYear();

  constructor(public svc: ComplaintService) {}

  // Tab groups: 0=Acolhimento, 1-4=Relato, 5=Empresa, 6=Revisão
  get activeTab(): string {
    const step = this.svc.currentStep();
    if (step === 0) return 'acolhimento';
    if (step >= 1 && step <= 4) return 'relato';
    if (step === 5) return 'empresa';
    return 'revisao';
  }

  isTabEnabled(tab: string): boolean {
    const step = this.svc.currentStep();
    if (tab === 'acolhimento') return true;
    if (tab === 'relato') return step >= 1;
    if (tab === 'empresa') return step >= 5;
    if (tab === 'revisao') return step >= 6;
    return false;
  }

  goToTab(tab: string): void {
    if (!this.isTabEnabled(tab)) return;
    
    switch (tab) {
      case 'acolhimento': this.svc.goToStep(0); break;
      case 'relato': this.svc.goToStep(1); break;
      case 'empresa': this.svc.goToStep(5); break;
      case 'revisao': this.svc.goToStep(6); break;
    }
  }
}
