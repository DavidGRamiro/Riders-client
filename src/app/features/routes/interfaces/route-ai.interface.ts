

export interface RouteAiResponse {
  id:number;
  id_fk_user: number;
  coords : AiCoords[];
  created_at: string;
  distance_km: number;
  route_type:string;
  saved: boolean;
  waypoints: string[];
  title: string;
  prompt: string;
  route_code: string;
  way_points_coords: [],
  duration: number;
}

export interface AiCoords {
  lat: number;
  lon: number;
}