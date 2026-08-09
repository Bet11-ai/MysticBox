import {
  CommonModule
} from '@angular/common';

import {
  Component,
  OnInit
} from '@angular/core';

import {
  FormsModule
} from '@angular/forms';

import {
  Router
} from '@angular/router';

import {
  IonicModule,
  ToastController
} from '@ionic/angular';

import {
  addIcons
} from 'ionicons';

import {
  alertCircleOutline,
  arrowBackOutline,
  callOutline,
  checkmarkCircleOutline,
  closeOutline,
  createOutline,
  locationOutline,
  mailOutline,
  peopleOutline,
  personOutline,
  refreshOutline,
  saveOutline,
  searchOutline,
  shieldCheckmarkOutline,
  timeOutline
} from 'ionicons/icons';

import {
  Cliente,
  UsuarioService
} from '../../services/usuario.service';

type FiltroEstado =
  'todos' |
  'activos' |
  'inactivos';

@Component({
  selector: 'app-admin-clientes',
  templateUrl:
    './admin-clientes.page.html',
  styleUrls: [
    './admin-clientes.page.scss'
  ],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ]
})
export class AdminClientesPage
  implements OnInit {

  clientes: Cliente[] = [];

  clientesFiltrados:
    Cliente[] = [];

  clienteSeleccionado:
    Cliente | null = null;

  textoBusqueda = '';

  filtroEstado:
    FiltroEstado = 'todos';

  cargando = true;

  guardando = false;

  mostrarModalDetalle = false;

  mostrarModalEdicion = false;

  formularioEdicion = {
    nombre: '',
    correo: '',
    telefono: '',
    direccion: ''
  };

  constructor(
    private usuarioService:
      UsuarioService,

    private toastController:
      ToastController,

    private router:
      Router
  ) {
    addIcons({
      alertCircleOutline,
      arrowBackOutline,
      callOutline,
      checkmarkCircleOutline,
      closeOutline,
      createOutline,
      locationOutline,
      mailOutline,
      peopleOutline,
      personOutline,
      refreshOutline,
      saveOutline,
      searchOutline,
      shieldCheckmarkOutline,
      timeOutline
    });
  }

  ngOnInit(): void {
    this.cargarClientes();
  }

  ionViewWillEnter(): void {
    this.cargarClientes();
  }

  cargarClientes(): void {
    this.cargando = true;

    this.usuarioService
      .obtenerClientes()
      .subscribe({
        next: clientes => {
          this.clientes =
            clientes ?? [];

          this.aplicarFiltros();

          this.cargando = false;
        },

        error: error => {
          this.cargando = false;

          console.error(
            'Error al consultar clientes:',
            error
          );

          this.mostrarMensaje(
            'No fue posible consultar los clientes.',
            'danger'
          );
        }
      });
  }

  aplicarFiltros(): void {
    const busqueda =
      this.normalizarTexto(
        this.textoBusqueda
      );

    this.clientesFiltrados =
      this.clientes.filter(
        cliente => {

          const coincideBusqueda =
            !busqueda ||
            this.normalizarTexto(
              cliente.nombre
            ).includes(busqueda) ||
            this.normalizarTexto(
              cliente.correo
            ).includes(busqueda) ||
            this.normalizarTexto(
              cliente.telefono ?? ''
            ).includes(busqueda);

          let coincideEstado =
            true;

          if (
            this.filtroEstado ===
            'activos'
          ) {
            coincideEstado =
              cliente.estado === true;
          }

          if (
            this.filtroEstado ===
            'inactivos'
          ) {
            coincideEstado =
              cliente.estado === false;
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
    this.filtroEstado = filtro;
    this.aplicarFiltros();
  }

  limpiarBusqueda(): void {
    this.textoBusqueda = '';
    this.aplicarFiltros();
  }

  abrirDetalle(
    cliente: Cliente
  ): void {
    this.clienteSeleccionado =
      cliente;

    this.mostrarModalDetalle =
      true;
  }

  cerrarDetalle(): void {
    this.mostrarModalDetalle =
      false;

    this.clienteSeleccionado =
      null;
  }

  abrirEdicion(
    cliente: Cliente
  ): void {
    this.clienteSeleccionado =
      cliente;

    this.formularioEdicion = {
      nombre:
        cliente.nombre,

      correo:
        cliente.correo,

      telefono:
        cliente.telefono ?? '',

      direccion:
        cliente.direccion ?? ''
    };

    this.mostrarModalEdicion =
      true;
  }

  cerrarEdicion(): void {
    this.mostrarModalEdicion =
      false;

    this.clienteSeleccionado =
      null;
  }

  guardarCambios(): void {
    if (
      !this.clienteSeleccionado
    ) {
      return;
    }

    if (
      !this.formularioEdicion
        .nombre.trim() ||
      !this.formularioEdicion
        .correo.trim()
    ) {
      this.mostrarMensaje(
        'Nombre y correo son obligatorios.',
        'warning'
      );

      return;
    }

    this.guardando = true;

    this.usuarioService
      .actualizarCliente(
        this.clienteSeleccionado
          .idUsuario,

        {
          nombre:
            this.formularioEdicion
              .nombre
              .trim(),

          correo:
            this.formularioEdicion
              .correo
              .trim()
              .toLowerCase(),

          telefono:
            this.formularioEdicion
              .telefono
              .trim() ||
            null,

          direccion:
            this.formularioEdicion
              .direccion
              .trim() ||
            null
        }
      )
      .subscribe({
        next: respuesta => {
          this.guardando = false;

          this.cerrarEdicion();

          this.mostrarMensaje(
            respuesta.mensaje,
            'success'
          );

          this.cargarClientes();
        },

        error: error => {
          this.guardando = false;

          const mensaje =
            error.error?.mensaje ??
            'No fue posible actualizar el cliente.';

          this.mostrarMensaje(
            mensaje,
            'danger'
          );
        }
      });
  }

  cambiarEstado(
    cliente: Cliente
  ): void {
    const nuevoEstado =
      !cliente.estado;

    this.usuarioService
      .cambiarEstadoCliente(
        cliente.idUsuario,
        nuevoEstado
      )
      .subscribe({
        next: respuesta => {
          cliente.estado =
            nuevoEstado;

          this.aplicarFiltros();

          this.mostrarMensaje(
            respuesta.mensaje,
            'success'
          );
        },

        error: error => {
          const mensaje =
            error.error?.mensaje ??
            'No fue posible cambiar el estado del cliente.';

          this.mostrarMensaje(
            mensaje,
            'danger'
          );
        }
      });
  }

  obtenerTotalClientes():
    number {

    return this.clientes.length;
  }

  obtenerTotalActivos():
    number {

    return this.clientes
      .filter(
        cliente =>
          cliente.estado
      )
      .length;
  }

  obtenerTotalInactivos():
    number {

    return this.clientes
      .filter(
        cliente =>
          !cliente.estado
      )
      .length;
  }

  obtenerIniciales(
    nombre: string
  ): string {

    const partes =
      nombre
        .trim()
        .split(/\s+/)
        .filter(Boolean);

    if (
      partes.length === 0
    ) {
      return '?';
    }

    if (
      partes.length === 1
    ) {
      return partes[0]
        .substring(0, 2)
        .toUpperCase();
    }

    return (
      partes[0][0] +
      partes[1][0]
    ).toUpperCase();
  }

  obtenerFecha(
    fecha:
      string |
      null
  ): string {

    if (!fecha) {
      return 'Sin fecha';
    }

    const fechaConvertida =
      new Date(fecha);

    if (
      Number.isNaN(
        fechaConvertida.getTime()
      )
    ) {
      return 'Sin fecha';
    }

    return fechaConvertida
      .toLocaleDateString(
        'es-CR',
        {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        }
      );
  }

  volverAlPanel(): void {
    this.router.navigate([
      '/admin'
    ]);
  }

  private normalizarTexto(
    texto: string
  ): string {

    return texto
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(
        /[\u0300-\u036f]/g,
        ''
      );
  }

  private async mostrarMensaje(
    mensaje: string,

    color:
      'success' |
      'warning' |
      'danger'
  ): Promise<void> {

    const toast =
      await this.toastController
        .create({
          message: mensaje,
          duration: 2600,
          position: 'top',
          color
        });

    await toast.present();
  }
}