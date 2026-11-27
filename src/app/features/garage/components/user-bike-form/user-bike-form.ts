import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowRightLeft, lucideCheck, lucideCloudUpload, lucideShieldCheck, lucideX } from '@ng-icons/lucide';

@Component({
  selector: 'app-user-bike-form',
  imports: [NgIcon, ReactiveFormsModule],
  templateUrl: './user-bike-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    provideIcons({
      lucideArrowRightLeft,
      lucideX,
      lucideCheck,
      lucideCloudUpload,
      lucideShieldCheck,
    }),
  ]
})
export class UserBikeForm {

  protected readonly registerOpen = signal(true);

  protected openRegister(): void {
    this.registerOpen.set(true);
  }

  protected closeRegister(): void {
    this.registerOpen.set(false);
  }

  private readonly formBuilder = inject(FormBuilder);


  protected readonly registerForm = this.formBuilder.nonNullable.group({
      model: ['', Validators.required],
      year: ['2024'],
      plate: ['9842-MBZ'],
      displacement: ['889 cc'],
      power: ['105 CV'],
      category: ['trail'],
      license: ['a'],
      obd: [true],
    });

  protected registerBike(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.registerForm.reset({
      model: '',
      year: '2024',
      plate: '9842-MBZ',
      displacement: '889 cc',
      power: '105 CV',
      category: 'trail',
      license: 'a',
      obd: true,
    });
    this.registerOpen.set(false);
  }

  protected setCategory(categoryId: string): void {
    this.registerForm.controls.category.setValue(categoryId);
  }


  protected readonly categories = [
    { id: 'trail', label: 'Trail / Adv' },
    { id: 'naked', label: 'Naked' },
    { id: 'sport', label: 'Sport / R' },
    { id: 'custom', label: 'Custom / Scrambler' },
  ];

  protected readonly licenses= [
    { id: 'a', label: 'Permiso A (Sin restricción)' },
    { id: 'a2', label: 'Carnet A2 (35 kW)' },
  ];
}
