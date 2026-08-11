import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import {
  IonContent, IonItem, IonInput, IonButton, IonIcon, ToastController
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import { eyeOffOutline, eyeOutline, keyOutline } from 'ionicons/icons';

import {
  AuthService, LoginRequest, RecuperarContrasenaRequest, UsuarioSesion
} from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonContent, IonItem, IonInput, IonButton, IonIcon]
})
export class LoginPage {
  correo = '';
  contrasena = '';
  mostrarContrasena = false;
  cargando = false;

  mostrarRecuperacion = false;
  correoRecuperacion = '';
  telefonoRecuperacion = '';
  nuevaContrasena = '';
  confirmarContrasena = '';
  mostrarNuevaContrasena = false;
  recuperando = false;

  constructor(
    private router: Router,
    private toastController: ToastController,
    private authService: AuthService
  ) {
    addIcons({ eyeOffOutline, eyeOutline, keyOutline });
  }

  async login(): Promise<void> {
    if (!this.correo.trim() || !this.contrasena.trim()) {
      await this.mostrarMensaje('Digite correo y contraseña.', 'warning');
      return;
    }

    const datosLogin: LoginRequest = {
      correo: this.correo.trim().toLowerCase(),
      contrasena: this.contrasena
    };

    this.cargando = true;
    this.authService.login(datosLogin).subscribe({
      next: async (respuesta: UsuarioSesion) => {
        this.cargando = false;
        this.authService.guardarSesion(respuesta);
        const rutaDestino = this.authService.obtenerRutaInicial();

        if (rutaDestino === '/login') {
          this.authService.cerrarSesion();
          await this.mostrarMensaje('El usuario no tiene un rol válido.', 'danger');
          return;
        }

        await this.mostrarMensaje(`Bienvenido, ${respuesta.nombre}.`, 'success');
        await this.router.navigateByUrl(rutaDestino, { replaceUrl: true });
      },
      error: async (error: any) => {
        this.cargando = false;
        await this.mostrarMensaje(
          error.error?.mensaje ?? 'Correo o contraseña incorrectos.',
          'danger'
        );
      }
    });
  }

  alternarContrasena(): void {
    this.mostrarContrasena = !this.mostrarContrasena;
  }

  abrirRecuperacion(): void {
    this.mostrarRecuperacion = !this.mostrarRecuperacion;
    if (this.mostrarRecuperacion && this.correo.trim()) {
      this.correoRecuperacion = this.correo.trim().toLowerCase();
    }
  }

  async recuperarContrasena(): Promise<void> {
    if (
      !this.correoRecuperacion.trim() ||
      !this.telefonoRecuperacion.trim() ||
      !this.nuevaContrasena ||
      !this.confirmarContrasena
    ) {
      await this.mostrarMensaje('Complete todos los datos de recuperación.', 'warning');
      return;
    }

    if (this.nuevaContrasena.length < 6) {
      await this.mostrarMensaje('La nueva contraseña debe tener al menos 6 caracteres.', 'warning');
      return;
    }

    if (this.nuevaContrasena !== this.confirmarContrasena) {
      await this.mostrarMensaje('Las contraseñas no coinciden.', 'warning');
      return;
    }

    const datos: RecuperarContrasenaRequest = {
      correo: this.correoRecuperacion.trim().toLowerCase(),
      telefono: this.telefonoRecuperacion.trim(),
      nuevaContrasena: this.nuevaContrasena
    };

    this.recuperando = true;
    this.authService.recuperarContrasena(datos).subscribe({
      next: async respuesta => {
        this.recuperando = false;
        this.correo = datos.correo;
        this.mostrarRecuperacion = false;
        this.telefonoRecuperacion = '';
        this.nuevaContrasena = '';
        this.confirmarContrasena = '';
        await this.mostrarMensaje(respuesta.mensaje, 'success');
      },
      error: async error => {
        this.recuperando = false;
        await this.mostrarMensaje(
          error.error?.mensaje ?? 'No fue posible recuperar la contraseña.',
          'danger'
        );
      }
    });
  }

  irRegistro(): void {
    this.router.navigate(['/registro']);
  }

  private async mostrarMensaje(
    mensaje: string,
    color: 'primary' | 'success' | 'warning' | 'danger'
  ): Promise<void> {
    const toast = await this.toastController.create({
      message: mensaje, duration: 2500, position: 'top', color
    });
    await toast.present();
  }
}
