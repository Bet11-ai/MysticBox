import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';

import { Mysticbox } from '../../services/mysticbox';
import { CategoriasService } from '../../services/categorias.service';

import { addIcons } from 'ionicons';

import {
  arrowBackOutline,
  cubeOutline,
  addOutline,
  createOutline,
  trashOutline,
  searchOutline,
  closeOutline,
  saveOutline,
  alertCircleOutline,
  checkmarkCircleOutline,
  imageOutline,
  pricetagOutline,
  archiveOutline,
  refreshOutline
} from 'ionicons/icons';

interface Categoria {
  idCategoria: number;
  nombreCategoria: string;
  activo?: boolean;
}

interface Caja {
  idCaja: number;
  idCategoria: number;
  nombreCaja: string;
  descripcion: string | null;
  precio: number;
  imagen: string | null;
  stock: number;
  estado: boolean | null;
}

interface CajaFormulario {
  idCategoria: number | null;
  nombreCaja: string;
  descripcion: string;
  precio: number | null;
  imagen: string;
  stock: number | null;
  estado: boolean;
}

@Component({
  selector: 'app-admin-cajas',
  templateUrl: './admin-cajas.page.html',
  styleUrls: ['./admin-cajas.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ]
})
export class AdminCajasPage implements OnInit {

  cajas: Caja[] = [];
  cajasFiltradas: Caja[] = [];
  categorias: Categoria[] = [];

  textoBusqueda = '';

  cargando = true;
  guardando = false;

  mostrarFormulario = false;
  modoEdicion = false;

  idCajaEditando: number | null = null;

  mensajeError = '';
  mensajeExito = '';

  formulario: CajaFormulario =
    this.crearFormularioVacio();

  constructor(
    private mysticboxService: Mysticbox,
    private categoriasService: CategoriasService,
    private router: Router
  ) {
    addIcons({
      arrowBackOutline,
      cubeOutline,
      addOutline,
      createOutline,
      trashOutline,
      searchOutline,
      closeOutline,
      saveOutline,
      alertCircleOutline,
      checkmarkCircleOutline,
      imageOutline,
      pricetagOutline,
      archiveOutline,
      refreshOutline
    });
  }

  ngOnInit(): void {
    this.cargarDatos();
  }

  ionViewWillEnter(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.cargando = true;
    this.mensajeError = '';

    this.cargarCategorias();
    this.cargarCajas();
  }

  cargarCajas(): void {
    this.mysticboxService.obtenerCajas().subscribe({
      next: (respuesta: any[]) => {
        this.cajas = (respuesta ?? []).map(
          (caja: any) => ({
            idCaja: Number(
              caja.idCaja ??
              caja.IdCaja ??
              0
            ),
            idCategoria: Number(
              caja.idCategoria ??
              caja.IdCategoria ??
              0
            ),
            nombreCaja:
              caja.nombreCaja ??
              caja.NombreCaja ??
              '',
            descripcion:
              caja.descripcion ??
              caja.Descripcion ??
              null,
            precio: Number(
              caja.precio ??
              caja.Precio ??
              0
            ),
            imagen:
              caja.imagen ??
              caja.Imagen ??
              null,
            stock: Number(
              caja.stock ??
              caja.Stock ??
              0
            ),
            estado:
              caja.estado ??
              caja.Estado ??
              false
          })
        );

        this.aplicarFiltro();
        this.cargando = false;

        console.log(
          'Cajas obtenidas:',
          respuesta
        );
      },
      error: (error) => {
        this.cargando = false;

        this.mensajeError =
          error.error?.mensaje ??
          'No fue posible consultar las cajas.';

        console.error(
          'Error al obtener cajas:',
          error
        );
      }
    });
  }

  cargarCategorias(): void {
    this.categoriasService
      .obtenerCategorias()
      .subscribe({
        next: (respuesta: any[]) => {
          this.categorias =
            (respuesta ?? []).map(
              (categoria: any) => ({
                idCategoria: Number(
                  categoria.idCategoria ??
                  categoria.IdCategoria ??
                  0
                ),
                nombreCategoria:
                  categoria.nombreCategoria ??
                  categoria.NombreCategoria ??
                  categoria.nombre ??
                  '',
                activo:
                  categoria.activo ??
                  categoria.Activo ??
                  true
              })
            );

          console.log(
            'Categorías obtenidas:',
            respuesta
          );
        },
        error: (error) => {
          console.error(
            'Error al obtener categorías:',
            error
          );
        }
      });
  }

  crearFormularioVacio(): CajaFormulario {
    return {
      idCategoria: null,
      nombreCaja: '',
      descripcion: '',
      precio: null,
      imagen: '',
      stock: null,
      estado: true
    };
  }

  abrirFormularioNuevaCaja(): void {
    this.modoEdicion = false;
    this.idCajaEditando = null;
    this.formulario =
      this.crearFormularioVacio();

    this.mensajeError = '';
    this.mensajeExito = '';
    this.mostrarFormulario = true;
  }

  abrirFormularioEditar(
    caja: Caja
  ): void {
    this.modoEdicion = true;
    this.idCajaEditando = caja.idCaja;

    this.formulario = {
      idCategoria: caja.idCategoria,
      nombreCaja: caja.nombreCaja,
      descripcion:
        caja.descripcion ?? '',
      precio: Number(caja.precio),
      imagen:
        caja.imagen ?? '',
      stock: Number(caja.stock),
      estado:
        caja.estado ?? false
    };

    this.mensajeError = '';
    this.mensajeExito = '';
    this.mostrarFormulario = true;
  }

  cerrarFormulario(): void {
    if (this.guardando) {
      return;
    }

    this.mostrarFormulario = false;
    this.modoEdicion = false;
    this.idCajaEditando = null;
    this.formulario =
      this.crearFormularioVacio();
  }

  validarFormulario(): boolean {
    if (
      !this.formulario.idCategoria ||
      this.formulario.idCategoria <= 0
    ) {
      this.mensajeError =
        'Debe seleccionar una categoría.';

      return false;
    }

    if (
      !this.formulario.nombreCaja.trim()
    ) {
      this.mensajeError =
        'El nombre de la caja es obligatorio.';

      return false;
    }

    if (
      this.formulario.precio === null ||
      Number(this.formulario.precio) <= 0
    ) {
      this.mensajeError =
        'El precio debe ser mayor que cero.';

      return false;
    }

    if (
      this.formulario.stock === null ||
      Number(this.formulario.stock) < 0
    ) {
      this.mensajeError =
        'El stock no puede ser negativo.';

      return false;
    }

    return true;
  }

  guardarCaja(): void {
    this.mensajeError = '';
    this.mensajeExito = '';

    if (!this.validarFormulario()) {
      return;
    }

    const caja = {
      idCaja:
        this.idCajaEditando ?? 0,
      idCategoria:
        Number(
          this.formulario.idCategoria
        ),
      nombreCaja:
        this.formulario.nombreCaja.trim(),
      descripcion:
        this.formulario.descripcion.trim() ||
        null,
      precio:
        Number(this.formulario.precio),
      imagen:
        this.formulario.imagen.trim() ||
        null,
      stock:
        Number(this.formulario.stock),
      estado:
        this.formulario.estado
    };

    this.guardando = true;

    if (
      this.modoEdicion &&
      this.idCajaEditando !== null
    ) {
      this.actualizarCaja(
        this.idCajaEditando,
        caja
      );

      return;
    }

    this.crearCaja(caja);
  }

  crearCaja(caja: any): void {
    this.mysticboxService
      .crearCaja(caja)
      .subscribe({
        next: (respuesta) => {
          this.guardando = false;
          this.mostrarFormulario = false;

          this.mensajeExito =
            'Caja creada correctamente.';

          this.formulario =
            this.crearFormularioVacio();

          this.cargarCajas();

          console.log(
            'Caja creada:',
            respuesta
          );
        },
        error: (error) => {
          this.guardando = false;

          this.mensajeError =
            error.error?.mensaje ??
            error.error?.title ??
            'No fue posible crear la caja.';

          console.error(
            'Error al crear caja:',
            error
          );
        }
      });
  }

  actualizarCaja(
    idCaja: number,
    caja: any
  ): void {
    this.mysticboxService
      .actualizarCaja(
        idCaja,
        caja
      )
      .subscribe({
        next: (respuesta) => {
          this.guardando = false;
          this.mostrarFormulario = false;

          this.mensajeExito =
            'Caja actualizada correctamente.';

          this.formulario =
            this.crearFormularioVacio();

          this.modoEdicion = false;
          this.idCajaEditando = null;

          this.cargarCajas();

          console.log(
            'Caja actualizada:',
            respuesta
          );
        },
        error: (error) => {
          this.guardando = false;

          this.mensajeError =
            error.error?.mensaje ??
            error.error?.title ??
            'No fue posible actualizar la caja.';

          console.error(
            'Error al actualizar caja:',
            error
          );
        }
      });
  }

  eliminarCaja(caja: Caja): void {
    const confirmar = window.confirm(
      `¿Deseas eliminar la caja "${caja.nombreCaja}"?`
    );

    if (!confirmar) {
      return;
    }

    this.mensajeError = '';
    this.mensajeExito = '';

    this.mysticboxService
      .eliminarCaja(caja.idCaja)
      .subscribe({
        next: () => {
          this.mensajeExito =
            'Caja eliminada correctamente.';

          this.cargarCajas();
        },
        error: (error) => {
          this.mensajeError =
            error.error?.mensaje ??
            error.error?.title ??
            'No fue posible eliminar la caja.';

          console.error(
            'Error al eliminar caja:',
            error
          );
        }
      });
  }

  aplicarFiltro(): void {
    const texto =
      this.textoBusqueda
        .trim()
        .toLowerCase();

    if (!texto) {
      this.cajasFiltradas = [
        ...this.cajas
      ];

      return;
    }

    this.cajasFiltradas =
      this.cajas.filter(
        caja =>
          caja.nombreCaja
            .toLowerCase()
            .includes(texto) ||
          (
            caja.descripcion ?? ''
          )
            .toLowerCase()
            .includes(texto) ||
          this.obtenerNombreCategoria(
            caja.idCategoria
          )
            .toLowerCase()
            .includes(texto)
      );
  }

  obtenerNombreCategoria(
    idCategoria: number
  ): string {
    const categoria =
      this.categorias.find(
        item =>
          item.idCategoria ===
          idCategoria
      );

    return (
      categoria?.nombreCategoria ??
      `Categoría ${idCategoria}`
    );
  }

  obtenerImagenCaja(
    caja: Caja
  ): string {
    return (
      caja.imagen?.trim() ||
      'assets/img/logo.png'
    );
  }

  manejarErrorImagen(
    evento: Event
  ): void {
    const imagen =
      evento.target as HTMLImageElement;

    imagen.src =
      'assets/img/logo.png';
  }

  volverAlPanel(): void {
    this.router.navigate(['/admin']);
  }
}