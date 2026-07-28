import {
  Component,
  OnInit
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';

import {
  Cupon,
  CuponRequest,
  CuponService
} from '../../services/cupon.service';

import { addIcons } from 'ionicons';

import {
  arrowBackOutline,
  addOutline,
  pricetagOutline,
  searchOutline,
  refreshOutline,
  createOutline,
  trashOutline,
  closeOutline,
  saveOutline,
  checkmarkCircleOutline,
  alertCircleOutline,
  calendarOutline,
  cashOutline,

  ticketOutline,
  timeOutline
} from 'ionicons/icons';

interface FormularioCupon {
  codigo: string;
  descripcion: string;
  tipoDescuento:
    'porcentaje' |
    'monto';
  porcentajeDescuento: number | null;
  montoDescuento: number | null;
  fechaInicio: string;
  fechaFin: string;
  activo: boolean;
}

@Component({
  selector: 'app-admin-promociones',
  templateUrl:
    './admin-promociones.page.html',
  styleUrls: [
    './admin-promociones.page.scss'
  ],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ]
})
export class AdminPromocionesPage
implements OnInit {

  cupones: Cupon[] = [];
  cuponesFiltrados: Cupon[] = [];

  textoBusqueda = '';

  cargando = true;
  guardando = false;

  mostrarFormulario = false;
  modoEdicion = false;

  idCuponEditando:
    number | null = null;

  mensajeError = '';
  mensajeExito = '';

  formulario: FormularioCupon =
    this.crearFormularioVacio();

  constructor(
    private cuponService: CuponService,
    private router: Router
  ) {
    addIcons({
      arrowBackOutline,
      addOutline,
      pricetagOutline,
      searchOutline,
      refreshOutline,
      createOutline,
      trashOutline,
      closeOutline,
      saveOutline,
      checkmarkCircleOutline,
      alertCircleOutline,
      calendarOutline,
      cashOutline,
       
      ticketOutline,
      timeOutline
    });
  }

  ngOnInit(): void {
    this.cargarCupones();
  }

  ionViewWillEnter(): void {
    this.cargarCupones();
  }

  crearFormularioVacio():
    FormularioCupon {
    const hoy =
      this.obtenerFechaActual();

    return {
      codigo: '',
      descripcion: '',
      tipoDescuento:
        'porcentaje',
      porcentajeDescuento: 10,
      montoDescuento: null,
      fechaInicio: hoy,
      fechaFin: hoy,
      activo: true
    };
  }

  obtenerFechaActual(): string {
    const fecha = new Date();

    const anio =
      fecha.getFullYear();

    const mes = String(
      fecha.getMonth() + 1
    ).padStart(2, '0');

    const dia = String(
      fecha.getDate()
    ).padStart(2, '0');

    return `${anio}-${mes}-${dia}`;
  }

  cargarCupones(): void {
    this.cargando = true;
    this.mensajeError = '';

    this.cuponService
      .obtenerCupones()
      .subscribe({
        next: (respuesta: any[]) => {
          this.cupones =
            (respuesta ?? []).map(
              (cupon: any) => ({
                idCupon: Number(
                  cupon.idCupon ??
                  cupon.IdCupon ??
                  0
                ),
                codigo:
                  cupon.codigo ??
                  cupon.Codigo ??
                  '',
                descripcion:
                  cupon.descripcion ??
                  cupon.Descripcion ??
                  null,
                porcentajeDescuento:
                  cupon.porcentajeDescuento ??
                  cupon.PorcentajeDescuento ??
                  null,
                montoDescuento:
                  cupon.montoDescuento ??
                  cupon.MontoDescuento ??
                  null,
                fechaInicio:
                  cupon.fechaInicio ??
                  cupon.FechaInicio ??
                  '',
                fechaFin:
                  cupon.fechaFin ??
                  cupon.FechaFin ??
                  '',
                activo:
                  cupon.activo ??
                  cupon.Activo ??
                  false
              })
            );

          this.aplicarFiltro();
          this.cargando = false;

          console.log(
            'Cupones obtenidos:',
            respuesta
          );
        },
        error: (error) => {
          this.cargando = false;

          this.mensajeError =
            error.error?.mensaje ??
            'No fue posible consultar los cupones.';

          console.error(
            'Error al consultar cupones:',
            error
          );
        }
      });
  }

  abrirFormularioNuevo(): void {
    this.modoEdicion = false;
    this.idCuponEditando = null;

    this.formulario =
      this.crearFormularioVacio();

    this.mensajeError = '';
    this.mensajeExito = '';
    this.mostrarFormulario = true;
  }

  abrirFormularioEditar(
    cupon: Cupon
  ): void {
    this.modoEdicion = true;
    this.idCuponEditando =
      cupon.idCupon;

    const usaPorcentaje =
      cupon.porcentajeDescuento !==
        null &&
      Number(
        cupon.porcentajeDescuento
      ) > 0;

    this.formulario = {
      codigo: cupon.codigo,
      descripcion:
        cupon.descripcion ?? '',
      tipoDescuento:
        usaPorcentaje
          ? 'porcentaje'
          : 'monto',
      porcentajeDescuento:
        usaPorcentaje
          ? Number(
              cupon.porcentajeDescuento
            )
          : null,
      montoDescuento:
        !usaPorcentaje
          ? Number(
              cupon.montoDescuento ?? 0
            )
          : null,
      fechaInicio:
        cupon.fechaInicio,
      fechaFin:
        cupon.fechaFin,
      activo:
        cupon.activo ?? false
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
    this.idCuponEditando = null;

    this.formulario =
      this.crearFormularioVacio();
  }

  cambiarTipoDescuento(): void {
    if (
      this.formulario
        .tipoDescuento ===
      'porcentaje'
    ) {
      this.formulario
        .porcentajeDescuento =
        this.formulario
          .porcentajeDescuento ??
        10;

      this.formulario
        .montoDescuento = null;
    } else {
      this.formulario
        .montoDescuento =
        this.formulario
          .montoDescuento ??
        1000;

      this.formulario
        .porcentajeDescuento = null;
    }
  }

  validarFormulario(): boolean {
    if (
      !this.formulario.codigo.trim()
    ) {
      this.mensajeError =
        'El código del cupón es obligatorio.';

      return false;
    }

    if (
      !this.formulario.fechaInicio
    ) {
      this.mensajeError =
        'Debe indicar la fecha inicial.';

      return false;
    }

    if (
      !this.formulario.fechaFin
    ) {
      this.mensajeError =
        'Debe indicar la fecha final.';

      return false;
    }

    if (
      this.formulario.fechaFin <
      this.formulario.fechaInicio
    ) {
      this.mensajeError =
        'La fecha final no puede ser anterior a la fecha inicial.';

      return false;
    }

    if (
      this.formulario
        .tipoDescuento ===
      'porcentaje'
    ) {
      const porcentaje = Number(
        this.formulario
          .porcentajeDescuento
      );

      if (
        porcentaje <= 0 ||
        porcentaje > 100
      ) {
        this.mensajeError =
          'El porcentaje debe estar entre 1 y 100.';

        return false;
      }
    }

    if (
      this.formulario
        .tipoDescuento ===
      'monto'
    ) {
      const monto = Number(
        this.formulario
          .montoDescuento
      );

      if (monto <= 0) {
        this.mensajeError =
          'El monto de descuento debe ser mayor que cero.';

        return false;
      }
    }

    return true;
  }

  guardarCupon(): void {
    this.mensajeError = '';
    this.mensajeExito = '';

    if (!this.validarFormulario()) {
      return;
    }

    const usaPorcentaje =
      this.formulario
        .tipoDescuento ===
      'porcentaje';

    const cupon:
      CuponRequest = {
        codigo:
          this.formulario.codigo
            .trim()
            .toUpperCase(),
        descripcion:
          this.formulario.descripcion
            .trim() || null,
        porcentajeDescuento:
          usaPorcentaje
            ? Number(
                this.formulario
                  .porcentajeDescuento
              )
            : null,
        montoDescuento:
          !usaPorcentaje
            ? Number(
                this.formulario
                  .montoDescuento
              )
            : null,
        fechaInicio:
          this.formulario
            .fechaInicio,
        fechaFin:
          this.formulario
            .fechaFin,
        activo:
          this.formulario.activo
      };

    this.guardando = true;

    if (
      this.modoEdicion &&
      this.idCuponEditando !== null
    ) {
      this.actualizarCupon(
        this.idCuponEditando,
        cupon
      );

      return;
    }

    this.crearCupon(cupon);
  }

  crearCupon(
    cupon: CuponRequest
  ): void {
    this.cuponService
      .crearCupon(cupon)
      .subscribe({
        next: (respuesta) => {
          this.guardando = false;
          this.mostrarFormulario =
            false;

          this.mensajeExito =
            'Cupón creado correctamente.';

          this.formulario =
            this.crearFormularioVacio();

          this.cargarCupones();

          console.log(
            'Cupón creado:',
            respuesta
          );
        },
        error: (error) => {
          this.guardando = false;

          this.mensajeError =
            error.error?.mensaje ??
            error.error?.title ??
            'No fue posible crear el cupón.';

          console.error(
            'Error al crear cupón:',
            error
          );
        }
      });
  }

  actualizarCupon(
    idCupon: number,
    cupon: CuponRequest
  ): void {
    this.cuponService
      .actualizarCupon(
        idCupon,
        cupon
      )
      .subscribe({
        next: (respuesta) => {
          this.guardando = false;
          this.mostrarFormulario =
            false;

          this.mensajeExito =
            'Cupón actualizado correctamente.';

          this.modoEdicion = false;
          this.idCuponEditando = null;

          this.formulario =
            this.crearFormularioVacio();

          this.cargarCupones();

          console.log(
            'Cupón actualizado:',
            respuesta
          );
        },
        error: (error) => {
          this.guardando = false;

          this.mensajeError =
            error.error?.mensaje ??
            error.error?.title ??
            'No fue posible actualizar el cupón.';

          console.error(
            'Error al actualizar cupón:',
            error
          );
        }
      });
  }

  eliminarCupon(
    cupon: Cupon
  ): void {
    const confirmar =
      window.confirm(
        `¿Deseas eliminar el cupón "${cupon.codigo}"?`
      );

    if (!confirmar) {
      return;
    }

    this.mensajeError = '';
    this.mensajeExito = '';

    this.cuponService
      .eliminarCupon(
        cupon.idCupon
      )
      .subscribe({
        next: () => {
          this.mensajeExito =
            'Cupón eliminado correctamente.';

          this.cargarCupones();
        },
        error: (error) => {
          this.mensajeError =
            error.error?.mensaje ??
            error.error?.title ??
            'No fue posible eliminar el cupón.';

          console.error(
            'Error al eliminar cupón:',
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
      this.cuponesFiltrados = [
        ...this.cupones
      ];

      return;
    }

    this.cuponesFiltrados =
      this.cupones.filter(
        cupon =>
          cupon.codigo
            .toLowerCase()
            .includes(texto) ||
          (
            cupon.descripcion ?? ''
          )
            .toLowerCase()
            .includes(texto)
      );
  }

  obtenerTipoDescuento(
    cupon: Cupon
  ): string {
    if (
      cupon.porcentajeDescuento !==
        null &&
      Number(
        cupon.porcentajeDescuento
      ) > 0
    ) {
      return `${cupon.porcentajeDescuento}%`;
    }

    return `₡${Number(
      cupon.montoDescuento ?? 0
    ).toLocaleString()}`;
  }

obtenerIconoDescuento(cupon: Cupon): string {
  if (
    cupon.porcentajeDescuento !== null &&
    Number(cupon.porcentajeDescuento) > 0
  ) {
    return 'pricetag-outline';
  }

  return 'cash-outline';
}
  obtenerEstadoCupon(
    cupon: Cupon
  ): string {
    if (!cupon.activo) {
      return 'Inactivo';
    }

    const hoy =
      this.obtenerFechaActual();

    if (hoy < cupon.fechaInicio) {
      return 'Próximo';
    }

    if (hoy > cupon.fechaFin) {
      return 'Vencido';
    }

    return 'Vigente';
  }

  obtenerClaseEstado(
    cupon: Cupon
  ): string {
    const estado =
      this.obtenerEstadoCupon(cupon);

    switch (estado) {
      case 'Vigente':
        return 'active';
      case 'Próximo':
        return 'upcoming';
      case 'Vencido':
        return 'expired';
      default:
        return 'inactive';
    }
  }

  volverAlPanel(): void {
    this.router.navigate(['/admin']);
  }
}