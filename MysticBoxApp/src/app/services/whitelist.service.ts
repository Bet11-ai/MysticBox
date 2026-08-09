import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

export interface WhiteList {
  idWhiteList: number;
  correo: string;
  activo: boolean;
  fechaRegistro: string;
}

export interface CrearWhiteListRequest {
  correo: string;
  activo: boolean;
  fechaRegistro: string;
}

export interface ActualizarWhiteListRequest {
  correo: string;
  activo: boolean;
  fechaRegistro: string;
}

@Injectable({
  providedIn: 'root'
})
export class WhiteListService {

  private readonly apiUrl =
    `${environment.apiUrl}/WhiteList`;

  constructor(
    private http: HttpClient
  ) {}

  obtenerTodos(): Observable<WhiteList[]> {
    return this.http.get<WhiteList[]>(
      this.apiUrl
    );
  }

  obtenerPorId(
    idWhiteList: number
  ): Observable<WhiteList> {

    return this.http.get<WhiteList>(
      `${this.apiUrl}/${idWhiteList}`
    );
  }

  crear(
    registro: CrearWhiteListRequest
  ): Observable<any> {

    return this.http.post<any>(
      this.apiUrl,
      registro
    );
  }

  actualizar(
    idWhiteList: number,
    registro: ActualizarWhiteListRequest
  ): Observable<any> {

    return this.http.put<any>(
      `${this.apiUrl}/${idWhiteList}`,
      registro
    );
  }

  eliminar(
    idWhiteList: number
  ): Observable<any> {

    return this.http.delete<any>(
      `${this.apiUrl}/${idWhiteList}`
    );
  }
}