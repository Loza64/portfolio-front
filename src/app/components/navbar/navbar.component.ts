import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
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
export class NavbarComponent implements AfterViewInit, OnDestroy {

  @ViewChild('bar') bar!: ElementRef<HTMLElement>;

  private frame = 0;
  private readonly onScroll = () => {
    if (this.frame) return;
    this.frame = requestAnimationFrame(() => {
      this.frame = 0;
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      const ratio = max > 0 ? Math.min(doc.scrollTop / max, 1) : 0;
      this.bar.nativeElement.style.transform = `scaleX(${ratio})`;
    });
  };

  constructor(private router: Router, @Inject(PLATFORM_ID) private platformId: object) { }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    window.addEventListener('scroll', this.onScroll, { passive: true });
    this.onScroll();
  }

  ngOnDestroy(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    window.removeEventListener('scroll', this.onScroll);
    if (this.frame) cancelAnimationFrame(this.frame);
  }

  activeRouteScreen(path: string): boolean {
    return this.router.url === path;
  }

  scrollElement(element: string): void {
    const el = document.getElementById(element);
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

}
