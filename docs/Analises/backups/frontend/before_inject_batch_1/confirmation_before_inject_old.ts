import { Component } from '@angular/core';
import { ComplaintService } from '../../services/complaint.service';

@Component({
  selector: 'app-confirmation',
  standalone: true,
  templateUrl: './confirmation.html',
  styleUrl: './confirmation.css'
})
export class ConfirmationComponent {
  constructor(public svc: ComplaintService) {}

  novasDenuncia(): void { this.svc.reset(); }
}
