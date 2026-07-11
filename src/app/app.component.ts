import { Component } from '@angular/core';
//import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './components/screens/home/home.component';

@Component({
  selector: 'app-root',
  imports: [NavbarComponent, HomeComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  standalone: true
})
export class AppComponent { }
