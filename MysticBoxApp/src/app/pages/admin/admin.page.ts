import { CommonModule } from '@angular/common';
import {
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';

import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { addIcons } from 'ionicons';

import {
  barChartOutline,
  calendarOutline,
  chevronForwardOutline,
  cubeOutline,
  gridOutline,
  logOutOutline,
  peopleOutline,
  personCircleOutline,
  pricetagOutline,
  receiptOutline,
  settingsOutline,
  shieldCheckmarkOutline,
  sparklesOutline,
  statsChartOutline,
  storefrontOutline,
  starOutline,
  timeOutline,
  documentTextOutline,
} from 'ionicons/icons';

import {
  AuthService,
  UsuarioSesion
} from '../../services/auth.service';

interface ModuloAdmin {
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
export class AdminPage
  implements OnInit, OnDestroy {

  usuario: UsuarioSesion | null = null;

  fechaActual = '';

  horaActual = '';

  private intervaloReloj:
    ReturnType<typeof setInterval> |
    null = null;

  modulos: ModuloAdmin[] = [

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
      titulo: 'Dashboard',
      descripcion:
        'Consulta ventas, clientes, pedidos y la actividad general de la tienda.',
      icono: 'grid-outline',
      tarea: 'MB-78',
      ruta: '/admin-dashboard',
      tema: 'dorado'
    },

    {
      titulo: 'Estadísticas',
      descripcion:
        'Analiza ventas, pedidos, descuentos y comportamiento de clientes.',
      icono: 'stats-chart-outline',
      tarea: 'MB-79',
      ruta: '/admin-estadisticas',
      tema: 'morado'
    },
    {
  titulo: 'Satisfacción',
  descripcion:
    'Analiza calificaciones, opiniones y nivel de satisfacción de los clientes.',
  icono: 'star-outline',
  tarea: 'MB-81',
  ruta: '/admin-satisfaccion',
  tema: 'dorado'
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
      ruta: '/admin-whitelist',
      tema: 'dorado'
    },
    {
  titulo: 'Reportes',
  descripcion:
    'Genera un resumen consolidado de ventas, pedidos y satisfacción.',
  icono: 'document-text-outline',
  tarea: 'MB-82',
  ruta: '/admin-reportes-generales',
  tema: 'azul'
},

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
      gridOutline,
      logOutOutline,
      peopleOutline,
      personCircleOutline,
      pricetagOutline,
      receiptOutline,
      settingsOutline,
      shieldCheckmarkOutline,
      sparklesOutline,
      statsChartOutline,
      storefrontOutline,
      starOutline,
      timeOutline,
     documentTextOutline,
    });
  }

  ngOnInit(): void {

    this.verificarAdministrador();

    this.actualizarFechaHora();

    this.intervaloReloj =
      setInterval(
        () => {
          this.actualizarFechaHora();
        },
        60000
      );
  }

  ionViewWillEnter(): void {

    this.verificarAdministrador();

    this.actualizarFechaHora();
  }

  ngOnDestroy(): void {

    if (this.intervaloReloj) {

      clearInterval(
        this.intervaloReloj
      );

      this.intervaloReloj = null;
    }
  }

  private verificarAdministrador(): void {

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

    if (
      Number(
        this.usuario.idRol
      ) !== 1
    ) {

      this.router.navigate(
        ['/home'],
        {
          replaceUrl: true
        }
      );

      return;
    }
  }

  private actualizarFechaHora(): void {

    const ahora =
      new Date();

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
    modulo: ModuloAdmin
  ): void {

    if (!modulo.ruta) {
      return;
    }

    this.router.navigate([
      modulo.ruta
    ]);
  }

  cerrarSesion(): void {

    this.authService
      .cerrarSesion();

    this.router.navigate(
      ['/login'],
      {
        replaceUrl: true
      }
    );
  }
}