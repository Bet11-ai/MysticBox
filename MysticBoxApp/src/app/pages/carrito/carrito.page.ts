import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterLink } from '@angular/router';

import { CarritoService } from '../../services/carrito.service';

import { addIcons } from 'ionicons';
import {
  arrowBackOutline,
  cartOutline,
  trashOutline,
  addOutline,
  removeOutline,
  bagCheckOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.page.html',
  styleUrls: ['./carrito.page.scss'],
  standalone: true,
 imports: [CommonModule, IonicModule, RouterLink]
})
export class CarritoPage implements OnInit {

  carritos: any[] = [];
  cargando = true;

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

  constructor(private carritoService: CarritoService) {
    addIcons({
      arrowBackOutline,
      cartOutline,
      trashOutline,
      addOutline,
      removeOutline,
      bagCheckOutline
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
        console.log('Carritos desde backend:', respuesta);
      },
      error: (error) => {
        console.error('Error al obtener carritos:', error);
        this.cargando = false;
      }
    });
  }

  aumentarCantidad(producto: any): void {
    producto.cantidad++;
  }

  disminuirCantidad(producto: any): void {
    if (producto.cantidad > 1) {
      producto.cantidad--;
    }
  }

  eliminarProducto(index: number): void {
    this.productosCarrito.splice(index, 1);
  }

  calcularSubtotal(): number {
    return this.productosCarrito.reduce(
      (total, producto) => total + producto.precio * producto.cantidad,
      0
    );
  }

  calcularTotal(): number {
    return this.calcularSubtotal();
  }
}