import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface MysticBoxModel {
  idCaja: number;
  idCategoria: number;
  nombreCaja: string;
  descripcion: string | null;
  precio: number;
  imagen: string | null;
  stock: number;
  estado: boolean | null;
  esOferta: boolean;
  porcentajeOferta: number | null;
  esRecomendada: boolean;
  esDestacada: boolean;
}

export interface MysticBoxRequest {
  idCategoria: number;
  nombreCaja: string;
  descripcion: string | null;
  precio: number;
  imagen: string | null;
  stock: number;
  estado: boolean | null;
  esOferta: boolean;
  porcentajeOferta: number | null;
  esRecomendada: boolean;
  esDestacada: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class Mysticbox {
  private apiUrl = `${environment.apiUrl}/MysticBox`;

  constructor(private http: HttpClient) {}

  obtenerCajas(): Observable<MysticBoxModel[]> {
    return this.http.get<MysticBoxModel[]>(this.apiUrl);
  }

  obtenerCajaPorId(idCaja: number): Observable<MysticBoxModel> {
    return this.http.get<MysticBoxModel>(`${this.apiUrl}/${idCaja}`);
  }

  crearCaja(caja: MysticBoxRequest): Observable<MysticBoxModel> {
    return this.http.post<MysticBoxModel>(this.apiUrl, caja);
  }

  actualizarCaja(idCaja: number, caja: MysticBoxRequest): Observable<unknown> {
    return this.http.put<unknown>(`${this.apiUrl}/${idCaja}`, caja);
  }

  eliminarCaja(idCaja: number): Observable<unknown> {
    return this.http.delete<unknown>(`${this.apiUrl}/${idCaja}`);
  }
}
