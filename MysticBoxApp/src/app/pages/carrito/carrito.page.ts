import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router, RouterLink } from '@angular/router';
import { Mysticbox } from 'src/app/services/mysticbox';
import { CarritoService } from '../../services/carrito.service';
import { PedidoService } from '../../services/pedido.service';
import { DetallePedidoService } from 'src/app/services/detallePedido.service';
import { FacturaService } from 'src/app/services/factura.service';
import { forkJoin } from 'rxjs';

import {
  CuponService,
  ValidacionCupon
} from '../../services/cupon.service';

import { addIcons } from 'ionicons';
import {
  arrowBackOutline,
  cartOutline,
  trashOutline,
  addOutline,
  removeOutline,
  bagCheckOutline,
  ticketOutline,
  checkmarkCircleOutline,
  closeCircleOutline
} from 'ionicons/icons';

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
export class CarritoPage implements OnInit {

  carritos: any[] = [];
  cargando = true;

  codigoCupon = '';
  cuponAplicado: ValidacionCupon | null = null;
  mensajeCupon = '';
  tipoMensajeCupon: 'exito' | 'error' | '' = '';
  validandoCupon = false;

  productosCarrito: any[] = [];
  carritoActivo: any

  metodosPago = [
    {
      idMetodoPago: 1, nombre: 'Tarjeta'
    },
    {
      idMetodoPago: 2, nombre: 'SINPE Móvil'
    },
    {
      idMetodoPago: 3, nombre: 'Transferencia Bancaria'
    }
  ];

  idMetodoPagoSeleccionado: number | null = null;
  procesandoCompra = false;
  mensajeCompra = '';


  constructor(
    private carritoService: CarritoService,
    private cuponService: CuponService,
    private mysticboxService: Mysticbox,
    private pedidoService: PedidoService,
    private facturaService: FacturaService,
    private detallePedidoService: DetallePedidoService,
    private router: Router
  ) {
    addIcons({
      arrowBackOutline,
      cartOutline,
      trashOutline,
      addOutline,
      removeOutline,
      bagCheckOutline,
      ticketOutline,
      checkmarkCircleOutline,
      closeCircleOutline
    });
  }

  ngOnInit(): void {
    this.obtenerCarritos();
  }

  obtenerCarritos(): void {

    let idUsuario =
      Number(localStorage.getItem('idUsuario'));

    if (!idUsuario) {
      const usuarioGuardado =
        localStorage.getItem('usuario');

      if (usuarioGuardado) {
        const usuario = JSON.parse(usuarioGuardado);

        idUsuario = Number(
          usuario.idUsuario
        );
      }
    }

    console.log(
      'Id del usuario en el carrito:',
      idUsuario
    );
    this.carritoService.obtenerCarritos()
      .subscribe({

        next: carritos => {

          this.carritos = carritos;

          const carritoActivo = carritos.find(
            (carrito: any) =>
              Number(carrito.idUsuario) === idUsuario &&
              String(carrito.estado).toLowerCase() === 'activo'
          );
          this.carritoActivo = carritoActivo ?? null;

          if (!carritoActivo) {
            this.productosCarrito = [];
            this.cargando = false;
            return;
          }

          this.carritoService
            .obtenerDetallesCarrito()
            .subscribe({

              next: detalles => {

                const detallesDelCarrito = detalles.filter(
                  (detalle: any) =>
                    Number(detalle.idCarrito) ===
                    Number(carritoActivo.idCarrito)
                );

                this.mysticboxService
                  .obtenerCajas()
                  .subscribe({

                    next: cajas => {
                      console.log(
                        'Detalles del carrito encontrados:',
                        detallesDelCarrito
                      );

                      console.log(
                        'Cajas recibidas desde backend:',
                        cajas
                      );

                      this.productosCarrito =
                        detallesDelCarrito.map(
                          (detalle: any) => {

                            const caja = cajas.find(
                              (item: any) =>
                                Number(item.idCaja) ===
                                Number(detalle.idCaja)
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
                                caja?.nombreCaja ||
                                'Mystic Box',
                              descripcion:
                                caja?.descripcion ||
                                '',
                              imagen:
                                caja?.imagen ||
                                '',
                              precio:
                                Number(detalle.precioUnitario) ||
                                Number(caja?.precio) ||
                                0,
                              cantidad:
                                Number(detalle.cantidad) || 1
                            };
                          }
                        );

                      this.cargando = false;

                      console.log(
                        'Productos reales del carrito:',
                        this.productosCarrito
                      );
                    },

                    error: errorCajas => {
                      console.error(
                        'Error al obtener las cajas:',
                        errorCajas
                      );

                      this.cargando = false;
                    }
                  });
              },

              error: errorDetalles => {
                console.error(
                  'Error al obtener los detalles:',
                  errorDetalles
                );

                this.cargando = false;
              }
            });
        },

        error: errorCarritos => {
          console.error(
            'Error al obtener los carritos:',
            errorCarritos
          );

          this.cargando = false;
        }
      });
  }

