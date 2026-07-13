import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

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

  private apiUrl = `${environment.apiUrl}/cupones`;

  constructor(private http: HttpClient) {}

  validarCupon(
    codigo: string,
    subtotal: number
  ): Observable<ValidacionCupon> {

    const params = new HttpParams()
      .set('subtotal', subtotal.toString());

    return this.http.get<ValidacionCupon>(
      `${this.apiUrl}/validar/${encodeURIComponent(codigo)}`,
      { params }
    );
  }
}