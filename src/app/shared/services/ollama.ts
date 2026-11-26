import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { GeneratedRouteResponse, GenerateRouteRequest, RouteResponse } from '../interfaces/ai-generator';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Ollama {

  private _http = inject(HttpClient)

  /** Call Ollama API for generate custom routes */
  generateRoute(body: GenerateRouteRequest): Observable<RouteResponse> {
    return this._http.post<GeneratedRouteResponse>('ai/generate/', body).pipe(
      map(({ route, id = 0, saved = false, ...response }) => ({
        ...response,
        id: route?.id ?? id,
        saved: route?.saved ?? saved,
      })),
    )
  }
}
