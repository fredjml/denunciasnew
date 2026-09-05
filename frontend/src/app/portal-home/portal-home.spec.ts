import { TestBed } from '@angular/core/testing';
import { PortalHome } from './portal-home';

describe('PortalHome', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [PortalHome] }).compileComponents();
  });

  it('renderiza os 6 tiles de Acesso Rápido', () => {
    const fixture = TestBed.createComponent(PortalHome);
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;

    const tiles = host.querySelectorAll('[data-testid="acesso-rapido-tiles"] .tile');
    expect(tiles.length).toBe(6);
  });

  it('todos os tiles abrem em nova aba, com noopener/noreferrer', () => {
    const fixture = TestBed.createComponent(PortalHome);
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;

    const links = Array.from(host.querySelectorAll<HTMLAnchorElement>('[data-testid="acesso-rapido-tiles"] a.tile'));
    expect(links.length).toBe(6);
    for (const link of links) {
      expect(link.target).toBe('_blank');
      expect(link.rel).toContain('noopener');
      expect(link.getAttribute('href')).toBeTruthy();
    }
  });

  it('o tile Ouvidoria aponta para a mesma URL usada no Acolhimento', () => {
    const fixture = TestBed.createComponent(PortalHome);
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;

    const ouvidoria = Array.from(host.querySelectorAll<HTMLAnchorElement>('a.tile')).find((a) =>
      a.textContent?.includes('Ouvidoria'),
    );
    expect(ouvidoria?.getAttribute('href')).toBe('https://www.proteste.org.br/');
  });

  it('emite denunciar() ao clicar no botão fixo "Denuncie"', () => {
    const fixture = TestBed.createComponent(PortalHome);
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    let emitted = false;
    fixture.componentInstance.denunciar.subscribe(() => (emitted = true));

    (host.querySelector('[data-testid="portal-denuncie"]') as HTMLButtonElement).click();

    expect(emitted).toBe(true);
  });
});
