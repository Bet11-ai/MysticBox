import { Component, OnInit } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent } from '@ionic/angular/standalone';
import { CategoriasService } from '../../services/categorias.service';


@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.page.html',
  styleUrls: ['./categorias.page.scss'],
  standalone: true,
  imports: [
  IonContent,
  CommonModule,
  FormsModule,
    NgFor

  ]
})
export class CategoriasPage implements OnInit {

  categorias: any[] = [];
  categoriasFiltradas: any[] = [];
  textoBusqueda: string = '';

  constructor(private categoriasService: CategoriasService) { }

  ngOnInit(): void {
    this.categoriasService.obtenerCategorias().subscribe({
      next: (data: any[]) => {
        console.log('Categorías desde API:', data);

        this.categorias = data.map((categoria: any) => ({
          ...categoria,
          imagen: this.obtenerImagenCategoria(categoria.nombreCategoria)
        }));

        this.categoriasFiltradas = [...this.categorias];
      },
      error: (error) => {
        console.error('Error al obtener categorías:', error);
      }
    });

  }

  obtenerImagenCategoria(nombre: string): string {
    switch (nombre) {
      case 'Gamer Box':
      case 'GamerBox':
        return 'assets/img/Gamer-Box.png';

      case 'Beauty Box':
      case 'BeautyBox':
        return 'assets/img/Beauty-Box.png';

      case 'Self Care Box':
      case 'SelfCareBox':
        return 'assets/img/Self-Care-Box.png';

      case 'Office Boost Box':
      case 'OfficeBoostBox':
        return 'assets/img/Office-Boost-Box.png';

      case 'Kids Fun Box':
      case 'KidsFunBox':
      case 'Kids Fin Box':
        return 'assets/img/Kids-Fun-Box.png';

      case 'Anime Box':
      case 'AnimeBox':
        return 'assets/img/Anime-Box.png';

      default:
        return 'assets/img/Mystic-Box-Categorias.png';
    }
  }

  mostrarNombreCategoria(nombre: string): string {
    switch (nombre) {
      case 'GamerBox':
        return 'Gamer Box';

      case 'BeautyBox':
        return 'Beauty Box';

      case 'SelfCareBox':
        return 'Self Care Box';

      case 'OfficeBoostBox':
        return 'Office Boost Box';

      case 'KidsFunBox':
      case 'Kids Fin Box':
        return 'Kids Fun Box';

      case 'AnimeBox':
        return 'Anime Box';

      default:
        return nombre;
    }
  }

  obtenerIconoCategoria(nombre: string): string {
    switch (nombre) {
      case 'Gamer Box':
      case 'GamerBox':
        return '🎮';

      case 'Beauty Box':
      case 'BeautyBox':
        return '✨';

      case 'Self Care Box':
      case 'SelfCareBox':
        return '🌿';

      case 'Office Boost Box':
      case 'OfficeBoostBox':
        return '💼';

      case 'Kids Fun Box':
      case 'KidsFunBox':
      case 'Kids Fin Box':
        return '🧸';

      case 'Anime Box':
      case 'AnimeBox':
        return '⭐';

      default:
        return '📦';
    }
  }

  filtrarCategorias(): void {
    const texto = this.textoBusqueda.trim().toLowerCase();

    if (texto === '') {
      this.categoriasFiltradas = [...this.categorias];
      return;
    }

    this.categoriasFiltradas = this.categorias.filter((categoria: any) => {
      const nombre = this.mostrarNombreCategoria(categoria.nombreCategoria).toLowerCase();
      const descripcion = categoria.descripcion?.toLowerCase() || '';

      return nombre.includes(texto) || descripcion.includes(texto);
    });
  }

 seleccionarCategoria(categoria: any): void {
  window.location.href = `/mysticbox?idCategoria=${categoria.idCategoria}`;
}


irAHome(): void {
  window.location.href = '/home';
}


}