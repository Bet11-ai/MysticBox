import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

export interface CrearDetallePedidoRequest {
  idPedido: number;
  idCaja: number;
  idPersonalizacion: number | null;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface DetallePedidoRespuesta {
  idDetallePedido: number;
  idPedido: number;
  idCaja: number;
  idPersonalizacion: number | null;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

@Injectable({
  providedIn: 'root'
})
export class DetallePedidoService {

  private apiUrl = `${environment.apiUrl}/DetallePedido`;

  constructor(private http: HttpClient) { }

  obtenerDetallesPedido(): Observable<DetallePedidoRespuesta[]> {
    return this.http.get<DetallePedidoRespuesta[]>(this.apiUrl);
  }

  obtenerDetallePedidoPorId(
    idDetallePedido: number
  ): Observable<DetallePedidoRespuesta> {

    return this.http.get<DetallePedidoRespuesta>(
      `${this.apiUrl}/${idDetallePedido}`
    );
  }

  crearDetallePedido(
    detalle: CrearDetallePedidoRequest
  ): Observable<DetallePedidoRespuesta> {

    return this.http.post<DetallePedidoRespuesta>(
      this.apiUrl,
      detalle
    );
  }
}