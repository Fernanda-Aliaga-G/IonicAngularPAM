import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseConfigService } from './services/fireBaseConfig/firebase-config.service';
import { UtilsService } from './services/utils/utils.service';
import { User } from './models/user.model';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  router = inject(Router);
  firebase = inject(FirebaseConfigService);
  utils = inject(UtilsService);
  rutaActual = '';
  paginas = [];

  constructor() {
    this.initializeApp();
  }

  ngOnInit() {
    this.router.events.subscribe((event: any) => {
      if (event?.url) this.rutaActual = event.url;
      this.mostrarMenu();
    });
  }

  logout() {
    this.firebase.signOut();
  }

  usuario(): User {
    return this.utils.getFromLocalStorage('user');
  }

  initializeApp() {
    this.router.navigateByUrl('splash');
  }

  mostrarMenu() {
    this.paginas = this.utils.menuPorRol();
  }
}
