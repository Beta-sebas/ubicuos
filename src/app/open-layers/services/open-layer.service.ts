import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Marcador, DatosResponse } from '../interfaces/marcador.interface';

@Injectable({
  providedIn: 'root'
})
export class OpenLayerService {

  private _url: string = environment.url;

  constructor( private http: HttpClient ) { }

  getSugerencias( termino: string ) {
    return this.http.get<Marcador[]>(`${this._url}marcadores?name=${termino}`);
  }

  getMarcador( id: number ) {
    return this.http.get<Marcador>(`${this._url}marcadores?id=${id}`);
  }

  getDatosMarcador( id: number ) {
    return this.http.get<DatosResponse[]>(`${this._url}datos?id=${id}`);
  }
}
