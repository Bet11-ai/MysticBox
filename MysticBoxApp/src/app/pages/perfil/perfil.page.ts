import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { addIcons } from 'ionicons';

import {
  arrowBackOutline,
  callOutline,
  locationOutline,
  logOutOutline,
  mailOutline,
  personCircleOutline,
  personOutline,
  shieldCheckmarkOutline
} from 'ionicons/icons';

import {
  AuthService,
  UsuarioSesion
} from '../../services/auth.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule
  ]
})
export class PerfilPage implements OnInit {

  usuario: UsuarioSesion | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {

    addIcons({
      arrowBackOutline,
      callOutline,
      locationOutline,
      logOutOutline,
      mailOutline,
      personCircleOutline,
      personOutline,
      shieldCheckmarkOutline
    });
  }

  ngOnInit(): void {
    this.cargarUsuario();
  }

  ionViewWillEnter(): void {
    this.cargarUsuario();
  }

  private cargarUsuario(): void {

    this.usuario =
      this.authService.obtenerUsuario();

    if (!this.usuario) {

      this.router.navigate(
        ['/login'],
        {
          replaceUrl: true
        }
      );
    }
  }

  volverAlInicio(): void {

    if (
      Number(
        this.usuario?.idRol
      ) === 1
    ) {

      this.router.navigate([
        '/admin'
      ]);

      return;
    }

    this.router.navigate([
      '/home'
    ]);
  }

  cerrarSesion(): void {

    this.authService.cerrarSesion();

    this.router.navigate(
      ['/login'],
      {
        replaceUrl: true
      }
    );
  }

  obtenerRol(): string {

    return Number(
      this.usuario?.idRol
    ) === 1
      ? 'Administrador'
      : 'Cliente';
  }

  obtenerIniciales(): string {

    const nombre =
      this.usuario?.nombre
        ?.trim();

    if (!nombre) {
      return 'MB';
    }

    return nombre
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map(
        parte =>
          parte.charAt(0)
      )
      .join('')
      .toUpperCase();
  }
}