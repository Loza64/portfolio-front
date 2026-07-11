import { Component, ElementRef, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { SourceList } from '../../../services/SourceList';
import { CommonModule } from '@angular/common';
import { Service } from '../../../services/ModelsInterface';
import { ObserverService } from '../../../services/ObserverService';

@Component({
  selector: 'app-services',
  imports: [CommonModule],
  templateUrl: './services.component.html',
  styleUrl: './services.component.css',
  standalone: true,
})
export class ServicesComponent {

  listService: Service[] = [];

  @ViewChildren("article") articles!: QueryList<ElementRef>;
  @ViewChild("section") section!: ElementRef

  constructor(private list: SourceList, private intersectionService: ObserverService) { }

  ngOnInit() {
    this.listService = this.list.getServicesList();
  }

  ngAfterViewInit() {

    this.intersectionService.observe(this.section.nativeElement);
    this.articles.forEach(element => { this.intersectionService.observe(element.nativeElement) });

    this.section.nativeElement.addEventListener("intersect", () => {
      document.getElementById("/services")!.classList.add("active");
    })

    this.section.nativeElement.addEventListener("notintersect", () => {
      document.getElementById("/services")!.classList.remove("active");
    })

    this.articles.forEach(element => {
      element.nativeElement.addEventListener("intersect", () => {
        const article = element.nativeElement as HTMLAreaElement
        article.style.opacity = "1";
        article.style.transform = "translateX(0)"
      })
      element.nativeElement.addEventListener("notintersect", () => {
        const article = element.nativeElement as HTMLAreaElement
        article.style.opacity = "0";
        article.style.transform = "translateX(-20px)"
      })
    })
  }

  ngOnDestroy() {
    this.intersectionService.unobserve(this.section.nativeElement)
    this.articles.forEach(element => { this.intersectionService.unobserve(element.nativeElement) });
  }
}
