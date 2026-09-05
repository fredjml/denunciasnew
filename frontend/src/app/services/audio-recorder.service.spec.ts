import { TestBed } from '@angular/core/testing';
import { MEDIA_DEVICES, MEDIA_RECORDER_FACTORY, AudioRecorderService } from './audio-recorder.service';

class FakeRecorder {
  state = 'inactive';
  ondataavailable: ((event: { data: Blob }) => void) | null = null;
  onstop: (() => void) | null = null;

  start(): void { this.state = 'recording'; }
  stop(): void {
    this.state = 'inactive';
    this.ondataavailable?.({ data: new Blob(['SYN-AUDIO'], { type: 'audio/webm' }) });
    this.onstop?.();
  }
}

describe('AudioRecorderService', () => {
  it('inicia e encerra uma gravação sintética', async () => {
    const track = { stop: vi.fn() };
    const stream = { getTracks: () => [track] } as unknown as MediaStream;
    TestBed.configureTestingModule({
      providers: [
        { provide: MEDIA_DEVICES, useValue: { getUserMedia: vi.fn().mockResolvedValue(stream) } },
        { provide: MEDIA_RECORDER_FACTORY, useValue: () => new FakeRecorder() },
      ],
    });
    const service = TestBed.inject(AudioRecorderService);

    expect(service.recording()).toBe(false);
    await service.start();
    expect(service.recording()).toBe(true);
    const audio = await service.stop();

    expect(audio.type).toBe('audio/webm');
    expect(audio.size).toBeGreaterThan(0);
    expect(track.stop).toHaveBeenCalled();
    expect(service.recording()).toBe(false);
  });
});
