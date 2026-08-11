import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import {
  addOutline,
  alertCircleOutline,
  arrowBackOutline,
  calendarOutline,
  cashOutline,
  checkmarkCircleOutline,
  closeOutline,
  createOutline,
  cubeOutline,
  pricetagOutline,
  refreshOutline,
  saveOutline,
  searchOutline,
  sparklesOutline,
  starOutline,
  ticketOutline,
  trashOutline
} from 'ionicons/icons';

import { Cupon, CuponRequest, CuponService } from '../../services/cupon.service';
import { Mysticbox, MysticBoxModel, MysticBoxRequest } from '../../services/mysticbox';

interface FormularioCupon {
  codigo: string;
  descripcion: string;
  tipoDescuento: 'porcentaje' | 'monto';
  porcentajeDescuento: number | null;
  montoDescuento: number | null;
  fechaInicio: string;
  fechaFin: string;
  activo: boolean;
}

@Component({
  selector: 'app-admin-promociones',
  templateUrl: './admin-promociones.page.html',
  styleUrls: ['./admin-promociones.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class AdminPromocionesPage implements OnInit {
 seccionActiva: 'productos' | 'cupones' | 'activas' = 'productos';
  cajas: MysticBoxModel[] = [];
  cajasFiltradas: MysticBoxModel[] = [];
  textoBusquedaCaja = '';
  guardandoCaja: number | null = null;

  cupones: Cupon[] = [];
  cuponesFiltrados: Cupon[] = [];
  promocionesActivas: MysticBoxModel[] = [];
  cuponesActivos: Cupon[] = [];
  textoBusquedaCupon = '';
  mostrarFormulario = false;
  modoEdicion = false;
  idCuponEditando: number | null = null;
  guardandoCupon = false;

  cargando = true;
  mensajeError = '';
  mensajeExito = '';
  mostrarConfirmacion = false;
 promocionAConfirmar: MysticBoxModel | null = null;
 mostrarConfirmacionCupon = false;
 cuponAConfirmar: Cupon | null = null;

  formulario: FormularioCupon = this.crearFormularioVacio();

  constructor(
    private mysticboxService: Mysticbox,
    private cuponService: CuponService,
    private router: Router
  ) {
    addIcons({
      addOutline,
      alertCircleOutline,
      arrowBackOutline,
      calendarOutline,
      cashOutline,
      checkmarkCircleOutline,
      closeOutline,
      createOutline,
      cubeOutline,
      pricetagOutline,
      refreshOutline,
      saveOutline,
      searchOutline,
      sparklesOutline,
      starOutline,
      ticketOutline,
      trashOutline
    });
  }

  ngOnInit(): void {
    this.cargarTodo();
  }

  ionViewWillEnter(): void {
    this.cargarTodo();
  }

  cargarTodo(): void {
    this.cargando = true;
    this.mensajeError = '';
    this.cargarCajas();
    this.cargarCupones();
  }

  cargarCajas(): void {
    this.mysticboxService.obtenerCajas().subscribe({
      next: respuesta => {
        this.cajas = (respuesta ?? []).map(caja => this.normalizarCaja(caja));
        this.aplicarFiltroCajas();
        this.actualizarPromocionesActivas();
        this.cargando = false;
      },
      error: error => {
        this.cargando = false;
        this.mensajeError = error.error?.mensaje ?? 'No fue posible cargar el catálogo.';
      }
    });
  }

  private normalizarCaja(caja: any): MysticBoxModel {
    return {
      idCaja: Number(caja.idCaja ?? caja.IdCaja ?? 0),
      idCategoria: Number(caja.idCategoria ?? caja.IdCategoria ?? 0),
      nombreCaja: caja.nombreCaja ?? caja.NombreCaja ?? '',
      descripcion: caja.descripcion ?? caja.Descripcion ?? null,
      precio: Number(caja.precio ?? caja.Precio ?? 0),
      imagen: caja.imagen ?? caja.Imagen ?? null,
      stock: Number(caja.stock ?? caja.Stock ?? 0),
      estado: caja.estado ?? caja.Estado ?? true,
      esOferta: Boolean(caja.esOferta ?? caja.EsOferta ?? false),
      porcentajeOferta: caja.porcentajeOferta ?? caja.PorcentajeOferta ?? null,
      esRecomendada: Boolean(caja.esRecomendada ?? caja.EsRecomendada ?? false),
      esDestacada: Boolean(caja.esDestacada ?? caja.EsDestacada ?? false)
    };
  }

 aplicarFiltroCajas(): void {
  const texto = this.textoBusquedaCaja.trim().toLowerCase();
  this.cajasFiltradas = this.cajas.filter(caja =>
    !texto || caja.nombreCaja.toLowerCase().includes(texto)
  );
}

actualizarPromocionesActivas(): void {
  this.promocionesActivas = this.cajas.filter(
    caja => caja.esOferta
  );

  const hoy = this.obtenerFechaActual();

  this.cuponesActivos = this.cupones.filter(cupon => {
    const inicio = this.formatearFechaInput(cupon.fechaInicio);
    const fin = this.formatearFechaInput(cupon.fechaFin);

    return Boolean(cupon.activo) &&
           inicio <= hoy &&
           fin >= hoy;
  });
}
  

  alternarOferta(caja: MysticBoxModel): void {
    caja.esOferta = !caja.esOferta;
    if (caja.esOferta && (!caja.porcentajeOferta || caja.porcentajeOferta <= 0)) {
      caja.porcentajeOferta = 10;
    }
    if (!caja.esOferta) {
      caja.porcentajeOferta = null;
    }
  }

  guardarConfiguracionCaja(caja: MysticBoxModel): void {
    this.mensajeError = '';
    this.mensajeExito = '';

    const porcentaje = Number(caja.porcentajeOferta ?? 0);
    if (caja.esOferta && (porcentaje <= 0 || porcentaje >= 100)) {
      this.mensajeError = 'El porcentaje de oferta debe ser mayor que 0 y menor que 100.';
      return;
    }

    const request: MysticBoxRequest = {
      idCategoria: caja.idCategoria,
      nombreCaja: caja.nombreCaja,
      descripcion: caja.descripcion,
      precio: caja.precio,
      imagen: caja.imagen,
      stock: caja.stock,
      estado: caja.estado,
      esOferta: caja.esOferta,
      porcentajeOferta: caja.esOferta ? porcentaje : null,
      esRecomendada: caja.esRecomendada,
      esDestacada: caja.esDestacada
    };

    this.guardandoCaja = caja.idCaja;
    this.mysticboxService.actualizarCaja(caja.idCaja, request).subscribe({
     next: () => {
  this.guardandoCaja = null;

  // se actualizan las ofertas activas de inmediato. 
  this.actualizarPromocionesActivas();

  this.mensajeExito = `${caja.nombreCaja} se actualizó correctamente.`;
},
      error: error => {
        this.guardandoCaja = null;
        this.mensajeError = error.error?.mensaje ?? error.error?.title ?? 'No fue posible actualizar la caja.';
      }
    });
  }
   desactivarPromocion(caja: MysticBoxModel): void {
  this.promocionAConfirmar = caja;
  this.mostrarConfirmacion = true;
}

confirmarDesactivacion(): void {
  if (!this.promocionAConfirmar) {
    return;
  }

  const caja = this.promocionAConfirmar;

  this.mensajeError = '';
  this.mensajeExito = '';

  const request: MysticBoxRequest = {
    idCategoria: caja.idCategoria,
    nombreCaja: caja.nombreCaja,
    descripcion: caja.descripcion,
    precio: caja.precio,
    imagen: caja.imagen,
    stock: caja.stock,
    estado: caja.estado,
    esOferta: false,
    porcentajeOferta: null,
    esRecomendada: caja.esRecomendada,
    esDestacada: caja.esDestacada
  };

  this.guardandoCaja = caja.idCaja;

  this.mysticboxService.actualizarCaja(caja.idCaja, request).subscribe({
    next: () => {
      caja.esOferta = false;
      caja.porcentajeOferta = null;

      this.guardandoCaja = null;
      this.mostrarConfirmacion = false;
      this.promocionAConfirmar = null;

      this.actualizarPromocionesActivas();

      this.mensajeExito =
        `La promoción de "${caja.nombreCaja}" fue desactivada correctamente.`;
    },
    error: error => {
      this.guardandoCaja = null;

      this.mensajeError =
        error.error?.mensaje ??
        error.error?.title ??
        'No fue posible desactivar la promoción.';
    }
  });
}
cancelarDesactivacion(): void {
  this.mostrarConfirmacion = false;
  this.promocionAConfirmar = null;
}

  obtenerPrecioOferta(caja: MysticBoxModel): number {
    if (!caja.esOferta || !caja.porcentajeOferta) return caja.precio;
    return Math.round(caja.precio * (1 - Number(caja.porcentajeOferta) / 100));
  }

  obtenerImagen(imagen: string | null): string {
    if (!imagen) return '';
    if (imagen.startsWith('assets/')) return imagen;
    return `assets/img/${imagen}`;
  }

  cargarCupones(): void {
    this.cuponService.obtenerCupones().subscribe({
      next: respuesta => {
        this.cupones = (respuesta ?? []).map((cupon: any) => ({
          idCupon: Number(cupon.idCupon ?? cupon.IdCupon ?? 0),
          codigo: cupon.codigo ?? cupon.Codigo ?? '',
          descripcion: cupon.descripcion ?? cupon.Descripcion ?? null,
          porcentajeDescuento: cupon.porcentajeDescuento ?? cupon.PorcentajeDescuento ?? null,
          montoDescuento: cupon.montoDescuento ?? cupon.MontoDescuento ?? null,
          fechaInicio: cupon.fechaInicio ?? cupon.FechaInicio ?? '',
          fechaFin: cupon.fechaFin ?? cupon.FechaFin ?? '',
          activo: cupon.activo ?? cupon.Activo ?? false
        }));
        this.aplicarFiltroCupones();
        this.actualizarPromocionesActivas();
      },
      error: error => {
        this.mensajeError = error.error?.mensaje ?? 'No fue posible cargar los cupones.';
      }
    });
  }

  aplicarFiltroCupones(): void {
    const texto = this.textoBusquedaCupon.trim().toLowerCase();
    this.cuponesFiltrados = this.cupones.filter(cupon =>
      !texto ||
      cupon.codigo.toLowerCase().includes(texto) ||
      (cupon.descripcion ?? '').toLowerCase().includes(texto)
    );
  }

  crearFormularioVacio(): FormularioCupon {
    const hoy = this.obtenerFechaActual();
    return {
      codigo: '',
      descripcion: '',
      tipoDescuento: 'porcentaje',
      porcentajeDescuento: 10,
      montoDescuento: null,
      fechaInicio: hoy,
      fechaFin: hoy,
      activo: true
    };
  }

  private obtenerFechaActual(): string {
    const fecha = new Date();
    const anio = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const dia = String(fecha.getDate()).padStart(2, '0');
    return `${anio}-${mes}-${dia}`;
  }

  abrirFormularioNuevo(): void {
    this.modoEdicion = false;
    this.idCuponEditando = null;
    this.formulario = this.crearFormularioVacio();
    this.mostrarFormulario = true;
    this.mensajeError = '';
  }

  abrirFormularioEditar(cupon: Cupon): void {
    const usaPorcentaje = Number(cupon.porcentajeDescuento ?? 0) > 0;
    this.modoEdicion = true;
    this.idCuponEditando = cupon.idCupon;
    this.formulario = {
      codigo: cupon.codigo,
      descripcion: cupon.descripcion ?? '',
      tipoDescuento: usaPorcentaje ? 'porcentaje' : 'monto',
      porcentajeDescuento: usaPorcentaje ? Number(cupon.porcentajeDescuento) : null,
      montoDescuento: usaPorcentaje ? null : Number(cupon.montoDescuento ?? 0),
      fechaInicio: this.formatearFechaInput(cupon.fechaInicio),
      fechaFin: this.formatearFechaInput(cupon.fechaFin),
      activo: Boolean(cupon.activo)
    };
    this.mostrarFormulario = true;
  }

  cerrarFormulario(): void {
    if (this.guardandoCupon) return;
    this.mostrarFormulario = false;
    this.formulario = this.crearFormularioVacio();
  }

  cambiarTipoDescuento(): void {
    if (this.formulario.tipoDescuento === 'porcentaje') {
      this.formulario.porcentajeDescuento = this.formulario.porcentajeDescuento ?? 10;
      this.formulario.montoDescuento = null;
    } else {
      this.formulario.montoDescuento = this.formulario.montoDescuento ?? 1000;
      this.formulario.porcentajeDescuento = null;
    }
  }

  guardarCupon(): void {
    this.mensajeError = '';
    this.mensajeExito = '';

    if (!this.formulario.codigo.trim() || !this.formulario.fechaInicio || !this.formulario.fechaFin) {
      this.mensajeError = 'Completa el código y las fechas del cupón.';
      return;
    }
    if (this.formulario.fechaFin < this.formulario.fechaInicio) {
      this.mensajeError = 'La fecha final no puede ser anterior a la fecha inicial.';
      return;
    }

    const usaPorcentaje = this.formulario.tipoDescuento === 'porcentaje';
    const porcentaje = Number(this.formulario.porcentajeDescuento ?? 0);
    const monto = Number(this.formulario.montoDescuento ?? 0);

    if (usaPorcentaje && (porcentaje <= 0 || porcentaje > 100)) {
      this.mensajeError = 'El porcentaje debe estar entre 1 y 100.';
      return;
    }
    if (!usaPorcentaje && monto <= 0) {
      this.mensajeError = 'El monto debe ser mayor que cero.';
      return;
    }

    const request: CuponRequest = {
      codigo: this.formulario.codigo.trim().toUpperCase(),
      descripcion: this.formulario.descripcion.trim() || null,
      porcentajeDescuento: usaPorcentaje ? porcentaje : null,
      montoDescuento: usaPorcentaje ? null : monto,
      fechaInicio: this.formulario.fechaInicio,
      fechaFin: this.formulario.fechaFin,
      activo: this.formulario.activo
    };

    this.guardandoCupon = true;
    const operacion = this.modoEdicion && this.idCuponEditando
      ? this.cuponService.actualizarCupon(this.idCuponEditando, request)
      : this.cuponService.crearCupon(request);

    operacion.subscribe({
      next: () => {
        this.guardandoCupon = false;
        this.mostrarFormulario = false;
        this.mensajeExito = this.modoEdicion ? 'Cupón actualizado correctamente.' : 'Cupón creado correctamente.';
        this.cargarCupones();
      },
      error: error => {
        this.guardandoCupon = false;
        this.mensajeError = error.error?.mensaje ?? 'No fue posible guardar el cupón.';
      }
    });
  }

  eliminarCupon(cupon: Cupon): void {
    if (!confirm(`¿Eliminar el cupón ${cupon.codigo}?`)) return;
    this.cuponService.eliminarCupon(cupon.idCupon).subscribe({
      next: () => {
        this.mensajeExito = 'Cupón eliminado correctamente.';
        this.cargarCupones();
      },
      error: error => {
        this.mensajeError = error.error?.mensaje ?? 'No fue posible eliminar el cupón.';
      }
    });
  }

   desactivarCupon(cupon: Cupon): void {
  this.cuponAConfirmar = cupon;
  this.mostrarConfirmacionCupon = true;
}
cancelarDesactivacionCupon(): void {
  this.mostrarConfirmacionCupon = false;
  this.cuponAConfirmar = null;
}

confirmarDesactivacionCupon(): void {
  if (!this.cuponAConfirmar) {
    return;
  }

  const cupon = this.cuponAConfirmar;

  this.mensajeError = '';
  this.mensajeExito = '';
  this.guardandoCupon = true;

  const request: CuponRequest = {
    codigo: cupon.codigo,
    descripcion: cupon.descripcion,
    porcentajeDescuento: cupon.porcentajeDescuento,
    montoDescuento: cupon.montoDescuento,
    fechaInicio: cupon.fechaInicio,
    fechaFin: cupon.fechaFin,
    activo: false
  };

  this.cuponService.actualizarCupon(cupon.idCupon, request).subscribe({
    next: () => {
      cupon.activo = false;

      this.guardandoCupon = false;
      this.mostrarConfirmacionCupon = false;
      this.cuponAConfirmar = null;

      this.actualizarPromocionesActivas();

      this.mensajeExito =
        `El cupón "${cupon.codigo}" fue desactivado correctamente.`;
    },
    error: error => {
      this.guardandoCupon = false;

      this.mensajeError =
        error.error?.mensaje ??
        'No fue posible desactivar el cupón.';
    }
  });
}

  obtenerDescuentoCupon(cupon: Cupon): string {
    if (Number(cupon.porcentajeDescuento ?? 0) > 0) {
      return `${Number(cupon.porcentajeDescuento)}%`;
    }
    return `₡${Number(cupon.montoDescuento ?? 0).toLocaleString('es-CR')}`;
  }

  private formatearFechaInput(fecha: string): string {
    return fecha ? String(fecha).slice(0, 10) : this.obtenerFechaActual();
  }


  contarOfertas(): number {
    return this.cajas.filter(caja => caja.esOferta).length;
  }

  contarRecomendadas(): number {
    return this.cajas.filter(caja => caja.esRecomendada).length;
  }

  contarDestacadas(): number {
    return this.cajas.filter(caja => caja.esDestacada).length;
  }

  volverAlPanel(): void {
    this.router.navigate(['/admin']);
  }
}
