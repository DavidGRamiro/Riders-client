import { HttpBackend, HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AiGenerator, AiResponse } from '../interfaces/ai-generator';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Ollama {

  private _http = inject(HttpClient)

  /** Call Ollama API for generate custom routes */
  generateRoute(body: AiGenerator): Observable<AiResponse> {
    return this._http.post<AiResponse>('ai/generate/', body)
  }

  


}
