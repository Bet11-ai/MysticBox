import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {

  private apiUrl = `${environment.apiUrl}/Carrito`;

  private apiDetalleUrl =
  `${environment.apiUrl}/DetalleCarrito`;

  constructor(private http: HttpClient) {}

 obtenerDetallesCarrito(): Observable<any[]> {
  return this.http.get<any[]>(
    this.apiDetalleUrl
  );
}

  obtenerCarritos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  obtenerCarritoPorId(idCarrito: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${idCarrito}`);
  }

  crearCarrito(carrito: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, carrito);
  }

  actualizarCarrito(idCarrito: number, carrito: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${idCarrito}`, carrito);
  }

  eliminarCarrito(idCarrito: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${idCarrito}`);
  }

    crearDetalleCarrito(
    detalle: any
  ): Observable<any> {
    return this.http.post<any>(
      this.apiDetalleUrl,
      detalle
    );
  }
}
