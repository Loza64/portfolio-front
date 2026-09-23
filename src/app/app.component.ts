import { Component, ViewEncapsulation } from '@angular/core';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './components/screens/home/home.component';

@Component({
  selector: 'app-root',
  imports: [NavbarComponent, HomeComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  // Sin encapsulación: este archivo define los tokens y utilidades globales del diseño.
  encapsulation: ViewEncapsulation.None,
  standalone: true
})
export class AppComponent {
  year = new Date().getFullYear();
}
