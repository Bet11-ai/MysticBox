import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

export interface CrearPedidoRequest {
  idPedido: number;
  idUsuario: number;
  idCupon: number | null;
  idMetodoPago: number;
  fechaPedido: string | null;
  subtotal: number;
  descuento: number;
  total: number;
  estadoPedido: string;
}

export interface PedidoCreadoResponse {
  mensaje: string;
  idPedido: number;
  numeroPedido: string;
  fechaPedido: string;
  fechaEstimadaEntrega: string;
  estadoPedido: string;
  subtotal: number;
  descuento: number;
  total: number;
  idCupon: number | null;
  idMetodoPago: number;
}

@Injectable({
  providedIn: 'root'
})
export class PedidoService {

  private apiUrl = `${environment.apiUrl}/Pedido`;

  constructor(private http: HttpClient) {}

  obtenerPedidos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  obtenerPedidoPorId(idPedido: number): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/${idPedido}`
    );
  }

  crearPedido(
    pedido: CrearPedidoRequest
  ): Observable<PedidoCreadoResponse> {

    return this.http.post<PedidoCreadoResponse>(
      this.apiUrl,
      pedido
    );
  }

  actualizarPedido(
    idPedido: number,
    pedido: CrearPedidoRequest
  ): Observable<any> {

    return this.http.put<any>(
      `${this.apiUrl}/${idPedido}`,
      pedido
    );
  }

  eliminarPedido(idPedido: number): Observable<any> {
    return this.http.delete<any>(
      `${this.apiUrl}/${idPedido}`
    );
  }
}