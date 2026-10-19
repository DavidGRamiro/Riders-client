import { HttpClient, HttpContext } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { LoginRequest } from '../interfaces/login.interface';

@Injectable({
  providedIn: 'root',
})
export class Auth {

  private _hhtp = inject(HttpClient)

  /** Ruta para obtener el par de tokens. */
  authenticate(body: LoginRequest){
    return this._hhtp.post('api/login', body)
  }
}
