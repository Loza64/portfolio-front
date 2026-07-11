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
      "text": "Creo aplicaciones web excepcionales y dinámicas. Mi solución es eficiente y optimizada, asegurando una mejor experiencia de usuario."
    },
    {
      "icon": "fas fa-shopping-cart",
      "title": "Desarrollo de E-commerce",
      "text": "Creo soluciones e-commerce personalizadas que integran pagos seguros y mejoran la experiencia de compra en línea."
    },
    {
      "icon": "fas fa-chart-line",
      "title": "SEO y Marketing Digital",
      "text": "Ofrezco servicios SEO para mejorar la visibilidad online de paginas web, fortalecer estrategias y potenciar la visibilidad en línea de sitios web."
    },
    {
      "icon": "fas fa-tools",
      "title": "Soporte y Mantenimiento",
      "text": "Ofrezco planes de mantenimiento personalizados para asegurar el funcionamiento óptimo y continuo, garantizando actualizaciones regulares y una optimización efectiva a lo largo del tiempo."
    },
    {
      "icon": "fas fa-code",
      "title": "Desarrollo de APIs",
      "text": "Creo APIs que permiten la integración de sistemas y desarrollan la funcionalidad de aplicaciones, optimizando así la comunicación entre diferentes plataformas para ofrecer una experiencia de usuario."
    },
    {
      "icon": "fas fa-project-diagram",
      "title": "Integración de Sistemas",
      "text": "Ayudo a unir aplicaciones y plataformas para mejorar la eficiencia y operatividad de tu negocio en su conjunto, facilitando la toma de decisiones y potenciando el crecimiento sostenido mediante soluciones integradas."
    },
    {
      "icon": "fas fa-cogs",
      "title": "Software a Medida",
      "text": "Creo soluciones personalizadas que se adaptan a los requerimientos específicos del cliente en todos los niveles."
    },
    {
      "icon": 'fa-solid fa-vial',
      "title": 'pruebasUnitarias',
      "text": 'Cobertura de pruebas unitarias con Jest, mocks de repositorios TypeORM y servicios dependientes para garantizar código confiable.'
    }
  ]

  getServicesList(): Service[] {
    return this.services
  }

}