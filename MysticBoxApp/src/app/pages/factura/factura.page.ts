import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';

import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';

import {
  FacturaCreada,
  FacturaService
} from '../../services/factura.service';

import {
  DetallePedidoRespuesta,
  DetallePedidoService
} from '../../services/detallePedido.service';

import { Mysticbox } from 'src/app/services/mysticbox';

@Component({
  selector: 'app-factura',
  templateUrl: './factura.page.html',
  styleUrls: ['./factura.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonBackButton,
    IonContent
  ]
})
export class FacturaPage implements OnInit {

  factura: FacturaCreada | null = null;

  productos: any[] = [];

  cargando = true;

  mensajeError = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private facturaService: FacturaService,
    private detallePedidoService: DetallePedidoService,
    private mysticboxService: Mysticbox
  ) {}

  ngOnInit(): void {

    const idFactura = Number(
      this.route.snapshot.queryParamMap.get('idFactura')
    );

    /*
     * Cuando la dirección contiene el id de la factura,
     * se consulta esa factura exacta en el backend.
     */
    if (idFactura) {

      this.facturaService
        .obtenerFacturaPorId(idFactura)
        .subscribe({

          next: (facturaEncontrada: FacturaCreada) => {

            this.factura = facturaEncontrada;

            this.cargarProductosDelPedido(
              Number(facturaEncontrada.idPedido)
            );
          },

          error: (error: any) => {

            console.error(
              'Error al obtener la factura:',
              error
            );

            this.cargando = false;

            this.mensajeError =
              'No fue posible recuperar la factura.';
          }
        });

      return;
    }

    /*
     * Solo utiliza la copia temporal cuando la dirección
     * no contiene un idFactura.
     */
    const datosGuardados =
      sessionStorage.getItem('facturaGenerada');

    if (datosGuardados) {

      try {

        const datosFactura =
          JSON.parse(datosGuardados);

        this.factura =
          datosFactura.factura ?? null;

        this.productos =
          datosFactura.productos ?? [];

        if (this.productos.length > 0) {

          this.cargando = false;

          return;
        }

        if (this.factura?.idPedido) {

          this.cargarProductosDelPedido(
            Number(this.factura.idPedido)
          );

          return;
        }

      } catch (error) {

        console.error(
          'Error al leer la factura temporal:',
          error
        );
      }
    }

    this.cargando = false;

    this.mensajeError =
      'No se indicó cuál factura debe mostrarse.';
  }

  private cargarProductosDelPedido(
    idPedido: number
  ): void {

    forkJoin({

      detalles:
        this.detallePedidoService
          .obtenerDetallesPedido(),

      cajas:
        this.mysticboxService
          .obtenerCajas()

    }).subscribe({

      next: (respuesta: {
        detalles: DetallePedidoRespuesta[];
        cajas: any[];
      }) => {

        const detallesDelPedido =
          respuesta.detalles.filter(
            detalle =>
              Number(detalle.idPedido) ===
              Number(idPedido)
          );

        this.productos =
          detallesDelPedido.map(detalle => {

            const caja =
              respuesta.cajas.find(
                cajaEncontrada =>
                  Number(cajaEncontrada.idCaja) ===
                  Number(detalle.idCaja)
              );

            const nombreCaja =
              caja?.nombreCaja ?? 'MysticBox';

            const cantidad =
              Number(detalle.cantidad) || 1;

            const precioUnitario =
              Number(detalle.precioUnitario) ||
              Number(caja?.precio) ||
              0;

            const subtotal =
              Number(detalle.subtotal) ||
              precioUnitario * cantidad;

            return {
              idCaja: detalle.idCaja,

              nombre: nombreCaja,

              nombreCaja: nombreCaja,

              descripcion:
                caja?.descripcion ?? '',

              imagen:
                caja?.imagen ?? '',

              cantidad,

              precio:
                precioUnitario,

              precioUnitario,

              subtotal
            };
          });

        this.cargando = false;

        if (this.productos.length === 0) {

          this.mensajeError =
            'La factura existe, pero no se encontraron productos asociados al pedido.';
        }
      },

      error: (error: any) => {

        console.error(
          'Error al cargar los productos de la factura:',
          error
        );

        this.cargando = false;

        this.mensajeError =
          'La factura fue encontrada, pero no fue posible cargar sus productos.';
      }
    });
  }

  irAPedidos(): void {
    this.router.navigate(['/pedidos']);
  }

  volverAlInicio(): void {
    this.router.navigate(['/home']);
  }
}