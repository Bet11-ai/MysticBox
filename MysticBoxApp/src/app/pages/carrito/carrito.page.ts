import {
  Component,
  OnInit
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import {
  Router,
  RouterLink
} from '@angular/router';

import { forkJoin } from 'rxjs';

import { Mysticbox } from 'src/app/services/mysticbox';

import {
  CarritoService
} from '../../services/carrito.service';

import {
  CrearPedidoRequest,
  PedidoService
} from '../../services/pedido.service';

import {
  DetallePedidoService
} from 'src/app/services/detallePedido.service';

import {
  CrearFacturaRequest,
  FacturaService
} from 'src/app/services/factura.service';

import {
  CuponService,
  ValidacionCupon
} from '../../services/cupon.service';

import { addIcons } from 'ionicons';

import {
  addOutline,
  arrowBackOutline,
  bagCheckOutline,
  cardOutline,
  cartOutline,
  checkmarkCircleOutline,
  closeCircleOutline,
  homeOutline,
  locationOutline,
  removeOutline,
  storefrontOutline,
  ticketOutline,
  trashOutline,
  carOutline,
  walletOutline
} from 'ionicons/icons';


type TipoEntrega =
  'retiro' |
  'envio' |
  '';


@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.page.html',
  styleUrls: ['./carrito.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterLink
  ]
})
export class CarritoPage
  implements OnInit {

  carritos: any[] = [];

  cargando = true;

  productosCarrito: any[] = [];

  carritoActivo:
    any = null;


  /* CUPÓN */

  codigoCupon = '';

  cuponAplicado:
    ValidacionCupon | null = null;

  mensajeCupon = '';

  tipoMensajeCupon:
    'exito' |
    'error' |
    '' = '';

  validandoCupon = false;


  /* PAGO */

  metodosPago = [
    {
      idMetodoPago: 1,
      nombre: 'Tarjeta'
    },
    {
      idMetodoPago: 2,
      nombre: 'SINPE Móvil'
    },
    {
      idMetodoPago: 3,
      nombre: 'Transferencia bancaria'
    }
  ];

  idMetodoPagoSeleccionado:
    number | null = null;


  /* ENTREGA */

  tipoEntrega:
    TipoEntrega = '';

  provinciaEntrega = '';

  direccionEntrega = '';

  provincias = [
    'San José',
    'Alajuela',
    'Cartago',
    'Heredia',
    'Guanacaste',
    'Puntarenas',
    'Limón'
  ];


  /* COMPRA */

  procesandoCompra = false;

  mensajeCompra = '';


  constructor(
    private carritoService:
      CarritoService,

    private cuponService:
      CuponService,

    private mysticboxService:
      Mysticbox,

    private pedidoService:
      PedidoService,

    private facturaService:
      FacturaService,

    private detallePedidoService:
      DetallePedidoService,

    private router:
      Router
  ) {

    addIcons({
      addOutline,
      arrowBackOutline,
      bagCheckOutline,
      cardOutline,
      cartOutline,
      checkmarkCircleOutline,
      closeCircleOutline,
      homeOutline,
      locationOutline,
      removeOutline,
      storefrontOutline,
      ticketOutline,
      trashOutline,
    carOutline,
      walletOutline
    });
  }


  ngOnInit(): void {

    this.obtenerCarritos();
  }


  ionViewWillEnter(): void {

    this.obtenerCarritos();
  }


  obtenerCarritos(): void {

    this.cargando = true;

    const idUsuario =
      this.obtenerIdUsuario();

    if (!idUsuario) {

      this.productosCarrito = [];

      this.carritoActivo = null;

      this.cargando = false;

      this.mensajeCompra =
        'Debes iniciar sesión para consultar tu carrito.';

      return;
    }

    this.carritoService
      .obtenerCarritos()
      .subscribe({

        next: carritos => {

          this.carritos =
            carritos ?? [];

          const carritoActivo =
            this.carritos.find(
              (carrito: any) =>
                Number(
                  carrito.idUsuario
                ) ===
                Number(
                  idUsuario
                )
                &&
                String(
                  carrito.estado ?? ''
                )
                  .trim()
                  .toLowerCase() ===
                'activo'
            );

          this.carritoActivo =
            carritoActivo ?? null;

          if (!carritoActivo) {

            this.productosCarrito = [];

            this.cargando = false;

            return;
          }

          this.cargarProductosCarrito(
            carritoActivo
          );
        },

        error: error => {

          console.error(
            'Error al obtener el carrito:',
            error
          );

          this.productosCarrito = [];

          this.carritoActivo = null;

          this.cargando = false;

          this.mensajeCompra =
            'No fue posible cargar tu carrito.';
        }

      });
  }


  private cargarProductosCarrito(
    carritoActivo: any
  ): void {

    forkJoin({

      detalles:
        this.carritoService
          .obtenerDetallesCarrito(),

      cajas:
        this.mysticboxService
          .obtenerCajas()

    })
    .subscribe({

      next: ({
        detalles,
        cajas
      }) => {
      
        const detallesDelCarrito =
          (detalles ?? [])
            .filter(
              (detalle: any) =>
                Number(
                  detalle.idCarrito
                ) ===
                Number(
                  carritoActivo.idCarrito
                )
            );

        this.productosCarrito =
          detallesDelCarrito
            .map(
              (detalle: any) => {

                const caja =
                  (cajas ?? [])
                    .find(
                      (item: any) =>
                        Number(
                          item.idCaja
                        ) ===
                        Number(
                          detalle.idCaja
                        )
                    );

                return {

                  idDetalleCarrito:
                    detalle.idDetalleCarrito,

                  idCarrito:
                    detalle.idCarrito,

                  idCaja:
                    detalle.idCaja,

                  idPersonalizacion:
                    detalle.idPersonalizacion,

                  nombre:
                    caja?.nombreCaja ??
                    'Mystic Box',

                  descripcion:
                    caja?.descripcion ??
                    '',

                  imagen:
                    caja?.imagen ??
                    '',

                  precio:
                    Number(
                      detalle.precioUnitario
                    )
                    ||
                    Number(
                      caja?.precio
                    )
                    ||
                    0,

                  cantidad:
                    Number(
                      detalle.cantidad
                    )
                    ||
                    1
                };
              }
            );

        this.cargando = false;
      },

      error: error => {

        console.error(
          'Error cargando productos del carrito:',
          error
        );

        this.productosCarrito = [];

        this.cargando = false;

        this.mensajeCompra =
          'No fue posible cargar los productos del carrito.';
      }

    });
  }


  aumentarCantidad(
    producto: any
  ): void {

    producto.cantidad =
      Number(
        producto.cantidad ?? 0
      ) + 1;

    this.reiniciarCuponSiCambioCarrito();
  }


  disminuirCantidad(
    producto: any
  ): void {

    const cantidad =
      Number(
        producto.cantidad ?? 1
      );

    if (cantidad <= 1) {
      return;
    }

    producto.cantidad =
      cantidad - 1;

    this.reiniciarCuponSiCambioCarrito();
  }


eliminarProducto(index: number): void {

  const producto =
    this.productosCarrito[index];

  if (!producto?.idDetalleCarrito) {
    console.error(
      'No se encontró el ID del detalle del carrito.'
    );
    return;
  }

  this.carritoService
    .eliminarDetalleCarrito(
      Number(
        producto.idDetalleCarrito
      )
    )
    .subscribe({

      next: () => {

        this.productosCarrito.splice(
          index,
          1
        );

        this.reiniciarCuponSiCambioCarrito();

      },

      error: error => {

        console.error(
          'Error eliminando producto del carrito:',
          error
        );

        this.mensajeCompra =
          'No fue posible eliminar el producto del carrito.';
      }

    });
}


  calcularSubtotal(): number {

    return this.productosCarrito
      .reduce(
        (
          total,
          producto
        ) =>
          total
          +
          (
            Number(
              producto.precio ?? 0
            )
            *
            Number(
              producto.cantidad ?? 0
            )
          ),
        0
      );
  }


  calcularDescuento(): number {

    return Number(
      this.cuponAplicado
        ?.descuento ??
      0
    );
  }


  calcularCostoEnvio(): number {

    if (
      this.tipoEntrega !==
      'envio'
    ) {
      return 0;
    }

    const provincia =
      this.normalizarTexto(
        this.provinciaEntrega
      );

    const direccion =
      this.normalizarTexto(
        this.direccionEntrega
      );

    /*
     * Según la regla definida:
     *
     * Guápiles o Limón = ₡2.000
     * San José u otras provincias = ₡3.500
     */
    const esLimon =
      provincia === 'limon';

    const esGuapiles =
      direccion.includes(
        'guapiles'
      );

    if (
      esLimon ||
      esGuapiles
    ) {
      return 2000;
    }

    return 3500;
  }


  calcularTotal(): number {

    return Math.max(
      this.calcularSubtotal()
      -
      this.calcularDescuento()
      +
      this.calcularCostoEnvio(),
      0
    );
  }


  seleccionarTipoEntrega(
    tipo:
      'retiro' |
      'envio'
  ): void {

    this.tipoEntrega = tipo;

    this.mensajeCompra = '';

    if (
      tipo === 'retiro'
    ) {

      this.provinciaEntrega = '';

      this.direccionEntrega = '';
    }
  }


  aplicarCupon(): void {

    const codigo =
      this.codigoCupon
        .trim();

    this.mensajeCupon = '';

    this.tipoMensajeCupon = '';

    if (!codigo) {

      this.mensajeCupon =
        'Ingresa tu código promocional.';

      this.tipoMensajeCupon =
        'error';

      return;
    }

    const subtotal =
      this.calcularSubtotal();

    if (
      subtotal <= 0
    ) {

      this.mensajeCupon =
        'Agrega productos antes de aplicar un cupón.';

      this.tipoMensajeCupon =
        'error';

      return;
    }

    this.validandoCupon = true;

    this.cuponService
      .validarCupon(
        codigo,
        subtotal
      )
      .subscribe({

        next: respuesta => {

          if (!respuesta.valido) {

            this.cuponAplicado =
              null;

            this.mensajeCupon =
              respuesta.mensaje ??
              'El cupón no es válido.';

            this.tipoMensajeCupon =
              'error';

            this.validandoCupon =
              false;

            return;
          }

          this.cuponAplicado =
            respuesta;

          this.codigoCupon =
            respuesta.codigo;

          this.mensajeCupon =
            respuesta.mensaje ??
            'Cupón aplicado correctamente.';

          this.tipoMensajeCupon =
            'exito';

          this.validandoCupon =
            false;
        },

        error: error => {

          this.cuponAplicado =
            null;

          this.mensajeCupon =
            error.error?.mensaje ??
            'El código ingresado no pudo aplicarse.';

          this.tipoMensajeCupon =
            'error';

          this.validandoCupon =
            false;

          console.error(
            'Error validando cupón:',
            error
          );
        }

      });
  }


  quitarCupon(): void {

    this.cuponAplicado = null;

    this.codigoCupon = '';

    this.mensajeCupon = '';

    this.tipoMensajeCupon = '';
  }


  reiniciarCuponSiCambioCarrito():
    void {

    if (!this.cuponAplicado) {
      return;
    }

    this.cuponAplicado = null;

    this.mensajeCupon =
      'El carrito cambió. Aplica nuevamente el código promocional.';

    this.tipoMensajeCupon =
      'error';
  }


  seleccionarMetodoPago(
    evento: Event
  ): void {

    const selector =
      evento.target as
      HTMLSelectElement;

    this.idMetodoPagoSeleccionado =
      selector.value
        ?
        Number(
          selector.value
        )
        :
        null;

    this.mensajeCompra = '';
  }


  continuarCompra(): void {

    this.mensajeCompra = '';

    if (
      this.productosCarrito
        .length === 0
    ) {

      this.mensajeCompra =
        'Tu carrito está vacío.';

      return;
    }

    if (!this.tipoEntrega) {

      this.mensajeCompra =
        'Selecciona cómo deseas recibir tu pedido.';

      return;
    }

    if (
      this.tipoEntrega ===
      'envio'
    ) {

      if (
        !this.provinciaEntrega
          .trim()
      ) {

        this.mensajeCompra =
          'Selecciona la provincia de entrega.';

        return;
      }

      if (
        !this.direccionEntrega
          .trim()
      ) {

        this.mensajeCompra =
          'Ingresa la dirección donde deseas recibir tu pedido.';

        return;
      }

      if (
        this.direccionEntrega
          .trim()
          .length < 8
      ) {

        this.mensajeCompra =
          'Ingresa una dirección de entrega más detallada.';

        return;
      }
    }

    if (
      !this.idMetodoPagoSeleccionado
    ) {

      this.mensajeCompra =
        'Selecciona un método de pago.';

      return;
    }

    if (!this.carritoActivo) {

      this.mensajeCompra =
        'No se encontró un carrito activo.';

      return;
    }

    const idUsuario =
      this.obtenerIdUsuario();

    if (!idUsuario) {

      this.mensajeCompra =
        'No se encontró la sesión del usuario.';

      return;
    }

    this.procesandoCompra = true;

    const subtotal =
      this.calcularSubtotal();

    const descuento =
      this.calcularDescuento();

    const costoEnvio =
      this.calcularCostoEnvio();

    const total =
      this.calcularTotal();

    const idCupon =
      this.cuponAplicado
        ?
        Number(
          this.cuponAplicado
            .idCupon
        )
        ||
        null
        :
        null;


    const nuevoPedido:
      CrearPedidoRequest = {

      idUsuario,

      idCupon,

      idMetodoPago:
        this.idMetodoPagoSeleccionado,

      fechaPedido:
        null,

      subtotal,

      descuento,

      costoEnvio,

      total,

      estadoPedido:
        'Pendiente',

      tipoEntrega:
        this.tipoEntrega,

      provinciaEntrega:
        this.tipoEntrega ===
          'envio'
          ?
          this.provinciaEntrega
            .trim()
          :
          null,

      direccionEntrega:
        this.tipoEntrega ===
          'envio'
          ?
          this.direccionEntrega
            .trim()
          :
          null
    };


    this.pedidoService
      .crearPedido(
        nuevoPedido
      )
      .subscribe({

        next:
          pedidoCreado => {

            this.crearDetallesPedido(
              pedidoCreado,
              idUsuario,
              subtotal,
              descuento,
              costoEnvio,
              total
            );
          },

        error:
          errorPedido => {

            this.procesandoCompra =
              false;

            this.mensajeCompra =
              errorPedido
                ?.error
                ?.mensaje
              ??
              'No fue posible crear el pedido.';

            console.error(
              'Error al crear pedido:',
              errorPedido
            );
          }

      });
  }


  private crearDetallesPedido(
    pedidoCreado: any,
    idUsuario: number,
    subtotal: number,
    descuento: number,
    costoEnvio: number,
    total: number
  ): void {

    const detallesPedido =
      this.productosCarrito
        .map(
          producto => {

            const cantidad =
              Number(
                producto.cantidad
              )
              ||
              1;

            const precioUnitario =
              Number(
                producto.precio
              )
              ||
              0;

            return this.detallePedidoService
              .crearDetallePedido({

                idPedido:
                  Number(
                    pedidoCreado
                      .idPedido
                  ),

                idCaja:
                  Number(
                    producto.idCaja
                  ),

                idPersonalizacion:
                  producto
                    .idPersonalizacion
                    ?
                    Number(
                      producto
                        .idPersonalizacion
                    )
                    :
                    null,

                cantidad,

                precioUnitario,

                subtotal:
                  precioUnitario
                  *
                  cantidad
              });
          }
        );

    forkJoin(
      detallesPedido
    )
    .subscribe({

      next: () => {

        this.crearFactura(
          pedidoCreado,
          idUsuario,
          subtotal,
          descuento,
          costoEnvio,
          total
        );
      },

      error:
        errorDetalles => {

          this.procesandoCompra =
            false;

          this.mensajeCompra =
            'El pedido se creó, pero no fue posible guardar todos los productos.';

          console.error(
            'Error creando detalles:',
            errorDetalles
          );
        }

    });
  }


  private crearFactura(
    pedidoCreado: any,
    idUsuario: number,
    subtotal: number,
    descuento: number,
    costoEnvio: number,
    total: number
  ): void {

    const nuevaFactura:
      CrearFacturaRequest = {

      idPedido:
        Number(
          pedidoCreado
            .idPedido
        ),

      fechaFactura:
        null,

      subtotal,

      descuento,

      costoEnvio,

      total
    };


    this.facturaService
      .crearFactura(
        nuevaFactura
      )
      .subscribe({

        next:
          facturaCreada => {

            this.finalizarCarrito(
              pedidoCreado,
              facturaCreada,
              idUsuario,
              costoEnvio
            );
          },

        error:
          errorFactura => {

            this.procesandoCompra =
              false;

            this.mensajeCompra =
              'El pedido se creó, pero no fue posible generar la factura.';

            console.error(
              'Error generando factura:',
              errorFactura
            );
          }

      });
  }


  private finalizarCarrito(
    pedidoCreado: any,
    facturaCreada: any,
    idUsuario: number,
    costoEnvio: number
  ): void {

    const carritoFinalizado = {

      idCarrito:
        Number(
          this.carritoActivo
            .idCarrito
        ),

      idUsuario,

      fechaCreacion:
        this.carritoActivo
          .fechaCreacion,

      estado:
        'Finalizado'
    };


    this.carritoService
      .actualizarCarrito(
        carritoFinalizado
          .idCarrito,

        carritoFinalizado
      )
      .subscribe({

        next: () => {

          sessionStorage.setItem(
            'facturaGenerada',

            JSON.stringify({

              factura:
                facturaCreada,

              pedido:
                pedidoCreado,

              productos:
                this.productosCarrito,

              entrega: {
                tipoEntrega:
                  this.tipoEntrega,

                provinciaEntrega:
                  this.provinciaEntrega,

                direccionEntrega:
                  this.direccionEntrega,

                costoEnvio
              }
            })
          );

          localStorage.removeItem(
            'idCarritoActual'
          );

          this.procesandoCompra =
            false;

          this.router.navigate(
            ['/factura'],
            {
              queryParams: {
                idFactura:
                  facturaCreada
                    .idFactura
              }
            }
          );
        },

        error:
          errorCarrito => {

            this.procesandoCompra =
              false;

            this.mensajeCompra =
              'La compra se completó, pero no fue posible cerrar el carrito.';

            console.error(
              'Error finalizando carrito:',
              errorCarrito
            );
          }

      });
  }


  volverAlInicio(): void {

    this.router.navigate([
      '/home'
    ]);
  }


  private obtenerIdUsuario():
    number | null {

    const idDirecto =
      Number(
        localStorage.getItem(
          'idUsuario'
        )
      );

    if (idDirecto) {
      return idDirecto;
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
          usuario.idUsuario
          ??
          usuario.IdUsuario
        );

      return idUsuario
        ||
        null;

    } catch (error) {

      console.error(
        'No fue posible leer la sesión:',
        error
      );

      return null;
    }
  }


  private normalizarTexto(
    valor:
      string |
      null |
      undefined
  ): string {

    return (
      valor ?? ''
    )
      .trim()
      .toLowerCase()
      .normalize(
        'NFD'
      )
      .replace(
        /[\u0300-\u036f]/g,
        ''
      );
  }
}