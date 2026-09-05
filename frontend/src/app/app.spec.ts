import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    sessionStorage.clear();
    await TestBed.configureTestingModule({
      imports: [App],
    })
      .compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('exibe o portal institucional (Acesso Rápido) como entrada do app', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Acesso Rápido');
  });

  it('botão "Denuncie" do portal leva ao Acolhimento', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const host = fixture.nativeElement as HTMLElement;

    (host.querySelector('[data-testid="portal-denuncie"]') as HTMLButtonElement).click();
    fixture.detectChanges();

    expect(host.querySelector('h1')?.textContent).toContain('Denuncie ao MPT');
  });

  it('abre a Ouvidoria em nova aba e permanece no Acolhimento (FATIA-DN-CP1-03)', async () => {
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;

    (host.querySelector('[data-testid="portal-denuncie"]') as HTMLButtonElement).click();
    fixture.detectChanges();
    (host.querySelectorAll('[data-testid="caminho-acolhimento"]')[2] as HTMLButtonElement).click();
    fixture.detectChanges();
    (host.querySelector('[data-testid="avancar"]') as HTMLButtonElement).click();
    fixture.detectChanges();

    expect(openSpy).toHaveBeenCalledWith('https://www.proteste.org.br/', '_blank', 'noopener,noreferrer');
    expect(host.querySelector('h1')?.textContent).toContain('Denuncie ao MPT');
    openSpy.mockRestore();
  });
});
