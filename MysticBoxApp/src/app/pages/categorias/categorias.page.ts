import { Component, OnInit } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { CategoriasService } from '../../services/categorias.service';

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.page.html',
  styleUrls: ['./categorias.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    NgFor
  ]
})
export class CategoriasPage implements OnInit {

  categorias: any[] = [];

  constructor(private categoriasService: CategoriasService) { }

   ngOnInit(): void {
    this.categoriasService.obtenerCategorias().subscribe({
      next: (data: any) => {
        console.log('Categorías desde API:', data);

        this.categorias = data.map((categoria: any) => {
          return {
            ...categoria,
            imagen: this.obtenerImagenCategoria(categoria.nombreCategoria)
          };
        });
      },
      error: (error) => {
        console.error('Error al obtener categorías:', error);
      }
    });
  }

  obtenerImagenCategoria(nombre: string): string {
    switch (nombre) {
      case 'Gamer Box':
        return 'assets/img/gamer-box.png';

      case 'Beauty Box':
        return 'assets/img/beauty-box.png';

      case 'Anime Box':
        return 'assets/img/anime-box.png';

      case 'Self Care Box':
        return 'assets/img/self-care-box.png';

      case 'Office Boost Box':
        return 'assets/img/office-boost-box.png';

      case 'Kids Fun Box':
        return 'assets/img/kids-fun-box.png';

      case 'Kids Fin Box':
        return 'assets/img/kids-fun-box.png';

      default:
        return 'assets/img/gamer-box.png';
    }
  }
}
