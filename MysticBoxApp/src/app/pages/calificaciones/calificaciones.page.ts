import {
  Component,
  OnInit
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import {
  Router,
  RouterLink
} from '@angular/router';

import {
  CalificacionCreadaResponse,
  CalificacionService,
  CrearCalificacionRequest
} from '../../services/calificacion.service';

import { addIcons } from 'ionicons';

import {
  arrowBackOutline,
  star,
  starOutline,
  chatbubbleEllipsesOutline,
  checkmarkCircleOutline,
  alertCircleOutline,
  receiptOutline,
  happyOutline,
  homeOutline
} from 'ionicons/icons';

interface UltimoPedido {
  idPedido: number;
  numeroPedido: string;
  estadoPedido: string;
  total: number;
  fechaPedido: string;
  fechaEstimadaEntrega: string;
}

@Component({
  selector: 'app-calificaciones',
  templateUrl: './calificaciones.page.html',
  styleUrls: ['./calificaciones.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterLink
  ]
})
export class CalificacionesPage implements OnInit {

  ultimoPedido: UltimoPedido | null = null;

  estrellas = 0;
  estrellasHover = 0;

  comentario = '';

  enviando = false;
  calificacionEnviada = false;

  mensajeError = '';

  respuestaCreada:
    CalificacionCreadaResponse | null = null;

  constructor(
    private calificacionService:
      CalificacionService,
    private router: Router
  ) {
    addIcons({
      arrowBackOutline,
      star,
      starOutline,
      chatbubbleEllipsesOutline,
      checkmarkCircleOutline,
      alertCircleOutline,
      receiptOutline,
      happyOutline,
      homeOutline
    });
  }

  ngOnInit(): void {
    this.cargarUltimoPedido();
  }

  ionViewWillEnter(): void {
    this.cargarUltimoPedido();
  }

  cargarUltimoPedido(): void {
    const pedidoGuardado =
    
  sessionStorage.getItem('ultimoPedido') ??
  localStorage.getItem('ultimoPedido');

    if (!pedidoGuardado) {
      this.ultimoPedido = null;
      this.mensajeError =
        'No se encontró un pedido reciente para calificar.';

      return;
    }

    try {
      this.ultimoPedido =
        JSON.parse(pedidoGuardado);

      this.mensajeError = '';
    } catch (error) {
      console.error(
        'No fue posible cargar el pedido:',
        error
      );

      this.ultimoPedido = null;

      this.mensajeError =
        'No fue posible cargar la información del pedido.';
    }
  }

  seleccionarEstrellas(
    cantidad: number
  ): void {

    this.estrellas = cantidad;
    this.mensajeError = '';
  }

  activarHover(
    cantidad: number
  ): void {

    this.estrellasHover = cantidad;
  }

  limpiarHover(): void {
    this.estrellasHover = 0;
  }

  estrellaActiva(
    posicion: number
  ): boolean {

    const cantidad =
      this.estrellasHover > 0
        ? this.estrellasHover
        : this.estrellas;

    return posicion <= cantidad;
  }

  contarCaracteres(): number {
    return this.comentario.length;
  }

  enviarCalificacion(): void {
    this.mensajeError = '';

    if (!this.ultimoPedido) {
      this.mensajeError =
        'No hay un pedido disponible para calificar.';

      return;
    }

    if (this.estrellas < 1) {
      this.mensajeError =
        'Debe seleccionar una calificación de 1 a 5 estrellas.';

      return;
    }

    if (this.comentario.length > 500) {
      this.mensajeError =
        'El comentario no puede superar los 500 caracteres.';

      return;
    }

    const nuevaCalificacion:
      CrearCalificacionRequest = {
        idCalificacion: 0,
        idPedido:
          this.ultimoPedido.idPedido,
        estrellas:
          this.estrellas,
        comentario:
          this.comentario.trim(),
        fechaCalificacion: null
      };

    this.enviando = true;

    this.calificacionService
      .crearCalificacion(
        nuevaCalificacion
      )
      .subscribe({
        next: (respuesta) => {
          this.enviando = false;
          this.calificacionEnviada = true;
          this.respuestaCreada = respuesta;

          sessionStorage.setItem(
            'ultimaCalificacion',
            JSON.stringify(respuesta)
          );

          console.log(
            'Calificación registrada:',
            respuesta
          );
        },
        error: (error) => {
          this.enviando = false;

          this.mensajeError =
            error.error?.mensaje ??
            'No fue posible registrar la calificación.';

          console.error(
            'Error al registrar la calificación:',
            error
          );
        }
      });
  }

  obtenerTextoCalificacion(): string {
    switch (this.estrellas) {
      case 1:
        return 'Muy insatisfecho';
      case 2:
        return 'Insatisfecho';
      case 3:
        return 'Aceptable';
      case 4:
        return 'Muy buena experiencia';
      case 5:
        return 'Excelente experiencia';
      default:
        return 'Selecciona una calificación';
    }
  }

  volverAlInicio(): void {
    this.router.navigate(['/home']);
  }

  irAPedidos(): void {
    this.router.navigate(['/pedidos']);
  }
}