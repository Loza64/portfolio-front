import { Injectable } from "@angular/core";
import { About, Professional, Project, Service, Technical } from "./ModelsInterface";


@Injectable({
  providedIn: 'root'
})

export class SourceList {

  private services: Service[] = [
    {
      "icon": "fas fa-laptop-code",
      "title": "Desarrollo web",
    },
    {
      "icon": "fas fa-shopping-cart",
      "title": "Desarrollo de E-commerce",
    },
    {
      "icon": "fas fa-chart-line",
      "title": "SEO y Marketing Digital",
    },
    {
      "icon": "fas fa-tools",
      "title": "Soporte y Mantenimiento",
    },
    {
      "icon": "fas fa-code",
      "title": "Desarrollo de APIs",
    },
    {
      "icon": "fas fa-project-diagram",
      "title": "Integración de Sistemas",
    },
    {
      "icon": "fas fa-cogs",
      "title": "Software a Medida",
    },
    {
      "icon": 'fa-solid fa-vial',
      "title": 'Pruebas unitarias',
    }
  ]

  getServicesList(): Service[] {
    return this.services
  }

}