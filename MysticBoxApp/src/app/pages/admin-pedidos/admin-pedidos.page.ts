import {
  Component,
  OnInit
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';

import {
  ActualizarPedidoRequest,
  Pedido,
  PedidoDetalleCompleto,
  PedidoService
} from '../../services/pedido.service';

import { addIcons } from 'ionicons';

import {
  arrowBackOutline,
  receiptOutline,
  searchOutline,
  refreshOutline,
  saveOutline,
  calendarOutline,
  personOutline,
  cashOutline,
  cardOutline,
  ticketOutline,
  alertCircleOutline,
  checkmarkCircleOutline,
  timeOutline,
  constructOutline,
  archiveOutline,
  carOutline,
  closeCircleOutline,
  cubeOutline,
  eyeOutline,
  closeOutline,
  mailOutline,
  callOutline,
  locationOutline,
  bagHandleOutline
} from 'ionicons/icons';

interface UsuarioPedido {
  idUsuario: number;
  nombre: string;
  correo: string;
}

interface PedidoAdministrativo extends Pedido {
  estadoSeleccionado: string;
  guardandoEstado: boolean;
}

@Component({
  selector: 'app-admin-pedidos',
  templateUrl: './admin-pedidos.page.html',
  styleUrls: ['./admin-pedidos.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ]
})
export class AdminPedidosPage implements OnInit {

  pedidos: PedidoAdministrativo[] = [];
  pedidosFiltrados: PedidoAdministrativo[] = [];

  usuarios: UsuarioPedido[] = [];

  textoBusqueda = '';
  filtroEstado = 'Todos';

  cargando = true;

  mensajeError = '';
  mensajeExito = '';

  mostrarDetalle = false;
  cargandoDetalle = false;

  pedidoDetalle:
    PedidoDetalleCompleto | null = null;

  mensajeErrorDetalle = '';

  estadosPedido: string[] = [
    'Pendiente',
    'Preparando',
    'Empacando',
    'En camino',
    'Entregado',
    'Cancelado'
  ];

  constructor(
    private pedidoService: PedidoService,
    private router: Router
  ) {
    addIcons({
      arrowBackOutline,
      receiptOutline,
      searchOutline,
      refreshOutline,
      saveOutline,
      calendarOutline,
      personOutline,
      cashOutline,
      cardOutline,
      ticketOutline,
      alertCircleOutline,
      checkmarkCircleOutline,
      timeOutline,
      constructOutline,
      archiveOutline,
      carOutline,
      closeCircleOutline,
      cubeOutline,
      eyeOutline,
      closeOutline,
      mailOutline,
      callOutline,
      locationOutline,
      bagHandleOutline
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

    this.pedidoService
      .obtenerPedidos()
      .subscribe({
        next: (respuesta: any[]) => {
          this.pedidos =
            (respuesta ?? [])
              .map(
                (pedido: any) =>
                  this.normalizarPedido(pedido)
              )
              .sort(
                (a, b) =>
                  b.idPedido - a.idPedido
              );

          this.aplicarFiltros();
          this.cargando = false;

          console.log(
            'Pedidos obtenidos:',
            respuesta
          );
        },
        error: (error) => {
          this.cargando = false;

          this.mensajeError =
            error.error?.mensaje ??
            'No fue posible consultar los pedidos.';

          console.error(
            'Error al obtener pedidos:',
            error
          );
        }
      });
  }

  normalizarPedido(
    pedido: any
  ): PedidoAdministrativo {
    const estado =
      pedido.estadoPedido ??
      pedido.EstadoPedido ??
      'Pendiente';

    return {
      idPedido: Number(
        pedido.idPedido ??
        pedido.IdPedido ??
        0
      ),
      idUsuario: Number(
        pedido.idUsuario ??
        pedido.IdUsuario ??
        0
      ),
      idCupon:
        pedido.idCupon ??
        pedido.IdCupon ??
        null,
      idMetodoPago: Number(
        pedido.idMetodoPago ??
        pedido.IdMetodoPago ??
        0
      ),
      fechaPedido:
        pedido.fechaPedido ??
        pedido.FechaPedido ??
        null,
      subtotal: Number(
        pedido.subtotal ??
        pedido.Subtotal ??
        0
      ),
      descuento:
        pedido.descuento ??
        pedido.Descuento ??
        null,
      total: Number(
        pedido.total ??
        pedido.Total ??
        0
      ),
      estadoPedido: estado,
      estadoSeleccionado: estado,
      guardandoEstado: false
    };
  }

  aplicarFiltros(): void {
    const texto =
      this.textoBusqueda
        .trim()
        .toLowerCase();

    this.pedidosFiltrados =
      this.pedidos.filter(
        pedido => {
          const coincideTexto =
            !texto ||
            this.obtenerNumeroPedido(
              pedido.idPedido
            )
              .toLowerCase()
              .includes(texto) ||
            pedido.idPedido
              .toString()
              .includes(texto) ||
            pedido.idUsuario
              .toString()
              .includes(texto) ||
            (
              pedido.estadoPedido ?? ''
            )
              .toLowerCase()
              .includes(texto);

          const coincideEstado =
            this.filtroEstado ===
              'Todos' ||
            pedido.estadoPedido ===
              this.filtroEstado;

          return (
            coincideTexto &&
            coincideEstado
          );
        }
      );
  }

  guardarEstado(
    pedido: PedidoAdministrativo
  ): void {
    this.mensajeError = '';
    this.mensajeExito = '';

    if (
      !pedido.estadoSeleccionado
    ) {
      this.mensajeError =
        'Debe seleccionar un estado válido.';

      return;
    }

    const pedidoActualizado:
      ActualizarPedidoRequest = {
        idPedido: pedido.idPedido,
        idUsuario: pedido.idUsuario,
        idCupon: pedido.idCupon,
        idMetodoPago:
          pedido.idMetodoPago,
        fechaPedido:
          pedido.fechaPedido,
        subtotal:
          pedido.subtotal,
        descuento:
          pedido.descuento,
        total:
          pedido.total,
        estadoPedido:
          pedido.estadoSeleccionado
      };

    pedido.guardandoEstado = true;

    this.pedidoService
      .actualizarPedido(
        pedido.idPedido,
        pedidoActualizado
      )
      .subscribe({
        next: () => {
          pedido.guardandoEstado =
            false;

          pedido.estadoPedido =
            pedido.estadoSeleccionado;

          this.mensajeExito =
            `El pedido ${this.obtenerNumeroPedido(
              pedido.idPedido
            )} fue actualizado correctamente.`;

          this.aplicarFiltros();
        },
        error: (error) => {
          pedido.guardandoEstado =
            false;

          this.mensajeError =
            error.error?.mensaje ??
            error.error?.title ??
            'No fue posible actualizar el estado del pedido.';

          console.error(
            'Error al actualizar pedido:',
            error
          );
        }
      });
  }

  restaurarEstado(
    pedido: PedidoAdministrativo
  ): void {
    pedido.estadoSeleccionado =
      pedido.estadoPedido ??
      'Pendiente';
  }

  obtenerNumeroPedido(
    idPedido: number
  ): string {
    return `MB-${idPedido
      .toString()
      .padStart(6, '0')}`;
  }

  obtenerNombreUsuario(
    idUsuario: number
  ): string {
    const usuario =
      this.usuarios.find(
        item =>
          item.idUsuario ===
          idUsuario
      );

    return (
      usuario?.nombre ??
      `Usuario #${idUsuario}`
    );
  }

  obtenerMetodoPago(
    idMetodoPago: number
  ): string {
    switch (idMetodoPago) {
      case 1:
        return 'Tarjeta';
      case 2:
        return 'SINPE';
      case 3:
        return 'Efectivo';
      default:
        return `Método #${idMetodoPago}`;
    }
  }

  obtenerClaseEstado(
    estado: string | null
  ): string {
    switch (
      this.normalizarTexto(
        estado ?? ''
      )
    ) {
      case 'pendiente':
        return 'pending';

      case 'preparando':
        return 'preparing';

      case 'empacando':
        return 'packing';

      case 'en camino':
        return 'shipping';

      case 'entregado':
        return 'delivered';

      case 'cancelado':
        return 'cancelled';

      default:
        return 'pending';
    }
  }

  obtenerIconoEstado(
    estado: string | null
  ): string {
    switch (
      this.normalizarTexto(
        estado ?? ''
      )
    ) {
      case 'pendiente':
        return 'time-outline';

      case 'preparando':
        return 'construct-outline';

      case 'empacando':
        return 'archive-outline';

      case 'en camino':
        return 'car-outline';

      case 'entregado':
        return 'checkmark-circle-outline';

      case 'cancelado':
        return 'close-circle-outline';

      default:
        return 'receipt-outline';
    }
  }

  normalizarTexto(
    valor: string
  ): string {
    return valor
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(
        /[\u0300-\u036f]/g,
        ''
      );
  }

  calcularTotalPedidos(): number {
    return this.pedidos.reduce(
      (total, pedido) =>
        total + pedido.total,
      0
    );
  }

  contarPedidosPorEstado(
    estado: string
  ): number {
    return this.pedidos.filter(
      pedido =>
        pedido.estadoPedido === estado
    ).length;
  }


  abrirDetallePedido(
    pedido: PedidoAdministrativo
  ): void {
    this.mostrarDetalle = true;
    this.cargandoDetalle = true;
    this.pedidoDetalle = null;
    this.mensajeErrorDetalle = '';

    this.pedidoService
      .obtenerDetalleCompleto(
        pedido.idPedido
      )
      .subscribe({
        next: (
          respuesta:
            PedidoDetalleCompleto
        ) => {
          this.pedidoDetalle =
            respuesta;

          this.cargandoDetalle =
            false;
        },
        error: (error) => {
          this.cargandoDetalle =
            false;

          this.mensajeErrorDetalle =
            error.error?.mensaje ??
            error.error?.title ??
            'No fue posible consultar el detalle del pedido.';

          console.error(
            'Error al consultar el detalle:',
            error
          );
        }
      });
  }

  cerrarDetallePedido(): void {
    this.mostrarDetalle = false;
    this.cargandoDetalle = false;
    this.pedidoDetalle = null;
    this.mensajeErrorDetalle = '';
  }

  cerrarDetalleDesdeFondo(
    event: MouseEvent
  ): void {
    const elemento =
      event.target as HTMLElement;

    if (
      elemento.classList.contains(
        'order-modal-overlay'
      )
    ) {
      this.cerrarDetallePedido();
    }
  }

  calcularCantidadArticulos(): number {
    if (!this.pedidoDetalle) {
      return 0;
    }

    return this.pedidoDetalle
      .productos
      .reduce(
        (total, producto) =>
          total + producto.cantidad,
        0
      );
  }

  obtenerImagenProducto(
    imagen: string | null
  ): string {
    if (!imagen) {
      return '';
    }

    const ruta = imagen.trim();

    if (
      ruta.startsWith('http://') ||
      ruta.startsWith('https://') ||
      ruta.startsWith('data:') ||
      ruta.startsWith('blob:')
    ) {
      return ruta;
    }

    const rutaLimpia = ruta
      .replace(/^\/+/, '')
      .replace(/^assets\//i, '');

    return `assets/${rutaLimpia}`;
  }

  marcarErrorImagen(
    producto: {
      errorImagen?: boolean;
    }
  ): void {
    producto.errorImagen = true;
  }

  volverAlPanel(): void {
    this.router.navigate(['/admin']);
  }
}