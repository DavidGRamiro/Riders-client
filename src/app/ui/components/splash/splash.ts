import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  effect,
  inject,
  viewChild,
} from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { Splash } from '../../services';

@Component({
  selector: 'app-splash',
  imports: [NgOptimizedImage],
  template: `
    @if (splash.isVisible()) {
      <div
        #overlay
        class="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden bg-background/80 backdrop-blur-xl"
        role="status"
        aria-live="polite"
        aria-busy="true"
        tabindex="-1"
      >
        <div
          class="pointer-events-none absolute left-1/2 top-0 size-[28rem] -translate-x-1/2 -translate-y-1/3 rounded-full bg-primary/10 blur-3xl"
          aria-hidden="true"
        ></div>
        <div
          class="pointer-events-none absolute bottom-0 left-1/2 size-[24rem] -translate-x-1/2 translate-y-1/3 rounded-full bg-primary/5 blur-3xl"
          aria-hidden="true"
        ></div>

        <div class="relative flex flex-col items-center gap-7">
          <div class="relative grid size-28 place-items-center">
            <span class="absolute inset-0 rounded-full border border-border/70" aria-hidden="true"></span>
            <span
              class="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-primary [animation-duration:1.1s]"
              aria-hidden="true"
            ></span>
            <span
              class="absolute inset-3 rounded-full bg-card/60 ring-1 ring-border/50"
              aria-hidden="true"
            ></span>
            <img
              ngSrc="/riders_logo.png"
              width="768"
              height="768"
              alt="MadRiders AI"
              class="relative size-16 object-contain"
              priority
            />
          </div>

          <div class="flex flex-col items-center gap-2 text-center">
            <p class="text-xl font-semibold tracking-tight">MadRiders AI</p>
            <p class="text-sm text-muted-foreground">
              {{ splash.message() ?? 'Preparando tu próxima ruta…' }}
            </p>
          </div>

          <div class="flex items-center gap-1.5" aria-hidden="true">
            <span class="splash-dot size-1.5 rounded-full bg-primary"></span>
            <span class="splash-dot size-1.5 rounded-full bg-primary"></span>
            <span class="splash-dot size-1.5 rounded-full bg-primary"></span>
          </div>
        </div>

        <div class="absolute inset-x-0 bottom-0 h-px overflow-hidden bg-border/60" aria-hidden="true">
          <div class="splash-progress h-full w-1/3 bg-primary"></div>
        </div>
      </div>
    }
  `,
  styles: `
    @keyframes splash-progress {
      0% {
        transform: translateX(-120%);
      }
      100% {
        transform: translateX(420%);
      }
    }

    @keyframes splash-dot {
      0%,
      80%,
      100% {
        opacity: 0.25;
        transform: translateY(0);
      }
      40% {
        opacity: 1;
        transform: translateY(-3px);
      }
    }

    .splash-progress {
      animation: splash-progress 1.4s ease-in-out infinite;
    }

    .splash-dot {
      animation: splash-dot 1.2s ease-in-out infinite;
    }

    .splash-dot:nth-child(2) {
      animation-delay: 0.15s;
    }

    .splash-dot:nth-child(3) {
      animation-delay: 0.3s;
    }

    @media (prefers-reduced-motion: reduce) {
      .splash-progress,
      .splash-dot {
        animation: none;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:keydown)': 'onKeydown($event)',
  },
})
export class SplashOverlay {
  protected readonly splash = inject(Splash);

  private readonly overlay = viewChild<ElementRef<HTMLDivElement>>('overlay');

  constructor() {
    effect(() => {
      const overlay = this.overlay()?.nativeElement;

      if (this.splash.isVisible() && overlay) {
        overlay.focus({ preventScroll: true });
      }
    });
  }

  /** Bloquea la navegación con teclado mientras la pantalla está visible. */
  protected onKeydown(event: KeyboardEvent): void {
    if (!this.splash.isVisible()) {
      return;
    }

    if (event.key === 'Tab') {
      event.preventDefault();
    }
  }
}
