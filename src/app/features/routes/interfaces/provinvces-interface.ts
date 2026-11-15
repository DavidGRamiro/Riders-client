export interface Municipality {
  id: number;
  nombre: string;
  provincia_id: number;
}

export interface Provinces {
  id: number;
  nombre: string;
  comunidad_id: number;
  municipios: Municipality[];
}

export interface ApiResponse<T> {
  total?: number;
  limit?: number;
  offset?: number;
  data: T[];
}
