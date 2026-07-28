import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { addIcons } from 'ionicons';
import {
  barChartOutline,
  calendarOutline,
  chevronForwardOutline,
  cubeOutline,
  logOutOutline,
  peopleOutline,
  personCircleOutline,
  pricetagOutline,
  receiptOutline,
  settingsOutline,
  shieldCheckmarkOutline,
  sparklesOutline,
  storefrontOutline,
  timeOutline
} from 'ionicons/icons';

import {
  AuthService,
  UsuarioSesion
} from '../../services/auth.service';

interface ModuloAdministrativo {
  titulo: string;
  descripcion: string;
  icono: string;
  tarea: string;
  ruta: string;
  tema: string;
}

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule
  ]
})
export class AdminPage implements OnInit {

  usuario: UsuarioSesion | null = null;

  fechaActual = '';

  horaActual = '';

  private relojIntervalo?: ReturnType<typeof setInterval>;

  modulos: ModuloAdministrativo[] = [
    {
      titulo: 'Administrar cajas',
      descripcion:
        'Registra, edita y organiza el catálogo de cajas sorpresa.',
      icono: 'cube-outline',
      tarea: 'MB-73',
      ruta: '/admin-cajas',
      tema: 'azul'
    },
    {
      titulo: 'Promociones y cupones',
      descripcion:
        'Crea descuentos, códigos promocionales y campañas.',
      icono: 'pricetag-outline',
      tarea: 'MB-74',
      ruta: '/admin-promociones',
      tema: 'morado'
    },
    {
      titulo: 'Gestionar pedidos',
      descripcion:
        'Consulta pedidos, revisa detalles y actualiza sus estados.',
      icono: 'receipt-outline',
      tarea: 'MB-75',
      ruta: '/admin-pedidos',
      tema: 'turquesa'
    },
    {
      titulo: 'Gestionar clientes',
      descripcion:
        'Administra la información de los clientes registrados.',
      icono: 'people-outline',
      tarea: 'MB-76',
      ruta: '/admin-clientes',
      tema: 'naranja'
    },
    {
      titulo: 'Reportes gráficos',
      descripcion:
        'Visualiza ventas, satisfacción y estadísticas del negocio.',
      icono: 'bar-chart-outline',
      tarea: 'HU13',
      ruta: '/admin-reportes',
      tema: 'verde'
    },
    {
      titulo: 'White List',
      descripcion:
        'Controla los usuarios autorizados durante las pruebas.',
      icono: 'shield-checkmark-outline',
      tarea: 'HU14',
      ruta: '/admin-white-list',
      tema: 'dorado'
    }
  ];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    addIcons({
      barChartOutline,
      calendarOutline,
      chevronForwardOutline,
      cubeOutline,
      logOutOutline,
      peopleOutline,
      personCircleOutline,
      pricetagOutline,
      receiptOutline,
      settingsOutline,
      shieldCheckmarkOutline,
      sparklesOutline,
      storefrontOutline,
      timeOutline
    });
  }

  ngOnInit(): void {
    this.cargarAdministrador();
    this.actualizarFechaHora();

    this.relojIntervalo = setInterval(
      () => this.actualizarFechaHora(),
      60000
    );
  }

  ionViewWillEnter(): void {
    this.cargarAdministrador();
    this.actualizarFechaHora();
  }

  ionViewWillLeave(): void {
    if (this.relojIntervalo) {
      clearInterval(this.relojIntervalo);
    }
  }

  private cargarAdministrador(): void {
    this.usuario =
      this.authService.obtenerUsuario();

    if (!this.usuario) {
      this.router.navigate(
        ['/login'],
        {
          replaceUrl: true
        }
      );

      return;
    }

    if (Number(this.usuario.idRol) !== 1) {
      this.router.navigate(
        ['/home'],
        {
          replaceUrl: true
        }
      );
    }
  }

  private actualizarFechaHora(): void {
    const ahora = new Date();

    this.fechaActual =
      ahora.toLocaleDateString(
        'es-CR',
        {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        }
      );

    this.horaActual =
      ahora.toLocaleTimeString(
        'es-CR',
        {
          hour: '2-digit',
          minute: '2-digit'
        }
      );
  }

  abrirModulo(
    modulo: ModuloAdministrativo
  ): void {
    this.router.navigate([
      modulo.ruta
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
}