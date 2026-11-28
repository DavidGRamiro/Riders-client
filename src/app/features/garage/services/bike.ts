import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BikeForm } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class Bike {

  private _http = inject(HttpClient)

  public registerBike( body : BikeForm ){
    return this._http.post('motorcycle/', body)
  }


}
