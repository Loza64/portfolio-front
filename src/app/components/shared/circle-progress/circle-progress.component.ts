import { Component, ElementRef, Input, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Professional } from '../../../services/ModelsInterface';
import { ObserverService } from '../../../services/ObserverService';

@Component({
  selector: 'app-circle-progress',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './circle-progress.component.html',
  styleUrls: ['./circle-progress.component.css'],
})
export class CircleProgressComponent implements AfterViewInit, OnDestroy {
  @Input() skill!: Professional;
  @ViewChild('article') articleRef!: ElementRef;

  constructor(private observerService: ObserverService) { }

  ngAfterViewInit(): void {
    const el = this.articleRef.nativeElement;
    this.observerService.observe(el);

    el.addEventListener('intersect', () => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0px)';
      const circle = el.querySelector('.circle') as HTMLElement;
      if (circle) circle.style.strokeDashoffset = 'calc(360 + (360 * (var(--percentage) / 100)))';
    });

    el.addEventListener('notintersect', () => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      const circle = el.querySelector('.circle') as HTMLElement;
      if (circle) {
        circle.style.strokeDashoffset = '360';
        circle.style.animation = 'auto';
      }
    });
  }

  ngOnDestroy(): void {
    this.observerService.unobserve(this.articleRef.nativeElement);
  }
}