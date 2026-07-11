import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormComponent } from '../../form/form.component';
import { ObserverService } from '../../../services/ObserverService';

@Component({
  selector: 'app-contact',
  imports: [FormComponent],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css',
  standalone: true,
})
export class ContactComponent {
  @ViewChild("section") section !: ElementRef

  constructor(private observerService: ObserverService) {

  }

  ngAfterViewInit() {

    this.observerService.observe(this.section.nativeElement)

    const element = this.section.nativeElement as HTMLElement;
    element.addEventListener("intersect", () => {
      document.getElementById("/contact")?.classList.add("active")
    })

    element.addEventListener("notintersect", () => {
      document.getElementById("/contact")?.classList.remove("active")
    })
  }
}
