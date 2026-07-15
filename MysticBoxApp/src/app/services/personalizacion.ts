import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

export interface Personalizacion {
  idPersonalizacion: number;
  idUsuario: number;
  idCaja: number;
  tamanoCaja: string;
  preferencias: string;
  exclusiones: string;
  mensajePersonalizado: string;
  fechaPersonalizacion: string | null;
}

export interface RespuestaPersonalizacion {
  mensaje: string;
  personalizacion: Personalizacion;
}

@Injectable({
  providedIn: 'root'
})
export class PersonalizacionService {

  private readonly apiUrl =
    `${environment.apiUrl}/Personalizaciones`;

  constructor(private http: HttpClient) { }

  crearPersonalizacion(
    personalizacion: Personalizacion
  ): Observable<RespuestaPersonalizacion> {

    return this.http.post<RespuestaPersonalizacion>(
      this.apiUrl,
      personalizacion
    );
  }

  obtenerPersonalizaciones(): Observable<Personalizacion[]> {
    return this.http.get<Personalizacion[]>(
      this.apiUrl
    );
  }

  obtenerPersonalizacionPorId(
    idPersonalizacion: number
  ): Observable<Personalizacion> {

    return this.http.get<Personalizacion>(
      `${this.apiUrl}/${idPersonalizacion}`
    );
  }

  actualizarPersonalizacion(
    idPersonalizacion: number,
    personalizacion: Personalizacion
  ): Observable<RespuestaPersonalizacion> {

    return this.http.put<RespuestaPersonalizacion>(
      `${this.apiUrl}/${idPersonalizacion}`,
      personalizacion
    );
  }
}