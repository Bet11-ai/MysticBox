import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  environment
} from '../../environments/environment';

export interface Cliente {
  idUsuario: number;
  idRol: number;
  nombreRol: string;
  nombre: string;
  correo: string;
  telefono: string | null;
  direccion: string | null;
  fechaRegistro: string | null;
  estado: boolean;
}

export interface ActualizarClienteRequest {
  nombre: string;
  correo: string;
  telefono: string | null;
  direccion: string | null;
}

export interface CambiarEstadoClienteRequest {
  estado: boolean;
}

export interface RespuestaMensaje {
  mensaje: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private readonly apiUrl =
    `${environment.apiUrl}/Usuario`;

  constructor(
    private http: HttpClient
  ) {}

  obtenerClientes():
    Observable<Cliente[]> {

    return this.http.get<Cliente[]>(
      `${this.apiUrl}/clientes`
    );
  }

  obtenerClientePorId(
    idUsuario: number
  ): Observable<Cliente> {

    return this.http.get<Cliente>(
      `${this.apiUrl}/clientes/${idUsuario}`
    );
  }

  actualizarCliente(
    idUsuario: number,
    cliente: ActualizarClienteRequest
  ): Observable<RespuestaMensaje> {

    return this.http.put<RespuestaMensaje>(
      `${this.apiUrl}/clientes/${idUsuario}`,
      cliente
    );
  }

  cambiarEstadoCliente(
    idUsuario: number,
    estado: boolean
  ): Observable<RespuestaMensaje> {

    const request:
      CambiarEstadoClienteRequest = {
        estado
      };

    return this.http.patch<RespuestaMensaje>(
      `${this.apiUrl}/clientes/${idUsuario}/estado`,
      request
    );
  }
}