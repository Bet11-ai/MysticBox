import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

export interface Calificacion {
  idCalificacion: number;
  idPedido: number;
  estrellas: number;
  comentario: string | null;
  fechaCalificacion: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class SatisfaccionService {

  private readonly apiUrl =
    `${environment.apiUrl}/Calificacion`;

  constructor(
    private http: HttpClient
  ) {}

  obtenerCalificaciones():
    Observable<Calificacion[]> {

    return this.http.get<Calificacion[]>(
      this.apiUrl
    );
  }
}