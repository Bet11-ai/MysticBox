import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';

import { IonicModule } from '@ionic/angular';

import { addIcons } from 'ionicons';

import {
  arrowBackOutline,
  bagHandleOutline,
  calendarOutline,
  cardOutline,
  checkmarkCircleOutline,
  chevronForwardOutline,
  documentTextOutline,
  receiptOutline,
  starOutline,
  timeOutline,
  walletOutline
} from 'ionicons/icons';

import {
  FacturaService
} from '../../services/factura.service';

import {
  PedidoService
} from '../../services/pedido.service';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.page.html',
  styleUrls: ['./pedidos.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule
  ]
})
export class PedidosPage implements OnInit {

  pedidos: any[] = [];

  cargando = true;

  mensajeError = '';

  constructor(
    private pedidoService: PedidoService,
    private facturaService: FacturaService,
    private router: Router
  ) {

    addIcons({
      arrowBackOutline,
      bagHandleOutline,
      calendarOutline,
      cardOutline,
      checkmarkCircleOutline,
      chevronForwardOutline,
      documentTextOutline,
      receiptOutline,
      starOutline,
      timeOutline,
      walletOutline
    });
  }

  ngOnInit(): void {
    this.cargarPedidos();
  }

  ionViewWillEnter(): void {
    this.cargarPedidos();
  }

  cargarPedidos(): void {

    this.cargando = true;
    this.mensajeError = '';

    const idUsuario =
      this.obtenerIdUsuario();

    if (!idUsuario) {

      this.cargando = false;

      this.mensajeError =
        'Debes iniciar sesión para consultar tus pedidos.';

      return;
    }

    forkJoin({
      pedidos:
        this.pedidoService
          .obtenerPedidos(),

      facturas:
        this.facturaService
          .obtenerFacturas()
    })
    .subscribe({

      next: ({
        pedidos,
        facturas
      }) => {

        const pedidosDelUsuario =
          (pedidos ?? [])
            .filter(
              pedido =>
                Number(
                  pedido.idUsuario
                ) ===
                Number(
                  idUsuario
                )
            )
            .sort(
              (
                pedidoA,
                pedidoB
              ) =>
                Number(
                  pedidoB.idPedido
                ) -
                Number(
                  pedidoA.idPedido
                )
            );

        this.pedidos =
          pedidosDelUsuario
            .map(
              pedido => {

                const factura =
                  (facturas ?? [])
                    .find(
                      facturaEncontrada =>
                        Number(
                          facturaEncontrada.idPedido
                        ) ===
                        Number(
                          pedido.idPedido
                        )
                    );

                return {
                  ...pedido,

                  numeroPedido:
                    pedido.numeroPedido ??
                    `MB-${String(
                      pedido.idPedido
                    ).padStart(6, '0')}`,

                  factura:
                    factura ?? null
                };
              }
            );

        this.cargando = false;
      },

      error: error => {

        console.error(
          'Error al cargar los pedidos:',
          error
        );

        this.cargando = false;

        this.mensajeError =
          'No fue posible cargar el historial de pedidos.';
      }
    });
  }

  verFactura(
    pedido: any
  ): void {

    const idFactura =
      Number(
        pedido.factura?.idFactura
      );

    if (!idFactura) {

      this.mensajeError =
        'Este pedido todavía no tiene una factura disponible.';

      return;
    }

    this.router.navigate(
      ['/factura'],
      {
        queryParams: {
          idFactura
        }
      }
    );
  }

  irACalificar(
    pedido: any
  ): void {

    /*
     * Guardamos específicamente
     * el pedido seleccionado.
     *
     * Así Calificaciones ya no depende
     * únicamente del último pedido
     * generado durante la compra.
     */
    const pedidoCalificar = {
      idPedido:
        Number(
          pedido.idPedido
        ),

      numeroPedido:
        pedido.numeroPedido,

      estadoPedido:
        pedido.estadoPedido,

      total:
        Number(
          pedido.total ?? 0
        ),

      fechaPedido:
        pedido.fechaPedido ?? '',

      fechaEstimadaEntrega:
        pedido.fechaEstimadaEntrega ?? ''
    };

    sessionStorage.setItem(
      'ultimoPedido',
      JSON.stringify(
        pedidoCalificar
      )
    );

    this.router.navigate([
      '/calificaciones'
    ]);
  }

  puedeCalificar(
    pedido: any
  ): boolean {

    return (
      this.normalizarEstado(
        pedido.estadoPedido
      ) === 'entregado'
    );
  }

  obtenerClaseEstado(
    estado:
      string |
      null |
      undefined
  ): string {

    switch (
      this.normalizarEstado(
        estado
      )
    ) {

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

  obtenerIconoEstado(
    estado:
      string |
      null |
      undefined
  ): string {

    switch (
      this.normalizarEstado(
        estado
      )
    ) {

      case 'entregado':
        return 'checkmark-circle-outline';

      case 'pendiente':
        return 'time-outline';

      default:
        return 'bag-handle-outline';
    }
  }

  volverAlInicio(): void {

    this.router.navigate([
      '/home'
    ]);
  }

  private normalizarEstado(
    estado:
      string |
      null |
      undefined
  ): string {

    return (
      estado ??
      ''
    )
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(
        /[\u0300-\u036f]/g,
        ''
      );
  }

  private obtenerIdUsuario():
    number | null {

    const idGuardado =
      Number(
        localStorage.getItem(
          'idUsuario'
        )
      );

    if (idGuardado) {
      return idGuardado;
    }

    const usuarioGuardado =
      localStorage.getItem(
        'usuario'
      );

    if (!usuarioGuardado) {
      return null;
    }

    try {

      const usuario =
        JSON.parse(
          usuarioGuardado
        );

      const idUsuario =
        Number(
          usuario.idUsuario ??
          usuario.IdUsuario
        );

      return idUsuario || null;

    } catch (error) {

      console.error(
        'No fue posible leer el usuario guardado:',
        error
      );

      return null;
    }
  }

  trackPedido(
    index: number,
    pedido: any
  ): number {

    return Number(
      pedido.idPedido
    );
  }
}