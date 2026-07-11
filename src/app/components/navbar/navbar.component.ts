import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, SimpleChanges } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [MatIconModule, RouterLink, RouterModule, CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  standalone: true,
})

export class NavbarComponent {

  constructor(private router: Router) { }

  activeRouteScreen(path: string): boolean {
    return this.router.url === path;
  }

  scrollElement(element: string): void {
    const el = document.getElementById(element);
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

}
