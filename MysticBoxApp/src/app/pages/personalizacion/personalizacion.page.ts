import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import {
  IonButton,
  IonContent,
  IonItem,
  IonTextarea,
  LoadingController,
  ToastController
} from '@ionic/angular/standalone';

import { CarritoService } from 'src/app/services/carrito.service';

import {
  Personalizacion,
  PersonalizacionService
} from '../../services/personalizacion';

@Component({
  selector: 'app-personalizacion',
  templateUrl: './personalizacion.page.html',
  styleUrls: ['./personalizacion.page.scss'],
  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonItem,
    IonTextarea,
    IonButton
  ]
})
export class PersonalizacionPage implements OnInit {

 
  idCaja = 0;
  idUsuario = 0;
  idCategoria = 0;
  precioCaja = 0;

  nombreCaja = 'Mystic Box';
  nombreCategoria = 'Categoría seleccionada';
  tamanoCaja = '';
  imagenCaja = '';

  
  productosCaja: string[] = [];


  preferenciasSeleccionadas: string[] = [];

  exclusionesSeleccionadas: string[] = [];

  mensajePersonalizado = '';

  guardando = false;

  mensajeError = '';


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private personalizacionService: PersonalizacionService,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private carritoService: CarritoService
  ) {}


  ngOnInit(): void {

    this.obtenerCajaSeleccionada();

    this.obtenerUsuario();

  }



  private obtenerCajaSeleccionada(): void {

    this.route.queryParamMap.subscribe(params => {

      this.idCaja =
        Number(params.get('idCaja')) || 0;


      this.idCategoria =
        Number(params.get('idCategoria')) || 0;


      this.precioCaja =
        Number(params.get('precio')) || 0;


      this.nombreCaja =
        params.get('nombreCaja') ||
        'Mystic Box';


      this.nombreCategoria =
        params.get('nombreCategoria') ||
        'Categoría seleccionada';


      this.tamanoCaja =
        params.get('tamanoCaja') ||
        this.obtenerNivelDesdeNombre(
          this.nombreCaja
        );


      
const imagen = params.get('imagen');

console.log('Imagen recibida en personalización:', imagen);

this.imagenCaja = this.obtenerImagen(imagen || '');

console.log('Imagen que se mostrará:', this.imagenCaja);


      
      this.cargarProductosCaja();

    });

  }


