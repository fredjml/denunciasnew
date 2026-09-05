import { Component, ElementRef, signal, viewChild } from '@angular/core';
import { Icon } from '../../shared/icon';

@Component({
  selector: 'app-video-institucional',
  standalone: true,
  imports: [Icon],
  templateUrl: './video-institucional.html',
  styleUrl: './video-institucional.css',
})
export class VideoInstitucional {
  private readonly videoRef = viewChild<ElementRef<HTMLVideoElement>>('videoEl');

  /** Overlay customizado (play + duração) some após o primeiro play, como no mockup — os
   * controles nativos do <video> assumem dali em diante. */
  protected readonly started = signal(false);

  protected play(): void {
    this.started.set(true);
    try {
      // jsdom/happy-dom (ambiente de teste) não implementam HTMLMediaElement.play().
      this.videoRef()?.nativeElement.play()?.catch(() => undefined);
    } catch {
      /* sem suporte de reprodução real no ambiente atual — o estado visual já foi atualizado. */
    }
  }
}
