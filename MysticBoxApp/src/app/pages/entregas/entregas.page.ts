import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { IonicModule } from '@ionic/angular';

import { addIcons } from 'ionicons';
import {
  alertCircleOutline,
  archiveOutline,
  arrowBackOutline,
  calendarOutline,
  carOutline,
  checkmarkCircleOutline,
  constructOutline,
  cubeOutline,
  homeOutline,
  locationOutline,
  mapOutline,
  receiptOutline,
  refreshOutline,
  timeOutline
} from 'ionicons/icons';

import {
  CrearEntregaRequest,
  Entrega,
  EntregaService
} from '../../services/entrega.service';

import {
  PedidoService
} from '../../services/pedido.service';

import {
  AuthService
} from '../../services/auth.service';

interface UltimoPedido {
  idPedido: number;
  numeroPedido: string;
  fechaPedido: string;
  fechaEstimadaEntrega: string;
  estadoPedido: string;
  total: number;
  direccionEntrega: string;
}

interface EstadoSeguimiento {
  nombre: string;
  descripcion: string;
  icono: string;
  completado: boolean;
  actual: boolean;
}

@Component({
  selector: 'app-entregas',
  templateUrl: './entregas.page.html',
  styleUrls: ['./entregas.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterLink
  ]
})
export class EntregasPage implements OnInit {

  entregas: Entrega[] = [];

  entregaSeleccionada: Entrega | null = null;

  ultimoPedido: UltimoPedido | null = null;

  estadosSeguimiento: EstadoSeguimiento[] = [];

  mapaUrl: SafeResourceUrl | null = null;

  cargando = true;

  creandoSeguimiento = false;

  mensajeError = '';

