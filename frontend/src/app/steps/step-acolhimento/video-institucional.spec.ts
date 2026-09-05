import { TestBed } from '@angular/core/testing';
import { VideoInstitucional } from './video-institucional';

describe('VideoInstitucional', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [VideoInstitucional] }).compileComponents();
  });

  it('não usa autoplay, oferece legendas, e só mostra os controles nativos após o play (FATIA-DN-mockup)', () => {
    const fixture = TestBed.createComponent(VideoInstitucional);
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    const video = host.querySelector('video') as HTMLVideoElement;
    const captions = video.querySelector('track[kind="captions"]') as HTMLTrackElement;

    expect(video.autoplay).toBe(false);
    expect(captions).toBeTruthy();
    expect(captions.default).toBe(true);

    // Antes do play: overlay customizado visível, controles nativos ausentes (como no mockup).
    expect(video.controls).toBe(false);
    const overlay = host.querySelector('[data-testid="video-play"]') as HTMLButtonElement;
    expect(overlay).toBeTruthy();

    overlay.click();
    fixture.detectChanges();

    // Após o play: controles nativos assumem, overlay some.
    expect(video.controls).toBe(true);
    expect(host.querySelector('[data-testid="video-play"]')).toBeNull();
  });

  it('mantém uma transcrição textual visível sem exigir reprodução', () => {
    const fixture = TestBed.createComponent(VideoInstitucional);
    fixture.detectChanges();
    const transcript = fixture.nativeElement.querySelector('[data-testid="transcricao-video"]');

    expect(transcript).toBeTruthy();
    expect(transcript.textContent).toContain('Conteúdo institucional pendente');
  });
});
