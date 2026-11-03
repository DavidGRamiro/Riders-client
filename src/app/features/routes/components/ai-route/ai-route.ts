import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCheck } from '@ng-icons/lucide';
import { HlmInputImports } from "@spartan-ng/helm/input";
import { HlmSliderImports } from "@spartan-ng/helm/slider";
import { HlmSwitchImports } from "@spartan-ng/helm/switch";
import { HlmTextarea } from '@spartan-ng/helm/textarea';
import { HlmField, HlmFieldDescription } from '@spartan-ng/helm/field';
import { form, min, required, FormRoot, FormField } from '@angular/forms/signals';
import { HttpErrorResponse } from '@angular/common/http';
import { toast } from '@spartan-ng/brain/sonner';
import { firstValueFrom } from 'rxjs';
import { Ollama } from '../../../../shared/services/ollama';
import { AiGenerator, AiResponse, AiRouteFormModel } from '../../../../shared/interfaces/ai-generator';
import { HlmSpinnerImports } from "@spartan-ng/helm/spinner";
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { NullableTextInput } from '../../../../shared/directives/nullable-text-input';



@Component({
  selector: 'app-ai-route',
  imports: [NgIcon, HlmSliderImports, HlmSwitchImports, HlmTextarea, HlmInputImports, HlmField, HlmFieldDescription, FormRoot, FormField, HlmSpinnerImports, HlmButtonImports, NullableTextInput],
  templateUrl: './ai-route.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    provideIcons({
      lucideCheck,

    })
  ]
})
export class AiRoute {

  private _ollama = inject(Ollama)

  protected readonly presets = [
    'Relajada',
    'Panorámica Vistas',
    'Rápida & Fluida',
    'Circular',
  ];
  protected readonly selectedPreset = signal(this.presets[0]);
  protected readonly estimatedDistance = signal(150);
  protected readonly avoidMotorways = signal(false);
  protected readonly preferCurvyRoads = signal(false);
  public loading = signal<boolean>(false)

  private aiRouteModel = signal<AiRouteFormModel>({
    additional_message : '',
    route_type : null,
    distance_km : null,
    avoid_motorways: false,
    prefer_curvy_roads: false,
    origin: '',
    destination: null,
    duration_time: null
  })

  public aiRouteForm = form(
    this.aiRouteModel,
    (schema) => {
      required(schema.additional_message, { message: "Escribe el prompt inicial" });
      required(schema.origin, { message: "El punto de partida es obligatorio" });
      min(schema.duration_time, 0, { message: "La duración no puede ser negativa" });
    },
     {
      submission: {
        action: async (field) => {
          try {
            this.loading.set(true)

            const body : AiGenerator = {
              additional_message: field().value().additional_message,
              route_type : this.getRouteType(),
              distance_km: this.estimatedDistance(),
              avoid_motorways: this.avoidMotorways(),
              prefer_curvy_roads: this.preferCurvyRoads(),
              origin: field().value().origin,
              destination: field().value().destination,
              duration_time: field().value().duration_time ?? null
            }

            const response : AiResponse = await firstValueFrom(this._ollama.generateRoute(body))
            this.loading.set(false)
            // TODO: Control de la respuesta de Ollama.
            // TODO: Generar Skeletons, Loader 
            
          } catch (err: unknown) {
            this.loading.set(false)
            const { error } = err as HttpErrorResponse;
            toast.error(error.detail ?? 'Ha ocurrido un error al crear la ruta. Intenéntalo de nuevo más tarde.');
          }
        },
      },
    },
  )
  
  protected selectPreset(preset: string): void {
    this.selectedPreset.set(preset);
  }

  protected updateEstimatedDistance(values: number[]): void {
    this.estimatedDistance.set(values[0] ?? this.estimatedDistance());
  }

  protected getRouteType(){
    switch(this.selectedPreset()){
      case 'Relajada':
        return 'relaxed';
      case 'Panorámica Vistas':
        return 'views';
      case 'Rápida & Fluida':
        return 'fast';
      case 'Circular':
        return 'circular';
      default:
        return 'tour'
    }
  }

  reset(){}
}
