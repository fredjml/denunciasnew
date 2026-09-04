import { Component } from '@angular/core';
import { ComplaintService } from '../../services/complaint.service';

@Component({
  selector: 'app-acolhimento',
  standalone: true,
  templateUrl: './acolhimento.html',
  styleUrl: './acolhimento.css'
})
export class AcolhimentoComponent {
  constructor(public svc: ComplaintService) {}

  iniciarDenuncia(): void {
    this.svc.nextStep();
  }
}
