import { ChangeDetectionStrategy, Component, computed,inject,signal } from '@angular/core';
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
import { LoginRequest } from '../../interfaces/login.interface';
import { form, FormField, required, FormRoot } from '@angular/forms/signals';
import { Auth } from '../../services/auth';
import { firstValueFrom } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { lucideBadgeAlert } from '@ng-icons/lucide';
import { toast } from '@spartan-ng/brain/sonner';
import { AuthStore } from '../../store/auth.store';


@Component({
  selector: 'app-signin',
  imports: [HlmButton, NgIcon, HlmSeparatorImports, HlmInputGroupImports, HlmCheckboxImports, HlmLabel, FormField, FormRoot],
  templateUrl: './signin.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideIcons({ faBrandApple, faBrandGoogle, lucideMail, faEye, faEyeSlash, faSolidArrowRight, lucideBadgeAlert })]
})
export class Signin {

  // Servicio / Store
  private _auth = inject(Auth)
  private _authStore = inject(AuthStore)

  // Variables de control de estado input password
  public isVisible = computed(() => this.toggle() ? 'faEye' : 'faEyeSlash');
  public passwordType = computed(() => this.toggle() ? 'text' : 'password' ) 
  private toggle = signal<boolean>(false);

  // Inittial State para el formulario de login.
  public loginModel = signal<LoginRequest>({
    username: '',
    password: ''
  });

  /** 
   * Formulario de inicio de sesión. Actualiza el store con los tokens
   * o devuelve el mensaje de error en el caso de que las credenciales no sean válidas.
   */
  public loginForm = form(this.loginModel, (schema) => {
    required( schema.username, { message: 'El nombre de usuario es requerido'}),
    required( schema.password, { message: 'La contraseña es obligatoria' })
    },
    {
      submission : {
        action: async (field) => {
          try {
            const { access, refresh } = await firstValueFrom(this._auth.authenticate(field().value()))
            this._authStore.setTokens(access, refresh);
            // TODO: Navegar a pagina principal
          } catch (err: unknown) {
            const { error } = err as HttpErrorResponse
             toast.error(error.detail)
          }
        }
      },
    }
  )

  /** Control de estado al hacer click en el botón de mostrar las contraseña */
  public showPassword(){
    this.toggle.set(!this.toggle())
  }
}
