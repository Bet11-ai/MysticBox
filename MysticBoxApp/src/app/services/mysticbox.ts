import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Mysticbox {

  private apiUrl = `${environment.apiUrl}/MysticBox`;

  constructor(private http: HttpClient) {}

  obtenerCajas(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  obtenerCajaPorId(idCaja: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${idCaja}`);
  }

  crearCaja(caja: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, caja);
  }

  actualizarCaja(idCaja: number, caja: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${idCaja}`, caja);
  }

  eliminarCaja(idCaja: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${idCaja}`);
  }
}
