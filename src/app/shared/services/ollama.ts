import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AiGenerator, RouteResponse } from '../interfaces/ai-generator';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Ollama {

  private _http = inject(HttpClient)

  /** Call Ollama API for generate custom routes */
  generateRoute(body: AiGenerator): Observable<RouteResponse> {
    return this._http.post<RouteResponse>('ai/generate/', body)
  }
}
