import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import {
  IonContent,
  IonItem,
  IonInput,
  IonButton,
  ToastController
} from '@ionic/angular/standalone';

import {
  AuthService,
  LoginRequest,
  UsuarioSesion
} from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    FormsModule,
    IonContent,
    IonItem,
    IonInput,
    IonButton
  ]
})
export class LoginPage {

  correo = '';
  contrasena = '';
  cargando = false;

  constructor(
    private router: Router,
    private toastController:
      ToastController,
    private authService:
      AuthService
  ) {}

  async login(): Promise<void> {

    if (
      !this.correo.trim() ||
      !this.contrasena.trim()
    ) {
      await this.mostrarMensaje(
        'Digite correo y contraseña.',
        'warning'
      );

      return;
    }

    const datosLogin:
      LoginRequest = {

      correo:
        this.correo
          .trim()
          .toLowerCase(),

      contrasena:
        this.contrasena
    };

    this.cargando = true;

    this.authService
      .login(datosLogin)
      .subscribe({
        next: async (
          respuesta:
            UsuarioSesion
        ) => {
          this.cargando = false;

          this.authService
            .guardarSesion(
              respuesta
            );

          const rutaDestino =
            this.authService
              .obtenerRutaInicial();

          if (
            rutaDestino === '/login'
          ) {
            this.authService
              .cerrarSesion();

            await this.mostrarMensaje(
              'El usuario no tiene un rol válido.',
              'danger'
            );

            return;
          }

          await this.mostrarMensaje(
            `Bienvenido, ${respuesta.nombre}.`,
            'success'
          );

          await this.router
            .navigateByUrl(
              rutaDestino,
              {
                replaceUrl: true
              }
            );
        },

        error: async (
          error: any
        ) => {
          this.cargando = false;

          const mensaje =
            error.error?.mensaje ??
            'Correo o contraseña incorrectos.';

          await this.mostrarMensaje(
            mensaje,
            'danger'
          );
        }
      });
  }

  irRegistro(): void {
    this.router.navigate(
      ['/registro']
    );
  }

  private async mostrarMensaje(
    mensaje: string,
    color:
      'primary' |
      'success' |
      'warning' |
      'danger'
  ): Promise<void> {

    const toast =
      await this.toastController
        .create({
          message: mensaje,
          duration: 2500,
          position: 'top',
          color
        });

    await toast.present();
  }
}