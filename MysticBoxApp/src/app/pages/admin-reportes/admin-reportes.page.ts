import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-admin-reportes',
  templateUrl: './admin-reportes.page.html',
  styleUrls: ['./admin-reportes.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class AdminReportesPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
