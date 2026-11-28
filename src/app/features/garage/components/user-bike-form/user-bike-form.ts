import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideShieldCheck } from '@ng-icons/lucide';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmCheckboxImports } from '@spartan-ng/helm/checkbox';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmLabelImports } from '@spartan-ng/helm/label';
import { HlmRadioGroupImports } from '@spartan-ng/helm/radio-group';
import { HlmToggleGroupImports } from '@spartan-ng/helm/toggle-group';

@Component({
  selector: 'app-user-bike-form',
  imports: [
    NgIcon,
    ReactiveFormsModule,
    HlmBadgeImports,
    HlmButtonImports,
    HlmCardImports,
    HlmCheckboxImports,
    HlmFieldImports,
    HlmInputImports,
    HlmLabelImports,
    HlmRadioGroupImports,
    HlmToggleGroupImports,
  ],
  templateUrl: './user-bike-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideIcons({ lucideShieldCheck })],
})
export class UserBikeForm {

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
  }

  protected readonly categories = [
    { id: 'trail', label: 'Trail / Adv' },
    { id: 'naked', label: 'Naked' },
    { id: 'sport', label: 'Sport / R' },
    { id: 'custom', label: 'Custom / Scrambler' },
  ];

  protected readonly licenses = [
    { id: 'a', label: 'Permiso A (Sin restricción)' },
    { id: 'a2', label: 'Carnet A2 (35 kW)' },
  ];
}
