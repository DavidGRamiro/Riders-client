import { ChangeDetectionStrategy, Component, computed, effect, inject, OnInit } from '@angular/core';
import { RouteTitle } from './route-title/route-title';
import { RouteMap, RouteMapMarker } from './route-map/route-map';
import { RouteAnalytics } from './route-analytics/route-analytics';
import { RouteStore } from '../../store/route.store';
import { LatLngTuple } from 'leaflet';
import { CoordinatesEngine } from '../../../../shared/interfaces/ai-generator';

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
    const title = this._routeStore.ollama().title;
    if(title.trim().length > 0){
      return title;
    }
    return 'Genera una ruta para hoy';
  })

  /** Puntos de la ruta unidos por flechas o texto por defecto. */
  public readonly pointsOfRoutes = computed(() => {
    const pointsOfRoutes = this._routeStore.ollama().way_points;
    if(pointsOfRoutes.length > 0){
      return pointsOfRoutes.join(' → ');
    }
    return 'Lugares de interés en ruta.';
  })

  /** Distancia estimada en kilómetros, o 0 si no está definida. */
  public readonly distance = computed(() => {
    const distance = this._routeStore.ollama().distance_estimated_km;
    if(distance > 0){
      return distance
    }
    return 0
  })

  /** FIXME:  Tiempo estimado de la ruta (pendiente de convertir los segundos a minutos / horas). */
  public time_estimated = computed(() => this._routeStore.route_engine().duration)

  /** Puntos de la ruta obtenidos de las coordenadas generadas por la IA. */
  public route = computed<LatLngTuple[]>(() =>
    (this._routeStore.route_engine().coordinates ?? [])
      .filter(
        (item): item is CoordinatesEngine & { lat: number; lon: number } =>
          typeof item.lat === 'number' && typeof item.lon === 'number',
      )
      .map((item) => [item.lat, item.lon]),
  );

  /** Marcadores de la ruta generada a partir de sus coordenadas. */
  //  public markers = computed<RouteMapMarker[]>(() => {
  //   const coords = this._routeStore.ollama().way_points ?? [];

  //   return coords
  //     .filter(
  //       (item): item is GeoResponse & { lat: number; lon: number } =>
  //         typeof item.lat === 'number' && typeof item.lon === 'number',
  //     )
  //     .map((item) => ({
  //         label: item.location,
  //       position: [item.lat, item.lon],
  //     }));
  // });

  /** Título del mapa con el origen y el destino. */
  public titleMap = computed<string>(() => {
    const firstLastPoint = this._routeStore.ollama().way_points
    if(firstLastPoint.length > 0){
      return firstLastPoint[0] + ' - ' + firstLastPoint[firstLastPoint.length - 1]
    }
    return 'Mapa de ruta'
  })
}
