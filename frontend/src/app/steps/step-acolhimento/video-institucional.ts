import { Component, ElementRef, isDevMode, signal, viewChild } from '@angular/core';
import { Icon } from '../../shared/icon';

// FATIA-DN-CP1-04 (teste local) — vídeo institucional oficial do MPT ainda não foi aprovado
// para produção (DEC-DN-27 fixou só o padrão de hosting, não o conteúdo final). Em build de
// produção o player fica sem fonte (mesmo comportamento anterior); em dev, usa um vídeo real do
// MPT-ES baixado manualmente pelo owner só para QA do player — nunca commitado nem servido em
// produção. Ver docs/preparacao-implementacao/prompts/VERIFICACAO-VIDEO-TESTE-2026-09-05.md.
const VIDEO_TESTE_LOCAL = {
  src: '/media/video-institucional-mpt-es-35-anos.mp4',
  captions: '/media/video-institucional-mpt-es-35-anos.vtt',
  duracao: '1min58s',
};
const VIDEO_PLACEHOLDER = {
  src: '',
  captions: '/media/video-institucional-placeholder.vtt',
  duracao: '45s',
};

@Component({
  selector: 'app-video-institucional',
  standalone: true,
  imports: [Icon],
  templateUrl: './video-institucional.html',
  styleUrl: './video-institucional.css',
})
export class VideoInstitucional {
  private readonly videoRef = viewChild<ElementRef<HTMLVideoElement>>('videoEl');
  private readonly ativo = isDevMode() ? VIDEO_TESTE_LOCAL : VIDEO_PLACEHOLDER;

  /** Overlay customizado (play + duração) some após o primeiro play, como no mockup — os
   * controles nativos do <video> assumem dali em diante. */
  protected readonly started = signal(false);

  protected readonly videoSrc = signal(this.ativo.src);
  protected readonly captionsSrc = signal(this.ativo.captions);
  protected readonly overlayCaption = signal(`Vídeo Explicativo (${this.ativo.duracao})`);
  protected readonly videoAriaLabel = signal(
    isDevMode()
      ? 'Vídeo Explicativo (teste local, conteúdo real do MPT-ES): Vídeo Manifesto, 35 anos'
      : 'Vídeo Explicativo: conheça o papel do MPT'
  );

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
