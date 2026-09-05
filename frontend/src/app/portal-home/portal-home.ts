import { Component, output } from '@angular/core';
import { Icon, IconName } from '../shared/icon';
import { MPT_LINKS } from '../shared/mpt-links';

interface AcessoRapidoTile {
  readonly label: string;
  readonly icon: IconName;
  readonly href: string | null;
}

@Component({
  selector: 'app-portal-home',
  standalone: true,
  imports: [Icon],
  templateUrl: './portal-home.html',
  styleUrl: './portal-home.css',
})
export class PortalHome {
  readonly denunciar = output<void>();

  protected readonly tiles: readonly AcessoRapidoTile[] = [
    { label: 'Petição eletrônica e protocolo', icon: 'upload', href: MPT_LINKS.peticionamento },
    { label: 'Consulta de Processos', icon: 'search', href: MPT_LINKS.consultaProcessos },
    { label: 'Carta de Serviços', icon: 'inbox', href: MPT_LINKS.cartaDeServicos },
    { label: 'Audiências Públicas', icon: 'scale', href: MPT_LINKS.audienciasPublicas },
    { label: 'Transparência', icon: 'building', href: MPT_LINKS.transparencia },
    { label: 'Ouvidoria', icon: 'chat', href: MPT_LINKS.ouvidoria },
  ];

  protected onDenunciarClick(): void {
    this.denunciar.emit();
  }
}
