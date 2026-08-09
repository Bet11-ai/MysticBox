import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  environment
} from '../../environments/environment';

export interface VentaMensual {
  numeroMes: number;
  mes: string;
  cantidadPedidos: number;
  ventas: number;
}

export interface PedidoEstadoEstadistica {
  estado: string;
  cantidad: number;
  porcentaje: number;
}

export interface ClienteEstadistica {
  idUsuario: number;
  nombre: string;
  cantidadPedidos: number;
  totalComprado: number;
}

export interface Estadisticas {
  anio: number;

  totalPedidos: number;

  ventasTotales: number;

  promedioVenta: number;

  descuentosAplicados: number;

  totalClientesConPedidos: number;

  mesMayorVenta: string;

  mayorVentaMensual: number;

  ventasPorMes: VentaMensual[];

  pedidosPorEstado:
    PedidoEstadoEstadistica[];

  mejoresClientes:
    ClienteEstadistica[];
}

@Injectable({
  providedIn: 'root'
})
export class EstadisticasService {

  private readonly apiUrl =
    `${environment.apiUrl}/Estadisticas`;

  constructor(
    private http: HttpClient
  ) {}

  obtenerEstadisticas(
    anio?: number
  ): Observable<Estadisticas> {

    if (anio) {
      return this.http.get<Estadisticas>(
        `${this.apiUrl}?anio=${anio}`
      );
    }

    return this.http.get<Estadisticas>(
      this.apiUrl
    );
  }
}