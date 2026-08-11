import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  barChartOutline,
  calendarOutline,
  chevronForwardOutline,
  cubeOutline,
  documentTextOutline,
  gridOutline,
  logOutOutline,
  peopleOutline,
  personCircleOutline,
  pricetagOutline,
  receiptOutline,
  settingsOutline,
  shieldCheckmarkOutline,
  starOutline,
  statsChartOutline,
  storefrontOutline,
  timeOutline
} from 'ionicons/icons';

import { AuthService, UsuarioSesion } from '../../services/auth.service';
import { Dashboard, DashboardService } from '../../services/dashboard.service';

interface ModuloAdmin {
  titulo: string;
  descripcion: string;
  icono: string;
  ruta: string;
  grupo: 'gestion' | 'analitica';
}

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class AdminPage implements OnInit, OnDestroy {
  usuario: UsuarioSesion | null = null;
  dashboard: Dashboard | null = null;
  fechaActual = '';
  horaActual = '';
  private intervaloReloj: ReturnType<typeof setInterval> | null = null;

  modulos: ModuloAdmin[] = [
    { titulo: 'Administrar cajas', descripcion: 'Gestiona catálogo, precios, stock e imágenes.', icono: 'cube-outline', ruta: '/admin-cajas', grupo: 'gestion' },
    { titulo: 'Promociones y cupones', descripcion: 'Define ofertas, recomendaciones y códigos promocionales.', icono: 'pricetag-outline', ruta: '/admin-promociones', grupo: 'gestion' },
    { titulo: 'Gestionar pedidos', descripcion: 'Consulta pedidos, revisa detalles y actualiza estados.', icono: 'receipt-outline', ruta: '/admin-pedidos', grupo: 'gestion' },
    { titulo: 'Gestionar clientes', descripcion: 'Administra las cuentas y la información de clientes.', icono: 'people-outline', ruta: '/admin-clientes', grupo: 'gestion' },
    { titulo: 'Dashboard', descripcion: 'Consulta la actividad general y los indicadores de la tienda.', icono: 'grid-outline', ruta: '/admin-dashboard', grupo: 'analitica' },
    { titulo: 'Estadísticas', descripcion: 'Analiza ventas, pedidos, descuentos y comportamiento.', icono: 'stats-chart-outline', ruta: '/admin-estadisticas', grupo: 'analitica' },
    { titulo: 'Reportes gráficos', descripcion: 'Visualiza ventas y tendencias en gráficos.', icono: 'bar-chart-outline', ruta: '/admin-reportes', grupo: 'analitica' },
    { titulo: 'Satisfacción', descripcion: 'Consulta calificaciones y opiniones de clientes.', icono: 'star-outline', ruta: '/admin-satisfaccion', grupo: 'analitica' },
    { titulo: 'Reportes generales', descripcion: 'Genera un resumen consolidado de la operación.', icono: 'document-text-outline', ruta: '/admin-reportes-generales', grupo: 'analitica' },
    { titulo: 'White List', descripcion: 'Administra los correos autorizados en la aplicación.', icono: 'shield-checkmark-outline', ruta: '/admin-whitelist', grupo: 'gestion' }
  ];

  constructor(
    private authService: AuthService,
    private dashboardService: DashboardService,
    private router: Router
  ) {
    addIcons({
      barChartOutline, calendarOutline, chevronForwardOutline, cubeOutline,
      documentTextOutline, gridOutline, logOutOutline, peopleOutline,
      personCircleOutline, pricetagOutline, receiptOutline, settingsOutline,
      shieldCheckmarkOutline, starOutline, statsChartOutline, storefrontOutline,
      timeOutline
    });
  }

  ngOnInit(): void {
    this.verificarAdministrador();
    this.actualizarFechaHora();
    this.cargarDashboard();
    this.intervaloReloj = setInterval(() => this.actualizarFechaHora(), 60000);
  }

  ionViewWillEnter(): void {
    this.verificarAdministrador();
    this.actualizarFechaHora();
    this.cargarDashboard();
  }

  ngOnDestroy(): void {
    if (this.intervaloReloj) clearInterval(this.intervaloReloj);
  }

  get modulosGestion(): ModuloAdmin[] {
    return this.modulos.filter(modulo => modulo.grupo === 'gestion');
  }

  get modulosAnalitica(): ModuloAdmin[] {
    return this.modulos.filter(modulo => modulo.grupo === 'analitica');
  }

  private verificarAdministrador(): void {
    this.usuario = this.authService.obtenerUsuario();
    if (!this.usuario) {
      this.router.navigate(['/login'], { replaceUrl: true });
      return;
    }
    if (Number(this.usuario.idRol) !== 1) {
      this.router.navigate(['/home'], { replaceUrl: true });
    }
  }

  private cargarDashboard(): void {
    this.dashboardService.obtenerDashboard().subscribe({
      next: data => this.dashboard = data,
      error: () => this.dashboard = null
    });
  }

  private actualizarFechaHora(): void {
    const ahora = new Date();
    this.fechaActual = ahora.toLocaleDateString('es-CR', { day: 'numeric', month: 'long', year: 'numeric' });
    this.horaActual = ahora.toLocaleTimeString('es-CR', { hour: '2-digit', minute: '2-digit' });
  }

  abrirModulo(modulo: ModuloAdmin): void {
    this.router.navigate([modulo.ruta]);
  }

  irRuta(ruta: string): void {
    this.router.navigate([ruta]);
  }

  cerrarSesion(): void {
    this.authService.cerrarSesion();
    this.router.navigate(['/login'], { replaceUrl: true });
  }
}
