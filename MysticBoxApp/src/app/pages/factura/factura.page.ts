import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit
} from '@angular/core';

import {
  ActivatedRoute,
  Router
} from '@angular/router';

import { forkJoin } from 'rxjs';

import { IonicModule } from '@ionic/angular';

import { addIcons } from 'ionicons';

import {
  arrowBackOutline,
  bagHandleOutline,
  calendarOutline,
  carOutline,
  checkmarkCircleOutline,
  locationOutline,
  receiptOutline,
  storefrontOutline
} from 'ionicons/icons';

import {
  FacturaCreada,
  FacturaService
} from '../../services/factura.service';

import {
  DetallePedidoRespuesta,
  DetallePedidoService
} from '../../services/detallePedido.service';

import {
  Pedido,
  PedidoService
} from '../../services/pedido.service';

import { Mysticbox } from 'src/app/services/mysticbox';


@Component({
  selector: 'app-factura',
  templateUrl: './factura.page.html',
  styleUrls: ['./factura.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule
  ]
})
export class FacturaPage
  implements OnInit {

  factura:
    FacturaCreada | null = null;

  pedido:
    Pedido | null = null;

  productos:
    any[] = [];

  cargando = true;

  mensajeError = '';

  tipoEntregaTemporal:
    string | null = null;

  provinciaEntregaTemporal:
    string | null = null;

  direccionEntregaTemporal:
    string | null = null;

  constructor(
    private route:
      ActivatedRoute,

    private router:
      Router,

    private facturaService:
      FacturaService,

    private pedidoService:
      PedidoService,

    private detallePedidoService:
      DetallePedidoService,

    private mysticboxService:
      Mysticbox
  ) {

    addIcons({
      arrowBackOutline,
      bagHandleOutline,
      calendarOutline,
      carOutline,
      checkmarkCircleOutline,
      locationOutline,
      receiptOutline,
      storefrontOutline
    });
  }


  ngOnInit(): void {

    this.cargarFactura();
  }


  private cargarFactura(): void {

    this.cargando = true;

    this.mensajeError = '';

    const idFactura =
      Number(
        this.route
          .snapshot
          .queryParamMap
          .get(
            'idFactura'
          )
      );

    if (idFactura) {

      this.facturaService
        .obtenerFacturaPorId(
          idFactura
        )
        .subscribe({

          next: facturaEncontrada => {

            this.factura =
              facturaEncontrada;

            this.cargarInformacionPedido(
              Number(
                facturaEncontrada.idPedido
              )
            );
          },

          error: error => {

            this.cargando = false;

            this.mensajeError =
              'No fue posible recuperar la factura.';

            console.error(
              'Error obteniendo factura:',
              error
            );
          }

        });

      return;
    }

    this.cargarFacturaTemporal();
  }


  private cargarFacturaTemporal():
    void {

    const datosGuardados =
      sessionStorage.getItem(
        'facturaGenerada'
      );

    if (!datosGuardados) {

      this.cargando = false;

      this.mensajeError =
        'No se indicó cuál factura debe mostrarse.';

      return;
    }

    try {

      const datos =
        JSON.parse(
          datosGuardados
        );

      this.factura =
        datos.factura ??
        null;

      this.productos =
        datos.productos ??
        [];

      const entrega =
        datos.entrega ??
        null;

      this.tipoEntregaTemporal =
        entrega?.tipoEntrega ??
        null;

      this.provinciaEntregaTemporal =
        entrega?.provinciaEntrega ??
        null;

      this.direccionEntregaTemporal =
        entrega?.direccionEntrega ??
        null;

      if (
        datos.pedido
      ) {

        this.pedido =
          datos.pedido;
      }

      if (
        this.factura?.idPedido
      ) {

        this.cargarInformacionPedido(
          Number(
            this.factura.idPedido
          )
        );

        return;
      }

      this.cargando = false;

    } catch (error) {

      this.cargando = false;

      this.mensajeError =
        'No fue posible cargar la información de la factura.';

      console.error(
        'Error leyendo factura temporal:',
        error
      );
    }
  }


  private cargarInformacionPedido(
    idPedido: number
  ): void {

    forkJoin({

      pedido:
        this.pedidoService
          .obtenerPedidoPorId(
            idPedido
          ),

      detalles:
        this.detallePedidoService
          .obtenerDetallesPedido(),

      cajas:
        this.mysticboxService
          .obtenerCajas()

    })
    .subscribe({

      next: respuesta => {

        this.pedido =
          respuesta.pedido;

        const detallesDelPedido =
          (
            respuesta.detalles ??
            []
          )
          .filter(
            detalle =>
              Number(
                detalle.idPedido
              ) ===
              Number(
                idPedido
              )
          );

        this.productos =
          detallesDelPedido
            .map(
              detalle => {

                const caja =
                  (
                    respuesta.cajas ??
                    []
                  )
                  .find(
                    cajaEncontrada =>
                      Number(
                        cajaEncontrada.idCaja
                      ) ===
                      Number(
                        detalle.idCaja
                      )
                  );

                const cantidad =
                  Number(
                    detalle.cantidad
                  )
                  ||
                  1;

                const precioUnitario =
                  Number(
                    detalle.precioUnitario
                  )
                  ||
                  Number(
                    caja?.precio
                  )
                  ||
                  0;

                const subtotal =
                  Number(
                    detalle.subtotal
                  )
                  ||
                  (
                    precioUnitario *
                    cantidad
                  );

                return {

                  idCaja:
                    detalle.idCaja,

                  nombre:
                    caja?.nombreCaja ??
                    'Mystic Box',

                  descripcion:
                    caja?.descripcion ??
                    '',

                  imagen:
                    caja?.imagen ??
                    '',

                  cantidad,

                  precio:
                    precioUnitario,

                  precioUnitario,

                  subtotal
                };
              }
            );

        this.cargando = false;

        if (
          this.productos.length === 0
        ) {

          this.mensajeError =
            'La factura fue encontrada, pero no se encontraron productos asociados.';
        }
      },

      error: error => {

        console.error(
          'Error cargando información de la factura:',
          error
        );

        /*
         * Si venimos directamente de la compra y
         * ya existen los productos temporales,
         * podemos mostrar la factura aunque falle
         * una consulta complementaria.
         */
        if (
          this.productos.length > 0
        ) {

          this.cargando = false;

          return;
        }

        this.cargando = false;

        this.mensajeError =
          'No fue posible cargar todos los datos de la factura.';
      }

    });
  }


  obtenerNumeroPedido(): string {

    const idPedido =
      Number(
        this.factura?.idPedido ??
        this.pedido?.idPedido ??
        0
      );

    return `MB-${idPedido
      .toString()
      .padStart(
        6,
        '0'
      )}`;
  }


  obtenerTipoEntrega(): string {

    const tipo =
      (
        this.pedido?.tipoEntrega ??
        this.tipoEntregaTemporal ??
        ''
      )
      .trim()
      .toLowerCase();

    if (
      tipo === 'envio'
    ) {

      return 'Envío a domicilio';
    }

    if (
      tipo === 'retiro'
    ) {

      return 'Retiro en tienda';
    }

    return 'No especificado';
  }


  esEnvio(): boolean {

    const tipo =
      (
        this.pedido?.tipoEntrega ??
        this.tipoEntregaTemporal ??
        ''
      )
      .trim()
      .toLowerCase();

    return tipo ===
      'envio';
  }


  obtenerProvincia(): string {

    return (
      this.pedido
        ?.provinciaEntrega
      ??
      this.provinciaEntregaTemporal
      ??
      ''
    );
  }


  obtenerDireccion(): string {

    return (
      this.pedido
        ?.direccionEntrega
      ??
      this.direccionEntregaTemporal
      ??
      ''
    );
  }


  obtenerCostoEnvio(): number {

    return Number(
      this.factura?.costoEnvio
      ??
      this.pedido?.costoEnvio
      ??
      0
    );
  }


  obtenerIconoEntrega(): string {

    return this.esEnvio()
      ?
      'car-outline'
      :
      'storefront-outline';
  }


  obtenerImagen(
    imagen:
      string |
      null |
      undefined
  ): string {

    if (!imagen) {

      return '';
    }

    const ruta =
      imagen.trim();

    if (
      ruta.startsWith(
        'http'
      )
      ||
      ruta.startsWith(
        'data:'
      )
    ) {

      return ruta;
    }

    if (
      ruta.startsWith(
        'assets/'
      )
    ) {

      return ruta;
    }

    return `assets/img/${ruta}`;
  }


  irAPedidos(): void {

    this.router.navigate([
      '/pedidos'
    ]);
  }


  volverAlInicio(): void {

    this.router.navigate([
      '/home'
    ]);
  }
}