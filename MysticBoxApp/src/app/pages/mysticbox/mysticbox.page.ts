import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonContent } from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router';



import { Mysticbox } from '../../services/mysticbox';

@Component({
  selector: 'app-mysticbox',
  templateUrl: './mysticbox.page.html',
  styleUrls: ['./mysticbox.page.scss'],
  standalone: true,
  imports: [
    IonContent,

    CommonModule

  ]
})
export class MysticboxPage implements OnInit {

  cajas: any[] = [];

  idCategoria: number = 0;
  cargando: boolean = true;
  mensajeError: string = '';

  constructor(
    private mysticboxService: Mysticbox,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.idCategoria = Number(params['idCategoria']);
      this.cargarCajas();
    });

  }

  cargarCajas(): void {
    this.cargando = true;
    this.mensajeError = '';

    this.mysticboxService.obtenerCajas().subscribe({
      next: (data: any[]) => {

        console.log('Todas las cajas recibidas:', data);
        console.log('Categoría seleccionada:', this.idCategoria);

        this.cajas = data.filter((caja: any) =>
          Number(caja.idCategoria) === Number(this.idCategoria) &&
          caja.estado === true
        );

        console.log('Cajas filtradas:', this.cajas);

        this.cargando = false;
      },
   
      error: (error) => {
        console.error('Error al obtener las cajas:', error);


        this.mensajeError = 'No se pudieron cargar las cajas.';
        this.cargando = false;
      }
    });
  }


  obtenerImagen(imagen: string): string {
    if (!imagen) {
      return 'assets/img/Mystic-Box-Categorias.png';
    }

    if (imagen.startsWith('assets/')) {
      return imagen;
    }

    return 'assets/img/' + imagen;
  }

  seleccionarCaja(caja: any): void {
    console.log('Caja seleccionada:', caja);
  }

  irACategorias(): void {
    window.location.href = '/categorias';
  }

  irAHome(): void {
    window.location.href = '/home';
  }

}