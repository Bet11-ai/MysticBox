import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import {
  Dashboard,
  DashboardPedido,
  DashboardService
} from '../../services/dashboard.service';

import {
  AuthService,
  UsuarioSesion
} from '../../services/auth.service';

import { addIcons } from 'ionicons';

import {
  arrowBackOutline,
  refreshOutline,
  cashOutline,
  receiptOutline,
  peopleOutline,
  cubeOutline,
  ticketOutline,
  trendingUpOutline,
  timeOutline,
  constructOutline,
  archiveOutline,
  carOutline,
  checkmarkCircleOutline,
  closeCircleOutline,
  statsChartOutline,
  personOutline,
  calendarOutline,
  bagHandleOutline,
  logOutOutline,
  alertCircleOutline,
  sparklesOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.page.html',
  styleUrls: ['./admin-dashboard.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule
  ]
})
export class AdminDashboardPage implements OnInit {

  usuario: UsuarioSesion | null = null;

  dashboard: Dashboard | null = null;

  cargando = true;
  mensajeError = '';

  constructor(
    private dashboardService: DashboardService,
    private authService: AuthService,
    private router: Router
  ) {

    addIcons({
      arrowBackOutline,
      refreshOutline,
      cashOutline,
      receiptOutline,
      peopleOutline,
      cubeOutline,
      ticketOutline,
      trendingUpOutline,
      timeOutline,
      constructOutline,
      archiveOutline,
      carOutline,
      checkmarkCircleOutline,
      closeCircleOutline,
      statsChartOutline,
      personOutline,
      calendarOutline,
      bagHandleOutline,
      logOutOutline,
      alertCircleOutline,
      sparklesOutline
    });
  }

  ngOnInit(): void {
    this.inicializar();
  }

  ionViewWillEnter(): void {
    this.inicializar();
  }

  private inicializar(): void {

    this.usuario =
      this.authService.obtenerUsuario();

    if (!this.usuario) {
      this.router.navigate(
        ['/login'],
        { replaceUrl: true }
      );

      return;
    }

    /*
     * Protección visual básica.
     * El administrador corresponde al IdRol 1.
     */
    if (Number(this.usuario.idRol) !== 1) {
      this.router.navigate(
        ['/home'],
        { replaceUrl: true }
      );

      return;
    }

    this.cargarDashboard();
  }

  cargarDashboard(): void {

    this.cargando = true;
    this.mensajeError = '';

    this.dashboardService
      .obtenerDashboard()
      .subscribe({

        next: respuesta => {

          this.dashboard = respuesta;

          this.cargando = false;
        },

        error: error => {

          console.error(
            'Error al cargar dashboard:',
            error
          );

          this.dashboard = null;

          this.cargando = false;

          this.mensajeError =
            'No fue posible cargar la información del dashboard.';
        }

      });
  }

  volverPanel(): void {
    this.router.navigate(['/admin']);
  }

  cerrarSesion(): void {

    this.authService.cerrarSesion();

    this.router.navigate(
      ['/login'],
      { replaceUrl: true }
    );
  }

  irAPedidos(): void {
    this.router.navigate(
      ['/admin-pedidos']
    );
  }

  irAClientes(): void {
    this.router.navigate(
      ['/admin-clientes']
    );
  }

  irACajas(): void {
    this.router.navigate(
      ['/admin-cajas']
    );
  }

  irAPromociones(): void {
    this.router.navigate(
      ['/admin-promociones']
    );
  }

  formatearMoneda(
    valor: number | null | undefined
  ): string {

    const numero =
      Number(valor ?? 0);

    return new Intl.NumberFormat(
      'es-CR',
      {
        style: 'currency',
        currency: 'CRC',
        maximumFractionDigits: 0
      }
    ).format(numero);
  }

  formatearFecha(
    fecha: string | null | undefined
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

    return new Intl.DateTimeFormat(
      'es-CR',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }
    ).format(fechaConvertida);
  }

  obtenerClaseEstado(
    estado: string | null | undefined
  ): string {

    const estadoNormalizado =
      this.normalizarEstado(
        estado ?? ''
      );

    switch (estadoNormalizado) {

      case 'pendiente':
        return 'estado-pendiente';

      case 'preparando':
        return 'estado-preparando';

      case 'empacando':
        return 'estado-empacando';

      case 'en camino':
        return 'estado-camino';

      case 'entregado':
        return 'estado-entregado';

      case 'cancelado':
        return 'estado-cancelado';

      default:
        return 'estado-default';
    }
  }

  obtenerIconoEstado(
    estado: string | null | undefined
  ): string {

    const estadoNormalizado =
      this.normalizarEstado(
        estado ?? ''
      );

    switch (estadoNormalizado) {

      case 'pendiente':
        return 'time-outline';

      case 'preparando':
        return 'construct-outline';

      case 'empacando':
        return 'archive-outline';

      case 'en camino':
        return 'car-outline';

      case 'entregado':
        return 'checkmark-circle-outline';

      case 'cancelado':
        return 'close-circle-outline';

      default:
        return 'receipt-outline';
    }
  }

  private normalizarEstado(
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

  trackPedido(
    index: number,
    pedido: DashboardPedido
  ): number {

    return pedido.idPedido;
  }
}