import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, OnInit, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { Professional, Technical } from '../../../services/ModelsInterface';
import { ObserverService } from '../../../services/ObserverService';
import { ApiService } from '../../../services/api/api.service';
import { ProgressBarComponent } from '../../shared/progress-bar/progress-bar.component';
import { CircleProgressComponent } from '../../shared/circle-progress/circle-progress.component';
import { TagComponent } from '../../shared/tag/tag.component';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule, ProgressBarComponent, TagComponent],
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.css'],
})
export class SkillsComponent implements OnInit, AfterViewInit, OnDestroy {

  private technicalsResponse: Technical[] = []
  private professionalResponse: Professional[] = []
  technicalList: Technical[] = [];

  filter: string = 'backend';
  @Input() maxTechnicalsToShow: number | null = null;

  @ViewChild('skills') skillsRef!: ElementRef;

  constructor(
    private api: ApiService,
    private observerService: ObserverService,
  ) { }

  ngOnInit(): void {
    this.api.getTechnicalSkills().subscribe((response: Technical[]) => {
      this.technicalsResponse = response;
      this.technicalList = response;
    });
    this.api.getProfessionalSkills().subscribe((response: Professional[]) => {
      this.professionalResponse = response;
    });
  }

  ngAfterViewInit(): void {
    const section = this.skillsRef.nativeElement;
    this.observerService.observe(section);

    section.addEventListener('intersect', () => {
      document.getElementById('/skills')?.classList.add('active');
    });
    section.addEventListener('notintersect', () => {
      document.getElementById('/skills')?.classList.remove('active');
    });
  }

  ngOnDestroy(): void {
    this.observerService.unobserve(this.skillsRef.nativeElement);
  }

  getTechnicalList(): Technical[] {
    return this.technicalList = this.technicalsResponse.filter(item => item.type === this.filter);
  }

  getProfessionalList(): Professional[] {
    return this.professionalResponse;
  }
}