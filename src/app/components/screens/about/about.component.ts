import { Component, ElementRef, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { About } from '../../../services/ModelsInterface';
import { ApiService } from '../../../services/api/api.service';
import { CommonModule } from '@angular/common';
import { ObserverService } from '../../../services/ObserverService';

@Component({
  selector: 'app-about',
  imports: [MatIcon, CommonModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css',
  standalone: true
})
export class AboutComponent {

  about: About[] = [];

  private readonly EXPAND_THRESHOLD = 140;
  private expandedIndexes = new Set<number>();

  constructor(
    private api: ApiService,
    private observer: ObserverService,
  ) { }

  @ViewChildren("article") articles!: QueryList<ElementRef>;
  @ViewChild("section") section!: ElementRef

  ngOnInit() {
    this.api.getAboutInfo().subscribe((data) => {
      // Mas reciente primero: cuenta mejor la historia profesional.
      this.about = [...data].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    })
  }

  ngAfterViewInit() {
    this.articles.forEach((article) => {
      this.observer.observe(article.nativeElement);

      article.nativeElement.addEventListener("intersect", () => {
        const content = article.nativeElement.querySelector(".content") as HTMLElement;
        const icon = article.nativeElement.querySelector("mat-icon") as HTMLElement;
        content.style.opacity = "1";
        content.style.transform = "translateY(0)";
        icon.style.transform = "scale(100%)";
        icon.style.opacity = "1";
        icon.style.transition = "transform 0.5s ease-in-out, opacity 0.5s ease-in-out";
        content.style.transition = "transform 0.5s ease-in-out, opacity 0.5s ease-in-out";
      });

      article.nativeElement.addEventListener("notintersect", () => {
        const content = article.nativeElement.querySelector(".content") as HTMLElement;
        const icon = article.nativeElement.querySelector("mat-icon") as HTMLElement;
        content.style.opacity = "0";
        content.style.transform = "translateY(50px)";
        icon.style.transform = "scale(200%)";
        icon.style.opacity = "0";
        icon.style.transition = "transform 0.5s ease-in-out, opacity 0.5s ease-in-out";
        content.style.transition = "transform 0.5s ease-in-out, opacity 0.5s ease-in-out";
      });
    });

    this.observer.observe(this.section.nativeElement)

    const sectionObserver = this.section.nativeElement as HTMLElement

    sectionObserver.addEventListener("intersect", () => {
      document.getElementById("/about")?.classList.add("active");
    })

    sectionObserver.addEventListener("notintersect", () => {
      document.getElementById("/about")?.classList.remove("active");
    })
  }

  /** Icono segun el tipo de experiencia, solo para dar variedad visual. */
  getIcon(title: string): string {
    const normalized = title.toLowerCase();

    if (normalized.includes('instructor')) return 'school';
    if (normalized.includes('fundacion') || normalized.includes('fundación')) return 'volunteer_activism';
    if (normalized.includes('chat') || normalized.includes('dashboard')) return 'dashboard';

    return 'work_history';
  }

  needsToggle(description: string): boolean {
    return description.length > this.EXPAND_THRESHOLD;
  }

  isExpanded(index: number): boolean {
    return this.expandedIndexes.has(index);
  }

  toggleExpand(index: number): void {
    if (this.expandedIndexes.has(index)) {
      this.expandedIndexes.delete(index);
    } else {
      this.expandedIndexes.add(index);
    }
  }
}
