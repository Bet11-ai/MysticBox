import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

export interface Entrega {
  idEntrega: number;
  idPedido: number;
  direccionEntrega: string;
  estadoEntrega: string;
  fechaEstimada: string | null;
  fechaEntrega: string | null;
  ubicacionReferencia: string | null;
}

export interface CrearEntregaRequest {
  idEntrega: number;
  idPedido: number;
  direccionEntrega: string;
  estadoEntrega: string;
  fechaEstimada: string | null;
  fechaEntrega: string | null;
  ubicacionReferencia: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class EntregaService {

  private apiUrl = `${environment.apiUrl}/Entrega`;

  constructor(private http: HttpClient) {}

  obtenerEntregas(): Observable<Entrega[]> {
    return this.http.get<Entrega[]>(this.apiUrl);
  }

  obtenerEntregaPorId(
    idEntrega: number
  ): Observable<Entrega> {

    return this.http.get<Entrega>(
      `${this.apiUrl}/${idEntrega}`
    );
  }

  crearEntrega(
    entrega: CrearEntregaRequest
  ): Observable<Entrega> {

    return this.http.post<Entrega>(
      this.apiUrl,
      entrega
    );
  }

  actualizarEntrega(
    idEntrega: number,
    entrega: CrearEntregaRequest
  ): Observable<any> {

    return this.http.put<any>(
      `${this.apiUrl}/${idEntrega}`,
      entrega
    );
  }

  eliminarEntrega(
    idEntrega: number
  ): Observable<any> {

    return this.http.delete<any>(
      `${this.apiUrl}/${idEntrega}`
    );
  }
}