private obtenerImagen(imagen: string): string {

  if (!imagen) {
    return '';
  }

  if (imagen.startsWith('assets/')) {
    return imagen;
  }

  return 'assets/img/' + imagen;
}


 
  private obtenerNivelDesdeNombre(
    nombreCaja: string
  ): string {

    const nombre =
      nombreCaja.toLowerCase();


    if (
      nombre.includes('premium')
    ) {

      return 'Premium';

    }


    if (
      nombre.includes('deluxe')
    ) {

      return 'Deluxe';

    }


    if (
      nombre.includes('básica') ||
      nombre.includes('basica')
    ) {

      return 'Básica';

    }


    return '';

  }


 
  private cargarProductosCaja(): void {

    const nombre =
      this.normalizarTexto(
        this.nombreCaja
      );


    // ==========================================
    // BEAUTY
    // ==========================================

    if (
      nombre.includes('beauty') &&
      nombre.includes('basica')
    ) {

      this.productosCaja = [

        'Labial',
        'Máscara',
        'Rubor',
        'Esponja',
        'Crema facial'

      ];

      return;

    }


    if (
      nombre.includes('beauty') &&
      nombre.includes('deluxe')
    ) {

      this.productosCaja = [

        'Sombras',
        'Base',
        'Labial',
        'Iluminadores',
        'Brochas'

      ];

      return;

    }


    if (
      nombre.includes('beauty') &&
      nombre.includes('premium')
    ) {

      this.productosCaja = [

        'Sombras grandes',
        'Paleta facial',
        'Serum facial',
        'Brochas grandes',
        'Crema premium'

      ];

      return;

    }


    // ==========================================
    // GAMER
    // ==========================================

    if (
      nombre.includes('gamer') &&
      nombre.includes('basica')
    ) {

      this.productosCaja = [

        'Mouse pad gamer',
        'Audífonos gamer básicos',
        'Mouse gamer básico',
        'Llavero gamer MB',
        'Soporte para celular gamer'

      ];

      return;

    }


    if (
      nombre.includes('gamer') &&
      nombre.includes('deluxe')
    ) {

      this.productosCaja = [

        'Mouse pad Deluxe',
        'Mouse gamer RGB',
        'Teclado mecánico RGB',
        'Audífonos RGB LED',
        'Enfriador para laptop'

      ];

      return;

    }


    if (
      nombre.includes('gamer') &&
      nombre.includes('premium')
    ) {

      this.productosCaja = [

        'Teclado mecánico RGB Premium',
        'Mouse Premium RGB',
        'Headset Premium',
        'Control Gamer Elite',
        'Stream Deck Mini Control Pad'

      ];

      return;

    }


  // ==========================================
// SELF CARE
// ==========================================

if (
  nombre.includes('self') &&
  nombre.includes('care')
) {

  if (nombre.includes('basica')) {

    this.productosCaja = [

      'Vela aromática',
      'Crema hidratante',
      'Mascarilla facial',
      'Sales de baño',
      'Jabón artesanal'

    ];

    return;

  }


  if (nombre.includes('deluxe')) {

    this.productosCaja = [

      'Kit de bombas de baño aromáticas',
      'Crema hidratante',
      'Mascarilla facial',
      'Sales de baño',
      'Exfoliante corporal'

    ];

    console.log(
      'PRODUCTOS SELF CARE DELUXE:',
      this.productosCaja
    );

    return;

  }


  if (nombre.includes('premium')) {

    this.productosCaja = [

      'Mini difusor de aromas con aceite esencial',
      'Aceite corporal o de masaje premium',
      'Set de rodillo facial y piedra Gua Sha',
      'Antifaz de satén con compresa relajante',
      'Kit de mascarillas de hidrogel premium'

    ];

    return;

  }

}


    // ==========================================
    // OFFICE
    // ==========================================

    if (
      nombre.includes('office') &&
      nombre.includes('basica')
    ) {

      this.productosCaja = [

        'Libreta de notas',
        'Set de bolígrafos de colores',
        'Taza para oficina',
        'Porta notas adhesivas',
        'Portalápices de escritorio'

      ];

      return;

    }


    if (
      nombre.includes('office') &&
      nombre.includes('deluxe')
    ) {

      this.productosCaja = [

        'Agenda ejecutiva',
        'Lámpara LED de escritorio',
        'Soporte ajustable para celular',
        'Organizador de escritorio',
        'Reposamuñeca ergonómico'

      ];

      return;

    }


    if (
      nombre.includes('office') &&
      nombre.includes('premium')
    ) {

      this.productosCaja = [

        'Cuaderno premium',
        'Bolígrafo metálico',
        'Termo de acero inoxidable',
        'Set de organización',
        'Vela aromática'

      ];

      return;

    }


    // ==========================================
    // KIDS
    // ==========================================

    if (
      nombre.includes('kids') &&
      nombre.includes('basica')
    ) {

      this.productosCaja = [

        'Libro para colorear',
        'Set de lápices de colores',
        'Rompecabezas infantil',
        'Plastilina de colores',
        'Juego de calcomanías reutilizables'

      ];

      return;

    }


    if (
      nombre.includes('kids') &&
      nombre.includes('deluxe')
    ) {

      this.productosCaja = [

        'Kit de pintura infantil',
        'Kit de origami',
        'Juego de memoria',
        'Kit de figuras para armar',
        'Libro de actividades con retos'

      ];

      return;

    }


    if (
      nombre.includes('kids') &&
      nombre.includes('premium')
    ) {

      this.productosCaja = [

        'Kit de experimentos científicos',
        'Set de construcción magnética',
        'Juego de mesa educativo',
        'Kit de exploración o excavación',
        'Proyector de dibujo infantil'

      ];

      return;

    }


    // ==========================================
    // ANIME
    // ==========================================

    if (
      nombre.includes('anime') &&
      nombre.includes('basica')
    ) {

      this.productosCaja = [

        'Libreta estilo anime',
        'Set de stickers',
        'Llavero decorativo',
        'Póster o lámina ilustrada',
        'Set de pines anime'

      ];

      return;

    }


    if (
      nombre.includes('anime') &&
      nombre.includes('deluxe')
    ) {

      this.productosCaja = [

        'Figura decorativa estilo anime',
        'Taza temática',
        'Set de tarjetas coleccionables',
        'Estuche organizador',
        'Mini lámpara decorativa'

      ];

      return;

    }


    if (
      nombre.includes('anime') &&
      nombre.includes('premium')
    ) {

      this.productosCaja = [

        'Figura coleccionable estilo anime',
        'Set de accesorios temáticos',
        'Taza premium temática',
        'Estuche premium',
        'Decoración exclusiva'

      ];

      return;

    }


   
    this.productosCaja = [];

  }


  
  private normalizarTexto(
    texto: string
  ): string {

    return texto
      .toLowerCase()
      .normalize('NFD')
      .replace(
        /[\u0300-\u036f]/g,
        ''
      );

  }


  
  alternarProducto(
  producto: string,
  lista: string[]
): void {

  const posicion =
    lista.indexOf(producto);

  if (posicion >= 0) {

    lista.splice(
      posicion,
      1
    );

    return;
  }

  

  if (lista === this.preferenciasSeleccionadas) {

    const posicionExclusion =
      this.exclusionesSeleccionadas.indexOf(producto);

    if (posicionExclusion >= 0) {

      this.exclusionesSeleccionadas.splice(
        posicionExclusion,
        1
      );

    }

  }



  if (lista === this.exclusionesSeleccionadas) {

    const posicionPreferencia =
      this.preferenciasSeleccionadas.indexOf(producto);

    if (posicionPreferencia >= 0) {

      this.preferenciasSeleccionadas.splice(
        posicionPreferencia,
        1
      );

    }

  }

  lista.push(producto);

}

  estaSeleccionado(
    producto: string,
    lista: string[]
  ): boolean {

    return lista.includes(
      producto
    );

  }

  private obtenerUsuario(): void {

    const idGuardado =
      localStorage.getItem(
        'idUsuario'
      );


    if (idGuardado) {

      this.idUsuario =
        Number(idGuardado);

      return;

    }


    const usuarioGuardado =
      localStorage.getItem(
        'usuario'
      );


    if (!usuarioGuardado) {

      return;

    }


    try {

      const usuario =
        JSON.parse(
          usuarioGuardado
        );


      this.idUsuario =
        Number(
          usuario.idUsuario ??
          usuario.IdUsuario ??
          usuario.id
        ) || 0;

    } catch (error) {

      console.error(
        'No se pudo leer el usuario guardado:',
        error
      );

    }

  }

  async guardarPersonalizacion(): Promise<void> {

    this.mensajeError = '';


    if (this.idCaja <= 0) {

      this.mensajeError =
        'No se encontró la caja seleccionada.';

      return;

    }


    if (this.idUsuario <= 0) {

      this.mensajeError =
        'Debes iniciar sesión antes de personalizar la caja.';

      return;

    }


    if (!this.tamanoCaja) {

      this.mensajeError =
        'No se pudo identificar el nivel de la caja.';

      return;

    }


    const preferencias =
      this.preferenciasSeleccionadas
        .join(', ');


    const exclusiones =
      this.exclusionesSeleccionadas
        .join(', ');


    const personalizacion: Personalizacion = {

      idPersonalizacion: 0,

      idUsuario:
        this.idUsuario,

      idCaja:
        this.idCaja,

      tamanoCaja:
        this.tamanoCaja,

      preferencias:
        preferencias,

      exclusiones:
        exclusiones,

      mensajePersonalizado:
        this.mensajePersonalizado.trim(),

      fechaPersonalizacion:
        null

    };


    const loading =
      await this.loadingController.create({

        message:
          'Guardando personalización...'

      });


    await loading.present();

    this.guardando = true;


    this.personalizacionService
      .crearPersonalizacion(
        personalizacion
      )
      .subscribe({

        next: async respuesta => {

          const idPersonalizacion =
            respuesta
              .personalizacion
              .idPersonalizacion;


          this.carritoService
            .obtenerCarritos()
            .subscribe({

              next: carritos => {

                const listaCarritos =
                  Array.isArray(carritos)
                    ? carritos
                    : [];


                const carritoActivo =
                  listaCarritos.find(
                    (carrito: any) =>

                      Number(
                        carrito.idUsuario
                      ) ===
                      Number(
                        this.idUsuario
                      ) &&

                      String(
                        carrito.estado
                      ).toLowerCase() ===
                      'activo'

                  );


                if (carritoActivo) {

                  this.agregarDetalleAlCarrito(

                    carritoActivo.idCarrito,

                    idPersonalizacion,

                    loading

                  );

                  return;

                }


                const nuevoCarrito = {

                  idCarrito: 0,

                  idUsuario:
                    this.idUsuario,

                  fechaCreacion:
                    null,

                  estado:
                    'Activo'

                };


                this.carritoService
                  .crearCarrito(
                    nuevoCarrito
                  )
                  .subscribe({

                    next: carritoCreado => {

                      this.agregarDetalleAlCarrito(

                        carritoCreado.idCarrito,

                        idPersonalizacion,

                        loading

                      );

                    },


                    error:
                      async errorCarrito => {

                        this.guardando = false;

                        await loading.dismiss();


                        console.error(
                          'Error al crear el carrito:',
                          errorCarrito
                        );


                        this.mensajeError =

                          errorCarrito
                            ?.error
                            ?.mensaje ||

                          'La personalización se guardó, pero no se pudo crear el carrito.';

                      }

                  });

              },


              error:
                async errorConsulta => {

                  this.guardando = false;

                  await loading.dismiss();


                  console.error(
                    'Error al consultar los carritos:',
                    errorConsulta
                  );


                  this.mensajeError =
                    'No se pudo revisar si el usuario ya tiene un carrito activo.';

                }

            });

        },


        error: async error => {

          this.guardando = false;

          await loading.dismiss();


          console.error(
            'Error al guardar la personalización:',
            error
          );


          this.mensajeError =

            error
              ?.error
              ?.mensaje ||

            'No fue posible guardar la personalización.';

        }

      });

  }


  volverAlCatalogo(): void {

    this.router.navigate(
      ['/mysticbox'],
      {
        queryParams: {

          idCategoria:
            this.idCategoria

        }

      }
    );

  }
  irAHome(): void {

  this.router.navigate(['/home']);

}

  private agregarDetalleAlCarrito(

    idCarrito: number,

    idPersonalizacion: number,

    loading: HTMLIonLoadingElement

  ): void {

    const detalleCarrito = {

      idDetalleCarrito:
        0,

      idCarrito:
        idCarrito,

      idCaja:
        this.idCaja,

      idPersonalizacion:
        idPersonalizacion,

      cantidad:
        1,

      precioUnitario:
        this.precioCaja,

      subtotal:
        this.precioCaja

    };


    this.carritoService
      .crearDetalleCarrito(
        detalleCarrito
      )
      .subscribe({

        next: async () => {

          this.guardando = false;

          await loading.dismiss();


          localStorage.setItem(

            'idPersonalizacionActual',

            idPersonalizacion.toString()

          );


          localStorage.setItem(

            'idCarritoActual',

            idCarrito.toString()

          );


          const toast =
            await this.toastController.create({

              message:
                'La caja personalizada se agregó al carrito.',

              duration:
                2500,

              position:
                'bottom'

            });


          await toast.present();


          this.router.navigate(
            ['/carrito']
          );

        },


        error:
          async errorDetalle => {

            this.guardando = false;

            await loading.dismiss();


            console.error(

              'Error al agregar la caja al carrito:',

              errorDetalle

            );


            this.mensajeError =

              errorDetalle
                ?.error
                ?.mensaje ||

              'La personalización se guardó, pero no se pudo agregar la caja al carrito.';

          }

      });

  }

}