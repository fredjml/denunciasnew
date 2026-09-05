import { Component, input } from '@angular/core';

export type IconName =
  | 'megaphone'
  | 'building'
  | 'chat'
  | 'mic'
  | 'capacete'
  | 'dialogo'
  | 'calendario'
  | 'upload'
  | 'trash'
  | 'shield-lock'
  | 'play'
  | 'clock'
  | 'users';

@Component({
  selector: 'app-icon',
  standalone: true,
  template: `
    <svg
      [attr.width]="size()"
      [attr.height]="size()"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.75"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      @switch (name()) {
        @case ('megaphone') {
          <path d="M3 11v2a2 2 0 0 0 2 2h1l3 6h2l-2-6h1l9 4V5l-9 4H6a2 2 0 0 0-2 2Z" />
          <path d="M17 9v6" />
        }
        @case ('building') {
          <rect x="4" y="3" width="16" height="18" rx="1" />
          <path d="M9 8h1M14 8h1M9 12h1M14 12h1M9 16h1M14 16h1M10 21v-3h4v3" />
        }
        @case ('chat') {
          <path d="M21 12a8 8 0 1 1-3.6-6.66" />
          <path d="M21 3v6h-6" />
          <path d="M8 12h.01M12 12h.01M16 12h.01" />
        }
        @case ('mic') {
          <rect x="9" y="2" width="6" height="12" rx="3" />
          <path d="M5 10a7 7 0 0 0 14 0" />
          <path d="M12 19v3" />
        }
        @case ('capacete') {
          <path d="M4 14a8 8 0 0 1 16 0v1H4z" />
          <path d="M2 15h20" />
          <path d="M12 6V4" />
        }
        @case ('dialogo') {
          <path d="M4 4h16v11H8l-4 4V4Z" />
        }
        @case ('calendario') {
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M3 10h18M8 3v4M16 3v4" />
        }
        @case ('upload') {
          <path d="M12 16V4M7 9l5-5 5 5" />
          <path d="M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" />
        }
        @case ('trash') {
          <path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" />
        }
        @case ('shield-lock') {
          <path d="M12 3 4 6v6c0 5 3.5 7.5 8 9 4.5-1.5 8-4 8-9V6Z" />
          <rect x="9.5" y="11" width="5" height="4" rx="0.5" />
          <path d="M10.5 11V9.5a1.5 1.5 0 0 1 3 0V11" />
        }
        @case ('play') {
          <circle cx="12" cy="12" r="9" />
          <path d="M10 8.5v7l6-3.5Z" fill="currentColor" stroke="none" />
        }
        @case ('clock') {
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 3" />
        }
        @case ('users') {
          <circle cx="9" cy="8" r="3" />
          <path d="M2 20c0-3.3 3.1-6 7-6s7 2.7 7 6" />
          <circle cx="17" cy="9" r="2.5" />
          <path d="M22 20c0-2.6-2-4.8-4.8-5.6" />
        }
      }
    </svg>
  `,
})
export class Icon {
  readonly name = input.required<IconName>();
  readonly size = input(24);
}
