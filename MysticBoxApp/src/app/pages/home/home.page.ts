import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router, RouterLink } from '@angular/router';

import { CarritoService } from '../../services/carrito.service';

import { addIcons } from 'ionicons';
import {
  cartOutline,
  searchOutline,
  giftOutline,
  gameControllerOutline,
  sparklesOutline,
  colorPaletteOutline,
  heartOutline,
  briefcaseOutline,
  rocketOutline,
  cubeOutline,
  bagHandleOutline,
  addOutline,
  homeOutline,
  gridOutline,
  receiptOutline,
    locationOutline,
  personOutline
} from 'ionicons/icons';

interface CategoriaHome {
  nombre: string;
  descripcion: string;
  icono: string;
  imagen: string;
}

interface ProductoHome {
  nombre: string;
  descripcion: string;
  precio: number;
  icono: string;
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

  cantidadCarritos = 0;
  cantidadProductosCarrito = 0;
  textoBusqueda = '';

  categorias: CategoriaHome[] = [
    {
      nombre: 'Gamer Box',
      descripcion: 'Caja sorpresa con accesorios y artículos gamer.',
      icono: 'game-controller-outline',
      imagen: 'assets/img/Gamer-Box.png'
    },
    {
      nombre: 'Beauty Box',
      descripcion: 'Caja sorpresa con productos de belleza.',
      icono: 'sparkles-outline',
      imagen: 'assets/img/Beauty-Box.png'
    },
    {
      nombre: 'Anime Box',
      descripcion: 'Caja sorpresa con artículos de anime.',
      icono: 'color-palette-outline',
      imagen: 'assets/img/Anime-Box.png'
    },
    {
      nombre: 'Self Care Box',
      descripcion: 'Productos para relajación, bienestar y cuidado personal.',
      icono: 'heart-outline',
      imagen: 'assets/img/Self-Care-Box.png'
    },
    {
      nombre: 'Office Boost Box',
      descripcion: 'Artículos útiles para oficina, estudio y productividad.',
      icono: 'briefcase-outline',
      imagen: 'assets/img/Office-Boost-Box.png'
    },
    {
      nombre: 'Kids Fun Box',
      descripcion: 'Juguetes, creatividad y diversión para niños.',
      icono: 'rocket-outline',
      imagen: 'assets/img/Kids-Fun-Box.png'
    }
  ];

  productosDestacados: ProductoHome[] = [
    {
      nombre: 'Mystic Deluxe Box',
      descripcion: 'Caja premium con productos seleccionados.',
      precio: 15000,
      icono: 'cube-outline'
    },
    {
      nombre: 'Office Boost Box',
      descripcion: 'Ideal para regalos empresariales.',
      precio: 12500,
      icono: 'bag-handle-outline'
    }
  ];

  constructor(
    private carritoService: CarritoService,
    private router: Router
  ) {
    addIcons({
      cartOutline,
      searchOutline,
      giftOutline,
      gameControllerOutline,
      sparklesOutline,
      colorPaletteOutline,
      heartOutline,
      briefcaseOutline,
      rocketOutline,
      cubeOutline,
      bagHandleOutline,
      addOutline,
      homeOutline,
      gridOutline,
      receiptOutline,
      locationOutline,
      personOutline
    });
  }

  ngOnInit(): void {
    this.obtenerCarritos();
    this.actualizarCantidadProductos();
  }

  ionViewWillEnter(): void {
    this.actualizarCantidadProductos();
  }

  obtenerCarritos(): void {
    this.carritoService.obtenerCarritos().subscribe({
      next: (respuesta: any[]) => {
        this.cantidadCarritos = respuesta.length;

        console.log(
          'Carritos obtenidos desde el backend:',
          respuesta
        );
      },
      error: (error) => {
        this.cantidadCarritos = 0;

        console.error(
          'Error al consultar los carritos:',
          error
        );
      }
    });
  }

  actualizarCantidadProductos(): void {
    const productosGuardados = JSON.parse(
      sessionStorage.getItem('productosCarrito') ?? '[]'
    );

    this.cantidadProductosCarrito = productosGuardados.reduce(
      (total: number, producto: any) =>
        total + Number(producto.cantidad ?? 0),
      0
    );
  }

  irAlCarrito(): void {
    this.router.navigate(['/carrito']);
  }

  irACategorias(): void {
    this.router.navigate(['/categorias']);
  }

  irAlCatalogo(): void {
    sessionStorage.removeItem('categoriaSeleccionada');
    sessionStorage.removeItem('busquedaMysticBox');

    this.router.navigate(['/mysticbox']);
  }

  seleccionarCategoria(categoria: CategoriaHome): void {
    sessionStorage.setItem(
      'categoriaSeleccionada',
      categoria.nombre
    );

    sessionStorage.removeItem('busquedaMysticBox');

    this.router.navigate(['/mysticbox']);
  }

  abrirProducto(producto: ProductoHome): void {
    sessionStorage.setItem(
      'productoSeleccionado',
      JSON.stringify(producto)
    );

    this.router.navigate(['/mysticbox']);
  }

  agregarAlCarrito(
    producto: ProductoHome,
    evento: MouseEvent
  ): void {
    evento.stopPropagation();

    const productosGuardados = JSON.parse(
      sessionStorage.getItem('productosCarrito') ?? '[]'
    );

    const productoExistente = productosGuardados.find(
      (item: any) => item.nombre === producto.nombre
    );

    if (productoExistente) {
      productoExistente.cantidad =
        Number(productoExistente.cantidad ?? 0) + 1;
    } else {
      productosGuardados.push({
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        precio: producto.precio,
        cantidad: 1
      });
    }

    sessionStorage.setItem(
      'productosCarrito',
      JSON.stringify(productosGuardados)
    );

    this.actualizarCantidadProductos();

    this.router.navigate(['/carrito']);
  }

  buscar(): void {
    const valor = this.textoBusqueda.trim();

    if (!valor) {
      return;
    }

    sessionStorage.setItem(
      'busquedaMysticBox',
      valor
    );

    sessionStorage.removeItem('categoriaSeleccionada');

    this.router.navigate(['/mysticbox']);
  }
}