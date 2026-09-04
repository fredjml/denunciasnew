import { Component, inject, output, signal } from '@angular/core';
import { AudioRecorderService } from '../../services/audio-recorder.service';

@Component({
  selector: 'app-audio-recorder',
  standalone: true,
  template: `
    <section class="recorder" aria-labelledby="recorder-title">
      <h3 id="recorder-title">Gravar relato em áudio</h3>
      <p>O áudio deste protótipo é processado somente pelo mock local.</p>
      @if (error()) {
        <p role="alert">Microfone indisponível. Continue usando o campo de texto.</p>
      }
      <div class="recorder-actions">
        <button type="button" [disabled]="active()" (click)="start()">Iniciar gravação</button>
        <button type="button" [disabled]="!active()" (click)="stop()">Parar gravação</button>
      </div>
    </section>
  `,
  styles: [`
    .recorder { padding: var(--space-4); border: 1px solid var(--color-border); border-radius: var(--radius-md); }
    .recorder-actions { display: flex; flex-wrap: wrap; gap: var(--space-3); }
    button { padding: var(--space-2) var(--space-4); }
    [role='alert'] { color: var(--color-danger); font-weight: 700; }
  `],
})
export class AudioRecorderComponent {
  private readonly recorder = inject(AudioRecorderService);
  readonly recorded = output<Blob>();
  readonly microphoneDenied = output<void>();
  protected readonly active = signal(false);
  protected readonly error = signal(false);

  protected async start(): Promise<void> {
    try {
      await this.recorder.start();
      this.active.set(true);
      this.error.set(false);
    } catch {
      this.error.set(true);
      this.microphoneDenied.emit();
    }
  }

  protected async stop(): Promise<void> {
    const blob = await this.recorder.stop();
    this.active.set(false);
    this.recorded.emit(blob);
  }
}
