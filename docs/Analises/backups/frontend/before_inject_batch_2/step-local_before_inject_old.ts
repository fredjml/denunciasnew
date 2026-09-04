import { Component, signal, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ComplaintService } from '../../../services/complaint.service';
import { ESTADOS_UF } from '../../../models/complaint.model';

@Component({
  selector: 'app-step-local',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './step-local.html',
  styleUrl: './step-local.css'
})
export class StepLocalComponent implements OnDestroy {
  readonly estados = ESTADOS_UF;
  uf = signal('');
  municipio = signal('');
  nomeEmpresa = signal('');
  enderecoEmpresa = signal('');
  cnpj = signal('');

  constructor(public svc: ComplaintService) {
    const c = this.svc.complaint();
    this.uf.set(c.uf);
    this.municipio.set(c.municipio);
    this.nomeEmpresa.set(c.nome_empresa ?? '');
    this.enderecoEmpresa.set(c.endereco_empresa ?? '');
    this.cnpj.set(c.cnpj_empresa ?? '');
  }

  formatCnpj(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');
    if (value.length > 14) value = value.slice(0, 14);
    value = value
      .replace(/^(\d{2})(\d)/, '$1.$2')
      .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d)/, '.$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2');
    input.value = value;
    this.cnpj.set(value);
  }

  save(): void {
    this.svc.updateComplaint({
      uf: this.uf(),
      municipio: this.municipio(),
      nome_empresa: this.nomeEmpresa(),
      endereco_empresa: this.enderecoEmpresa(),
      cnpj_empresa: this.cnpj()
    });
  }

  revisar(): void { this.save(); this.svc.nextStep(); }
  voltar(): void  { this.save(); this.svc.prevStep(); }

  ngOnDestroy(): void {
    this.save();
  }
}
