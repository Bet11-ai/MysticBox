import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit
} from '@angular/core';

import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { addIcons } from 'ionicons';

import {
  alertCircleOutline,
  arrowBackOutline,
  barChartOutline,
  calendarOutline,
  cashOutline,
  peopleOutline,
  pieChartOutline,
  receiptOutline,
  refreshOutline,
  statsChartOutline,
  trendingUpOutline,
  trophyOutline
} from 'ionicons/icons';

import {
  AuthService,
  UsuarioSesion
} from '../../services/auth.service';

import {
  ClienteEstadistica,
  Estadisticas,
  EstadisticasService,
  PedidoEstadoEstadistica,
  VentaMensual
} from '../../services/estadisticas.service';

@Component({
  selector: 'app-admin-reportes',
  templateUrl: './admin-reportes.page.html',
  styleUrls: ['./admin-reportes.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ]
})
export class AdminReportesPage implements OnInit {

  usuario: UsuarioSesion | null = null;

  estadisticas: Estadisticas | null = null;

  cargando = true;

  mensajeError = '';

  anioSeleccionado =
    new Date().getFullYear();

  aniosDisponibles: number[] = [];

  constructor(
    private estadisticasService: EstadisticasService,
    private authService: AuthService,
    private router: Router
  ) {

    addIcons({
      alertCircleOutline,
      arrowBackOutline,
      barChartOutline,
      calendarOutline,
      cashOutline,
      peopleOutline,
      pieChartOutline,
      receiptOutline,
      refreshOutline,
      statsChartOutline,
      trendingUpOutline,
      trophyOutline
    });
  }

  ngOnInit(): void {

    this.prepararAnios();

    this.verificarAdministrador();
  }

  ionViewWillEnter(): void {

    this.verificarAdministrador();
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

    this.cargarReporte();
  }

  private prepararAnios(): void {

    const actual =
      new Date().getFullYear();

    this.aniosDisponibles = [];

    for (
      let anio = actual;
      anio >= actual - 4;
      anio--
    ) {

      this.aniosDisponibles.push(
        anio
      );
    }
  }

  cargarReporte(): void {

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
            'Error al cargar reportes:',
            error
          );

          this.estadisticas = null;

          this.cargando = false;

          this.mensajeError =
            'No fue posible cargar la información de los reportes.';
        }

      });
  }

  cambiarAnio(): void {

    this.cargarReporte();
  }

  volverAlPanel(): void {

    this.router.navigate([
      '/admin'
    ]);
  }

  irAEstadisticas(): void {

    this.router.navigate([
      '/admin-estadisticas'
    ]);
  }

  formatearMoneda(
    valor: number | null | undefined
  ): string {

    return new Intl.NumberFormat(
      'es-CR',
      {
        style: 'currency',
        currency: 'CRC',
        maximumFractionDigits: 0
      }
    ).format(
      Number(valor ?? 0)
    );
  }

  obtenerAlturaVenta(
    venta: VentaMensual
  ): number {

    if (
      !this.estadisticas ||
      this.estadisticas
        .mayorVentaMensual <= 0
    ) {

      return 3;
    }

    const porcentaje =
      (
        venta.ventas /
        this.estadisticas
          .mayorVentaMensual
      ) * 100;

    /*
     * Dejamos un mínimo visual
     * para que los meses sin ventas
     * sigan mostrando la línea base.
     */
    return Math.max(
      3,
      Math.min(
        100,
        porcentaje
      )
    );
  }

  obtenerPorcentajeEstado(
    estado: PedidoEstadoEstadistica
  ): number {

    return Math.max(
      0,
      Math.min(
        100,
        Number(
          estado.porcentaje ?? 0
        )
      )
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
        return 'estado-pendiente';

      case 'preparando':
        return 'estado-preparando';

      case 'empacando':
        return 'estado-empacando';

      case 'en camino':
        return 'estado-camino';

      case 'entregado':
        return 'estado-entregado';

      case 'cancelado':
        return 'estado-cancelado';

      default:
        return 'estado-default';
    }
  }

  obtenerColorEstado(
    estado: string
  ): string {

    const normalizado =
      this.normalizarTexto(
        estado
      );

    switch (normalizado) {

      case 'pendiente':
        return '#f4c542';

      case 'preparando':
        return '#a970ff';

      case 'empacando':
        return '#4b9fff';

      case 'en camino':
        return '#2dcad0';

      case 'entregado':
        return '#35cc82';

      case 'cancelado':
        return '#ff6470';

      default:
        return '#8e9cad';
    }
  }

  obtenerGraficoCircular(): string {

    if (
      !this.estadisticas ||
      this.estadisticas
        .pedidosPorEstado
        .length === 0 ||
      this.estadisticas.totalPedidos === 0
    ) {

      return 'conic-gradient(#273549 0deg 360deg)';
    }

    let acumulado = 0;

    const segmentos: string[] = [];

    this.estadisticas
      .pedidosPorEstado
      .forEach(
        estado => {

          const inicio =
            acumulado;

          const fin =
            acumulado +
            (
              Number(
                estado.porcentaje ?? 0
              ) * 3.6
            );

          const color =
            this.obtenerColorEstado(
              estado.estado
            );

          segmentos.push(
            `${color} ${inicio}deg ${fin}deg`
          );

          acumulado = fin;
        }
      );

    if (acumulado < 360) {

      segmentos.push(
        `#273549 ${acumulado}deg 360deg`
      );
    }

    return `conic-gradient(${segmentos.join(', ')})`;
  }

  obtenerMaximoCliente(): number {

    if (
      !this.estadisticas ||
      this.estadisticas
        .mejoresClientes
        .length === 0
    ) {

      return 0;
    }

    return Math.max(
      ...this.estadisticas
        .mejoresClientes
        .map(
          cliente =>
            cliente.totalComprado
        )
    );
  }

  obtenerBarraCliente(
    cliente: ClienteEstadistica
  ): number {

    const maximo =
      this.obtenerMaximoCliente();

    if (maximo <= 0) {
      return 0;
    }

    return (
      cliente.totalComprado /
      maximo
    ) * 100;
  }

  trackMes(
    index: number,
    venta: VentaMensual
  ): number {

    return venta.numeroMes;
  }

  trackEstado(
    index: number,
    estado: PedidoEstadoEstadistica
  ): string {

    return estado.estado;
  }

  trackCliente(
    index: number,
    cliente: ClienteEstadistica
  ): number {

    return cliente.idUsuario;
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