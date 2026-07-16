import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class CategoriasService {

private apiUrl = `${environment.apiUrl}/categorias`;

  constructor(private http: HttpClient) { }

obtenerCategorias(): Observable<any> {
  return this.http.get<any>(this.apiUrl);
}

  obtenerCategoriaPorId(idCategoria: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${idCategoria}`);
  }

  crearCategoria(categoria: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, categoria);
  }

  actualizarCategoria(idCategoria: number, categoria: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${idCategoria}`, categoria);
  }

  eliminarCategoria(idCategoria: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${idCategoria}`);
  }
}