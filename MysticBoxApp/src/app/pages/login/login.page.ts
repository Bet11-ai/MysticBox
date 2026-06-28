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

import { AuthService } from '../../services/auth.service';

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
    private toastController: ToastController,
    private authService: AuthService
  ) {}

  async login() {
    if (!this.correo.trim() || !this.contrasena.trim()) {
      return this.mostrarMensaje('Digite correo y contraseña.');
    }

    const datosLogin = {
      correo: this.correo,
      contrasena: this.contrasena
    };

    this.cargando = true;

    this.authService.login(datosLogin).subscribe({
  next: async (respuesta: any) => {

    console.log('RESPUESTA DEL BACKEND:', respuesta);

    this.cargando = false;

    localStorage.setItem('usuario', JSON.stringify(respuesta));

    await this.mostrarMensaje('Inicio de sesión correcto.');

    this.router.navigate(['/home']);
  },

  error: async (error: any) => {

    console.log('ERROR COMPLETO:', error);
    console.log('STATUS:', error.status);
    console.log('BODY:', error.error);

    this.cargando = false;

    await this.mostrarMensaje('Correo o contraseña incorrectos.');
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

  irRegistro() {
    this.router.navigate(['/registro']);
  }
}