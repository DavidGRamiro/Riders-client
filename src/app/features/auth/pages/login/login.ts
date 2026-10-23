import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmButtonGroup } from '@spartan-ng/helm/button-group';
import { HlmButton } from '@spartan-ng/helm/button';
import { LoginAction } from '../../enums/login.enum';
import { Signin } from '../../components/signin/signin';
import { Signup } from '../../components/signup/signup';


@Component({
  selector: 'app-login',
  imports: [HlmCardImports, HlmButtonGroup, HlmButton, Signin, Signup],
  templateUrl: './login.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'w-full max-w-md' },
})
export class Login {

  public action = signal<LoginAction>(LoginAction.LOGIN)
  public variantButtonLoggin = computed(() => { return this.action() === LoginAction.LOGIN ? 'default' : 'outline' })
  public variantButtonRegister = computed(() => { return this.action() === LoginAction.SIGNUP ? 'default' : 'outline' })

  protected readonly availableAcions = LoginAction
} 
