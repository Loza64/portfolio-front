import { Component, ElementRef, Input, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Professional } from '../../../services/ModelsInterface';
import { ObserverService } from '../../../services/ObserverService';

@Component({
  selector: 'app-tag',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.css']
})
export class TagComponent implements AfterViewInit, OnDestroy {
  @Input() item!: Professional;
  @ViewChild('chip') chipRef!: ElementRef;

  constructor(private observerService: ObserverService) { }

  ngAfterViewInit(): void {
    const el = this.chipRef.nativeElement;
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
    this.observerService.unobserve(this.chipRef.nativeElement);
  }
}