  constructor(
    private entregaService: EntregaService,
    private pedidoService: PedidoService,
    private authService: AuthService,
    private sanitizer: DomSanitizer,
    private router: Router
  ) {
    addIcons({
      arrowBackOutline,
      locationOutline,
      cubeOutline,
      checkmarkCircleOutline,
      timeOutline,
      constructOutline,
      archiveOutline,
      carOutline,
      homeOutline,
      calendarOutline,
      receiptOutline,
      mapOutline,
      alertCircleOutline,
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

    const usuario =
      this.authService.obtenerUsuario();

    if (!usuario) {
      this.router.navigate(['/login']);
      return;
    }

    this.pedidoService
      .obtenerPedidos()
      .subscribe({
        next: pedidos => {
          const pedidosPropios =
            (pedidos ?? [])
              .filter(
                pedido =>
                  Number(pedido.idUsuario) ===
                  usuario.idUsuario
              )
              .sort(
                (pedidoA, pedidoB) =>
                  pedidoB.idPedido -
                  pedidoA.idPedido
              );

          const pedidoMasReciente =
            pedidosPropios[0];

          if (!pedidoMasReciente) {
            this.ultimoPedido = null;
            this.entregaSeleccionada = null;
            this.cargando = false;

            this.mensajeError =
              'Todavía no tienes pedidos para dar seguimiento.';

            return;
          }

          this.ultimoPedido = {
            idPedido:
              pedidoMasReciente.idPedido,

            numeroPedido:
              pedidoMasReciente.numeroPedido ??
              `MB-${pedidoMasReciente.idPedido
                .toString()
                .padStart(6, '0')}`,

            fechaPedido:
              pedidoMasReciente.fechaPedido ??
              '',

            fechaEstimadaEntrega:
              pedidoMasReciente
                .fechaEstimadaEntrega ??
              this.sumarDias(
                pedidoMasReciente.fechaPedido,
                5
              ),

            estadoPedido:
              pedidoMasReciente.estadoPedido ??
              'Pendiente',

            total:
              Number(
                pedidoMasReciente.total ?? 0
              ),

            direccionEntrega:
              usuario.direccion?.trim() ??
              ''
          };

          this.obtenerEntregas();
        },

        error: error => {
          this.cargando = false;

          this.mensajeError =
            'No fue posible consultar tus pedidos.';

          console.error(error);
        }
      });
  }

  obtenerEntregas(): void {
    this.entregaService
      .obtenerEntregas()
      .subscribe({
        next: respuesta => {
          this.entregas =
            respuesta ?? [];

          this.buscarEntrega();
        },

        error: error => {
          this.cargando = false;

          this.mensajeError =
            'No fue posible consultar las entregas.';

          console.error(error);
        }
      });
  }

  buscarEntrega(): void {
    if (!this.ultimoPedido) {
      this.cargando = false;
      return;
    }

    const entregaEncontrada =
      this.entregas.find(
        entrega =>
          Number(entrega.idPedido) ===
          this.ultimoPedido!.idPedido
      );

    if (entregaEncontrada) {
      this.seleccionarEntrega(
        entregaEncontrada
      );

      this.cargando = false;
      return;
    }

    this.crearSeguimientoAutomatico();
  }

  crearSeguimientoAutomatico(): void {
    if (
      !this.ultimoPedido ||
      this.creandoSeguimiento
    ) {
      return;
    }

    if (
      !this.ultimoPedido
        .direccionEntrega
    ) {
      this.cargando = false;

      this.mensajeError =
        'Agrega una dirección en tu perfil para crear el seguimiento.';

      return;
    }

    const nuevaEntrega:
      CrearEntregaRequest = {
        idEntrega: 0,

        idPedido:
          this.ultimoPedido.idPedido,

        direccionEntrega:
          this.ultimoPedido
            .direccionEntrega,

        estadoEntrega:
          'Pendiente',

        fechaEstimada:
          this.convertirFechaDateOnly(
            this.ultimoPedido
              .fechaEstimadaEntrega
          ),

        fechaEntrega:
          null,

        ubicacionReferencia:
          'Ubicación aproximada según la dirección proporcionada por el cliente.'
      };

    this.creandoSeguimiento = true;

    this.entregaService
      .crearEntrega(nuevaEntrega)
      .subscribe({
        next: respuesta => {
          this.creandoSeguimiento =
            false;

          this.cargando =
            false;

          this.entregas = [
            ...this.entregas,
            respuesta
          ];

          this.seleccionarEntrega(
            respuesta
          );
        },

        error: error => {
          this.creandoSeguimiento =
            false;

          this.cargando =
            false;

          this.mensajeError =
            error.error?.mensaje ??
            'No fue posible crear el seguimiento del pedido.';

          console.error(error);
        }
      });
  }

  sumarDias(
    fecha: string | null,
    dias: number
  ): string {
    const fechaCalculada =
      fecha
        ? new Date(fecha)
        : new Date();

    fechaCalculada.setDate(
      fechaCalculada.getDate() +
      dias
    );

    return fechaCalculada
      .toISOString();
  }

  convertirFechaDateOnly(
    fecha: string | null | undefined
  ): string | null {
    if (!fecha) {
      return null;
    }

    const fechaConvertida =
      new Date(fecha);

    if (
      Number.isNaN(
        fechaConvertida.getTime()
      )
    ) {
      return null;
    }

    const anio =
      fechaConvertida.getFullYear();

    const mes =
      String(
        fechaConvertida.getMonth() + 1
      ).padStart(2, '0');

    const dia =
      String(
        fechaConvertida.getDate()
      ).padStart(2, '0');

    return `${anio}-${mes}-${dia}`;
  }

  seleccionarEntrega(
    entrega: Entrega
  ): void {
    this.entregaSeleccionada =
      entrega;

    this.construirSeguimiento();

    this.generarMapa();
  }

  construirSeguimiento(): void {
    const estadoActual =
      this.normalizarEstado(
        this.entregaSeleccionada
          ?.estadoEntrega ??
        'Pendiente'
      );

    const estadosBase = [
      {
        nombre: 'Pendiente',
        descripcion:
          'El pedido fue registrado y está pendiente de preparación.',
        icono: 'time-outline'
      },
      {
        nombre: 'Preparando',
        descripcion:
          'Estamos seleccionando los productos de tu Mystic Box.',
        icono:
          'construct-outline'
      },
      {
        nombre: 'Empacando',
        descripcion:
          'Tu caja está siendo empacada cuidadosamente.',
        icono:
          'archive-outline'
      },
      {
        nombre: 'En camino',
        descripcion:
          'El pedido salió y se encuentra en ruta.',
        icono:
          'car-outline'
      },
      {
        nombre: 'Entregado',
        descripcion:
          'El pedido fue entregado correctamente.',
        icono:
          'checkmark-circle-outline'
      }
    ];

    const indiceActual =
      estadosBase.findIndex(
        estado =>
          this.normalizarEstado(
            estado.nombre
          ) === estadoActual
      );

    this.estadosSeguimiento =
      estadosBase.map(
        (estado, indice) => ({
          nombre:
            estado.nombre,

          descripcion:
            estado.descripcion,

          icono:
            estado.icono,

          completado:
            indice <= indiceActual,

          actual:
            indice === indiceActual
        })
      );
  }

  normalizarEstado(
    estado: string
  ): string {
    return estado
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(
        /[\u0300-\u036f]/g,
        ''
      );
  }

  generarMapa(): void {
    const direccion =
      this.entregaSeleccionada
        ?.direccionEntrega
        ?.trim();

    if (!direccion) {
      this.mapaUrl = null;
      return;
    }

    const url =
      `https://www.google.com/maps?q=${
        encodeURIComponent(direccion)
      }&output=embed`;

    this.mapaUrl =
      this.sanitizer
        .bypassSecurityTrustResourceUrl(
          url
        );
  }

  obtenerNumeroPedido(): string {
    if (
      this.ultimoPedido
        ?.numeroPedido
    ) {
      return this.ultimoPedido
        .numeroPedido;
    }

    const idPedido =
      this.entregaSeleccionada
        ?.idPedido ??
      0;

    return `MB-${idPedido
      .toString()
      .padStart(6, '0')}`;
  }

  obtenerEstadoActual(): string {
    return (
      this.entregaSeleccionada
        ?.estadoEntrega ??
      'Pendiente'
    );
  }

  estaEntregado(): boolean {
    return (
      this.normalizarEstado(
        this.obtenerEstadoActual()
      ) === 'entregado'
    );
  }

  actualizarSeguimiento(): void {
    this.cargarDatos();
  }

  volverAlInicio(): void {
    this.router.navigate(['/home']);
  }

  irAPedidos(): void {
    this.router.navigate(['/pedidos']);
  }
}