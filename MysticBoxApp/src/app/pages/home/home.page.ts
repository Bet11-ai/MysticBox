import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
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
  heartOutline,
  homeOutline,
  locationOutline,
  logOutOutline,
  personOutline,
  pricetagOutline,
  receiptOutline,
  searchOutline,
  shieldCheckmarkOutline,
  sparklesOutline,
  starOutline,
  storefrontOutline
} from 'ionicons/icons';

import { AuthService, UsuarioSesion } from '../../services/auth.service';
import { PedidoService } from '../../services/pedido.service';
import { Mysticbox, MysticBoxModel } from '../../services/mysticbox';

interface ProductoHome {
  idCaja: number;
  nombre: string;
  descripcion: string;
  precio: number;
  precioAnterior?: number;
  descuento?: number;
  imagen?: string;
  etiqueta?: string;
  esOferta?: boolean;
  esRecomendada?: boolean;
  esDestacada?: boolean;
}

interface UltimoPedidoHome {
  idPedido: number;
  numeroPedido: string;
  estadoPedido: string;
  total: number;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class HomePage implements OnInit {
  usuario: UsuarioSesion | null = null;
  textoBusqueda = '';
  cantidadProductosCarrito = 0;
  ultimoPedido: UltimoPedidoHome | null = null;
  cargandoCatalogo = true;

  ofertas: ProductoHome[] = [];
  productoRecomendado: ProductoHome | null = null;
  productosDestacados: ProductoHome[] = [];

  constructor(
    private authService: AuthService,
    private pedidoService: PedidoService,
    private mysticboxService: Mysticbox,
    private router: Router
  ) {
    addIcons({
      addOutline, arrowForwardOutline, bagHandleOutline, cartOutline,
      checkmarkCircleOutline, cubeOutline, flameOutline, giftOutline,
      gridOutline, heartOutline, homeOutline, locationOutline, logOutOutline,
      personOutline, pricetagOutline, receiptOutline, searchOutline,
      shieldCheckmarkOutline, sparklesOutline, starOutline, storefrontOutline
    });
  }

  ngOnInit(): void {
    this.cargarPantalla();
  }

  ionViewWillEnter(): void {
    this.cargarPantalla();
  }

  private cargarPantalla(): void {
    this.usuario = this.authService.obtenerUsuario();
    this.actualizarCantidadProductos();
    this.cargarUltimoPedidoReal();
    this.cargarContenidoComercial();
  }

  private cargarContenidoComercial(): void {
    this.cargandoCatalogo = true;
    this.mysticboxService.obtenerCajas().subscribe({
      next: cajas => {
        const activas = (cajas ?? []).filter(caja => this.cajaActiva(caja));
        const productos = activas.map(caja => this.mapearProducto(caja));

        this.ofertas = productos
          .filter(producto => producto.esOferta && Number(producto.descuento ?? 0) > 0)
          .slice(0, 3);

        this.productoRecomendado = productos.find(producto => producto.esRecomendada)
          ?? productos.find(producto => producto.esDestacada)
          ?? productos[0]
          ?? null;

        this.productosDestacados = productos
          .filter(producto => producto.esDestacada && producto.idCaja !== this.productoRecomendado?.idCaja)
          .slice(0, 4);

        if (this.productosDestacados.length === 0) {
          this.productosDestacados = productos
            .filter(producto => producto.idCaja !== this.productoRecomendado?.idCaja)
            .slice(0, 4);
        }

        this.cargandoCatalogo = false;
      },
      error: () => {
        this.ofertas = [];
        this.productoRecomendado = null;
        this.productosDestacados = [];
        this.cargandoCatalogo = false;
      }
    });
  }

  private mapearProducto(caja: MysticBoxModel): ProductoHome {
    const descuento = caja.esOferta ? Number(caja.porcentajeOferta ?? 0) : 0;
    const precioRegular = Number(caja.precio ?? 0);
    const precioFinal = descuento > 0
      ? Math.round(precioRegular * (1 - descuento / 100))
      : precioRegular;

    return {
      idCaja: caja.idCaja,
      nombre: caja.nombreCaja,
      descripcion: caja.descripcion ?? 'Caja sorpresa Mystic Box.',
      precio: precioFinal,
      precioAnterior: descuento > 0 ? precioRegular : undefined,
      descuento: descuento > 0 ? descuento : undefined,
      imagen: this.obtenerImagen(caja.imagen),
      etiqueta: caja.esRecomendada ? 'Recomendada' : caja.esDestacada ? 'Destacada' : caja.esOferta ? 'Oferta' : undefined,
      esOferta: caja.esOferta,
      esRecomendada: caja.esRecomendada,
      esDestacada: caja.esDestacada
    };
  }

  private cajaActiva(caja: MysticBoxModel): boolean {
    return caja.estado === true || caja.estado === null;
  }

  private obtenerImagen(imagen: string | null): string | undefined {
    if (!imagen) return undefined;
    if (imagen.startsWith('assets/')) return imagen;
    return `assets/img/${imagen}`;
  }

  cargarUltimoPedidoReal(): void {
    const idUsuario = this.usuario?.idUsuario;
    if (!idUsuario) {
      this.ultimoPedido = null;
      return;
    }

    this.pedidoService.obtenerPedidos().subscribe({
      next: pedidos => {
        const pedido = (pedidos ?? [])
          .filter(item => Number(item.idUsuario) === Number(idUsuario))
          .sort((a, b) => b.idPedido - a.idPedido)[0];

        this.ultimoPedido = pedido ? {
          idPedido: pedido.idPedido,
          numeroPedido: pedido.numeroPedido ?? this.obtenerNumeroPedido(pedido.idPedido),
          estadoPedido: pedido.estadoPedido ?? 'Pendiente',
          total: Number(pedido.total ?? 0)
        } : null;
      },
      error: () => this.ultimoPedido = null
    });
  }

  actualizarCantidadProductos(): void {
    try {
      const productos = JSON.parse(sessionStorage.getItem('productosCarrito') ?? '[]');
      this.cantidadProductosCarrito = productos.reduce(
        (total: number, producto: any) => total + Number(producto.cantidad ?? 0), 0
      );
    } catch {
      this.cantidadProductosCarrito = 0;
    }
  }

  obtenerNumeroPedido(idPedido: number): string {
    return `MB-${idPedido.toString().padStart(6, '0')}`;
  }

  buscar(): void {
    const valor = this.textoBusqueda.trim();
    if (!valor) return;
    sessionStorage.setItem('busquedaMysticBox', valor);
    sessionStorage.removeItem('categoriaSeleccionada');
    this.router.navigate(['/mysticbox']);
  }

  abrirProducto(producto: ProductoHome): void {
    sessionStorage.setItem('productoSeleccionado', JSON.stringify(producto));
    this.router.navigate(['/mysticbox']);
  }

  agregarAlCarrito(producto: ProductoHome, evento?: MouseEvent): void {
    evento?.stopPropagation();
    let productos: any[] = [];
    try {
      productos = JSON.parse(sessionStorage.getItem('productosCarrito') ?? '[]');
    } catch {
      productos = [];
    }

    const existente = productos.find(item => Number(item.idCaja) === Number(producto.idCaja));
    if (existente) {
      existente.cantidad = Number(existente.cantidad ?? 0) + 1;
    } else {
      productos.push({
        idCaja: producto.idCaja,
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        precio: producto.precio,
        cantidad: 1,
        imagen: producto.imagen ?? null
      });
    }

    sessionStorage.setItem('productosCarrito', JSON.stringify(productos));
    this.actualizarCantidadProductos();
  }

  irRuta(ruta: string): void { this.router.navigate([ruta]); }
  irAlCatalogo(): void { sessionStorage.removeItem('busquedaMysticBox'); this.router.navigate(['/mysticbox']); }
  irAlCarrito(): void { this.router.navigate(['/carrito']); }
  irAEntregas(): void { this.router.navigate(['/entregas']); }

  cerrarSesion(): void {
    this.authService.cerrarSesion();
    this.router.navigate(['/login'], { replaceUrl: true });
  }
}
