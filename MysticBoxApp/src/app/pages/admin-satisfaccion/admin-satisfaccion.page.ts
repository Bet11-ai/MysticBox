import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit
} from '@angular/core';

import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { addIcons } from 'ionicons';

import {
  alertCircleOutline,
  arrowBackOutline,
  chatbubbleEllipsesOutline,
  happyOutline,
  refreshOutline,
  sadOutline,
  starOutline,
  star,
  statsChartOutline,
  timeOutline
} from 'ionicons/icons';

import {
  AuthService,
  UsuarioSesion
} from '../../services/auth.service';

import {
  Calificacion,
  SatisfaccionService
} from '../../services/satisfaccion.service';


interface DistribucionEstrella {
  estrellas: number;
  cantidad: number;
  porcentaje: number;
}


@Component({
  selector: 'app-admin-satisfaccion',
  templateUrl: './admin-satisfaccion.page.html',
  styleUrls: [
    './admin-satisfaccion.page.scss'
  ],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule
  ]
})
export class AdminSatisfaccionPage
  implements OnInit {

  usuario:
    UsuarioSesion | null = null;

  calificaciones:
    Calificacion[] = [];

  distribucion:
    DistribucionEstrella[] = [];

  promedio = 0;

  totalCalificaciones = 0;

  positivas = 0;

  neutrales = 0;

  negativas = 0;

  cargando = true;

  mensajeError = '';


  constructor(
    private satisfaccionService:
      SatisfaccionService,

    private authService:
      AuthService,

    private router:
      Router
  ) {

    addIcons({
      alertCircleOutline,
      arrowBackOutline,
      chatbubbleEllipsesOutline,
      happyOutline,
      refreshOutline,
      sadOutline,
      starOutline,
      star,
      statsChartOutline,
      timeOutline
    });
  }


  ngOnInit(): void {

    /*
     * Aquí solamente verificamos
     * que exista una sesión válida.
     *
     * La información se carga desde
     * ionViewWillEnter().
     */
    this.verificarAdministrador();
  }


  ionViewWillEnter(): void {

    /*
     * Cada vez que el administrador
     * entra nuevamente a la pantalla,
     * actualizamos las calificaciones.
     */
    if (
      this.verificarAdministrador()
    ) {
      this.cargarCalificaciones();
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

    /*
     * Rol 1 = Administrador
     */
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


  cargarCalificaciones(): void {

    this.cargando = true;

    this.mensajeError = '';

    this.satisfaccionService
      .obtenerCalificaciones()
      .subscribe({

        next: respuesta => {

          this.calificaciones =
            [...(respuesta ?? [])]
              .sort(
                (a, b) =>
                  this.obtenerTiempo(
                    b.fechaCalificacion
                  ) -
                  this.obtenerTiempo(
                    a.fechaCalificacion
                  )
              );

          this.calcularEstadisticas();

          this.cargando = false;
        },

        error: error => {

          console.error(
            'Error consultando calificaciones:',
            error
          );

          this.calificaciones = [];

          this.reiniciarEstadisticas();

          this.cargando = false;

          this.mensajeError =
            'No fue posible consultar las calificaciones.';
        }

      });
  }


  private calcularEstadisticas(): void {

    this.totalCalificaciones =
      this.calificaciones.length;

    if (
      this.totalCalificaciones === 0
    ) {

      this.reiniciarEstadisticas();

      this.generarDistribucion();

      return;
    }

    const suma =
      this.calificaciones.reduce(
        (
          total,
          calificacion
        ) =>
          total +
          Number(
            calificacion.estrellas ?? 0
          ),
        0
      );

    this.promedio =
      Number(
        (
          suma /
          this.totalCalificaciones
        ).toFixed(1)
      );


    /*
     * Positivas:
     * 4 y 5 estrellas
     */
    this.positivas =
      this.calificaciones
        .filter(
          item =>
            Number(
              item.estrellas
            ) >= 4
        )
        .length;


    /*
     * Neutrales:
     * 3 estrellas
     */
    this.neutrales =
      this.calificaciones
        .filter(
          item =>
            Number(
              item.estrellas
            ) === 3
        )
        .length;


    /*
     * Negativas:
     * 1 y 2 estrellas
     */
    this.negativas =
      this.calificaciones
        .filter(
          item =>
            Number(
              item.estrellas
            ) <= 2
        )
        .length;

    this.generarDistribucion();
  }


  private reiniciarEstadisticas(): void {

    this.promedio = 0;

    this.totalCalificaciones =
      this.calificaciones.length;

    this.positivas = 0;

    this.neutrales = 0;

    this.negativas = 0;

    this.distribucion = [];
  }


  private generarDistribucion(): void {

    this.distribucion =
      [
        5,
        4,
        3,
        2,
        1
      ]
      .map(
        estrellas => {

          const cantidad =
            this.calificaciones
              .filter(
                item =>
                  Number(
                    item.estrellas
                  ) === estrellas
              )
              .length;

          const porcentaje =
            this.totalCalificaciones > 0
              ?
                (
                  cantidad /
                  this.totalCalificaciones
                ) * 100
              : 0;

          return {
            estrellas,
            cantidad,
            porcentaje
          };
        }
      );
  }


  obtenerPorcentajePositivas():
    number {

    if (
      this.totalCalificaciones === 0
    ) {
      return 0;
    }

    return Math.round(
      (
        this.positivas /
        this.totalCalificaciones
      ) * 100
    );
  }


  obtenerEstrellas(
    cantidad: number
  ): number[] {

    /*
     * Para representar el promedio:
     * 4.6 se visualiza como 5 estrellas,
     * 4.2 como 4, etc.
     */
    const llenas =
      Math.max(
        0,
        Math.min(
          5,
          Math.round(
            Number(
              cantidad ?? 0
            )
          )
        )
      );

    return Array.from(
      {
        length: llenas
      }
    );
  }


  obtenerEstrellasVacias(
    cantidad: number
  ): number[] {

    const llenas =
      Math.max(
        0,
        Math.min(
          5,
          Math.round(
            Number(
              cantidad ?? 0
            )
          )
        )
      );

    return Array.from(
      {
        length:
          5 - llenas
      }
    );
  }


  obtenerClaseCalificacion(
    estrellas: number
  ): string {

    if (
      Number(estrellas) >= 4
    ) {
      return 'review-positive';
    }

    if (
      Number(estrellas) === 3
    ) {
      return 'review-neutral';
    }

    return 'review-negative';
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

    return new Intl
      .DateTimeFormat(
        'es-CR',
        {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }
      )
      .format(valor);
  }


  volverAlPanel(): void {

    this.router.navigate([
      '/admin'
    ]);
  }


  private obtenerTiempo(
    fecha:
      string |
      null |
      undefined
  ): number {

    if (!fecha) {
      return 0;
    }

    const valor =
      new Date(fecha)
        .getTime();

    return Number.isNaN(valor)
      ? 0
      : valor;
  }


  trackCalificacion(
    index: number,
    item: Calificacion
  ): number {

    return item.idCalificacion;
  }
}