export interface AiGenerator {
  additional_message: string;
  route_type: string | null;
  origin: string;
  destination?: string | null;
  distance_km?: number | null;
  duration_time?: number | null;
  avoid_motorways: boolean;
  prefer_curvy_roads: boolean;
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
  way_points_coords: any[];
}

export interface RouteResponse {
  ollama: OllamaResponse;
  route_engine : RouteEngineResponse;
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
  distance_km: number | null;
  avoid_motorways: boolean;
  prefer_curvy_roads: boolean;
  origin: string;
  destination: string | null;
  duration_time: number | null;
}
