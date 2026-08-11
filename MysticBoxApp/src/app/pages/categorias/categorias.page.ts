import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  arrowBackOutline,
  arrowForwardOutline,
  gridOutline,
  searchOutline,
  sparklesOutline
} from 'ionicons/icons';

import { CategoriasService } from '../../services/categorias.service';

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.page.html',
  styleUrls: ['./categorias.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class CategoriasPage implements OnInit {
  categorias: any[] = [];
  categoriasFiltradas: any[] = [];
  textoBusqueda = '';
  cargando = true;

  constructor(
    private categoriasService: CategoriasService,
    private router: Router
  ) {
    addIcons({
      arrowBackOutline,
      arrowForwardOutline,
      gridOutline,
      searchOutline,
      sparklesOutline
    });
  }

  ngOnInit(): void {
    this.cargarCategorias();
  }

  private cargarCategorias(): void {
    this.cargando = true;

    this.categoriasService.obtenerCategorias().subscribe({
      next: (data: any[]) => {
        this.categorias = (data ?? []).map((categoria: any) => ({
          ...categoria,
          imagen: this.obtenerImagenCategoria(categoria.nombreCategoria)
        }));

        this.categoriasFiltradas = [...this.categorias];
        this.cargando = false;
      },
      error: error => {
        console.error('Error al obtener categorías:', error);
        this.categorias = [];
        this.categoriasFiltradas = [];
        this.cargando = false;
      }
    });
  }

  obtenerImagenCategoria(nombre: string): string {
    const normalizado = this.normalizarNombre(nombre);

    if (normalizado.includes('gamer')) return 'assets/img/Gamer-Box.png';
    if (normalizado.includes('beauty')) return 'assets/img/Beauty-Box.png';
    if (normalizado.includes('self care')) return 'assets/img/Self-Care-Box.png';
    if (normalizado.includes('office boost')) return 'assets/img/Office-Boost-Box.png';
    if (normalizado.includes('kids fun') || normalizado.includes('kids fin')) return 'assets/img/Kids-Fun-Box.png';
    if (normalizado.includes('anime')) return 'assets/img/Anime-Box.png';

    return 'assets/img/Mystic-Box-Categorias.png';
  }

  mostrarNombreCategoria(nombre: string): string {
    const normalizado = this.normalizarNombre(nombre);

    if (normalizado === 'gamerbox' || normalizado === 'gamer box') return 'Gamer Box';
    if (normalizado === 'beautybox' || normalizado === 'beauty box') return 'Beauty Box';
    if (normalizado === 'selfcarebox' || normalizado === 'self care box') return 'Self Care Box';
    if (normalizado === 'officeboostbox' || normalizado === 'office boost box') return 'Office Boost Box';
    if (normalizado === 'kidsfunbox' || normalizado === 'kids fun box' || normalizado === 'kids fin box') return 'Kids Fun Box';
    if (normalizado === 'animebox' || normalizado === 'anime box') return 'Anime Box';

    return nombre;
  }

  filtrarCategorias(): void {
    const texto = this.normalizarNombre(this.textoBusqueda);

    if (!texto) {
      this.categoriasFiltradas = [...this.categorias];
      return;
    }

    this.categoriasFiltradas = this.categorias.filter((categoria: any) => {
      const nombre = this.normalizarNombre(this.mostrarNombreCategoria(categoria.nombreCategoria));
      const descripcion = this.normalizarNombre(categoria.descripcion ?? '');
      return nombre.includes(texto) || descripcion.includes(texto);
    });
  }

  seleccionarCategoria(categoria: any): void {
    this.router.navigate(['/mysticbox'], {
      queryParams: { idCategoria: categoria.idCategoria }
    });
  }

  irAHome(): void {
    this.router.navigate(['/home']);
  }

  private normalizarNombre(valor: string): string {
    return String(valor ?? '')
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }
}
