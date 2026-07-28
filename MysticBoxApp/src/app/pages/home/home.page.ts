import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { addIcons } from 'ionicons';
import {
  addOutline,
  arrowForwardOutline,
  bagHandleOutline,
  cartOutline,
  checkmarkCircleOutline,
  cubeOutline,
  flameOutline,
  giftOutline,
  gridOutline,
  homeOutline,
  locationOutline,
  logOutOutline,
  personOutline,
  pricetagOutline,
  receiptOutline,
  searchOutline,
  sparklesOutline,
  starOutline,
  ticketOutline,
  timeOutline
} from 'ionicons/icons';

import {
  AuthService,
  UsuarioSesion
} from '../../services/auth.service';

import {
  CarritoService
} from '../../services/carrito.service';

import {
  PedidoService
} from '../../services/pedido.service';

interface ProductoHome {
  nombre: string;
  descripcion: string;
  precio: number;
  precioAnterior?: number;
  descuento?: number;
  icono: string;
  imagen?: string;
  etiqueta?: string;
}

interface UltimoPedidoHome {
  idPedido: number;
  numeroPedido: string;
  estadoPedido: string;
  total: number;
  fechaEstimadaEntrega?: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterLink
  ]
})
export class HomePage implements OnInit {

  usuario: UsuarioSesion | null = null;

  cantidadCarritos = 0;

  cantidadProductosCarrito = 0;

  textoBusqueda = '';

  ultimoPedido: UltimoPedidoHome | null = null;

  ofertas: ProductoHome[] = [
    {
      nombre: 'Gamer Box Básica',
      descripcion:
        'Accesorios gamer seleccionados para mejorar tu espacio.',
      precio: 13500,
      precioAnterior: 15000,
      descuento: 10,
      icono: 'cube-outline',
      imagen:
        'assets/img/Gamer-Box-Basica.png',
      etiqueta: 'Oferta'
    },
    {
      nombre: 'Beauty Box Glow',
      descripcion:
        'Productos de belleza y cuidado para una experiencia especial.',
      precio: 14400,
      precioAnterior: 18000,
      descuento: 20,
      icono:
        'sparkles-outline',
      imagen:
        'assets/img/Beauty-Box.png',
      etiqueta:
        'Popular'
    },
    {
      nombre: 'Office Boost Box',
      descripcion:
        'Artículos para oficina, estudio y productividad.',
      precio: 12500,
      precioAnterior: 15000,
      descuento: 16,
      icono:
        'bag-handle-outline',
      imagen:
        'assets/img/Office-Boost-Box.png',
      etiqueta:
        'Recomendada'
    }
  ];

  productoRecomendado: ProductoHome = {
    nombre:
      'Mystic Deluxe Box',
    descripcion:
      'Una experiencia premium con productos especialmente seleccionados para sorprenderte.',
    precio:
      25000,
    icono:
      'gift-outline',
    imagen:
      'assets/img/Gamer-Box-deluxe.png',
    etiqueta:
      'Selección Mystic'
  };

  productosDestacados: ProductoHome[] = [
    {
      nombre:
        'Anime Box Otaku',
      descripcion:
        'Artículos y sorpresas para amantes del anime.',
      precio:
        16000,
      icono:
        'cube-outline'
    },
    {
      nombre:
        'Self Care Box Relax',
      descripcion:
        'Bienestar, relajación y cuidado personal.',
      precio:
        17500,
      icono:
        'sparkles-outline'
    },
    {
      nombre:
        'Kids Fun Box',
      descripcion:
        'Juguetes, creatividad y diversión para niños.',
      precio:
        14500,
      icono:
        'gift-outline'
    }
  ];

  constructor(
    private carritoService: CarritoService,
    private pedidoService: PedidoService,
    private authService: AuthService,
    private router: Router
  ) {
    addIcons({
      cartOutline,
      searchOutline,
      giftOutline,
      cubeOutline,
      bagHandleOutline,
      addOutline,
      homeOutline,
      gridOutline,
      receiptOutline,
      locationOutline,
      personOutline,
      flameOutline,
      starOutline,
      ticketOutline,
      timeOutline,
      arrowForwardOutline,
      checkmarkCircleOutline,
      sparklesOutline,
      pricetagOutline,
      logOutOutline
    });
  }

  ngOnInit(): void {
    this.cargarPantalla();
  }

  ionViewWillEnter(): void {
    this.cargarPantalla();
  }

  private cargarPantalla(): void {
    this.usuario =
      this.authService.obtenerUsuario();

    this.obtenerCarritosDelUsuario();

    this.actualizarCantidadProductos();

    this.cargarUltimoPedidoReal();
  }

  obtenerCarritosDelUsuario(): void {
    const idUsuario =
      this.usuario?.idUsuario;

    if (!idUsuario) {
      this.cantidadCarritos = 0;
      return;
    }

    this.carritoService
      .obtenerCarritos()
      .subscribe({
        next: carritos => {
          this.cantidadCarritos =
            (carritos ?? [])
              .filter(
                (carrito: any) =>
                  Number(
                    carrito.idUsuario
                  ) === idUsuario &&
                  String(
                    carrito.estado ?? ''
                  ).toLowerCase() ===
                  'activo'
              )
              .length;
        },

        error: error => {
          this.cantidadCarritos = 0;

          console.error(
            'Error al consultar carritos:',
            error
          );
        }
      });
  }

