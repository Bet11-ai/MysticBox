import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

export interface LoginRequest {
  correo: string;
  contrasena: string;
}

export interface UsuarioSesion {
  idUsuario: number;
  idRol: number;
  nombreRol: string;
  nombre: string;
  correo: string;
  telefono: string | null;
  direccion: string | null;
  fechaRegistro: string | null;
  estado: boolean | null;
}

export interface RegistroRequest {
  nombre: string;
  correo: string;
  telefono: string;
  direccion: string;
  contrasena: string;
}

export interface RegistroResponse {
  mensaje: string;
  usuario: UsuarioSesion;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly apiUrl =
    `${environment.apiUrl}/Auth`;

  private readonly llaveUsuario =
    'usuario';

  constructor(
    private http: HttpClient
  ) {}

  registrar(
    usuario: RegistroRequest
  ): Observable<RegistroResponse> {
    return this.http.post<RegistroResponse>(
      `${this.apiUrl}/Registro`,
      usuario
    );
  }

  login(
    datos: LoginRequest
  ): Observable<UsuarioSesion> {
    return this.http.post<UsuarioSesion>(
      `${this.apiUrl}/Login`,
      datos
    );
  }

  guardarSesion(
    usuario: UsuarioSesion
  ): void {
    localStorage.setItem(
      this.llaveUsuario,
      JSON.stringify(usuario)
    );
  }

  obtenerUsuario():
    UsuarioSesion | null {

    const contenido =
      localStorage.getItem(
        this.llaveUsuario
      );

    if (!contenido) {
      return null;
    }

    try {
      return JSON.parse(
        contenido
      ) as UsuarioSesion;
    } catch {
      this.cerrarSesion();
      return null;
    }
  }

  estaAutenticado(): boolean {
    return this.obtenerUsuario() !== null;
  }

  esAdministrador(): boolean {
    const usuario =
      this.obtenerUsuario();

    if (!usuario) {
      return false;
    }

    const rol =
      this.normalizarTexto(
        usuario.nombreRol
      );

    return (
      usuario.idRol === 1 ||
      rol === 'administrador' ||
      rol === 'admin'
    );
  }

  esCliente(): boolean {
    const usuario =
      this.obtenerUsuario();

    if (!usuario) {
      return false;
    }

    const rol =
      this.normalizarTexto(
        usuario.nombreRol
      );

    return (
      usuario.idRol === 2 ||
      rol === 'cliente' ||
      rol === 'usuario'
    );
  }

  obtenerRutaInicial(): string {
    if (this.esAdministrador()) {
      return '/admin';
    }

    if (this.esCliente()) {
      return '/home';
    }

    return '/login';
  }

  cerrarSesion(): void {
    localStorage.removeItem(this.llaveUsuario);
    localStorage.removeItem('idUsuario');
    localStorage.removeItem('token');
    localStorage.removeItem('ultimoPedido');

    sessionStorage.removeItem('usuario');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('ultimoPedido');
    sessionStorage.removeItem('productosCarrito');
    sessionStorage.removeItem('productoSeleccionado');
    sessionStorage.removeItem('busquedaMysticBox');
    sessionStorage.removeItem('categoriaSeleccionada');
  }

  private normalizarTexto(
    texto: string | null | undefined
  ): string {
    return (texto ?? '')
      .trim()
      .toLowerCase();
  }
}