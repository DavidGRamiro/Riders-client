import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCheck } from '@ng-icons/lucide';
import { HlmInputImports } from "@spartan-ng/helm/input";
import { HlmSliderImports } from "@spartan-ng/helm/slider";
import { HlmSwitchImports } from "@spartan-ng/helm/switch";
import { HlmTextarea } from '@spartan-ng/helm/textarea';
import { HlmField, HlmFieldDescription } from '@spartan-ng/helm/field';
import { form, required, FormRoot, FormField } from '@angular/forms/signals';
import { HttpErrorResponse } from '@angular/common/http';
import { toast } from '@spartan-ng/brain/sonner';
import { firstValueFrom } from 'rxjs';
import { Ollama } from '../../../../shared/services/ollama';
import { AiGenerator, AiResponse } from '../../../../shared/interfaces/ai-generator';


@Component({
  selector: 'app-ai-route',
  imports: [NgIcon, HlmSliderImports, HlmSwitchImports, HlmTextarea, HlmInputImports, HlmField, HlmFieldDescription, FormRoot, FormField],
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
  protected readonly curveDensity = signal(50);
  protected readonly estimatedDistance = signal(150);
  protected readonly asphalt = signal(true);
  protected readonly avoidTraffic = signal(true);

  private aiRouteModel = signal({
    additional_message : '',
    route_type : null,
    distance_km : null,
    avoid_motorways: false,
    prefer_curvy_roads: false,
    origin: '',
    destination: ''
  })

  public aiRouteForm = form(
    this.aiRouteModel,
    (schema) => {
      required(schema.additional_message, { message: "Escribe el prompt inicial" });
      required(schema.origin, { message: "El punto de partida es obligatorio" });
    },
     {
      submission: {
        action: async (field) => {
          try {

            // FIXME: Duration time missing.
            // FIXME: avoid_motorways missign

            const body : AiGenerator = {
              additional_message: field().value().additional_message,
              route_type : this.getRouteType(),
              distance_km: this.estimatedDistance(),
              avoid_motorways: this.avoidTraffic(),
              prefer_curvy_roads: true,
              origin: field().value().origin,
              destination: field().value().destination
            }

            const response : AiResponse = await firstValueFrom(this._ollama.generateRoute(body))
            // TODO: Control de la respuesta de Ollama.
            // TODO: Generar Skeletons, Loader 
            
          } catch (err: unknown) {
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

  protected updateCurveDensity(values: number[]): void {
    this.curveDensity.set(values[0] ?? this.curveDensity());
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
