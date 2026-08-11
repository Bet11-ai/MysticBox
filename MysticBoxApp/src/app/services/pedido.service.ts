import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

export interface Pedido {
  idPedido: number;
  numeroPedido?: string;

  idUsuario: number;
  idCupon: number | null;
  idMetodoPago: number;

  fechaPedido: string | null;
  fechaEstimadaEntrega?: string | null;

  subtotal: number;
  descuento: number | null;
  costoEnvio: number;
  total: number;

  estadoPedido: string | null;

  tipoEntrega: string | null;
  direccionEntrega: string | null;
  provinciaEntrega: string | null;
}

export interface CrearPedidoRequest {
  idUsuario: number;
  idCupon: number | null;
  idMetodoPago: number;

  fechaPedido: string | null;

  subtotal: number;
  descuento: number;
  costoEnvio: number;
  total: number;

  estadoPedido: string;

  tipoEntrega: string;
  direccionEntrega: string | null;
  provinciaEntrega: string | null;
}

export interface ActualizarPedidoRequest {
  idPedido: number;

  idUsuario: number;
  idCupon: number | null;
  idMetodoPago: number;

  fechaPedido: string | null;

  subtotal: number;
  descuento: number | null;
  costoEnvio: number;
  total: number;

  estadoPedido: string;

  tipoEntrega: string | null;
  direccionEntrega: string | null;
  provinciaEntrega: string | null;
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
  costoEnvio: number;
  total: number;

  tipoEntrega: string | null;
  direccionEntrega: string | null;
  provinciaEntrega: string | null;

  idCupon: number | null;
  idMetodoPago: number;
}

export interface ClientePedidoDetalle {
  idUsuario: number;
  nombre: string;
  correo: string;
  telefono: string | null;
  direccion: string | null;
}

export interface MetodoPagoPedidoDetalle {
  idMetodoPago: number;
  nombreMetodo: string;
}

export interface CuponPedidoDetalle {
  idCupon: number;
  codigo: string;
  descripcion: string | null;
  porcentajeDescuento: number | null;
  montoDescuento: number | null;
}

export interface ProductoPedidoDetalle {
  idDetallePedido: number;
  idCaja: number;
  nombreCaja: string;
  descripcion: string | null;
  imagen: string | null;

  cantidad: number;
  precioUnitario: number;
  subtotal: number;

  idPersonalizacion: number | null;
  tamanoCaja: string | null;
  preferencias: string | null;
  exclusiones: string | null;
  mensajePersonalizado: string | null;

  errorImagen?: boolean;
}

export interface PedidoDetalleCompleto {
  idPedido: number;
  numeroPedido: string;

  fechaPedido: string | null;
  estadoPedido: string;

  subtotal: number;
  descuento: number;
  costoEnvio: number;
  total: number;

  tipoEntrega: string | null;
  direccionEntrega: string | null;
  provinciaEntrega: string | null;

  cliente: ClientePedidoDetalle;
  metodoPago: MetodoPagoPedidoDetalle;
  cupon: CuponPedidoDetalle | null;

  productos: ProductoPedidoDetalle[];
}

@Injectable({
  providedIn: 'root'
})
export class PedidoService {

  private readonly apiUrl =
    `${environment.apiUrl}/Pedido`;

  constructor(
    private http: HttpClient
  ) {}

  obtenerPedidos(): Observable<Pedido[]> {

    return this.http.get<Pedido[]>(
      this.apiUrl
    );
  }

  obtenerPedidoPorId(
    idPedido: number
  ): Observable<Pedido> {

    return this.http.get<Pedido>(
      `${this.apiUrl}/${idPedido}`
    );
  }

  obtenerDetalleCompleto(
    idPedido: number
  ): Observable<PedidoDetalleCompleto> {

    return this.http.get<PedidoDetalleCompleto>(
      `${this.apiUrl}/${idPedido}/detalle-completo`
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
    pedido: ActualizarPedidoRequest
  ): Observable<unknown> {

    return this.http.put<unknown>(
      `${this.apiUrl}/${idPedido}`,
      pedido
    );
  }

  eliminarPedido(
    idPedido: number
  ): Observable<unknown> {

    return this.http.delete<unknown>(
      `${this.apiUrl}/${idPedido}`
    );
  }
}