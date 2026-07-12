import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent } from '@ionic/angular/standalone';

import { Mysticbox } from '../../services/mysticbox';

@Component({
  selector: 'app-mysticbox',
  templateUrl: './mysticbox.page.html',
  styleUrls: ['./mysticbox.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    CommonModule,
    FormsModule
  ]
})
export class MysticboxPage implements OnInit {

  cajas: any[] = [];
  cargando = true;
  mensajeError = '';

  constructor(private mysticboxService: Mysticbox) {}

  ngOnInit(): void {
    this.cargarCajas();
  }

  cargarCajas(): void {
    this.cargando = true;
    this.mensajeError = '';

    this.mysticboxService.obtenerCajas().subscribe({
      next: (data: any[]) => {
        this.cajas = data.filter((caja: any) => caja.estado !== false);
        this.cargando = false;

        console.log('Cajas desde API:', data);
      },
      error: (error) => {
        console.error('Error al obtener las cajas:', error);

        this.mensajeError = 'No se pudieron cargar las cajas.';
        this.cargando = false;
      }
    });
  }

  seleccionarCaja(caja: any): void {
    console.log('Caja seleccionada:', caja);
  }
}