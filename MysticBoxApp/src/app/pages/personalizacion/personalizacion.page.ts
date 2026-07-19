import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CarritoService } from 'src/app/services/carrito.service';

import {
  IonButton,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonTextarea,
  IonTitle,
  IonToolbar,
  LoadingController,
  ToastController
} from '@ionic/angular/standalone';

import {
  Personalizacion,
  PersonalizacionService
} from '../../services/personalizacion';

@Component({
  selector: 'app-personalizacion',
  templateUrl: './personalizacion.page.html',
  styleUrls: ['./personalizacion.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonItem,
    IonLabel,
    IonTextarea,
    IonButton
  ]
})
export class PersonalizacionPage implements OnInit {

  idCaja = 0;
  idUsuario = 0;
  idCategoria = 0;
  precioCaja = 0;

  nombreCaja = 'Mystic Box';
  nombreCategoria = 'Categoría seleccionada';
  tamanoCaja = '';

  preferencias = '';
  exclusiones = '';
  mensajePersonalizado = '';

  guardando = false;
  mensajeError = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private personalizacionService: PersonalizacionService,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private carritoService: CarritoService
  ) {}

  ngOnInit(): void {
    this.obtenerCajaSeleccionada();
    this.obtenerUsuario();
  }

  private obtenerCajaSeleccionada(): void {
    this.route.queryParamMap.subscribe(params => {
      this.idCaja = Number(params.get('idCaja')) || 0;
      
      this.idCategoria =
  Number(params.get('idCategoria')) || 0;

   this.precioCaja = Number(params.get('precio')) || 0;

      this.nombreCaja =
        params.get('nombreCaja') || 'Mystic Box';

      this.nombreCategoria =
        params.get('nombreCategoria') ||
        'Categoría seleccionada';

      this.tamanoCaja =
        params.get('tamanoCaja') ||
        this.obtenerNivelDesdeNombre(this.nombreCaja);

       
    });
  }

  private obtenerNivelDesdeNombre(nombreCaja: string): string {
    const nombre = nombreCaja.toLowerCase();

    if (nombre.includes('premium')) {
      return 'Premium';
    }

    if (nombre.includes('deluxe')) {
      return 'Deluxe';
    }

    if (nombre.includes('básica') || nombre.includes('basica')) {
      return 'Básica';
    }

    return '';
  }

  private obtenerUsuario(): void {
    const idGuardado = localStorage.getItem('idUsuario');

    if (idGuardado) {
      this.idUsuario = Number(idGuardado);
      return;
    }

    const usuarioGuardado = localStorage.getItem('usuario');

    if (!usuarioGuardado) {
      return;
    }

    try {
      const usuario = JSON.parse(usuarioGuardado);

      this.idUsuario = Number(
        usuario.idUsuario ??
        usuario.IdUsuario ??
        usuario.id
      ) || 0;
    } catch (error) {
      console.error(
        'No se pudo leer el usuario guardado:',
        error
      );
    }
  }

  async guardarPersonalizacion(): Promise<void> {
    this.mensajeError = '';

    if (this.idCaja <= 0) {
      this.mensajeError =
        'No se encontró la caja seleccionada.';
      return;
    }

    if (this.idUsuario <= 0) {
      this.mensajeError =
        'Debes iniciar sesión antes de personalizar la caja.';
      return;
    }

    if (!this.tamanoCaja) {
      this.mensajeError =
        'No se pudo identificar el nivel de la caja.';
      return;
    }

    const personalizacion: Personalizacion = {
      idPersonalizacion: 0,
      idUsuario: this.idUsuario,
      idCaja: this.idCaja,
      tamanoCaja: this.tamanoCaja,
      preferencias: this.preferencias.trim(),
      exclusiones: this.exclusiones.trim(),
      mensajePersonalizado:
        this.mensajePersonalizado.trim(),
      fechaPersonalizacion: null
    };

    const loading = await this.loadingController.create({
      message: 'Guardando personalización...'
    });

    await loading.present();
    this.guardando = true;

    this.personalizacionService
      .crearPersonalizacion(personalizacion)
      .subscribe({
        next: async respuesta => {
        const idPersonalizacion =
        respuesta.personalizacion.idPersonalizacion;

     this.carritoService.obtenerCarritos().subscribe({

  next: carritos => {

    const listaCarritos = Array.isArray(carritos)
      ? carritos
      : [];

    const carritoActivo = listaCarritos.find(
      (carrito: any) =>
        Number(carrito.idUsuario) === Number(this.idUsuario) &&
        String(carrito.estado).toLowerCase() === 'activo'
    );

    if (carritoActivo) {

      this.agregarDetalleAlCarrito(
        carritoActivo.idCarrito,
        idPersonalizacion,
        loading
      );

      return;
    }

    const nuevoCarrito = {
      idCarrito: 0,
      idUsuario: this.idUsuario,
      fechaCreacion: null,
      estado: 'Activo'
    };

    this.carritoService
      .crearCarrito(nuevoCarrito)
      .subscribe({

        next: carritoCreado => {

          this.agregarDetalleAlCarrito(
            carritoCreado.idCarrito,
            idPersonalizacion,
            loading
          );
        },

        error: async errorCarrito => {

          this.guardando = false;
          await loading.dismiss();

          console.error(
            'Error al crear el carrito:',
            errorCarrito
          );

          this.mensajeError =
            errorCarrito?.error?.mensaje ||
            'La personalización se guardó, pero no se pudo crear el carrito.';
        }
      });
  },

  error: async errorConsulta => {

    this.guardando = false;
    await loading.dismiss();

    console.error(
      'Error al consultar los carritos:',
      errorConsulta
    );

    this.mensajeError =
      'No se pudo revisar si el usuario ya tiene un carrito activo.';
  }
});
    },
        error: async error => {
          this.guardando = false;
          await loading.dismiss();

          console.error(
            'Error al guardar la personalización:',
            error
          );

          this.mensajeError =
            error?.error?.mensaje ||
            'No fue posible guardar la personalización.';
        }
      });
  }

volverAlCatalogo(): void {
  this.router.navigate(['/mysticbox'], {
    queryParams: {
      idCategoria: this.idCategoria
    }
  });

}

private agregarDetalleAlCarrito(
  idCarrito: number,
  idPersonalizacion: number,
  loading: HTMLIonLoadingElement
): void {

  const detalleCarrito = {
    idDetalleCarrito: 0,
    idCarrito: idCarrito,
    idCaja: this.idCaja,
    idPersonalizacion: idPersonalizacion,
    cantidad: 1,
    precioUnitario: this.precioCaja,
    subtotal: this.precioCaja
  };

  this.carritoService
    .crearDetalleCarrito(detalleCarrito)
    .subscribe({

      next: async () => {

        this.guardando = false;
        await loading.dismiss();

        localStorage.setItem(
          'idPersonalizacionActual',
          idPersonalizacion.toString()
        );

        localStorage.setItem(
          'idCarritoActual',
          idCarrito.toString()
        );

        const toast =
          await this.toastController.create({
            message:
              'La caja personalizada se agregó al carrito.',
            duration: 2500,
            position: 'bottom'
          });

        await toast.present();

        this.router.navigate(['/carrito']);
      },

      error: async errorDetalle => {

        this.guardando = false;
        await loading.dismiss();

        console.error(
          'Error al agregar la caja al carrito:',
          errorDetalle
        );

        this.mensajeError =
          errorDetalle?.error?.mensaje ||
          'La personalización se guardó, pero no se pudo agregar la caja al carrito.';
      }
    });
}

}
