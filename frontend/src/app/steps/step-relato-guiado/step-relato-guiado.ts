import { Component, inject, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { taxonomia } from '../../shared/taxonomia';
import { RelatoStateService } from '../../services/relato-state.service';
import { SttClientService } from '../../services/stt-client.service';
import { AudioRecorderComponent } from './audio-recorder';
import { Icon } from '../../shared/icon';

@Component({
  selector: 'app-step-relato-guiado',
  standalone: true,
  imports: [FormsModule, AudioRecorderComponent, Icon],
  templateUrl: './step-relato-guiado.html',
  styleUrl: './step-relato-guiado.css',
})
export class StepRelatoGuiado {
  protected readonly state = inject(RelatoStateService);
  private readonly stt = inject(SttClientService);
  protected readonly taxonomia = taxonomia;
  protected readonly consentDialog = signal(false);
  protected readonly audioEnabled = signal(false);
  protected readonly microphoneUnavailable = signal(false);

  /** Paginação em bolinhas do carrossel horizontal de irregularidades (mockup). */
  protected readonly dotCount = Math.max(1, Math.ceil(this.taxonomia.length / 2));
  protected readonly dots = Array.from({ length: this.dotCount }, (_, i) => i);
  protected readonly activeDot = signal(0);
  readonly advance = output<void>();
  readonly voltar = output<void>();

  protected toggle(code: string): void { this.state.toggleIrregularidade(code); }

  protected onChecklistScroll(event: Event): void {
    const el = event.target as HTMLElement;
    const maxScroll = el.scrollWidth - el.clientWidth;
    if (maxScroll <= 0) {
      this.activeDot.set(0);
      return;
    }
    const ratio = el.scrollLeft / maxScroll;
    this.activeDot.set(Math.round(ratio * (this.dotCount - 1)));
  }

  protected goNext(): void { this.advance.emit(); }
  protected goBack(): void { this.voltar.emit(); }
  protected setRelato(value: string): void { this.state.setRelato(value); }
  protected requestAudio(): void { this.consentDialog.set(true); }
  protected declineAudio(): void { this.consentDialog.set(false); this.audioEnabled.set(false); }
  protected acceptAudio(): void { this.consentDialog.set(false); this.audioEnabled.set(true); }
  protected markMicrophoneUnavailable(): void { this.microphoneUnavailable.set(true); }

  protected async transcribe(audio: Blob): Promise<void> {
    this.state.setAudioOriginal(audio);
    const result = await this.stt.transcribe(audio);
    this.state.setTranscricao(result.texto, result.status);
  }
}
