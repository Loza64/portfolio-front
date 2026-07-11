import { Component, ElementRef, Input, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Project } from '../../../services/ModelsInterface';
import { ObserverService } from '../../../services/ObserverService';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css'],
})
export class CardComponent implements AfterViewInit, OnDestroy {
  @Input() project!: Project;
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
      el.style.transform = 'translateY(-30px)';
    });
  }

  ngOnDestroy(): void {
    this.observerService.unobserve(this.articleRef.nativeElement);
  }
}