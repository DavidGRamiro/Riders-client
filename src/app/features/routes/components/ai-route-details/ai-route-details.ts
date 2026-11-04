import { ChangeDetectionStrategy, Component, computed, effect, inject, OnInit } from '@angular/core';
import { RouteTitle } from './route-title/route-title';
import { RouteMap } from './route-map/route-map';
import { RouteAnalytics } from './route-analytics/route-analytics';
import { RouteStore } from '../../store/route.store';

@Component({
  selector: 'app-ai-route-details',
  imports: [RouteTitle, RouteMap, RouteAnalytics],
  templateUrl: './ai-route-details.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
/** Muestra los detalles de la ruta generada por IA: título, mapa y analíticas. */
export class AiRouteDetails{

  /** Store con los datos de la ruta generada. */
  private _routeStore = inject(RouteStore)

  /** Título de la ruta o texto por defecto si no hay ruta. */
  public readonly title = computed(() => {
    const title = this._routeStore.title()
    if(title.trim().length > 0){
      return title;
    }
    return 'Genera una ruta para hoy';
  })

  /** Puntos de la ruta unidos por flechas o texto por defecto. */
  public readonly pointsOfRoutes = computed(() => {
    const pointsOfRoutes = this._routeStore.way_points()
    if(pointsOfRoutes.length > 0){
      return pointsOfRoutes.join(' → ');
    }
    return 'Lugares de interés en ruta.';
  })

  /** Distancia estimada en kilómetros, o 0 si no está definida. */
  public readonly distance = computed(() => {
    const distance = this._routeStore.distance_estimated_km()
    if(distance > 0){
      return distance
    }
    return 0
  })

  // TODO: Definir en backend el tiempo estimado horas/minutos.
  /** Tiempo estimado de la ruta (pendiente de definir en backend). */
  public time: number = 0;
}
