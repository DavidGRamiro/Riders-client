import { ChangeDetectionStrategy, Component, effect, inject, input, OnInit, signal, untracked } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideBike,
  lucideDelete,
  lucideDownload,
  lucideNavigationOff,
  lucideSearch,
  lucideZap,
} from '@ng-icons/lucide';
import { HlmNativeSelectImports } from '@spartan-ng/helm/native-select';
import { HlmSwitchImports } from '@spartan-ng/helm/switch';
import { RouteService } from '../../services/route-service';
import { catchError, combineLatest, debounceTime, distinctUntilChanged, EMPTY, expand, firstValueFrom, map, reduce, startWith, Subject, switchMap } from 'rxjs';
import { toast } from '@spartan-ng/brain/sonner';
import { RouteAiQueryParams, RouteAiResponse } from '../../interfaces/route-ai.interface';
import type { LatLngTuple } from 'leaflet';
import { DatePipe } from '@angular/common';
import { RouteMap, RouteMapMarker } from '../ai-route-details/route-map/route-map';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { formatTime } from '../../../../shared/utils';
import { HlmNumberedPagination } from '@spartan-ng/helm/pagination';
import { ResponsePaginator } from '../../../../shared/interfaces/paginator.interface';


/** Historial de rutas generadas por el usuario con buscador, filtros y paginación. */
@Component({
  selector: 'app-ai-user-route',
  imports: [NgIcon, HlmNativeSelectImports, HlmSwitchImports, DatePipe, HlmButtonImports, RouteMap, HlmNumberedPagination],
  templateUrl: './ai-user-route.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideIcons({ lucideBike, lucideDownload, lucideSearch, lucideZap, lucideDelete, lucideNavigationOff })],
})
export class AiUserRoute implements OnInit{
  /** Indica si se ha generado una nueva ruta. */
  public newRoute = input<boolean>(false)

  /** Orden de los resultados. */
  protected readonly sortOrder = signal('-id');
  /** Indica si el listado se limita a las rutas guardadas. */
  protected readonly onlySavedRoutes = signal(false);
  /** Emisiones del filtro de guardadas para combinarlas con el resto de filtros. */
  private readonly onlySavedRoutes$ = toObservable(this.onlySavedRoutes);
  /** Evita una petición duplicada durante la inicialización. */
  private readonly hasSyncedInitialRoute = signal(false);
  /** Carga de rutas generadas por el usuario */
  public userRoutes = signal<RouteAiResponse[]>([])

  // Paginacion
  /** Página actual de resultados. */
  public readonly page = signal(1);
	/** Cantidad de resultados por página. */
	public readonly pageSize = signal(5);
	/** Total de rutas disponibles. */
	public readonly totalItems = signal(0);

  //Filtros
  /** Stream de búsqueda con debounce. */
  private searchSubject = new Subject<string>();
  /** Stream de cambios de orden. */
  private orderSubject = new Subject<string>();
  /** Stream para forzar el refresco del listado. */
  private refreshSubject = new Subject<void>();

  // Services
  /** Servicio de rutas generadas por IA. */
  private _routeService = inject(RouteService)

  /** Sincroniza la carga de rutas al crear una nueva o cambiar de página. */
  constructor(){
    effect(() => {
      this.newRoute();
      this.page();
      if (untracked(() => !this.hasSyncedInitialRoute())) {
        this.hasSyncedInitialRoute.set(true);
        return;
      }
      this.refreshSubject.next();
    })
  }

  /** Inicializa los streams de búsqueda, orden y refresco de rutas. */
  ngOnInit(): void {
    combineLatest([
      this.searchSubject.pipe(
        debounceTime(1000),
        distinctUntilChanged(),
        startWith(''),
      ),
      this.orderSubject.pipe(startWith('-id'), distinctUntilChanged()),
      this.onlySavedRoutes$,
      this.refreshSubject.pipe(startWith(undefined)),
    ])
      .pipe(
        switchMap(([search, order, onlySaved]) =>
          this.fetchRoutes(search, order, onlySaved).pipe(
            map((response) => ({ response, onlySaved })),
            catchError(() => {
              toast.error('No se han podido recuperar las rutas generadas con IA.');
              return EMPTY;
            }),
          ),
        ),
      )
      .subscribe(({ response, onlySaved }) => {
        const results = onlySaved
          ? response.results.filter((route) => route.saved)
          : response.results;
        this.userRoutes.set(results);
        this.totalItems.set(onlySaved ? results.length : response.count);
      });
  }

