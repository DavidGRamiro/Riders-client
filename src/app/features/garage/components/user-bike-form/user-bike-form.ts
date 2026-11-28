import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { NgIcon, provideIcons } from "@ng-icons/core";
import { lucideShieldCheck } from "@ng-icons/lucide";
import { HlmBadgeImports } from "@spartan-ng/helm/badge";
import { HlmButtonImports } from "@spartan-ng/helm/button";
import { HlmCardImports } from "@spartan-ng/helm/card";
import { HlmCheckboxImports } from "@spartan-ng/helm/checkbox";
import { HlmFieldImports } from "@spartan-ng/helm/field";
import { HlmInputImports } from "@spartan-ng/helm/input";
import { HlmLabelImports } from "@spartan-ng/helm/label";
import { HlmRadioGroupImports } from "@spartan-ng/helm/radio-group";
import { HlmToggleGroupImports } from "@spartan-ng/helm/toggle-group";
import { BikeForm } from "../../interfaces";
import { form, required, FormRoot, FormField } from "@angular/forms/signals";
import { toast } from "@spartan-ng/brain/sonner";
import { Bike } from "../../services";
import { firstValueFrom } from "rxjs";
import { HlmTextarea } from "@spartan-ng/helm/textarea";

@Component({
  selector: "app-user-bike-form",
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
    HlmTextarea,
    FormRoot,
    FormField
],
  templateUrl: "./user-bike-form.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideIcons({ lucideShieldCheck })],
})
export class UserBikeForm {
  private _bikeService = inject(Bike);

  private registerModel = signal<BikeForm>({
    brand: "",
    model: "",
    type: "",
    engine_cc: "",
    engine_power: "",
    year: "",
    kilometers: 0,
    color: "",
    alternative_text: "",
  });

  public registerForm = form(
    this.registerModel,
    (schema) => {
      (required(schema.brand),
        required(schema.model),
        required(schema.engine_cc),
        required(schema.engine_power));
    },
    {
      submission: {
        action: async (field) => {
          try {
            const body = field as unknown as BikeForm;
            console.log(body);
            await firstValueFrom(this._bikeService.registerBike(body));
            toast.success("Monntura creada correctamente");
          } catch (_) {
            toast.error(
              "Ha ocurrido un error al intentar dar de alta la montura",
            );
          }
        },
      },
    },
  );

  protected readonly categories = [
    { id: "trail", label: "Trail / Adv" },
    { id: "naked", label: "Naked" },
    { id: "sport", label: "Sport / R" },
    { id: "custom", label: "Custom / Scrambler" },
  ];

  protected readonly licenses = [
    { id: "a", label: "Permiso A (Sin restricción)" },
    { id: "a2", label: "Carnet A2 (35 kW)" },
  ];
}
