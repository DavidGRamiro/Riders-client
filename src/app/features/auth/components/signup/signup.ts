import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from "@angular/core";
import { HlmInputImports } from "@spartan-ng/helm/input";
import { HlmFieldImports } from "@spartan-ng/helm/field";
import { HlmToggleGroupImports } from "@spartan-ng/helm/toggle-group";
import { lucideMountainSnow } from "@ng-icons/lucide";
import { provideIcons, NgIcon } from "@ng-icons/core";
import { lucideMotorbike } from "@ng-icons/lucide";
import { lucideGauge } from "@ng-icons/lucide";
import { lucideSliders } from "@ng-icons/lucide";
import {
  HlmInputGroup,
  HlmInputGroupAddon,
  HlmInputGroupImports,
} from "@spartan-ng/helm/input-group";
import { lucideUserCircle2 } from "@ng-icons/lucide";
import { HlmButtonImports } from "@spartan-ng/helm/button";
import { faEye, faEyeSlash } from "@ng-icons/font-awesome/regular";
import { HlmProgressImports } from "@spartan-ng/helm/progress";
import { HlmCheckboxImports } from "@spartan-ng/helm/checkbox";
import { HlmMarkerImports } from "@spartan-ng/helm/marker";
import { faBrandApple, faBrandGoogle } from "@ng-icons/font-awesome/brands";
import { form, required, FormRoot, FormField } from "@angular/forms/signals";
import { SignUpRequest } from "../../interfaces/login.interface";
import { Auth } from "../../services/auth";
import { debounceTime, firstValueFrom, of } from "rxjs";
import { AuthStore } from "../../store/auth.store";
import { UserStore } from "../../../../shared";
import { HttpErrorResponse } from "@angular/common/http";
import { toast } from "@spartan-ng/brain/sonner";
import { Router } from "@angular/router";


@Component({
  selector: "app-signup",
  imports: [
    HlmInputImports,
    HlmFieldImports,
    HlmToggleGroupImports,
    NgIcon,
    HlmInputGroup,
    HlmInputGroupAddon,
    HlmButtonImports,
    HlmInputGroup,
    HlmInputGroupImports,
    HlmProgressImports,
    HlmCheckboxImports,
    HlmMarkerImports,
    FormRoot,
    FormField
],
  templateUrl: "./signup.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: provideIcons({
    lucideMountainSnow,
    lucideMotorbike,
    lucideGauge,
    lucideSliders,
    lucideUserCircle2,
    faEye,
    faEyeSlash,
    faBrandApple,
    faBrandGoogle,
  }),
})
export class Signup {
  public isVisible = computed(() => (this.toggle() ? "faEye" : "faEyeSlash"));
  public passwordType = computed(() => (this.toggle() ? "text" : "password"));
  public indicatorValue = signal<number>(0);
  public indicatorClass = signal<string>("");

  private toggle = signal<boolean>(false);
  private password = signal<string>("");

  private _auth = inject(Auth);
  private _authStore = inject(AuthStore);
  private _userStore = inject(UserStore);
  private _router = inject(Router);

  // FIXME: Temporal data until the issue #8 is resolved
  public typesOfBikes = [
    { value: "trail", label: "Trail", icon: "lucideMountainSnow" },
    { value: "sport", label: "Sport", icon: "lucideGauge" },
    { value: "naked", label: "Naked", icon: "lucideMotorbike" },
    { value: "custom", label: "Custom", icon: "lucideSliders" },
  ];

  // FIXME: Should be query from backend,
  public licenses = [
    { value: "a", label: "Permiso A" },
    { value: "a2", label: "Permiso A2" },
    { value: "a1", label: "Permiso A1/B" },
    { value: "am", label: "Permiso AM" },
  ];

  public signUpModel = signal<SignUpRequest>({
    name: "",
    last_name: "",
    username: "",
    email: "",
    password: "",
  });

  public signUpForm = form(
    this.signUpModel,
    (schema) => {
      required(schema.name, { message: "El nombre es requerido" });
      required(schema.username, {message: "El nombre de usuario es requerido" });
      required(schema.last_name, { message: "Los apellidos son requeridos" });
      required(schema.email, { message: "El correo es requerido" });
      required(schema.password, { message: "La contraseña es requerida" });
    },
    {
      submission: {
        action: async (field) => {
          try {
            const { token, refresh, user, is_online } = await firstValueFrom(this._auth.register(field().value()));
            this._authStore.setTokens(token, refresh);
            this._userStore.setUser( { username: user, is_online, authenticated: true });

            // TODO: Manage delay and set up spinner view
            this._router.navigate(['/main']);
          } catch (err: unknown) {
            const { error } = err as HttpErrorResponse;
            toast.error(error.detail);
          }
        },
      },
    },
  );

  constructor() {
    effect(() => {
      const size = this.password().length;
      switch (size) {
        case 0:
          this.indicatorValue.set(0);
          this.indicatorClass.set("");
          break;
        case 5:
          this.indicatorValue.set(10);
          this.indicatorClass.set("bg-red-300");
          break;
        case 12:
          this.indicatorValue.set(50);
          this.indicatorClass.set("bg-orange-300");
          break;
        case 16:
          this.indicatorValue.set(100);
          this.indicatorClass.set("bg-green-300");
          break;
      }
    });
  }

  public showPassword() {
    this.toggle.set(!this.toggle());
  }

  public onPasswordChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.password.set(target.value);
  }
}