  /** Recupera todas las páginas cuando se filtran las rutas guardadas. */
  private fetchRoutes(search: string | null, order: string, onlySaved: boolean){
    if (!onlySaved) {
      return this.getRoutesAiUser(search, order, false, this.page())
    }

    const emptyPage: ResponsePaginator<RouteAiResponse> = {
      results: [],
      count: 0,
      next: null,
      previous: null,
    }

    return this.getRoutesAiUser(search, order, true, 1).pipe(
      expand((response, index) =>
        response.next ? this.getRoutesAiUser(search, order, true, index + 2) : EMPTY,
      ),
      reduce(
        (accumulator, response) => ({
          ...accumulator,
          results: [...accumulator.results, ...response.results],
          count: response.count,
        }),
        emptyPage,
      ),
    )
  }

  /** Fetch routes generated by AI and requested by the authenticated user. */
  private getRoutesAiUser(search: string | null = null, order: string, onlySaved = false, page = this.page()){
    const params: RouteAiQueryParams = { page, ordering: order }
    if (search) {
      params.search = search
    }
    if (onlySaved) {
      params.saved = true
    }
    return this._routeService.getRoutesAiUser(params)
  }

  /** Convierte las coordenadas de la API en tuplas LatLng para Leaflet. */
  public formatCoords(coords: RouteAiResponse['coords']): LatLngTuple[] {
    return coords.map(({ lat, lon }) => [lat, lon]);
  } 

  /** Devuelve la etiqueta legible del tipo de ruta. */
  public getTypeOfRoute( route_type : string) : string{
    let type_text = ''
    switch(route_type){
      case 'relaxed':
        type_text = 'Relajada'
        break;
      case 'circular':
        type_text = 'Circular'
        break
      case 'fast':
        type_text = 'Rápida y fluida'
        break
      default:
        type_text = route_type
        break
    }
    return type_text
  }

  /** Construye los marcadores del mapa a partir de las coordenadas. */
  public formatMarkers(coords: RouteAiResponse['way_points_coords']): RouteMapMarker[] {
    if (!Array.isArray(coords)) {
      return []
    }
    return coords.map((coord) => ({
      position: [coord.lat, coord.lon],
      label: coord.name
    }))
  }

  /** Formatea la duración total de la ruta. */
  public getTotalTime( duration: number){
    return formatTime(duration)
  }

  /** Devuelve un título basado en el primer y último waypoint. */
  public getTitle(waypoints : string[]){
    if(waypoints.length > 0){
      return waypoints[0] + ' - ' + waypoints[waypoints.length - 1]
    }
    return 'Ruta generada por Inteligencia Artifical'
  }

  /** Une los waypoints en una cadena separada por flechas. */
  public formatTextWaypoints(waypoints : string[]){
    const pointsOfRoutes = waypoints;
    if(pointsOfRoutes.length > 0){
      return pointsOfRoutes.join(' → ');
    }
    return 'Lugares de interés en ruta.';
  }

  /** Emite el texto introducido en el buscador. */
  public onSearchChange(event:Event){
    const text = (event.target as HTMLInputElement).value
    this.searchSubject.next(text)
  }

  /** Actualiza el orden de los resultados seleccionado. */
  public updateSortOrder(value: string | null | undefined){
    const order = value === 'id' ? 'id' : '-id'
    this.orderSubject.next(order)
  }

  /** Activa o desactiva el filtro de rutas guardadas. */
  public onSavedFilterChange(event: Event){
    this.onlySavedRoutes.set((event.target as HTMLInputElement).checked)
    this.page.set(1)
  }

  /** Elimina una ruta generada y refresca el listado. */
  public async onDeleteRoute(id:number){
    try {
      await firstValueFrom(this._routeService.deleteRoute(id))
      toast.success('Ruta eliminada correctamente.')
      this.refreshSubject.next()
    } catch {
      toast.error('No se ha podido eliminar la ruta, intentelo mas tarde.')
    }
  }
}
