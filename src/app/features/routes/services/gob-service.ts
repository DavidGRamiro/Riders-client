import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  ApiResponse,
  Municipality,
  Provinces,
} from '../interfaces/provinvces-interface';

/** Servicio de consulta de provincias y municipios. */
@Injectable({
  providedIn: 'root',
})
export class GobService {

  private _http = inject(HttpClient)

  /** Obtiene el listado de provincias. */
  getProvinces(): Observable<ApiResponse<Provinces>>{
    return this._http.get<ApiResponse<Provinces>>(
      "https://ccaa-provincias-municipios-localida.vercel.app/api/provincias",
    );
  }

  /** Obtiene los municipios de una provincia con paginación. */
  getMunicipalities(
    provincia_id: number,
    offset = 0,
    limit = 100,
  ): Observable<ApiResponse<Municipality>>{
    return this._http.get<ApiResponse<Municipality>>(
      "https://ccaa-provincias-municipios-localida.vercel.app/api/municipios",
      { params: { provincia_id, offset, limit } }
    );
  }

 
}