  aumentarCantidad(producto: any): void {
    producto.cantidad++;

    this.reiniciarCuponSiCambioCarrito();
  }

  disminuirCantidad(producto: any): void {
    if (producto.cantidad > 1) {
      producto.cantidad--;

      this.reiniciarCuponSiCambioCarrito();
    }
  }

  eliminarProducto(index: number): void {
    this.productosCarrito.splice(index, 1);

    this.reiniciarCuponSiCambioCarrito();
  }

  calcularSubtotal(): number {
    return this.productosCarrito.reduce(
      (total, producto) =>
        total + producto.precio * producto.cantidad,
      0
    );
  }

  calcularDescuento(): number {
    return this.cuponAplicado?.descuento ?? 0;
  }

  calcularTotal(): number {
    return Math.max(
      this.calcularSubtotal() - this.calcularDescuento(),
      0
    );
  }

  aplicarCupon(): void {
    const codigo = this.codigoCupon.trim();

    this.mensajeCupon = '';
    this.tipoMensajeCupon = '';

    if (!codigo) {
      this.mensajeCupon =
        'Debe ingresar un código de cupón.';

      this.tipoMensajeCupon = 'error';

      return;
    }

    const subtotal = this.calcularSubtotal();

    if (subtotal <= 0) {
      this.mensajeCupon =
        'Debe agregar productos antes de aplicar un cupón.';

      this.tipoMensajeCupon = 'error';

      return;
    }

    this.validandoCupon = true;

    this.cuponService
      .validarCupon(codigo, subtotal)
      .subscribe({
        next: (respuesta) => {
          this.cuponAplicado = respuesta;
          this.codigoCupon = respuesta.codigo;

          this.mensajeCupon =
            respuesta.mensaje;

          this.tipoMensajeCupon = 'exito';
          this.validandoCupon = false;

          console.log(
            'Cupón aplicado:',
            respuesta
          );
        },
        error: (error) => {
          this.cuponAplicado = null;

          this.mensajeCupon =
            error.error?.mensaje ??
            'No fue posible validar el cupón.';

          this.tipoMensajeCupon = 'error';
          this.validandoCupon = false;

          console.error(
            'Error al validar el cupón:',
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

  reiniciarCuponSiCambioCarrito(): void {
    if (this.cuponAplicado) {
      this.cuponAplicado = null;

      this.mensajeCupon =
        'El carrito cambió. Vuelva a aplicar el cupón.';

      this.tipoMensajeCupon = 'error';
    }
  }

  seleccionarMetodoPago(evento: Event): void {
    const selector = evento.target as HTMLSelectElement;

    this.idMetodoPagoSeleccionado = selector.value
      ? Number(selector.value) : null;

  }
  continuarCompra(): void {

    if (this.productosCarrito.length === 0) {
      this.mensajeCompra =
        'El carrito no tiene productos.';

      return;
    }

    if (!this.idMetodoPagoSeleccionado) {
      this.mensajeCompra =
        'Debe seleccionar un método de pago.';

      return;
    }

    if (!this.carritoActivo) {
      this.mensajeCompra =
        'No se encontró el carrito activo.';

      return;
    }

    let idUsuario =
      Number(localStorage.getItem('idUsuario'));

    if (!idUsuario) {

      const usuarioGuardado =
        localStorage.getItem('usuario');

      if (usuarioGuardado) {

        try {

          const usuario =
            JSON.parse(usuarioGuardado);

          idUsuario =
            Number(usuario.idUsuario);

        } catch (error) {

          console.error(
            'Error al leer el usuario guardado:',
            error
          );
        }
      }
    }

    if (!idUsuario) {
      this.mensajeCompra =
        'No se encontró el usuario que inició sesión.';

      return;
    }

    this.procesandoCompra = true;
    this.mensajeCompra = '';

    const subtotal =
      this.calcularSubtotal();

    const descuento =
      this.calcularDescuento();

    const total =
      this.calcularTotal();

    const idCupon =
      this.cuponAplicado
        ? Number(
          this.cuponAplicado.idCupon
        ) || null
        : null;

    const nuevoPedido = {
      idUsuario: idUsuario,
      idCupon: idCupon,
      idMetodoPago:
        this.idMetodoPagoSeleccionado,
      fechaPedido: null,
      subtotal: subtotal,
      descuento: descuento,
      total: total,
      estadoPedido: 'Pendiente'
    };

    this.pedidoService
      .crearPedido(nuevoPedido)
      .subscribe({

        next: (pedidoCreado: any) => {

          const detallesPedido =
            this.productosCarrito.map(
              (producto: any) => {

                const cantidad =
                  Number(producto.cantidad) || 1;

                const precioUnitario =
                  Number(producto.precio) || 0;

                return this.detallePedidoService
                  .crearDetallePedido({

                    idPedido:
                      Number(
                        pedidoCreado.idPedido
                      ),

                    idCaja:
                      Number(producto.idCaja),

                    idPersonalizacion:
                      producto.idPersonalizacion
                        ? Number(
                          producto.idPersonalizacion
                        )
                        : null,

                    cantidad:
                      cantidad,

                    precioUnitario:
                      precioUnitario,

                    subtotal:
                      precioUnitario * cantidad
                  });
              }
            );

          forkJoin(detallesPedido)
            .subscribe({

              next: () => {

                const nuevaFactura = {

                  idPedido:
                    Number(
                      pedidoCreado.idPedido
                    ),

                  fechaFactura: null,

                  subtotal:
                    subtotal,

                  descuento:
                    descuento,

                  total:
                    total
                };

                this.facturaService
                  .crearFactura(nuevaFactura)
                  .subscribe({

                    next: (
                      facturaCreada: any
                    ) => {

                      const carritoFinalizado = {

                        idCarrito:
                          Number(
                            this.carritoActivo
                              .idCarrito
                          ),

                        idUsuario:
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
                                  this.productosCarrito
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
                                    facturaCreada.idFactura
                                }
                              }
                            );
                          },

                          error: (
                            errorCarrito: any
                          ) => {

                            this.procesandoCompra =
                              false;

                            this.mensajeCompra =
                              'La factura se generó, pero no se pudo finalizar el carrito.';

                            console.error(
                              'Error al finalizar el carrito:',
                              errorCarrito
                            );
                          }
                        });
                    },

                    error: (
                      errorFactura: any
                    ) => {

                      this.procesandoCompra =
                        false;

                      this.mensajeCompra =
                        'El pedido se creó, pero no se pudo generar la factura.';

                      console.error(
                        'Error al generar la factura:',
                        errorFactura
                      );
                    }
                  });
              },

              error: (
                errorDetalles: any
              ) => {

                this.procesandoCompra =
                  false;

                this.mensajeCompra =
                  'El pedido se creó, pero no se pudieron guardar todos los productos.';

                console.error(
                  'Error al crear los detalles del pedido:',
                  errorDetalles
                );
              }
            });
        },

        error: (
          errorPedido: any
        ) => {

          this.procesandoCompra =
            false;

          this.mensajeCompra =
            errorPedido?.error?.mensaje ||
            'No fue posible crear el pedido.';

          console.error(
            'Error al crear el pedido:',
            errorPedido
          );
        }
      });
  }
}