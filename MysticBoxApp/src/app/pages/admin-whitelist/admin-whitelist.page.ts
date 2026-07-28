import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-admin-whitelist',
  templateUrl: './admin-whitelist.page.html',
  styleUrls: ['./admin-whitelist.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class AdminWhitelistPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
