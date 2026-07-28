import {
  Component
} from '@angular/core';

import {
  Router
} from '@angular/router';

import {
  FormsModule
} from '@angular/forms';

import {
  IonContent,
  IonItem,
  IonInput,
  IonButton,
  IonIcon,
  ToastController
} from '@ionic/angular/standalone';

import {
  AuthService,
  RegistroRequest
} from '../../services/auth.service';

import {
  addIcons
} from 'ionicons';

import {
  personOutline,
  mailOutline,
  callOutline,
  locationOutline,
  lockClosedOutline,
  eyeOffOutline,
  eyeOutline,
  shieldCheckmarkOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-registro',
  templateUrl:
    './registro.page.html',
  styleUrls: [
    './registro.page.scss'
  ],
  standalone: true,
  imports: [
    FormsModule,
    IonContent,
    IonItem,
    IonInput,
    IonButton,
    IonIcon
  ]
})
export class RegistroPage {

  nombre = '';
  correo = '';
  telefono = '';
  direccion = '';
  contrasena = '';
  confirmarContrasena = '';

  mostrarContrasena = false;
  mostrarConfirmacion = false;

  cargando = false;

  constructor(
    private router: Router,

    private toastController:
      ToastController,

    private authService:
      AuthService
  ) {
    addIcons({
      personOutline,
      mailOutline,
      callOutline,
      locationOutline,
      lockClosedOutline,
      eyeOffOutline,
      eyeOutline,
      shieldCheckmarkOutline
    });
  }

  async registrar():
    Promise<void> {

    if (
      !this.nombre.trim() ||
      !this.correo.trim() ||
      !this.telefono.trim() ||
      !this.direccion.trim() ||
      !this.contrasena.trim() ||
      !this.confirmarContrasena
        .trim()
    ) {
      await this.mostrarMensaje(
        'Todos los campos son obligatorios.',
        'warning'
      );

      return;
    }

    const correoValido =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
      !correoValido.test(
        this.correo.trim()
      )
    ) {
      await this.mostrarMensaje(
        'El correo electrónico no es válido.',
        'warning'
      );

      return;
    }

    if (
      this.contrasena.length < 8
    ) {
      await this.mostrarMensaje(
        'La contraseña debe tener mínimo 8 caracteres.',
        'warning'
      );

      return;
    }

    if (
      this.contrasena !==
      this.confirmarContrasena
    ) {
      await this.mostrarMensaje(
        'Las contraseñas no coinciden.',
        'warning'
      );

      return;
    }

    const usuario:
      RegistroRequest = {

      nombre:
        this.nombre.trim(),

      correo:
        this.correo
          .trim()
          .toLowerCase(),

      telefono:
        this.telefono.trim(),

      direccion:
        this.direccion.trim(),

      contrasena:
        this.contrasena
    };

    this.cargando = true;

    this.authService
      .registrar(usuario)
      .subscribe({
        next: async (
          respuesta
        ) => {
          this.cargando = false;

          await this.mostrarMensaje(
            respuesta.mensaje ??
            'Cuenta de cliente creada correctamente.',
            'success'
          );

          await this.router
            .navigateByUrl(
              '/login',
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
            'No se pudo registrar la cuenta.';

          await this.mostrarMensaje(
            mensaje,
            'danger'
          );
        }
      });
  }

  alternarContrasena():
    void {

    this.mostrarContrasena =
      !this.mostrarContrasena;
  }

  alternarConfirmacion():
    void {

    this.mostrarConfirmacion =
      !this.mostrarConfirmacion;
  }

  irLogin(): void {
    this.router.navigate(
      ['/login']
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
          duration: 2600,
          position: 'top',
          color
        });

    await toast.present();
  }
}