import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router, RouterLink } from '@angular/router';

import {
  CrearPedidoRequest,
  PedidoCreadoResponse,
  PedidoService
} from '../../services/pedido.service';

import { addIcons } from 'ionicons';

import {
  arrowBackOutline,
  cardOutline,
  locationOutline,
  bagCheckOutline,
  checkmarkCircleOutline,
  receiptOutline,
  calendarOutline,
  cubeOutline,
  ticketOutline,
  alertCircleOutline
} from 'ionicons/icons';

interface ProductoCompra {
  nombre: string;
  descripcion: string;
  precio: number;
  cantidad: number;
}

interface CuponCompra {
  idCupon: number;
  codigo: string;
  descripcion: string;
  descuento: number;
}

interface DatosCompra {
  productos: ProductoCompra[];
  subtotal: number;
  descuento: number;
  totalFinal: number;
  cupon: CuponCompra | null;
}

@Component({
  selector: 'app-proceso-compra',
  templateUrl: './proceso-compra.page.html',
  styleUrls: ['./proceso-compra.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterLink
  ]
})
export class ProcesoCompraPage implements OnInit {

  datosCompra: DatosCompra = {
    productos: [],
    subtotal: 0,
    descuento: 0,
    totalFinal: 0,
    cupon: null
  };

  direccionEntrega = '';

  idMetodoPago = 1;

  procesandoCompra = false;

  mensajeError = '';

  compraRealizada = false;

  pedidoCreado: PedidoCreadoResponse | null = null;

  constructor(
    private pedidoService: PedidoService,
    private router: Router
  ) {
    addIcons({
      arrowBackOutline,
      cardOutline,
      locationOutline,
      bagCheckOutline,
      checkmarkCircleOutline,
      receiptOutline,
      calendarOutline,
      cubeOutline,
      ticketOutline,
      alertCircleOutline
    });
  }

  ngOnInit(): void {
    this.cargarDatosCompra();
    this.cargarDireccionUsuario();
  }

  cargarDatosCompra(): void {
    const datosGuardados =
      sessionStorage.getItem('datosCompra');

    if (!datosGuardados) {
      this.mensajeError =
        'No se encontraron productos para procesar la compra.';

      return;
    }

    try {
      const datos = JSON.parse(datosGuardados);

      this.datosCompra = {
        productos: datos.productos ?? [],
        subtotal: Number(datos.subtotal ?? 0),
        descuento: Number(datos.descuento ?? 0),
        totalFinal: Number(datos.totalFinal ?? 0),
        cupon: datos.cupon ?? null
      };

      if (this.datosCompra.productos.length === 0) {
        this.mensajeError =
          'El carrito no contiene productos.';
      }
    } catch (error) {
      console.error(
        'Error al leer los datos de la compra:',
        error
      );

      this.mensajeError =
        'No fue posible cargar la información del carrito.';
    }
  }

  cargarDireccionUsuario(): void {
    const usuarioGuardado =
      sessionStorage.getItem('usuario');

    if (!usuarioGuardado) {
      return;
    }

    try {
      const usuario = JSON.parse(usuarioGuardado);

      this.direccionEntrega =
        usuario.direccionEntrega ??
        usuario.direccion ??
        '';
    } catch (error) {
      console.error(
        'No fue posible cargar la dirección:',
        error
      );
    }
  }

  calcularSubtotalProducto(
    producto: ProductoCompra
  ): number {
    return producto.precio * producto.cantidad;
  }

  obtenerIdUsuario(): number {
    const usuarioGuardado =
      sessionStorage.getItem('usuario');

    if (usuarioGuardado) {
      try {
        const usuario = JSON.parse(usuarioGuardado);

        const idUsuario = Number(
          usuario.idUsuario ??
          usuario.usuarioId ??
          usuario.id
        );

        if (idUsuario > 0) {
          return idUsuario;
        }
      } catch (error) {
        console.error(
          'No fue posible leer el usuario:',
          error
        );
      }
    }

    /*
     * Se usa temporalmente el usuario 1,
     * porque fue confirmado en Swagger.
     */
    return 1;
  }

  confirmarCompra(): void {
    this.mensajeError = '';

    if (this.datosCompra.productos.length === 0) {
      this.mensajeError =
        'Debe tener productos en el carrito.';

      return;
    }

    if (!this.direccionEntrega.trim()) {
      this.mensajeError =
        'Debe ingresar la dirección de entrega.';

      return;
    }

    if (this.idMetodoPago <= 0) {
      this.mensajeError =
        'Debe seleccionar un método de pago.';

      return;
    }

    if (this.datosCompra.totalFinal <= 0) {
      this.mensajeError =
        'El total de la compra no es válido.';

      return;
    }

    const pedido: CrearPedidoRequest = {
      idPedido: 0,
      idUsuario: this.obtenerIdUsuario(),
      idCupon:
        this.datosCompra.cupon?.idCupon ?? null,
      idMetodoPago: this.idMetodoPago,
      fechaPedido: null,
      subtotal: this.datosCompra.subtotal,
      descuento: this.datosCompra.descuento,
      total: this.datosCompra.totalFinal,
      estadoPedido: 'Pendiente'
    };

    this.procesandoCompra = true;

    this.pedidoService
      .crearPedido(pedido)
      .subscribe({
        next: (respuesta) => {
          this.procesandoCompra = false;
          this.compraRealizada = true;
          this.pedidoCreado = respuesta;

          /*
           * Se guarda el pedido completo para:
           * - Seguimiento de entrega.
           * - Calificación de experiencia.
           * - Consulta del pedido más reciente.
           */
          const ultimoPedido = {
            idPedido: respuesta.idPedido,
            numeroPedido: respuesta.numeroPedido,
            fechaPedido: respuesta.fechaPedido,
            fechaEstimadaEntrega:
              respuesta.fechaEstimadaEntrega,
            estadoPedido: respuesta.estadoPedido,
            subtotal: respuesta.subtotal,
            descuento: respuesta.descuento,
            total: respuesta.total,
            idCupon: respuesta.idCupon,
            idMetodoPago: respuesta.idMetodoPago,
            productos: this.datosCompra.productos,
            direccionEntrega:
              this.direccionEntrega.trim(),
            cupon: this.datosCompra.cupon
          };

          sessionStorage.setItem(
            'ultimoPedido',
            JSON.stringify(ultimoPedido)
          );

          /*
           * También lo guardamos en localStorage.
           * Así no se pierde al cerrar la pestaña
           * o reiniciar Ionic.
           */
          localStorage.setItem(
            'ultimoPedido',
            JSON.stringify(ultimoPedido)
          );

          sessionStorage.removeItem('datosCompra');
          sessionStorage.removeItem('productosCarrito');

          console.log(
            'Pedido creado correctamente:',
            respuesta
          );

          console.log(
            'Último pedido guardado:',
            ultimoPedido
          );
        },
        error: (error) => {
          this.procesandoCompra = false;

          this.mensajeError =
            error.error?.mensaje ??
            'No fue posible confirmar la compra.';

          console.error(
            'Error al crear el pedido:',
            error
          );
        }
      });
  }

  irAMisPedidos(): void {
    this.router.navigate(['/pedidos']);
  }

  volverAlInicio(): void {
    this.router.navigate(['/home']);
  }
}