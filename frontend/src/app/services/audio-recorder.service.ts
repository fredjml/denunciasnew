import { InjectionToken, Injectable, inject, signal } from '@angular/core';

interface RecorderPort {
  state: string;
  ondataavailable: ((event: { data: Blob }) => void) | null;
  onstop: (() => void) | null;
  start(): void;
  stop(): void;
}

export const MEDIA_DEVICES = new InjectionToken<Pick<MediaDevices, 'getUserMedia'>>('MEDIA_DEVICES', {
  providedIn: 'root',
  factory: () => navigator.mediaDevices,
});

function adaptNativeRecorder(stream: MediaStream): RecorderPort {
  const native = new MediaRecorder(stream);
  const port: RecorderPort = {
    get state() {
      return native.state;
    },
    ondataavailable: null,
    onstop: null,
    start: () => native.start(),
    stop: () => native.stop(),
  };
  native.ondataavailable = (event) => port.ondataavailable?.({ data: event.data });
  native.onstop = () => port.onstop?.();
  return port;
}

export const MEDIA_RECORDER_FACTORY = new InjectionToken<(stream: MediaStream) => RecorderPort>(
  'MEDIA_RECORDER_FACTORY',
  { providedIn: 'root', factory: () => adaptNativeRecorder },
);

@Injectable({ providedIn: 'root' })
export class AudioRecorderService {
  private readonly mediaDevices = inject(MEDIA_DEVICES);
  private readonly recorderFactory = inject(MEDIA_RECORDER_FACTORY);
  private recorder: RecorderPort | null = null;
  private stream: MediaStream | null = null;
  private chunks: Blob[] = [];
  private readonly recordingState = signal(false);
  readonly recording = this.recordingState.asReadonly();

  async start(): Promise<void> {
    this.stream = await this.mediaDevices.getUserMedia({ audio: true });
    this.recorder = this.recorderFactory(this.stream);
    this.chunks = [];
    this.recorder.ondataavailable = ({ data }) => {
      if (data.size > 0) this.chunks.push(data);
    };
    this.recorder.start();
    this.recordingState.set(true);
  }

  stop(): Promise<Blob> {
    if (!this.recorder || this.recorder.state !== 'recording') {
      return Promise.reject(new Error('GRAVACAO_NAO_INICIADA'));
    }

    return new Promise((resolve) => {
      this.recorder!.onstop = () => {
        this.recordingState.set(false);
        this.stream?.getTracks().forEach((track) => track.stop());
        resolve(new Blob(this.chunks, { type: this.chunks[0]?.type || 'audio/webm' }));
      };
      this.recorder!.stop();
    });
  }
}
