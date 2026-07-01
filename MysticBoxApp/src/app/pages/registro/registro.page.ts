import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import {
  IonContent,
  IonItem,
  IonInput,
  IonButton,
  IonIcon,
  ToastController
} from '@ionic/angular/standalone';

import { AuthService } from '../../services/auth.service';

import { addIcons } from 'ionicons';

import {
  personOutline,
  mailOutline,
  callOutline,
  locationOutline,
  lockClosedOutline,
  eyeOffOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
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

  cargando = false;

  constructor(
    private router: Router,
    private toastController: ToastController,
    private authService: AuthService
  ) {
    addIcons({
      personOutline,
      mailOutline,
      callOutline,
      locationOutline,
      lockClosedOutline,
      eyeOffOutline
    });
  }

  async registrar() {

    if (
      !this.nombre.trim() ||
      !this.correo.trim() ||
      !this.telefono.trim() ||
      !this.direccion.trim() ||
      !this.contrasena.trim() ||
      !this.confirmarContrasena.trim()
    ) {
      return this.mostrarMensaje('Todos los campos son obligatorios.');
    }

    const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!correoValido.test(this.correo)) {
      return this.mostrarMensaje('El correo electrónico no es válido.');
    }

    if (this.contrasena.length < 8) {
      return this.mostrarMensaje('La contraseña debe tener mínimo 8 caracteres.');
    }

    if (this.contrasena !== this.confirmarContrasena) {
      return this.mostrarMensaje('Las contraseñas no coinciden.');
    }

    const usuario = {
      idRol: 2,
      nombre: this.nombre,
      correo: this.correo,
      telefono: this.telefono,
      direccion: this.direccion,
      contrasena: this.contrasena
    };

    this.cargando = true;

    this.authService.registrar(usuario).subscribe({
      next: async () => {
        this.cargando = false;
        await this.mostrarMensaje('Usuario registrado correctamente.');
        this.router.navigate(['/login']);
      },
      error: async (error: any) => {
        this.cargando = false;
        console.error('Error al registrar usuario:', error);
        await this.mostrarMensaje('No se pudo registrar el usuario.');
      }
    });

  }

  async mostrarMensaje(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2500,
      position: 'top',
      color: 'primary'
    });

    await toast.present();
  }

  irLogin() {
    this.router.navigate(['/login']);
  }

}