import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';

import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';

import { FacturaService } from '../../services/factura.service';
import { PedidoService } from '../../services/pedido.service';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.page.html',
  styleUrls: ['./pedidos.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar
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
  ) {}

  ngOnInit(): void {
    this.cargarPedidos();
  }

  cargarPedidos(): void {

    const idUsuario = this.obtenerIdUsuario();

    if (!idUsuario) {

      this.cargando = false;

      this.mensajeError =
        'Debes iniciar sesión para consultar tus pedidos.';

      return;
    }

    forkJoin({
      pedidos: this.pedidoService.obtenerPedidos(),
      facturas: this.facturaService.obtenerFacturas()
    }).subscribe({

      next: ({ pedidos, facturas }) => {

        const pedidosDelUsuario =
          pedidos
            .filter(
              pedido =>
                Number(pedido.idUsuario) ===
                Number(idUsuario)
            )
            .sort(
              (pedidoA, pedidoB) =>
                Number(pedidoB.idPedido) -
                Number(pedidoA.idPedido)
            );

        this.pedidos =
          pedidosDelUsuario.map(pedido => {

            const factura =
              facturas.find(
                facturaEncontrada =>
                  Number(facturaEncontrada.idPedido) ===
                  Number(pedido.idPedido)
              );

            return {
              ...pedido,

              numeroPedido:
                pedido.numeroPedido ??
                `MB-${String(pedido.idPedido).padStart(6, '0')}`,

              factura: factura ?? null
            };
          });

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

  verFactura(pedido: any): void {

    const idFactura =
      Number(pedido.factura?.idFactura);

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

  volverAlInicio(): void {
    this.router.navigate(['/home']);
  }

  private obtenerIdUsuario(): number | null {

    const idGuardado =
      Number(localStorage.getItem('idUsuario'));

    if (idGuardado) {
      return idGuardado;
    }

    const usuarioGuardado =
      localStorage.getItem('usuario');

    if (!usuarioGuardado) {
      return null;
    }

    try {

      const usuario =
        JSON.parse(usuarioGuardado);

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
}
