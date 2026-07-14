import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router, RouterLink } from '@angular/router';

import { CarritoService } from '../../services/carrito.service';
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

  productosCarrito = [
    {
      nombre: 'Mystic Deluxe Box',
      descripcion: 'Caja premium con productos seleccionados.',
      precio: 15000,
      cantidad: 1
    },
    {
      nombre: 'Office Boost Box',
      descripcion: 'Ideal para regalos empresariales.',
      precio: 12500,
      cantidad: 1
    }
  ];

  constructor(
    private carritoService: CarritoService,
    private cuponService: CuponService,
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
    this.carritoService.obtenerCarritos().subscribe({
      next: (respuesta) => {
        this.carritos = respuesta;
        this.cargando = false;

        console.log(
          'Carritos desde backend:',
          respuesta
        );
      },
      error: (error) => {
        console.error(
          'Error al obtener carritos:',
          error
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

  continuarCompra(): void {
    if (this.productosCarrito.length === 0) {
      return;
    }

    const datosCompra = {
      productos: this.productosCarrito,
      subtotal: this.calcularSubtotal(),
      descuento: this.calcularDescuento(),
      totalFinal: this.calcularTotal(),
      cupon: this.cuponAplicado
    };

    sessionStorage.setItem(
      'datosCompra',
      JSON.stringify(datosCompra)
    );

    console.log(
      'Datos enviados al proceso de compra:',
      datosCompra
    );

    this.router.navigate(['/proceso-compra']);
  }
}