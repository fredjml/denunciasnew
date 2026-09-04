import { TestBed } from '@angular/core/testing';
import { VideoInstitucional } from './video-institucional';

describe('VideoInstitucional', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [VideoInstitucional] }).compileComponents();
  });

  it('não usa autoplay e oferece controles e legendas', () => {
    const fixture = TestBed.createComponent(VideoInstitucional);
    fixture.detectChanges();
    const video = fixture.nativeElement.querySelector('video') as HTMLVideoElement;
    const captions = video.querySelector('track[kind="captions"]') as HTMLTrackElement;

    expect(video.autoplay).toBe(false);
    expect(video.controls).toBe(true);
    expect(captions).toBeTruthy();
    expect(captions.default).toBe(true);
  });

  it('mantém uma transcrição textual visível sem exigir reprodução', () => {
    const fixture = TestBed.createComponent(VideoInstitucional);
    fixture.detectChanges();
    const transcript = fixture.nativeElement.querySelector('[data-testid="transcricao-video"]');

    expect(transcript).toBeTruthy();
    expect(transcript.textContent).toContain('Conteúdo institucional pendente');
  });
});
