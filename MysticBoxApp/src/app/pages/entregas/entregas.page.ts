import {
  Component,
  OnInit
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  IonicModule
} from '@ionic/angular';

import {
  Router,
  RouterLink
} from '@angular/router';

import {
  DomSanitizer,
  SafeResourceUrl
} from '@angular/platform-browser';

import {
  CrearEntregaRequest,
  Entrega,
  EntregaService
} from '../../services/entrega.service';

import { addIcons } from 'ionicons';

import {
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
} from 'ionicons/icons';

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
    this.cargarUltimoPedido();
    this.obtenerEntregas();
  }

  ionViewWillEnter(): void {
    this.cargarUltimoPedido();
    this.obtenerEntregas();
  }

  cargarUltimoPedido(): void {
    const pedidoGuardado =
    
  sessionStorage.getItem('ultimoPedido') ??
  localStorage.getItem('ultimoPedido');

    if (!pedidoGuardado) {
      this.ultimoPedido = null;
      return;
    }

    try {
      this.ultimoPedido = JSON.parse(
        pedidoGuardado
      );
    } catch (error) {
      console.error(
        'No fue posible leer el último pedido:',
        error
      );

      this.ultimoPedido = null;
    }
  }

  obtenerEntregas(): void {
    this.cargando = true;
    this.mensajeError = '';

    this.entregaService
      .obtenerEntregas()
      .subscribe({
        next: (respuesta) => {
          this.entregas = respuesta ?? [];

          this.buscarEntregaDelUltimoPedido();
        },
        error: (error) => {
          this.cargando = false;

          this.mensajeError =
            'No fue posible consultar las entregas.';

          console.error(
            'Error al obtener entregas:',
            error
          );
        }
      });
  }

  buscarEntregaDelUltimoPedido(): void {
    if (
      this.ultimoPedido &&
      this.ultimoPedido.idPedido
    ) {
      const entregaEncontrada =
        this.entregas.find(
          entrega =>
            entrega.idPedido ===
            this.ultimoPedido?.idPedido
        );

      if (entregaEncontrada) {
        this.seleccionarEntrega(
          entregaEncontrada
        );

        this.cargando = false;
        return;
      }

      this.crearSeguimientoAutomatico();
      return;
    }

    if (this.entregas.length > 0) {
      const entregasOrdenadas = [
        ...this.entregas
      ].sort(
        (a, b) =>
          b.idEntrega - a.idEntrega
      );

      this.seleccionarEntrega(
        entregasOrdenadas[0]
      );
    }

    this.cargando = false;
  }

  crearSeguimientoAutomatico(): void {
    if (
      !this.ultimoPedido ||
      this.creandoSeguimiento
    ) {
      this.cargando = false;
      return;
    }

    const direccion =
      this.ultimoPedido.direccionEntrega
        ?.trim();

    if (!direccion) {
      this.mensajeError =
        'El último pedido no contiene una dirección de entrega.';

      this.cargando = false;
      return;
    }

    const entregaNueva:
      CrearEntregaRequest = {
        idEntrega: 0,
        idPedido:
          this.ultimoPedido.idPedido,
        direccionEntrega: direccion,
        estadoEntrega: 'Pendiente',
        fechaEstimada:
          this.convertirFechaDateOnly(
            this.ultimoPedido
              .fechaEstimadaEntrega
          ),
        fechaEntrega: null,
        ubicacionReferencia:
          'Ubicación aproximada según la dirección proporcionada por el cliente.'
      };

    this.creandoSeguimiento = true;

    this.entregaService
      .crearEntrega(entregaNueva)
      .subscribe({
        next: (respuesta) => {
          this.creandoSeguimiento = false;
          this.cargando = false;

          this.entregas = [
            ...this.entregas,
            respuesta
          ];

          this.seleccionarEntrega(
            respuesta
          );

          console.log(
            'Seguimiento creado:',
            respuesta
          );
        },
        error: (error) => {
          this.creandoSeguimiento = false;
          this.cargando = false;

          this.mensajeError =
            error.error?.mensaje ??
            'El pedido existe, pero no fue posible crear su seguimiento.';

          console.error(
            'Error al crear seguimiento:',
            error
          );
        }
      });
  }

  convertirFechaDateOnly(
    fecha: string | null | undefined
  ): string | null {

    if (!fecha) {
      return null;
    }

    const fechaConvertida = new Date(fecha);

    if (
      Number.isNaN(
        fechaConvertida.getTime()
      )
    ) {
      return null;
    }

    const anio =
      fechaConvertida.getFullYear();

    const mes = String(
      fechaConvertida.getMonth() + 1
    ).padStart(2, '0');

    const dia = String(
      fechaConvertida.getDate()
    ).padStart(2, '0');

    return `${anio}-${mes}-${dia}`;
  }

  seleccionarEntrega(
    entrega: Entrega
  ): void {

    this.entregaSeleccionada = entrega;

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
        icono: 'construct-outline'
      },
      {
        nombre: 'Empacando',
        descripcion:
          'Tu caja está siendo empacada cuidadosamente.',
        icono: 'archive-outline'
      },
      {
        nombre: 'En camino',
        descripcion:
          'El pedido salió y se encuentra en ruta.',
        icono: 'car-outline'
      },
      {
        nombre: 'Entregado',
        descripcion:
          'El pedido fue entregado correctamente.',
        icono: 'checkmark-circle-outline'
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
          ...estado,
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

    const direccionCodificada =
      encodeURIComponent(direccion);

    const url =
      `https://www.google.com/maps?q=${direccionCodificada}&output=embed`;

    this.mapaUrl =
      this.sanitizer
        .bypassSecurityTrustResourceUrl(
          url
        );
  }

  obtenerNumeroPedido(): string {
    if (
      this.ultimoPedido &&
      this.entregaSeleccionada &&
      this.ultimoPedido.idPedido ===
        this.entregaSeleccionada.idPedido
    ) {
      return this.ultimoPedido
        .numeroPedido;
    }

    const idPedido =
      this.entregaSeleccionada
        ?.idPedido ?? 0;

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
    this.obtenerEntregas();
  }

  volverAlInicio(): void {
    this.router.navigate(['/home']);
  }

  irAPedidos(): void {
    this.router.navigate(['/pedidos']);
  }
}