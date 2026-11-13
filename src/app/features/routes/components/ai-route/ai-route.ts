import {
  ChangeDetectionStrategy,
  Component,
  inject,
  output,
  signal,
} from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";
import {
  form,
  min,
  required,
  FormRoot,
  FormField,
} from "@angular/forms/signals";
import { firstValueFrom } from "rxjs";
import { NgIcon, provideIcons } from "@ng-icons/core";
import { lucideCheck, lucideDownload, lucideRotateCcw } from "@ng-icons/lucide";
import { HlmButtonImports } from "@spartan-ng/helm/button";
import { HlmCardImports } from "@spartan-ng/helm/card";
import { HlmField, HlmFieldDescription } from "@spartan-ng/helm/field";
import { HlmInputImports } from "@spartan-ng/helm/input";
import { HlmSliderImports } from "@spartan-ng/helm/slider";
import { HlmSpinnerImports } from "@spartan-ng/helm/spinner";
import { HlmSwitchImports } from "@spartan-ng/helm/switch";
import { HlmTextarea } from "@spartan-ng/helm/textarea";
import { toast } from "@spartan-ng/brain/sonner";
import { Ollama } from "../../../../shared/services/ollama";
import {
  AiGenerator,
  AiRouteFormModel,
  RouteResponse,
} from "../../../../shared/interfaces/ai-generator";
import { NullableTextInput } from "../../../../shared/directives/nullable-text-input";
import { RouteStore } from "../../store/route.store";

/** Distancia estimada por defecto en kilómetros. */
const DEFAULT_DISTANCE_KM = 150;

/** Componente de formulario para generar rutas mediante IA a partir de una descripción y preferencias. */
@Component({
  selector: "app-ai-route",
  imports: [
    NgIcon,
    HlmSliderImports,
    HlmSwitchImports,
    HlmTextarea,
    HlmInputImports,
    HlmField,
    HlmFieldDescription,
    FormRoot,
    FormField,
    HlmSpinnerImports,
    HlmButtonImports,
    NullableTextInput,
    HlmCardImports,
  ],
  templateUrl: "./ai-route.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideIcons({ lucideCheck, lucideDownload, lucideRotateCcw })],
})
export class AiRoute {
  /** Emitir señal cuando se genera una nueva ruta. */
  public eventResRoute = output<boolean>();

  private _ollama = inject(Ollama);
  private _routeStore = inject(RouteStore);

  /** Modelo inicial vacío del formulario. */
  private readonly initialModel: AiRouteFormModel = {
    additional_message: "",
    route_type: null,
    distance_km: null,
    avoid_motorways: false,
    prefer_curvy_roads: false,
    origin: "",
    destination: null,
    duration_time: null,
  };

  /** Estado reactivo del formulario. */
  private aiRouteModel = signal<AiRouteFormModel>({ ...this.initialModel });

  /** Presets de estilo de ruta disponibles. */
  protected readonly presets = [
    "Relajada",
    "Panorámica Vistas",
    "Rápida & Fluida",
    "Circular",
  ];
  /** Preset de ruta seleccionado actualmente. */
  protected readonly selectedPreset = signal(this.presets[0]);
  /** Distancia estimada en kilómetros. */
  protected readonly estimatedDistance = signal(DEFAULT_DISTANCE_KM);
  /** Indica si se deben evitar las autopistas. */
  protected readonly avoidMotorways = signal(false);
  /** Indica si se prefieren carreteras con curvas. */
  protected readonly preferCurvyRoads = signal(false);
  /** Indica si hay una petición de generación en curso. */
  public loading = signal<boolean>(false);
  public newRoute = signal<boolean>(false); 

  /** Formulario con validaciones y envío a la API de generación de rutas. */
  public aiRouteForm = form(
    this.aiRouteModel,
    (schema) => {
      required(schema.additional_message, {
        message: "Escribe el prompt inicial",
      });
      required(schema.origin, {
        message: "El punto de partida es obligatorio",
      });
      min(schema.duration_time, 0, {
        message: "La duración no puede ser negativa",
      });
    },
    {
      submission: {
        action: async (field) => {
          try {
            this.loading.set(true);
            this.newRoute.set(false);

            const body: AiGenerator = {
              additional_message: field().value().additional_message,
              route_type: this.getRouteType(),
              distance_km: this.estimatedDistance(),
              avoid_motorways: this.avoidMotorways(),
              prefer_curvy_roads: this.preferCurvyRoads(),
              origin: field().value().origin,
              destination: field().value().destination,
              duration_time: field().value().duration_time ?? null,
            };

            const response: RouteResponse = await firstValueFrom(
              this._ollama.generateRoute(body),
            );
            this.loading.set(false);
            this.newRoute.set(true);
            this._routeStore.setRoute(response);
            toast.success("Ruta generada correctamente");
          } catch (err: unknown) {
            this.loading.set(false);
            this.newRoute.set(false);
            const { error } = err as HttpErrorResponse;
            toast.error(
              error.detail ??
                "Ha ocurrido un error al crear la ruta. Intenéntalo de nuevo más tarde.",
            );
          }
          this.eventResRoute.emit(this.newRoute());
        },
      },
    },
  );

  /** Selecciona un preset de estilo de ruta. */
  protected selectPreset(preset: string): void {
    this.selectedPreset.set(preset);
  }

  /** Actualiza la distancia estimada a partir del valor del slider. */
  protected updateEstimatedDistance(values: number[]): void {
    this.estimatedDistance.set(values[0] ?? this.estimatedDistance());
  }

  /** Traduce el preset seleccionado al tipo de ruta esperado por la API. */
  protected getRouteType() {
    switch (this.selectedPreset()) {
      case "Relajada":
        return "relaxed";
      case "Panorámica Vistas":
        return "views";
      case "Rápida & Fluida":
        return "fast";
      case "Circular":
        return "circular";
      default:
        return "tour";
    }
  }

  /** Restablece el formulario y todas las preferencias a su estado inicial. */
  public reset() {
    this.aiRouteModel.set({ ...this.initialModel });
    this.aiRouteForm().reset();
    this.selectedPreset.set(this.presets[0]);
    this.estimatedDistance.set(DEFAULT_DISTANCE_KM);
    this.avoidMotorways.set(false);
    this.preferCurvyRoads.set(false);
    this.loading.set(false);
  }
}
