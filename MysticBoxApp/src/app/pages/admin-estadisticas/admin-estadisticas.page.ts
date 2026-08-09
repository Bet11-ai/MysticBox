import {
  CommonModule
} from '@angular/common';

import {
  Component,
  OnInit
} from '@angular/core';

import {
  FormsModule
} from '@angular/forms';

import {
  Router
} from '@angular/router';

import {
  IonicModule
} from '@ionic/angular';

import {
  addIcons
} from 'ionicons';

import {
  alertCircleOutline,
  arrowBackOutline,
  barChartOutline,
  calendarOutline,
  cashOutline,
  checkmarkCircleOutline,
  closeCircleOutline,
  peopleOutline,
  receiptOutline,
  refreshOutline,
  statsChartOutline,
  ticketOutline,
  timeOutline,
  trendingUpOutline,
  trophyOutline
} from 'ionicons/icons';

import {
  AuthService,
  UsuarioSesion
} from '../../services/auth.service';

import {
  Estadisticas,
  EstadisticasService,
  PedidoEstadoEstadistica,
  VentaMensual
} from '../../services/estadisticas.service';

@Component({
  selector: 'app-admin-estadisticas',
  templateUrl:
    './admin-estadisticas.page.html',
  styleUrls: [
    './admin-estadisticas.page.scss'
  ],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ]
})
export class AdminEstadisticasPage
  implements OnInit {

  usuario:
    UsuarioSesion | null = null;

  estadisticas:
    Estadisticas | null = null;

  anioSeleccionado =
    new Date().getFullYear();

  aniosDisponibles:
    number[] = [];

  cargando = true;

  mensajeError = '';

  constructor(
    private estadisticasService:
      EstadisticasService,

    private authService:
      AuthService,

    private router:
      Router
  ) {
    addIcons({
      alertCircleOutline,
      arrowBackOutline,
      barChartOutline,
      calendarOutline,
      cashOutline,
      checkmarkCircleOutline,
      closeCircleOutline,
      peopleOutline,
      receiptOutline,
      refreshOutline,
      statsChartOutline,
      ticketOutline,
      timeOutline,
      trendingUpOutline,
      trophyOutline
    });
  }

  ngOnInit(): void {
    this.prepararAnios();

    this.inicializar();
  }

  ionViewWillEnter(): void {
    this.inicializar();
  }

  private inicializar(): void {

    this.usuario =
      this.authService
        .obtenerUsuario();

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

    this.cargarEstadisticas();
  }

  private prepararAnios(): void {

    const anioActual =
      new Date().getFullYear();

    this.aniosDisponibles = [];

    for (
      let anio =
        anioActual;
      anio >=
        anioActual - 4;
      anio--
    ) {
      this.aniosDisponibles
        .push(anio);
    }
  }

  cargarEstadisticas(): void {

    this.cargando = true;

    this.mensajeError = '';

    this.estadisticasService
      .obtenerEstadisticas(
        this.anioSeleccionado
      )
      .subscribe({

        next: respuesta => {

          this.estadisticas =
            respuesta;

          this.cargando =
            false;
        },

        error: error => {

          console.error(
            'Error al consultar estadísticas:',
            error
          );

          this.estadisticas =
            null;

          this.cargando =
            false;

          this.mensajeError =
            'No fue posible consultar las estadísticas.';
        }

      });
  }

  cambiarAnio(): void {
    this.cargarEstadisticas();
  }

  volverAlPanel(): void {
    this.router.navigate([
      '/admin'
    ]);
  }

  irDashboard(): void {
    this.router.navigate([
      '/admin-dashboard'
    ]);
  }

  formatearMoneda(
    valor:
      number |
      null |
      undefined
  ): string {

    return new Intl
      .NumberFormat(
        'es-CR',
        {
          style: 'currency',
          currency: 'CRC',
          maximumFractionDigits: 0
        }
      )
      .format(
        Number(valor ?? 0)
      );
  }

  obtenerClaseEstado(
    estado: string
  ): string {

    const normalizado =
      this.normalizarTexto(
        estado
      );

    switch (normalizado) {

      case 'pendiente':
        return 'status-pending';

      case 'preparando':
        return 'status-preparing';

      case 'empacando':
        return 'status-packing';

      case 'en camino':
        return 'status-road';

      case 'entregado':
        return 'status-delivered';

      case 'cancelado':
        return 'status-cancelled';

      default:
        return 'status-default';
    }
  }

  obtenerBarraVenta(
    venta: VentaMensual
  ): number {

    if (
      !this.estadisticas ||
      this.estadisticas
        .mayorVentaMensual <= 0
    ) {
      return 0;
    }

    return Math.min(
      100,
      Math.max(
        0,
        (
          venta.ventas /
          this.estadisticas
            .mayorVentaMensual
        ) * 100
      )
    );
  }

  obtenerBarraEstado(
    estado:
      PedidoEstadoEstadistica
  ): number {

    return Math.min(
      100,
      Math.max(
        0,
        Number(
          estado.porcentaje ??
          0
        )
      )
    );
  }

  trackMes(
    index: number,
    venta: VentaMensual
  ): number {
    return venta.numeroMes;
  }

  trackEstado(
    index: number,
    estado:
      PedidoEstadoEstadistica
  ): string {
    return estado.estado;
  }

  private normalizarTexto(
    texto: string
  ): string {

    return texto
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(
        /[\u0300-\u036f]/g,
        ''
      );
  }
}