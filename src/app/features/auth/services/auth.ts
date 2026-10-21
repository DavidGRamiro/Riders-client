import { HttpClient, HttpContext } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { LoginRequest, ResponseLogin } from '../interfaces/login.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Auth {

  private _hhtp = inject(HttpClient)

  /** Ruta para obtener el par de tokens. */
  authenticate(body: LoginRequest): Observable<ResponseLogin>{
    return this._hhtp.post<ResponseLogin>('api/login', body)
  }
}
