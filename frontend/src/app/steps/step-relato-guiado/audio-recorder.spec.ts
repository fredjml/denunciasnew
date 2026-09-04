import { TestBed } from '@angular/core/testing';
import { AudioRecorderComponent } from './audio-recorder';
import { AudioRecorderService } from '../../services/audio-recorder.service';

describe('AudioRecorderComponent', () => {
  it('grava e emite o Blob capturado ao parar', async () => {
    const blob = new Blob(['SYN-AUDIO'], { type: 'audio/webm' });
    const service = { start: vi.fn().mockResolvedValue(undefined), stop: vi.fn().mockResolvedValue(blob) };
    TestBed.configureTestingModule({
      imports: [AudioRecorderComponent],
      providers: [{ provide: AudioRecorderService, useValue: service }],
    });
    const fixture = TestBed.createComponent(AudioRecorderComponent);
    let recorded: Blob | undefined;
    fixture.componentInstance.recorded.subscribe((value: Blob) => (recorded = value));
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;

    (host.querySelectorAll('button')[0] as HTMLButtonElement).click();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(service.start).toHaveBeenCalled();

    (host.querySelectorAll('button')[1] as HTMLButtonElement).click();
    await fixture.whenStable();

    expect(service.stop).toHaveBeenCalled();
    expect(recorded).toBe(blob);
  });

  it('mostra fallback e emite microphoneDenied quando o microfone é negado', async () => {
    const service = { start: vi.fn().mockRejectedValue(new Error('NotAllowedError')), stop: vi.fn() };
    TestBed.configureTestingModule({
      imports: [AudioRecorderComponent],
      providers: [{ provide: AudioRecorderService, useValue: service }],
    });
    const fixture = TestBed.createComponent(AudioRecorderComponent);
    let denied = false;
    fixture.componentInstance.microphoneDenied.subscribe(() => (denied = true));
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;

    (host.querySelectorAll('button')[0] as HTMLButtonElement).click();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(denied).toBe(true);
    expect(host.querySelector('[role="alert"]')).toBeTruthy();
  });
});
