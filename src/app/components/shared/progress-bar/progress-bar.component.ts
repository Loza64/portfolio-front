import { Component, ElementRef, Input, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Technical } from '../../../services/ModelsInterface';
import { ObserverService } from '../../../services/ObserverService';

@Component({
  selector: 'app-progress-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.css'],
})
export class ProgressBarComponent implements AfterViewInit, OnDestroy {
  @Input() skill!: Technical;
  @ViewChild('article') articleRef!: ElementRef;

  constructor(private observerService: ObserverService) { }

  ngAfterViewInit(): void {
    const el = this.articleRef.nativeElement;
    this.observerService.observe(el);

    el.addEventListener('intersect', () => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    });

    el.addEventListener('notintersect', () => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(50px)';
    });
  }

  ngOnDestroy(): void {
    this.observerService.unobserve(this.articleRef.nativeElement);
  }
}