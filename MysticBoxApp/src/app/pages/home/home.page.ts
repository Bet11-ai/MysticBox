import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule, ToastController } from '@ionic/angular';
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
  storefrontOutline,
  logoWhatsapp
} from 'ionicons/icons';

import { AuthService, UsuarioSesion } from '../../services/auth.service';
import { PedidoService } from '../../services/pedido.service';
import { CarritoService } from '../../services/carrito.service';
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
    private carritoService: CarritoService,
    private toastController: ToastController,
    private router: Router
  ) {
    addIcons({
      addOutline, arrowForwardOutline, bagHandleOutline, cartOutline,
      checkmarkCircleOutline, cubeOutline, flameOutline, giftOutline,
      gridOutline, heartOutline, homeOutline, locationOutline, logOutOutline,
      personOutline, pricetagOutline, receiptOutline, searchOutline,
      shieldCheckmarkOutline, sparklesOutline, starOutline, storefrontOutline,
      logoWhatsapp
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
    const idUsuario = this.usuario?.idUsuario;

    if (!idUsuario) {
      this.cantidadProductosCarrito = 0;
      return;
    }

    this.carritoService.obtenerCarritos().subscribe({
      next: carritos => {
        const carritoActivo = (carritos ?? []).find((carrito: any) =>
          Number(carrito.idUsuario) === Number(idUsuario) &&
          String(carrito.estado ?? '').trim().toLowerCase() === 'activo'
        );

        if (!carritoActivo) {
          this.cantidadProductosCarrito = 0;
          return;
        }

        this.carritoService.obtenerDetallesCarrito().subscribe({
          next: detalles => {
            this.cantidadProductosCarrito = (detalles ?? [])
              .filter((detalle: any) =>
                Number(detalle.idCarrito) === Number(carritoActivo.idCarrito)
              )
              .reduce(
                (total: number, detalle: any) =>
                  total + Number(detalle.cantidad ?? 1),
                0
              );
          },
          error: () => this.cantidadProductosCarrito = 0
        });
      },
      error: () => this.cantidadProductosCarrito = 0
    });
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

  async agregarAlCarrito(producto: ProductoHome, evento?: MouseEvent): Promise<void> {
    evento?.stopPropagation();

    const idUsuario = this.usuario?.idUsuario;

    if (!idUsuario) {
      const toast = await this.toastController.create({
        message: 'Debes iniciar sesión para agregar productos al carrito.',
        duration: 2200,
        position: 'bottom'
      });
      await toast.present();
      return;
    }

    this.carritoService.obtenerCarritos().subscribe({
      next: carritos => {
        const carritoActivo = (carritos ?? []).find((carrito: any) =>
          Number(carrito.idUsuario) === Number(idUsuario) &&
          String(carrito.estado ?? '').trim().toLowerCase() === 'activo'
        );

        if (carritoActivo) {
          this.crearDetalleCarrito(carritoActivo.idCarrito, producto);
          return;
        }

        this.carritoService.crearCarrito({
          idCarrito: 0,
          idUsuario,
          fechaCreacion: null,
          estado: 'Activo'
        }).subscribe({
          next: carritoCreado =>
            this.crearDetalleCarrito(carritoCreado.idCarrito, producto),
          error: error => {
            console.error('Error al crear carrito:', error);
            this.mostrarMensajeCarrito('No se pudo crear el carrito.');
          }
        });
      },
      error: error => {
        console.error('Error consultando carritos:', error);
        this.mostrarMensajeCarrito('No se pudo consultar el carrito.');
      }
    });
  }

  private crearDetalleCarrito(idCarrito: number, producto: ProductoHome): void {
    const detalle = {
      idDetalleCarrito: 0,
      idCarrito,
      idCaja: producto.idCaja,
      idPersonalizacion: null,
      cantidad: 1,
      precioUnitario: producto.precio,
      subtotal: producto.precio
    };

    this.carritoService.crearDetalleCarrito(detalle).subscribe({
      next: () => {
        this.actualizarCantidadProductos();
        this.mostrarMensajeCarrito(`${producto.nombre} se agregó al carrito.`);
      },
      error: error => {
        console.error('Error agregando producto al carrito:', error);
        this.mostrarMensajeCarrito('No se pudo agregar el producto al carrito.');
      }
    });
  }

  private async mostrarMensajeCarrito(mensaje: string): Promise<void> {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2200,
      position: 'bottom'
    });
    await toast.present();
  }

  irRuta(ruta: string): void { this.router.navigate([ruta]); }

  irAlCatalogo(tipo?: 'ofertas' | 'recomendadas'): void {
    sessionStorage.removeItem('busquedaMysticBox');
    sessionStorage.removeItem('categoriaSeleccionada');
    this.router.navigate(['/mysticbox'], {
      queryParams: tipo ? { tipo } : {}
    });
  }

  abrirWhatsApp(): void {
    // Reemplazar por el número real de Mystic Box, incluyendo código de país.
    const numeroWhatsApp = '506XXXXXXXX';

    if (numeroWhatsApp.includes('X')) {
      alert('Configura el número real de WhatsApp en home.page.ts.');
      return;
    }

    const mensaje = encodeURIComponent('Hola, necesito ayuda con Mystic Box.');
    window.open(`https://wa.me/${numeroWhatsApp}?text=${mensaje}`, '_blank');
  }

  irAlCarrito(): void { this.router.navigate(['/carrito']); }
  irAEntregas(): void { this.router.navigate(['/entregas']); }

  cerrarSesion(): void {
    this.authService.cerrarSesion();
    this.router.navigate(['/login'], { replaceUrl: true });
  }
}
