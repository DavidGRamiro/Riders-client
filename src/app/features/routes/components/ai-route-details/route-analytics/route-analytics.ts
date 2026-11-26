import { ChangeDetectionStrategy, Component, computed, ElementRef, inject, signal, viewChild } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { toast } from '@spartan-ng/brain/sonner';
import {
  lucideBookmark,
  lucideCheck,
  lucideDownload,
  lucideFlag,
  lucideGauge,
  lucideMapPin,
  lucideRoute,
  lucideShare2,
  lucideSaveOff
} from '@ng-icons/lucide';
import { RouteStore } from '../../../store/route.store';
import { RouteService } from '../../../services/route-service';
import { firstValueFrom } from 'rxjs';

/** Etiquetas legibles para los tipos de ruta que devuelve la API. */
const ROUTE_TYPE_LABELS: Record<string, string> = {
  relaxed: 'Relajada',
  views: 'Panorámica',
  fast: 'Rápida',
  circular: 'Circular',
  tour: 'Turismo',
};

/**
 * Resumen del itinerario y acciones principales de la ruta generada.
 * Sustituye las métricas decorativas por información útil para el usuario:
 * recorrido, paradas, distancia y acciones para guardar, compartir o exportar.
 */
@Component({
  selector: 'app-route-analytics',
  imports: [NgIcon, HlmCardImports, HlmButtonImports],
  templateUrl: './route-analytics.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    provideIcons({
      lucideBookmark,
      lucideCheck,
      lucideDownload,
      lucideFlag,
      lucideGauge,
      lucideMapPin,
      lucideRoute,
      lucideShare2,
      lucideSaveOff
    }),
  ],
})
export class RouteAnalytics {
  private readonly _routeStore = inject(RouteStore);
  private readonly _routeService = inject(RouteService);
  private readonly saveButton = viewChild<ElementRef<HTMLButtonElement>>('saveButton');

  /** Indica si existe una ruta generada con coordenadas utilizables. */
  protected readonly hasRoute = computed(() => this._routeStore.route_engine().coordinates.length > 0);

  /** Origen de la ruta o texto por defecto. */
  protected readonly origin = computed(
    () => this._routeStore.ollama().origin.trim() || 'Origen sin definir',
  );

  /** Destino de la ruta o texto por defecto. */
  protected readonly destination = computed(
    () => this._routeStore.ollama().destination.trim() || 'Destino sin definir',
  );

  /** Indica si la ruta actual ya está guardada en el garaje. */
  protected readonly isSaved = computed(() => this._routeStore.saved());

  /** Indica si la ruta generada tiene un id válido para guardarla. */
  protected readonly canSaveRoute = computed(
    () => this.hasRoute() && this._routeStore.id() > 0,
  );

  /** Evita envíos duplicados mientras se completa la petición. */
  protected readonly isSaving = signal(false);

  /** Indica si el botón de guardado no está disponible. */
  protected readonly saveDisabled = computed(() => !this.canSaveRoute() || this.isSaving());

  /** Etiqueta del botón de guardado según el estado actual. */
  protected readonly saveLabel = computed(() => {
    if (this.isSaving()) return 'Guardando…';
    return this.isSaved() ? 'Deshacer guardado' : 'Guardar ruta';
  });

  /** Icono del botón de guardado según el estado actual. */
  protected readonly saveIcon = computed(() =>
    this.isSaved() ? 'lucideSaveOff' : 'lucideBookmark',
  );

  /** Puntos de paso intermedios. */
  protected readonly wayPoints = computed(() => this._routeStore.ollama().way_points);

  /** Distancia estimada en kilómetros. */
  protected readonly distance = computed(() => this._routeStore.route_engine().distance);
  /** Número de coordenadas GPS que forman el trazado. */
  protected readonly gpsPoints = computed(() => this._routeStore.ollama().way_points.length);

  /** Tipo de ruta traducido a una etiqueta legible. */
  protected readonly routeType = computed(
    () => ROUTE_TYPE_LABELS[this._routeStore.ollama().route_type] ?? 'Personalizada',
  );

  /** Indica si la ruta prioriza carreteras con curvas. */
  protected readonly prefersCurves = computed(() => this._routeStore.ollama().prefer_curvy_roads);

  /** Alterna el estado guardado de la ruta generada. */
  protected toggleSavedRoute(): void {
    void this.saveRoute(!this.isSaved());
  }

  /** Guarda o desguarda la ruta generada en el garaje del usuario. */
  protected async saveRoute(saved: boolean): Promise<void> {
    if (!this.canSaveRoute() || this.isSaving()) return;

    this.isSaving.set(true);
    try {
      const response = await firstValueFrom(
        this._routeService.saveRoute(this._routeStore.id(), saved),
      );
      this._routeStore.updateSavedRoute(response.saved);
      toast.success(
        response.saved
          ? 'Ruta guardada en tu garaje'
          : 'Ruta eliminada de tu garaje',
      );
    } catch {
      toast.error('No se pudo actualizar el guardado de la ruta. Inténtalo de nuevo.');
    } finally {
      this.isSaving.set(false);
      this.saveButton()?.nativeElement.focus();
    }
  }

  /** Comparte un resumen de la ruta o lo copia al portapapeles como alternativa. */
  protected async shareRoute(): Promise<void> {
    if (!this.hasRoute()) return;
    const text = `${this.origin()} → ${this.destination()} · ${this.distance()} km`;

    try {
      if (navigator.share) {
        await navigator.share({ title: this._routeStore.ollama().title || 'Ruta de moto', text });
        return;
      }

      await navigator.clipboard.writeText(text);
      toast.success('Resumen copiado al portapapeles');
    } catch {
      toast.error('No se pudo compartir la ruta');
    }
  }

}
