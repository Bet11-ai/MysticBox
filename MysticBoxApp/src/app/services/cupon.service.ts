import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpParams
} from '@angular/common/http';

import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Cupon {
  idCupon: number;
  codigo: string;
  descripcion: string | null;
  porcentajeDescuento: number | null;
  montoDescuento: number | null;
  fechaInicio: string;
  fechaFin: string;
  activo: boolean | null;
}

export interface CuponRequest {
  codigo: string;
  descripcion: string | null;
  porcentajeDescuento: number | null;
  montoDescuento: number | null;
  fechaInicio: string;
  fechaFin: string;
  activo: boolean;
}

export interface ValidacionCupon {
  valido: boolean;
  mensaje: string;
  idCupon: number;
  codigo: string;
  descripcion: string;
  porcentajeDescuento: number | null;
  montoDescuento: number | null;
  subtotal: number;
  descuento: number;
  totalFinal: number;
  fechaInicio: string;
  fechaFin: string;
}

@Injectable({
  providedIn: 'root'
})
export class CuponService {

  private apiUrl =
    `${environment.apiUrl}/cupones`;

  constructor(
    private http: HttpClient
  ) {}

  obtenerCupones(): Observable<Cupon[]> {
    return this.http.get<Cupon[]>(
      this.apiUrl
    );
  }

  obtenerCuponPorId(
    idCupon: number
  ): Observable<Cupon> {
    return this.http.get<Cupon>(
      `${this.apiUrl}/${idCupon}`
    );
  }

  crearCupon(
    cupon: CuponRequest
  ): Observable<Cupon> {
    return this.http.post<Cupon>(
      this.apiUrl,
      cupon
    );
  }

  actualizarCupon(
    idCupon: number,
    cupon: CuponRequest
  ): Observable<any> {
    return this.http.put<any>(
      `${this.apiUrl}/${idCupon}`,
      cupon
    );
  }

  eliminarCupon(
    idCupon: number
  ): Observable<any> {
    return this.http.delete<any>(
      `${this.apiUrl}/${idCupon}`
    );
  }

  validarCupon(
    codigo: string,
    subtotal: number
  ): Observable<ValidacionCupon> {
    const params = new HttpParams()
      .set(
        'subtotal',
        subtotal.toString()
      );

    return this.http.get<ValidacionCupon>(
      `${this.apiUrl}/validar/${encodeURIComponent(codigo)}`,
      { params }
    );
  }
}