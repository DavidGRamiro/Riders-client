import { Directive, ElementRef, effect, inject, model } from '@angular/core';
import type { FormValueControl } from '@angular/forms/signals';

@Directive({
  selector: 'input[nullableText]',
  host: {
    '(input)': 'onInput($event)',
    '(blur)': 'onBlur()',
  },
})
export class NullableTextInput implements FormValueControl<string | null> {
  private readonly _element = inject<ElementRef<HTMLInputElement>>(ElementRef);

  public readonly value = model<string | null>(null);
  public readonly touched = model<boolean>(false);

  constructor() {
    effect(() => {
      const next = this.value() ?? '';
      const element = this._element.nativeElement;
      if (element.value !== next) {
        element.value = next;
      }
    });
  }

  protected onInput(event: Event): void {
    const raw = (event.target as HTMLInputElement).value;
    this.value.set(raw === '' ? null : raw);
  }

  protected onBlur(): void {
    this.touched.set(true);
  }
}
