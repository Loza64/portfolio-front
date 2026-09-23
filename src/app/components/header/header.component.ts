import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, ViewChild } from '@angular/core';
import { ObserverService } from '../../services/ObserverService';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  standalone: true,
})

export class HeaderComponent implements AfterViewInit, OnDestroy {

  @ViewChild('header') header!: ElementRef<HTMLElement>;
  constructor(private intersection: ObserverService) { }

  ngAfterViewInit() {
    this.intersection.observe(this.header.nativeElement)
    this.header.nativeElement.addEventListener('intersect', () => {
      document.getElementById('/home')?.classList.add('active');
    })

    this.header.nativeElement.addEventListener('notintersect', () => {
      document.getElementById('/home')?.classList.remove('active');
    })
  }

  /** El resplandor del fondo sigue al cursor (solo en dispositivos con mouse). */
  @HostListener('pointermove', ['$event'])
  onPointerMove(event: PointerEvent): void {
    if (event.pointerType !== 'mouse' || !this.header) return;
    const el = this.header.nativeElement;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${event.clientX - rect.left}px`);
    el.style.setProperty('--my', `${event.clientY - rect.top}px`);
  }

  ngOnDestroy() {
    this.intersection.unobserve(this.header.nativeElement)
  }

}
