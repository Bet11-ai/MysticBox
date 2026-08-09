import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  environment
} from '../../environments/environment';

export interface DashboardPedido {
  idPedido: number;
  numeroPedido: string;
  cliente: string;
  fechaPedido: string | null;
  total: number;
  estadoPedido: string;
}

export interface Dashboard {
  totalClientes: number;
  clientesActivos: number;
  clientesInactivos: number;

  totalPedidos: number;
  pedidosPendientes: number;
  pedidosPreparando: number;
  pedidosEmpacando: number;
  pedidosEnCamino: number;
  pedidosEntregados: number;
  pedidosCancelados: number;

  ventasTotales: number;
  promedioPorPedido: number;

  totalCajas: number;
  cuponesActivos: number;

  ultimosPedidos: DashboardPedido[];
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private readonly apiUrl =
    `${environment.apiUrl}/Dashboard`;

  constructor(
    private http: HttpClient
  ) {}

  obtenerDashboard():
    Observable<Dashboard> {

    return this.http.get<Dashboard>(
      this.apiUrl
    );
  }
}