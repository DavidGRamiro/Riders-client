import { ChangeDetectionStrategy, Component, computed,signal } from '@angular/core';
import { HlmButton } from '@spartan-ng/helm/button';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { faBrandApple, faBrandGoogle } from '@ng-icons/font-awesome/brands';
import { faEye, faEyeSlash } from '@ng-icons/font-awesome/regular';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { lucideMail } from '@ng-icons/lucide';
import { HlmCheckboxImports } from '@spartan-ng/helm/checkbox';
import { HlmLabel } from '@spartan-ng/helm/label';
import { faSolidArrowRight } from '@ng-icons/font-awesome/solid';


@Component({
  selector: 'app-signin',
  imports: [HlmButton, NgIcon, HlmSeparatorImports, HlmInputGroupImports, HlmCheckboxImports, HlmLabel],
  templateUrl: './signin.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideIcons({ faBrandApple, faBrandGoogle, lucideMail, faEye, faEyeSlash, faSolidArrowRight })]
})
export class Signin {

  public isVisible = computed(() => this.toggle() ? 'faEye' : 'faEyeSlash');
  public passwordType = computed(() => this.toggle() ? 'text' : 'password' ) 

  private toggle = signal<boolean>(false);

  public showPassword(){
    this.toggle.set(!this.toggle())
  }


}