  cargarUltimoPedidoReal(): void {
    const idUsuario =
      this.usuario?.idUsuario;

    if (!idUsuario) {
      this.ultimoPedido = null;
      return;
    }

    this.pedidoService
      .obtenerPedidos()
      .subscribe({
        next: pedidos => {
          const pedidosPropios =
            (pedidos ?? [])
              .filter(
                pedido =>
                  Number(
                    pedido.idUsuario
                  ) === idUsuario
              )
              .sort(
                (
                  pedidoA,
                  pedidoB
                ) =>
                  pedidoB.idPedido -
                  pedidoA.idPedido
              );

          const pedidoMasReciente =
            pedidosPropios[0];

          if (!pedidoMasReciente) {
            this.ultimoPedido =
              null;

            localStorage.removeItem(
              'ultimoPedido'
            );

            sessionStorage.removeItem(
              'ultimoPedido'
            );

            return;
          }

          this.ultimoPedido = {
            idPedido:
              pedidoMasReciente.idPedido,

            numeroPedido:
              pedidoMasReciente
                .numeroPedido ??
              this.obtenerNumeroPedido(
                pedidoMasReciente
                  .idPedido
              ),

            estadoPedido:
              pedidoMasReciente
                .estadoPedido ??
              'Pendiente',

            total:
              Number(
                pedidoMasReciente
                  .total ??
                0
              ),

            fechaEstimadaEntrega:
              pedidoMasReciente
                .fechaEstimadaEntrega ??
              undefined
          };
        },

        error: error => {
          this.ultimoPedido = null;

          console.error(
            'Error al consultar pedidos:',
            error
          );
        }
      });
  }

  actualizarCantidadProductos(): void {
    try {
      const productos =
        JSON.parse(
          sessionStorage.getItem(
            'productosCarrito'
          ) ?? '[]'
        );

      this.cantidadProductosCarrito =
        productos.reduce(
          (
            total: number,
            producto: any
          ) =>
            total +
            Number(
              producto.cantidad ?? 0
            ),
          0
        );
    } catch {
      this.cantidadProductosCarrito = 0;

      sessionStorage.removeItem(
        'productosCarrito'
      );
    }
  }

  obtenerNumeroPedido(
    idPedido: number
  ): string {
    return `MB-${idPedido
      .toString()
      .padStart(6, '0')}`;
  }

  buscar(): void {
    const valor =
      this.textoBusqueda.trim();

    if (!valor) {
      return;
    }

    sessionStorage.setItem(
      'busquedaMysticBox',
      valor
    );

    sessionStorage.removeItem(
      'categoriaSeleccionada'
    );

    this.router.navigate([
      '/mysticbox'
    ]);
  }

  irAlCarrito(): void {
    this.router.navigate([
      '/carrito'
    ]);
  }

  irAlCatalogo(): void {
    sessionStorage.removeItem(
      'categoriaSeleccionada'
    );

    sessionStorage.removeItem(
      'busquedaMysticBox'
    );

    this.router.navigate([
      '/mysticbox'
    ]);
  }

  irAEntregas(): void {
    this.router.navigate([
      '/entregas'
    ]);
  }

  irACalificaciones(): void {
    this.router.navigate([
      '/calificaciones'
    ]);
  }

  cerrarSesion(): void {
    this.authService.cerrarSesion();

    this.router.navigate(
      ['/login'],
      {
        replaceUrl: true
      }
    );
  }

  abrirProducto(
    producto: ProductoHome
  ): void {
    sessionStorage.setItem(
      'productoSeleccionado',
      JSON.stringify(producto)
    );

    this.router.navigate([
      '/mysticbox'
    ]);
  }

  agregarAlCarrito(
    producto: ProductoHome,
    evento?: MouseEvent
  ): void {
    evento?.stopPropagation();

    let productosGuardados: any[] = [];

    try {
      productosGuardados =
        JSON.parse(
          sessionStorage.getItem(
            'productosCarrito'
          ) ?? '[]'
        );
    } catch {
      productosGuardados = [];
    }

    const productoExistente =
      productosGuardados.find(
        productoGuardado =>
          productoGuardado.nombre ===
          producto.nombre
      );

    if (productoExistente) {
      productoExistente.cantidad =
        Number(
          productoExistente.cantidad ??
          0
        ) + 1;
    } else {
      productosGuardados.push({
        nombre:
          producto.nombre,

        descripcion:
          producto.descripcion,

        precio:
          producto.precio,

        cantidad:
          1,

        imagen:
          producto.imagen ??
          null
      });
    }

    sessionStorage.setItem(
      'productosCarrito',
      JSON.stringify(
        productosGuardados
      )
    );

    this.actualizarCantidadProductos();
  }

  manejarErrorImagen(
    evento: Event
  ): void {
    const imagen =
      evento.target as
      HTMLImageElement;

    imagen.style.display =
      'none';
  }
}