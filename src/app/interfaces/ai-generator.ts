export interface AiGenerator {
  additional_message: string
  route_type: string | null
  origin: string
  destination: string
  distance_km: number
  duration_time?: number
  avoid_motorways: boolean
  prefer_curvy_roads: boolean
}

export interface AiResponse {
  title: string
  origin: string
  destination: string
  way_points: []
  route_type: string
  prefer_curvy_roads: boolean
  distance_estimated_km: number
  coords?: GeoResponse[]
}

export interface GeoResponse {
  location?: string
  altitude?: number
  lat?: number
  lon?: number
  name?: string | null
  position?: string
  msg?: string
  detail?: string
  err?: string
}
