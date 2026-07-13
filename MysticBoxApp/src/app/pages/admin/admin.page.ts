import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router, RouterLink } from '@angular/router';

import { addIcons } from 'ionicons';

import {
  arrowBackOutline,
  cubeOutline,
  pricetagOutline,
  receiptOutline,
  peopleOutline,
  barChartOutline,
  shieldCheckmarkOutline,
  settingsOutline,
  chevronForwardOutline,
  logOutOutline,
  storefrontOutline
} from 'ionicons/icons';

interface ModuloAdministrativo {
  titulo: string;
  descripcion: string;
  icono: string;
  ruta: string;
  tarea: string;
}

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    RouterLink
  ]
})
export class AdminPage {

  modulos: ModuloAdministrativo[] = [
    {
      titulo: 'Administrar cajas',
      descripcion:
        'Registrar, editar, consultar y eliminar cajas sorpresa.',
      icono: 'cube-outline',
      ruta: '/admin-cajas',
      tarea: 'MB-73'
    },
    {
      titulo: 'Promociones y cupones',
      descripcion:
        'Crear promociones, descuentos y códigos promocionales.',
      icono: 'pricetag-outline',
      ruta: '/admin-promociones',
      tarea: 'MB-74'
    },
    {
      titulo: 'Gestionar pedidos',
      descripcion:
        'Consultar pedidos y actualizar su estado.',
      icono: 'receipt-outline',
      ruta: '/admin-pedidos',
      tarea: 'MB-75'
    },
    {
      titulo: 'Gestionar clientes',
      descripcion:
        'Consultar y administrar los clientes registrados.',
      icono: 'people-outline',
      ruta: '/admin-clientes',
      tarea: 'MB-76'
    },
    {
      titulo: 'Reportes gráficos',
      descripcion:
        'Visualizar ventas, satisfacción y estadísticas.',
      icono: 'bar-chart-outline',
      ruta: '/admin-reportes',
      tarea: 'HU13'
    },
    {
      titulo: 'White List',
      descripcion:
        'Controlar los usuarios autorizados durante las pruebas.',
      icono: 'shield-checkmark-outline',
      ruta: '/admin-whitelist',
      tarea: 'HU14'
    }
  ];

  constructor(
    private router: Router
  ) {
    addIcons({
      arrowBackOutline,
      cubeOutline,
      pricetagOutline,
      receiptOutline,
      peopleOutline,
      barChartOutline,
      shieldCheckmarkOutline,
      settingsOutline,
      chevronForwardOutline,
      logOutOutline,
      storefrontOutline
    });
  }

  abrirModulo(
    modulo: ModuloAdministrativo
  ): void {
    this.router.navigate([modulo.ruta]);
  }

  volverAlInicio(): void {
    this.router.navigate(['/home']);
  }

  cerrarSesion(): void {
    sessionStorage.removeItem('usuario');
    sessionStorage.removeItem('token');
    localStorage.removeItem('usuario');
    localStorage.removeItem('token');

    this.router.navigate(['/login']);
  }
}