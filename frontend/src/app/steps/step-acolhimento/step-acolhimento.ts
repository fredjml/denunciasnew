import { Component, inject, output } from '@angular/core';
import {
  AcolhimentoChoice,
  AcolhimentoStateService,
} from '../../services/acolhimento-state.service';
import { VideoInstitucional } from './video-institucional';
import { Icon, IconName } from '../../shared/icon';

interface AcolhimentoOption {
  readonly id: AcolhimentoChoice;
  readonly label: string;
  readonly description: string;
  readonly icon: IconName;
}

@Component({
  selector: 'app-step-acolhimento',
  standalone: true,
  imports: [VideoInstitucional, Icon],
  templateUrl: './step-acolhimento.html',
  styleUrl: './step-acolhimento.css',
})
export class StepAcolhimento {
  private readonly state = inject(AcolhimentoStateService);

  readonly advance = output<AcolhimentoChoice>();
  protected readonly selected = this.state.selected;
  protected readonly options: readonly AcolhimentoOption[] = [
    {
      id: 'CIDADAO',
      label: 'Denunciar',
      description: 'Para cidadãs e cidadãos que desejam relatar uma irregularidade trabalhista.',
      icon: 'megaphone',
    },
    {
      id: 'AGENTE_PUBLICO',
      label: 'Faz parte de um órgão público e quer denunciar',
      description: 'Para servidoras, servidores e agentes de órgãos públicos.',
      icon: 'building',
    },
    {
      id: 'OUVIDORIA',
      label: 'Tem dúvida? Fale com a Ouvidoria',
      description: 'Para dúvidas, manifestações e orientações antes de fazer uma denúncia.',
      icon: 'chat',
    },
  ];

  protected selectChoice(choice: AcolhimentoChoice): void {
    this.state.select(choice);
  }

  protected continue(): void {
    const choice = this.selected();
    if (choice !== null) {
      this.advance.emit(choice);
    }
  }
}
