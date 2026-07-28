import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-admin-clientes',
  templateUrl: './admin-clientes.page.html',
  styleUrls: ['./admin-clientes.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class AdminClientesPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
