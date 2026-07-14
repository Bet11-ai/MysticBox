import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

export interface Calificacion {
  idCalificacion: number;
  idPedido: number;
  estrellas: number;
  comentario: string | null;
  fechaCalificacion: string | null;
}

export interface CrearCalificacionRequest {
  idCalificacion: number;
  idPedido: number;
  estrellas: number;
  comentario: string;
  fechaCalificacion: string | null;
}

export interface CalificacionCreadaResponse {
  mensaje: string;
  idCalificacion: number;
  idPedido: number;
  estrellas: number;
  comentario: string | null;
  fechaCalificacion: string;
}

@Injectable({
  providedIn: 'root'
})
export class CalificacionService {

  private apiUrl =
    `${environment.apiUrl}/Calificacion`;

  constructor(private http: HttpClient) {}

  obtenerCalificaciones(): Observable<Calificacion[]> {
    return this.http.get<Calificacion[]>(
      this.apiUrl
    );
  }

  obtenerCalificacionPorId(
    idCalificacion: number
  ): Observable<Calificacion> {

    return this.http.get<Calificacion>(
      `${this.apiUrl}/${idCalificacion}`
    );
  }

  crearCalificacion(
    calificacion: CrearCalificacionRequest
  ): Observable<CalificacionCreadaResponse> {

    return this.http.post<CalificacionCreadaResponse>(
      this.apiUrl,
      calificacion
    );
  }

  actualizarCalificacion(
    idCalificacion: number,
    calificacion: CrearCalificacionRequest
  ): Observable<any> {

    return this.http.put<any>(
      `${this.apiUrl}/${idCalificacion}`,
      calificacion
    );
  }

  eliminarCalificacion(
    idCalificacion: number
  ): Observable<any> {

    return this.http.delete<any>(
      `${this.apiUrl}/${idCalificacion}`
    );
  }
}