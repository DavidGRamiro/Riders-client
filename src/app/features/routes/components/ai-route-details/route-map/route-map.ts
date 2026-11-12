import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { HlmCardImports } from '@spartan-ng/helm/card';
import {
  DefaultIcon,
  Map as LeafletMap,
  Marker,
  Polyline,
  TileLayer,
  type LatLngTuple,
  type Layer,
} from 'leaflet';

export interface RouteMapMarker {
  position: LatLngTuple;
  label?: string;
}

const DEFAULT_CENTER: LatLngTuple = [40.4168, -3.7038];

const DEFAULT_ROUTE: LatLngTuple[] = [
  [40.4168, -3.7038],
  [40.4217, -3.7106],
  [40.4295, -3.7182],
  [40.4381, -3.7114],
  [40.4448, -3.7035],
];

const DEFAULT_MARKERS: RouteMapMarker[] = [
  { position: [40.4168, -3.7038], label: 'Puerta del Sol' },
  { position: [40.4448, -3.7035], label: 'Plaza de España' },
];

/**
 * Mapa de prueba basado en Leaflet. Todos los parámetros visuales y geográficos
 * son inputs, por lo que puede reutilizarse con cualquier ruta, marcador o proveedor de teselas.
 */
@Component({
  selector: 'app-route-map',
  imports: [HlmCardImports],
  templateUrl: './route-map.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RouteMap {
  private readonly _mapElement = viewChild.required<ElementRef<HTMLDivElement>>('mapElement');
  private readonly _destroyRef = inject(DestroyRef);

  private _map?: LeafletMap;
  private _tiles?: TileLayer;
  private _overlayLayers: Layer[] = [];
  private readonly _mapReady = signal(false);

  /** Título mostrado sobre el mapa. */
  readonly title = input('Comienza a explorar una nueva zona.');

  /** Altura CSS del contenedor del mapa. */
  readonly height = input('450px');

  /** Etiqueta accesible del mapa. */
  readonly ariaLabel = input('Mapa visualizador de rutas');

  /** Centro inicial del mapa. */
  readonly center = input<LatLngTuple>(DEFAULT_CENTER);

  /** Nivel de zoom inicial. */
  readonly zoom = input(13);

  /** Zoom mínimo permitido. */
  readonly minZoom = input(3);

  /** Zoom máximo permitido. */
  readonly maxZoom = input(19);

  /** Plantilla de URL de las teselas. Cambiarla para usar otro proveedor. */
  readonly tileUrl = input('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');

  /** Texto de atribución del proveedor de teselas. */
  readonly attribution = input(
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  );

  /** Puntos de la polilínea que representa la ruta. */
  readonly route = input<LatLngTuple[]>(DEFAULT_ROUTE);

  /** Marcadores que se pintan sobre el mapa. */
  readonly markers = input<RouteMapMarker[]>(DEFAULT_MARKERS);

  /** Color de la polilínea de la ruta. */
  readonly routeColor = input('#f97316');

  /** Grosor de la polilínea de la ruta. */
  readonly routeWeight = input(5);

  /** Color de los marcadores. */
  readonly markerColor = input('#f97316');

  /** Ajusta automáticamente la vista para encuadrar ruta y marcadores. */
  readonly fitToContent = input(true);

  /** Control de zoom nativo de Leaflet. */
  readonly showZoomControl = input(true);

  /** Se emite cuando el mapa ha sido creado, para personalizaciones avanzadas. */
  readonly mapReady = output<LeafletMap>();

  /** Instancia de Leaflet disponible para personalizaciones externas. */
  readonly map = signal<LeafletMap | undefined>(undefined);

  constructor() {
    /*
     * Inicialización del mapa:
     * Se espera a que el DOM esté renderizado para crear la instancia de Leaflet sobre
     * el contenedor `#mapElement`. Se aplican los valores iniciales de centro, zoom y
     * controles. Al terminar se marca `_mapReady` para activar los efectos reactivos y
     * se emite `mapReady` para que el componente padre pueda personalizar el mapa.
     */
    afterNextRender(() => {
      const map = new LeafletMap(this._mapElement().nativeElement, {
        center: this.center(),
        zoom: this.zoom(),
        minZoom: this.minZoom(),
        maxZoom: this.maxZoom(),
        zoomControl: this.showZoomControl(),
      });

      this._map = map;
      this.map.set(map);
      this._mapReady.set(true);
      this.mapReady.emit(map);
    });

    /*
     * Efecto de vista:
     * Cada vez que cambian `center` o `zoom`, recentra el mapa sin recrearlo,
     * manteniendo la misma instancia de Leaflet.
     */
    effect(() => {
      if (!this._mapReady()) {
        return;
      }
      this._map?.setView(this.center(), this.zoom());
    });

    /*
     * Efecto de teselas:
     * Reacciona a cambios en `tileUrl`, `attribution`, `minZoom` o `maxZoom`.
     * Elimina la capa anterior y crea una nueva `TileLayer`, lo que permite cambiar
     * de proveedor de mapas (OSM, Carto, Stadia, etc.) en tiempo de ejecución.
     */
    effect(() => {
      if (!this._mapReady()) {
        return;
      }

      const map = this._map;
      if (!map) {
        return;
      }

      this._tiles?.remove();
      this._tiles = new TileLayer(this.tileUrl(), {
        attribution: this.attribution(),
        minZoom: this.minZoom(),
        maxZoom: this.maxZoom(),
      }).addTo(map);
    });

    /*
     * Efecto de overlays:
     * Se ejecuta cuando cambian `route` o `markers` (y los estilos usados por
     * `_renderOverlays`). Vuelve a dibujar la polilínea y los marcadores, y ajusta
     * la vista si `fitToContent` está activo.
     */
    effect(() => {
      if (!this._mapReady()) {
        return;
      }

      this._renderOverlays(this.route(), this.markers());
    });

    /*
     * Limpieza:
     * Al destruir el componente se elimina la instancia del mapa, sus capas y la
     * referencia expuesta en la señal `map` para liberar memoria y listeners.
     */
    this._destroyRef.onDestroy(() => {
      this._map?.remove();
      this._map = undefined;
      this._tiles = undefined;
      this._overlayLayers = [];
      this.map.set(undefined);
    });
  }

  /**
   * Dibuja (o redibuja) las capas superpuestas del mapa.
   *
   * @param route Puntos que forman la polilínea de la ruta.
   * @param markers Marcadores a mostrar, con etiqueta opcional para el popup.
   *
   * Pasos:
   * 1. Elimina las capas anteriores para evitar duplicados al cambiar los datos.
   * 2. Crea una `Polyline` si la ruta tiene al menos dos puntos.
   * 3. Crea un `Marker` por cada marcador, usando `DefaultIcon` con `markerColor`.
   * 4. Si `fitToContent` está activo, encuadra todos los puntos con padding.
   */
  private _renderOverlays(
    route: readonly LatLngTuple[],
    markers: readonly RouteMapMarker[],
  ): void {
    const map = this._map;
    if (!map) {
      return;
    }

    // Limpieza de capas previas (polilínea y marcadores).
    for (const layer of this._overlayLayers) {
      layer.remove();
    }
    this._overlayLayers = [];

    // Polilínea de la ruta: solo se dibuja si hay dos puntos o más.
    if (route.length > 1) {
      const polyline = new Polyline([...route], {
        color: this.routeColor(),
        weight: this.routeWeight(),
        opacity: 0.9,
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(map);

      this._overlayLayers.push(polyline);
    }

    // Marcadores: comparten el icono generado con el color configurado.
    const icon = new DefaultIcon({ color: this.markerColor() });

    for (const marker of markers) {
      const instance = new Marker(marker.position, { icon });

      // Popup opcional con la etiqueta del marcador.
      if (marker.label) {
        instance.bindPopup(marker.label);
      }

      instance.addTo(map);
      this._overlayLayers.push(instance);
    }

    // Ajuste de vista para encuadrar ruta y marcadores.
    if (this.fitToContent()) {
      const points: LatLngTuple[] = [...route, ...markers.map((marker) => marker.position)];

      if (points.length > 1) {
        map.fitBounds(points, { padding: [32, 32] });
      }
    }
  }
}
