import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

import { CarritoService } from '../../services/carrito.service';

import { addIcons } from 'ionicons';
import {
  cartOutline,
  searchOutline,
  giftOutline,
  gameControllerOutline,
  sparklesOutline,
  colorPaletteOutline,
  heartOutline,
  briefcaseOutline,
  rocketOutline,
  cubeOutline,
  bagHandleOutline,
  addOutline,
  pricetagOutline,
  homeOutline,
  gridOutline,
  receiptOutline,
  personOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule
  ]
})
export class HomePage implements OnInit {

  cantidadCarritos = 0;

  constructor(private carritoService: CarritoService) {

    addIcons({
      cartOutline,
      searchOutline,
      giftOutline,
      gameControllerOutline,
      sparklesOutline,
      colorPaletteOutline,
      heartOutline,
      briefcaseOutline,
      rocketOutline,
      cubeOutline,
      bagHandleOutline,
      addOutline,
      pricetagOutline,
      homeOutline,
      gridOutline,
      receiptOutline,
      personOutline
    });

  }

  ngOnInit(): void {

    this.carritoService.obtenerCarritos().subscribe({

  next: (respuesta: any[]) => {

        console.log('Respuesta del backend', respuesta);

        this.cantidadCarritos = respuesta.length;

      },

     error: (error: any) => {

        console.error(error);

      }

    });

  }

}