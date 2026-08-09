import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
import { informationCircleOutline } from 'ionicons/icons';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router';

import { Mysticbox } from '../../services/mysticbox';

@Component({
  selector: 'app-mysticbox',
  templateUrl: './mysticbox.page.html',
  styleUrls: ['./mysticbox.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonIcon,
    CommonModule
  ]
})
export class MysticboxPage implements OnInit {

  cajas: any[] = [];

  idCategoria: number = 0;

  cargando: boolean = true;

  mensajeError: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private mysticboxService: Mysticbox
  ) {
    addIcons({
      informationCircleOutline
    });
  }

  ngOnInit(): void {

    this.route.queryParams.subscribe(params => {

      this.idCategoria =
        Number(params['idCategoria']) || 0;

      console.log(
        'ID de categoría recibido:',
        this.idCategoria
      );

      this.cargarCajas();

    });

  }

  cargarCajas(): void {

    this.cargando = true;
    this.mensajeError = '';

    this.mysticboxService
      .obtenerCajas()
      .subscribe({

        next: (data: any[]) => {

          console.log(
            'Todas las cajas recibidas:',
            data
          );

          console.log(
            'Categoría seleccionada:',
            this.idCategoria
          );

          if (!this.idCategoria) {

            this.cajas = data.filter(
              (caja: any) =>
                this.cajaEstaActiva(caja)
            );

          } else {

            this.cajas = data.filter(
              (caja: any) =>
                Number(caja.idCategoria) ===
                this.idCategoria &&
                this.cajaEstaActiva(caja)
            );

          }

          console.log(
            'Cajas filtradas:',
            this.cajas
          );

          this.cargando = false;

        },

        error: (error) => {

          console.error(
            'Error al obtener las cajas:',
            error
          );

          this.mensajeError =
            'No se pudieron cargar las cajas.';

          this.cargando = false;

        }

      });

  }

  cajaEstaActiva(caja: any): boolean {

    return (
      caja.estado === true ||
      caja.estado === 'true' ||
      caja.estado === 1 ||
      caja.estado === '1' ||
      String(caja.estado).toLowerCase() ===
      'activo'
    );

  }

  obtenerImagen(imagen: string): string {

  if (!imagen) {
    return '';
  }

  if (imagen.startsWith('assets/')) {
    return imagen;
  }

  return 'assets/img/' + imagen;
}
  seleccionarCaja(caja: any): void {

    console.log(
      'Caja seleccionada:',
      caja
    );

  }

  irACategorias(): void {

    this.router.navigate([
      '/categorias'
    ]);

  }

  irAHome(): void {

    this.router.navigate([
      '/home'
    ]);

  }

personalizarCaja(caja: any): void {

  console.log('========== CAJA ==========');
  console.log(caja);
  console.log('==========================');

  console.log('PROPIEDADES:');
  console.log(Object.keys(caja));

  console.log('IMAGEN:', caja.imagen);
  console.log('IMAGEN CAJA:', caja.imagenCaja);
  console.log('NOMBRE IMAGEN:', caja.nombreImagen);
  console.log('RUTA IMAGEN:', caja.rutaImagen);

  let imagen = '';

  imagen =
    caja.imagen ||
    caja.imagenCaja ||
    caja.nombreImagen ||
    caja.rutaImagen ||
    '';

  /*
   * Si la caja no trae imagen desde el backend,
   * buscamos la imagen según el nombre de la caja.
   */

  if (!imagen) {

    const nombre =
      String(caja.nombreCaja || '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');

    if (
      nombre.includes('gamer') &&
      nombre.includes('deluxe')
    ) {

      imagen = 'Gamer-Box-deluxe.png';

    }

    else if (
      nombre.includes('gamer') &&
      nombre.includes('premium')
    ) {

      imagen = 'Gamer-Box-Premium.png';

    }

    else if (
      nombre.includes('gamer') &&
      nombre.includes('basica')
    ) {

      imagen = 'Gamer-Box-Basica.png';

    }

  }

  console.log('IMAGEN FINAL:', imagen);

  this.router.navigate(
    ['/personalizacion'],
    {
      queryParams: {

        idCaja:
          caja.idCaja,

        idCategoria:
          caja.idCategoria ||
          this.idCategoria,

        nombreCaja:
          caja.nombreCaja,

        nombreCategoria:
          caja.nombreCategoria || '',

        precio:
          caja.precio,

        imagen:
          imagen

      }
    }
  );

}
}