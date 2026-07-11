import { Component, ViewChild, ElementRef, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ObserverService } from '../../../services/ObserverService';
import { Project } from '../../../services/ModelsInterface';
import { ApiService } from '../../../services/api/api.service';
import { CardComponent } from '../../shared/card/card.component';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, CardComponent],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css',
})
export class ProjectsComponent implements OnInit, AfterViewInit, OnDestroy {

  projects: Project[] = [];

  @ViewChild('section') sectionRef!: ElementRef;

  constructor(private api: ApiService, private intersect: ObserverService) { }

  ngOnInit(): void {
    this.api.getProjects().subscribe((data: Project[]) => {
      this.projects = data.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    });
  }

  ngAfterViewInit(): void {
    const section = this.sectionRef.nativeElement;
    this.intersect.observe(section);

    section.addEventListener('intersect', () => {
      document.getElementById('/projects')?.classList.add('active');
    });
    section.addEventListener('notintersect', () => {
      document.getElementById('/projects')?.classList.remove('active');
    });
  }

  ngOnDestroy(): void {
    this.intersect.unobserve(this.sectionRef.nativeElement);
  }
}