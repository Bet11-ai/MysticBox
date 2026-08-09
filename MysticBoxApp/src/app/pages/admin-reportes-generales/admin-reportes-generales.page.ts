import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit
} from '@angular/core';

import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { IonicModule } from '@ionic/angular';

import { addIcons } from 'ionicons';

import {
  alertCircleOutline,
  arrowBackOutline,
  calendarOutline,
  cashOutline,
  documentTextOutline,
  happyOutline,
  peopleOutline,
  printOutline,
  receiptOutline,
  refreshOutline,
  starOutline,
  statsChartOutline,
  ticketOutline,
  trendingUpOutline
} from 'ionicons/icons';

import {
  AuthService,
  UsuarioSesion
} from '../../services/auth.service';

import {
  Estadisticas,
  EstadisticasService
} from '../../services/estadisticas.service';

import {
  SatisfaccionService,
  Calificacion
} from '../../services/satisfaccion.service';

import {
  PedidoService
} from '../../services/pedido.service';

interface PedidoReporte {
  idPedido: number;
  numeroPedido: string;
  fechaPedido: string | null;
  estadoPedido: string;
  subtotal: number;
  descuento: number;
  total: number;
  idUsuario: number;
}

@Component({
  selector: 'app-admin-reportes-generales',
  templateUrl:
    './admin-reportes-generales.page.html',
  styleUrls: [
    './admin-reportes-generales.page.scss'
  ],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ]
})
export class AdminReportesGeneralesPage
  implements OnInit {

  usuario:
    UsuarioSesion | null = null;

  estadisticas:
    Estadisticas | null = null;

  calificaciones:
    Calificacion[] = [];

  pedidos:
    PedidoReporte[] = [];

  pedidosFiltrados:
    PedidoReporte[] = [];

  anioSeleccionado =
    new Date().getFullYear();

  aniosDisponibles:
    number[] = [];

  promedioSatisfaccion = 0;

  cargando = true;

  mensajeError = '';

  constructor(
    private authService:
      AuthService,

    private estadisticasService:
      EstadisticasService,

    private satisfaccionService:
      SatisfaccionService,

    private pedidoService:
      PedidoService,

    private router:
      Router
  ) {

    addIcons({
      alertCircleOutline,
      arrowBackOutline,
      calendarOutline,
      cashOutline,
      documentTextOutline,
      happyOutline,
      peopleOutline,
      printOutline,
      receiptOutline,
      refreshOutline,
      starOutline,
      statsChartOutline,
      ticketOutline,
      trendingUpOutline
    });
  }

  ngOnInit(): void {

    this.prepararAnios();

    this.verificarAdministrador();
  }

  ionViewWillEnter(): void {

    if (
      this.verificarAdministrador()
    ) {
      this.cargarReporte();
    }
  }

  private verificarAdministrador():
    boolean {

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

      return false;
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

      return false;
    }

    return true;
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

      this.aniosDisponibles
        .push(anio);
    }
  }

  cargarReporte(): void {

    this.cargando = true;

    this.mensajeError = '';

    forkJoin({

      estadisticas:
        this.estadisticasService
          .obtenerEstadisticas(
            this.anioSeleccionado
          ),

      calificaciones:
        this.satisfaccionService
          .obtenerCalificaciones(),

      pedidos:
        this.pedidoService
          .obtenerPedidos()

    })
    .subscribe({

      next: ({
        estadisticas,
        calificaciones,
        pedidos
      }) => {

        this.estadisticas =
          estadisticas;

        this.calificaciones =
          calificaciones ?? [];

        this.pedidos =
          (pedidos ?? [])
            .map(
              pedido => ({
                idPedido:
                  Number(
                    pedido.idPedido
                  ),

                numeroPedido:
                  pedido.numeroPedido ??
                  `MB-${String(
                    pedido.idPedido
                  ).padStart(6, '0')}`,

                fechaPedido:
                  pedido.fechaPedido ??
                  null,

                estadoPedido:
                  pedido.estadoPedido ??
                  'Pendiente',

                subtotal:
                  Number(
                    pedido.subtotal ?? 0
                  ),

                descuento:
                  Number(
                    pedido.descuento ?? 0
                  ),

                total:
                  Number(
                    pedido.total ?? 0
                  ),

                idUsuario:
                  Number(
                    pedido.idUsuario ?? 0
                  )
              })
            );

        this.filtrarPedidos();

        this.calcularSatisfaccion();

        this.cargando = false;
      },

      error: error => {

        console.error(
          'Error al generar reporte:',
          error
        );

        this.cargando = false;

        this.mensajeError =
          'No fue posible generar el reporte administrativo.';
      }

    });
  }

  cambiarAnio(): void {

    this.cargarReporte();
  }

  private filtrarPedidos(): void {

    this.pedidosFiltrados =
      this.pedidos
        .filter(
          pedido => {

            if (!pedido.fechaPedido) {
              return false;
            }

            const fecha =
              new Date(
                pedido.fechaPedido
              );

            if (
              Number.isNaN(
                fecha.getTime()
              )
            ) {
              return false;
            }

            return (
              fecha.getFullYear() ===
              this.anioSeleccionado
            );
          }
        )
        .sort(
          (a, b) =>
            b.idPedido -
            a.idPedido
        );
  }

  private calcularSatisfaccion():
    void {

    if (
      this.calificaciones.length === 0
    ) {

      this.promedioSatisfaccion = 0;

      return;
    }

    const suma =
      this.calificaciones
        .reduce(
          (
            total,
            item
          ) =>
            total +
            Number(
              item.estrellas ?? 0
            ),
          0
        );

    this.promedioSatisfaccion =
      Number(
        (
          suma /
          this.calificaciones.length
        ).toFixed(1)
      );
  }

  formatearMoneda(
    valor:
      number |
      null |
      undefined
  ): string {

    return new Intl.NumberFormat(
      'es-CR',
      {
        style: 'currency',
        currency: 'CRC',
        maximumFractionDigits: 0
      }
    ).format(
      Number(
        valor ?? 0
      )
    );
  }

  formatearFecha(
    fecha:
      string |
      null |
      undefined
  ): string {

    if (!fecha) {
      return 'Sin fecha';
    }

    const valor =
      new Date(fecha);

    if (
      Number.isNaN(
        valor.getTime()
      )
    ) {
      return 'Sin fecha';
    }

    return new Intl.DateTimeFormat(
      'es-CR',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }
    ).format(valor);
  }

  imprimirReporte(): void {

    window.print();
  }

  volverAlPanel(): void {

    this.router.navigate([
      '/admin'
    ]);
  }

  trackPedido(
    index: number,
    pedido: PedidoReporte
  ): number {

    return pedido.idPedido;
  }
}