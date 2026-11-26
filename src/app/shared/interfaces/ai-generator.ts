

export interface WayPointCoordinate {
  name: string;
  lat: number;
  lon: number;
}

export interface OllamaResponse {
  avoid_motorways: boolean;
  destination: string;
  distance_estimated_km: number;
  origin: string;
  prefer_curvy_roads: boolean;
  route_type: string;
  title: string;
  way_points: string[];
  way_points_coords: WayPointCoordinate[];
}

export interface RouteResponse {
  id: number;
  saved: boolean;
  ollama: OllamaResponse;
  route_engine: RouteEngineResponse;
}

export interface GeneratedRouteResponse extends Omit<RouteResponse, 'id' | 'saved'> {
  id?: number;
  saved?: boolean;
  route?: { id: number; saved: boolean };
}

export interface RouteEngineResponse {
  distance: number;
  duration: number;
  coordinates: CoordinatesEngine[]
}

export interface CoordinatesEngine {
  lat: number;
  lon: number;
}

export interface AiRouteFormModel {
  additional_message: string;
  route_type: string | null;
  avoid_motorways: boolean;
  prefer_curvy_roads: boolean;
  origin: string;
  destination: string | null;
}

export interface GenerateRouteRequest extends Omit<AiRouteFormModel, 'prefer_curvy_roads'> {
  prefer_curvy_roads?: boolean;
}
