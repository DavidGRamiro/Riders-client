import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  output,
  signal,
} from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";
import {
  form,
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
import { AiRouteFormModel, RouteResponse } from "../../../../shared/interfaces/ai-generator";
import { RouteStore } from "../../store/route.store";
import { lucideGlobe } from "@ng-icons/lucide";
import { HlmComboboxImports } from "@spartan-ng/helm/combobox";
import { HlmInputGroupAddon } from "@spartan-ng/helm/input-group";
import { GobService } from "../../services/gob-service";
import {
  Municipality,
  Provinces,
} from "../../interfaces/provinvces-interface";


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
    FormRoot,
    FormField,
    HlmSpinnerImports,
    HlmButtonImports,
    HlmCardImports,
    HlmComboboxImports,
    HlmInputGroupAddon
  ],
  templateUrl: "./ai-route.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideIcons({ lucideCheck, lucideDownload, lucideRotateCcw, lucideGlobe })],
})
export class AiRoute implements OnInit {

  /** Emitir señal cuando se genera una nueva ruta. */
  public eventResRoute = output<boolean>();

  /** Services */
  private _ollama = inject(Ollama);
  private _routeStore = inject(RouteStore);
  private _gobService = inject(GobService);

  /** Modelo inicial vacío del formulario. */
  private readonly initialModel: AiRouteFormModel = {
    additional_message: "",
    route_type: null,
    avoid_motorways: true,
    prefer_curvy_roads: true,
    origin: "",
    destination: null,
  };
  /** Presets de estilo de ruta disponibles. */
  protected readonly presets = ["Relajada","Panorámica Vistas","Rápida & Fluida","Circular"];
  /** Preset de ruta seleccionado actualmente. */
  protected readonly selectedPreset = signal(this.presets[0]);
  /** Indica si se deben evitar las autopistas. */
  protected readonly avoidMotorways = signal(true);
  /** Datos de provincias obtenidos de la API. */
  protected readonly provinces = signal<Provinces[]>([]);
  /** Indica si hay una petición de generación en curso. */
  public loading = signal<boolean>(false);
  /** Indica si se ha generado una nueva ruta. */
  public newRoute = signal<boolean>(false); 
  /** Estado reactivo del formulario. */
  private aiRouteModel = signal<AiRouteFormModel>({ ...this.initialModel });

  async ngOnInit(): Promise<void> {
    this.loadProvincesData()
  }

  /** Carga todas las provincias y sus municipios. */
  private async loadProvincesData(): Promise<void> {
    const { data: provinces = [] } = await firstValueFrom(
      this._gobService.getProvinces(),
    );

    const withMunicipalities = await Promise.all(
      provinces.map(async ({ id, comunidad_id, nombre }) => ({
        id,
        comunidad_id,
        nombre,
        municipios: await this.fetchAllMunicipalities(id),
      })),
    );

    this.provinces.set(withMunicipalities);
  }

  /** Obtiene todos los municipios de una provincia. */
  private async fetchAllMunicipalities(
    provinciaId: number,
  ): Promise<Municipality[]> {
    const first = await firstValueFrom(
      this._gobService.getMunicipalities(provinciaId),
    );

    const { data = [], total = data.length, limit = 100 } = first;
    const pendingPages = Math.max(0, Math.ceil(total / limit) - 1);
    if (pendingPages === 0) {
      return data;
    }

    const pages = await Promise.all(
      Array.from({ length: pendingPages }, (_, index) =>
        firstValueFrom(
          this._gobService.getMunicipalities(provinciaId, (index + 1) * limit, limit),
        ),
      ),
    );

    return [...data, ...pages.flatMap((page) => page.data)];
  }

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
      required(schema.destination, {
        message: "El punto de partida es obligatorio",
      });
    },
    {
      submission: {
        action: async (field) => {
          try {
            this.loading.set(true);
            this.newRoute.set(false);
            const body = {
              additional_message: field().value().additional_message,
              route_type: this.getRouteType(),
              avoid_motorways: this.avoidMotorways(),
              origin: field().value().origin,
              destination: field().value().destination,
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
    this.avoidMotorways.set(false);
    this.loading.set(false);
  }
}
