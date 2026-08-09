import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit
} from '@angular/core';

import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { addIcons } from 'ionicons';

import {
  addOutline,
  alertCircleOutline,
  arrowBackOutline,
  checkmarkCircleOutline,
  closeCircleOutline,
  createOutline,
  mailOutline,
  refreshOutline,
  searchOutline,
  shieldCheckmarkOutline,
  trashOutline
} from 'ionicons/icons';

import {
  AuthService,
  UsuarioSesion
} from '../../services/auth.service';

import {
  ActualizarWhiteListRequest,
  CrearWhiteListRequest,
  WhiteList,
  WhiteListService
} from '../../services/whitelist.service';

type FiltroEstado =
  'todos' |
  'activos' |
  'inactivos';

@Component({
  selector: 'app-admin-whitelist',
  templateUrl: './admin-whitelist.page.html',
  styleUrls: [
    './admin-whitelist.page.scss'
  ],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ]
})
export class AdminWhitelistPage
  implements OnInit {

  usuario:
    UsuarioSesion | null = null;

  registros:
    WhiteList[] = [];

  registrosFiltrados:
    WhiteList[] = [];

  cargando = true;

  guardando = false;

  mensajeError = '';

  mensajeExito = '';

  textoBusqueda = '';

  filtroEstado:
    FiltroEstado = 'todos';

  mostrarFormulario = false;

  modoEdicion = false;

  idEditando:
    number | null = null;

  correoFormulario = '';

  activoFormulario = true;

  constructor(
    private whiteListService:
      WhiteListService,

    private authService:
      AuthService,

    private router:
      Router
  ) {

    addIcons({
      addOutline,
      alertCircleOutline,
      arrowBackOutline,
      checkmarkCircleOutline,
      closeCircleOutline,
      createOutline,
      mailOutline,
      refreshOutline,
      searchOutline,
      shieldCheckmarkOutline,
      trashOutline
    });
  }

  ngOnInit(): void {
    this.verificarAdministrador();
  }

  ionViewWillEnter(): void {

    if (
      this.verificarAdministrador()
    ) {
      this.cargarRegistros();
    }
  }

  private verificarAdministrador():
    boolean {

    this.usuario =
      this.authService
        .obtenerUsuario();

    if (!this.usuario) {

      this.router.navigate(
        ['/login'],
        {
          replaceUrl: true
        }
      );

      return false;
    }

    if (
      Number(
        this.usuario.idRol
      ) !== 1
    ) {

      this.router.navigate(
        ['/home'],
        {
          replaceUrl: true
        }
      );

      return false;
    }

    return true;
  }

  cargarRegistros(): void {

    this.cargando = true;

    this.mensajeError = '';

    this.whiteListService
      .obtenerTodos()
      .subscribe({

        next: respuesta => {

          this.registros =
            [...(respuesta ?? [])]
              .sort(
                (a, b) =>
                  b.idWhiteList -
                  a.idWhiteList
              );

          this.aplicarFiltros();

          this.cargando = false;
        },

        error: error => {

          console.error(
            'Error consultando White List:',
            error
          );

          this.registros = [];

          this.registrosFiltrados = [];

          this.cargando = false;

          this.mensajeError =
            'No fue posible consultar la White List.';
        }

      });
  }

  aplicarFiltros(): void {

    const busqueda =
      this.textoBusqueda
        .trim()
        .toLowerCase();

    this.registrosFiltrados =
      this.registros.filter(
        registro => {

          const coincideBusqueda =
            !busqueda ||
            registro.correo
              .toLowerCase()
              .includes(
                busqueda
              );

          let coincideEstado = true;

          if (
            this.filtroEstado ===
            'activos'
          ) {
            coincideEstado =
              registro.activo;
          }

          if (
            this.filtroEstado ===
            'inactivos'
          ) {
            coincideEstado =
              !registro.activo;
          }

          return (
            coincideBusqueda &&
            coincideEstado
          );
        }
      );
  }

  cambiarFiltro(
    filtro: FiltroEstado
  ): void {

    this.filtroEstado =
      filtro;

    this.aplicarFiltros();
  }

  abrirNuevo(): void {

    this.modoEdicion = false;

    this.idEditando = null;

    this.correoFormulario = '';

    this.activoFormulario = true;

    this.mensajeError = '';

    this.mensajeExito = '';

    this.mostrarFormulario = true;
  }

  editar(
    registro: WhiteList
  ): void {

    this.modoEdicion = true;

    this.idEditando =
      registro.idWhiteList;

    this.correoFormulario =
      registro.correo;

    this.activoFormulario =
      registro.activo;

    this.mensajeError = '';

    this.mensajeExito = '';

    this.mostrarFormulario = true;
  }

  cancelarFormulario(): void {

    this.mostrarFormulario = false;

    this.modoEdicion = false;

    this.idEditando = null;

    this.correoFormulario = '';

    this.activoFormulario = true;
  }

  guardar(): void {

    this.mensajeError = '';

    this.mensajeExito = '';

    const correo =
      this.correoFormulario
        .trim()
        .toLowerCase();

    if (!correo) {

      this.mensajeError =
        'Debes ingresar un correo electrónico.';

      return;
    }

    if (
      !this.esCorreoValido(
        correo
      )
    ) {

      this.mensajeError =
        'El correo electrónico no tiene un formato válido.';

      return;
    }

    const duplicado =
      this.registros.some(
        registro =>
          registro.correo
            .trim()
            .toLowerCase() ===
            correo &&
          registro.idWhiteList !==
            this.idEditando
      );

    if (duplicado) {

      this.mensajeError =
        'Ese correo ya se encuentra registrado en la White List.';

      return;
    }

    this.guardando = true;

    if (
      this.modoEdicion &&
      this.idEditando
    ) {

      const registro:
        ActualizarWhiteListRequest = {

        correo,

        activo:
          this.activoFormulario,

        fechaRegistro:
          this.obtenerFechaActual()
      };

      this.whiteListService
        .actualizar(
          this.idEditando,
          registro
        )
        .subscribe({

          next: () => {

            this.guardando = false;

            this.mensajeExito =
              'Registro actualizado correctamente.';

            this.cancelarFormulario();

            this.cargarRegistros();
          },

          error: error => {

            this.guardando = false;

            console.error(
              'Error actualizando White List:',
              error
            );

            this.mensajeError =
              error.error?.mensaje ??
              'No fue posible actualizar el registro.';
          }

        });

      return;
    }

    const nuevoRegistro:
      CrearWhiteListRequest = {

      correo,

      activo:
        this.activoFormulario,

      fechaRegistro:
        this.obtenerFechaActual()
    };

    this.whiteListService
      .crear(
        nuevoRegistro
      )
      .subscribe({

        next: () => {

          this.guardando = false;

          this.mensajeExito =
            'Correo autorizado correctamente.';

          this.cancelarFormulario();

          this.cargarRegistros();
        },

        error: error => {

          this.guardando = false;

          console.error(
            'Error creando White List:',
            error
          );

          this.mensajeError =
            error.error?.mensaje ??
            'No fue posible crear el registro.';
        }

      });
  }

  cambiarEstado(
    registro: WhiteList
  ): void {

    this.mensajeError = '';

    this.mensajeExito = '';

    const actualizacion:
      ActualizarWhiteListRequest = {

      correo:
        registro.correo,

      activo:
        !registro.activo,

      fechaRegistro:
        registro.fechaRegistro
    };

    this.whiteListService
      .actualizar(
        registro.idWhiteList,
        actualizacion
      )
      .subscribe({

        next: () => {

          this.mensajeExito =
            registro.activo
              ? 'Correo desactivado correctamente.'
              : 'Correo activado correctamente.';

          this.cargarRegistros();
        },

        error: error => {

          console.error(
            'Error cambiando estado:',
            error
          );

          this.mensajeError =
            error.error?.mensaje ??
            'No fue posible cambiar el estado.';
        }

      });
  }

  eliminar(
    registro: WhiteList
  ): void {

    const confirmado =
      window.confirm(
        `¿Deseas eliminar ${registro.correo} de la White List?`
      );

    if (!confirmado) {
      return;
    }

    this.mensajeError = '';

    this.mensajeExito = '';

    this.whiteListService
      .eliminar(
        registro.idWhiteList
      )
      .subscribe({

        next: () => {

          this.mensajeExito =
            'Registro eliminado correctamente.';

          this.cargarRegistros();
        },

        error: error => {

          console.error(
            'Error eliminando White List:',
            error
          );

          this.mensajeError =
            error.error?.mensaje ??
            'No fue posible eliminar el registro.';
        }

      });
  }

  obtenerTotalActivos(): number {

    return this.registros
      .filter(
        registro =>
          registro.activo
      )
      .length;
  }

  obtenerTotalInactivos(): number {

    return this.registros
      .filter(
        registro =>
          !registro.activo
      )
      .length;
  }

  formatearFecha(
    fecha:
      string |
      null |
      undefined
  ): string {

    if (!fecha) {
      return 'Sin fecha';
    }

    const valor =
      new Date(fecha);

    if (
      Number.isNaN(
        valor.getTime()
      )
    ) {
      return 'Sin fecha';
    }

    return new Intl.DateTimeFormat(
      'es-CR',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }
    ).format(valor);
  }

  volverAlPanel(): void {

    this.router.navigate([
      '/admin'
    ]);
  }

  trackRegistro(
    index: number,
    registro: WhiteList
  ): number {

    return registro.idWhiteList;
  }

  private obtenerFechaActual():
    string {

    return new Date()
      .toISOString();
  }

  private esCorreoValido(
    correo: string
  ): boolean {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      .test(
        correo
      );
  }
}