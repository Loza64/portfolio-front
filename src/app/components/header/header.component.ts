import { Component, ElementRef, ViewChild } from '@angular/core';
import { ObserverService } from '../../services/ObserverService';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  standalone: true,
})

export class HeaderComponent {

  @ViewChild('header') header!: ElementRef;
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

  ngOnDestroy() {
    this.intersection.unobserve(this.header.nativeElement)
  }

}