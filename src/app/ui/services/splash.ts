import { DOCUMENT, Injectable, inject, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Splash {
  private readonly document = inject(DOCUMENT);

  private readonly visible = signal(false);
  private readonly currentMessage = signal<string | null>(null);
  private previousOverflow: string | null = null;

  public readonly isVisible = this.visible.asReadonly();
  public readonly message = this.currentMessage.asReadonly();

  /** Muestra la pantalla de carga y bloquea la interacción con la app. */
  public show(message?: string): void {
    this.currentMessage.set(message ?? null);
    this.visible.set(true);
    this.lockScroll();
  }

  /** Oculta la pantalla de carga. */
  public hide(): void {
    this.visible.set(false);
    this.currentMessage.set(null);
    this.unlockScroll();
  }

  /** Envuelve una promesa mostrando la pantalla de carga mientras se resuelve. */
  public async run<T>(task: Promise<T>, message?: string): Promise<T> {
    this.show(message);

    try {
      return await task;
    } finally {
      this.hide();
    }
  }

  private lockScroll(): void {
    const body = this.document.body;
    this.previousOverflow = body.style.overflow;
    body.style.overflow = 'hidden';
  }

  private unlockScroll(): void {
    this.document.body.style.overflow = this.previousOverflow ?? '';
    this.previousOverflow = null;
  }
}
