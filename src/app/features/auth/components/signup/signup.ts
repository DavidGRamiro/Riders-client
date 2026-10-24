import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmToggleGroupImports } from '@spartan-ng/helm/toggle-group';
import { lucideMountainSnow } from '@ng-icons/lucide';
import { provideIcons, NgIcon } from '@ng-icons/core';
import { lucideMotorbike } from '@ng-icons/lucide';
import { lucideGauge } from '@ng-icons/lucide';
import { lucideSliders } from '@ng-icons/lucide';
import { HlmInputGroup, HlmInputGroupAddon } from '@spartan-ng/helm/input-group';
import { lucideUserCircle2 } from '@ng-icons/lucide';
import { HlmButtonGroupImports } from '@spartan-ng/helm/button-group';
import { HlmButtonImports } from '@spartan-ng/helm/button';




@Component({
  selector: 'app-signup',
  imports: [HlmInputImports, HlmFieldImports, HlmToggleGroupImports, NgIcon, HlmInputGroup, HlmInputGroupAddon, HlmButtonImports],
  templateUrl: './signup.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: provideIcons({lucideMountainSnow, lucideMotorbike, lucideGauge, lucideSliders, lucideUserCircle2})
})
export class Signup  {

  // Temporal data until the issue #8 is resolved 
  public typesOfBikes = [
    { value: 'trail', label: 'Trail', icon: 'lucideMountainSnow' },
    { value: 'sport', label: 'Sport', icon: 'lucideGauge'},
    { value: 'naked', label: 'Naked', icon: 'lucideMotorbike'},
    { value: 'custom', label: 'Custom', icon: 'lucideSliders'},
  ]

  public licenses = [
    { value: 'a', label: 'Permiso A' },
    { value: 'a2', label: 'Permiso A2' },
    { value: 'a1', label: 'Permiso A1/B' },
    { value: 'am', label: 'Permiso AM' },
  ]

}
