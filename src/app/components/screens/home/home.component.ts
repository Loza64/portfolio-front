import { Component } from '@angular/core';
import { HeaderComponent } from '../../header/header.component';
import { ServicesComponent } from "../services/services.component";
import { ProjectsComponent } from "../projects/projects.component";
import { AboutComponent } from "../about/about.component";
import { SkillsComponent } from '../skills/skills.component';
import { ContactComponent } from '../contact/contact.component';

@Component({
  selector: 'app-home',
  imports: [HeaderComponent, SkillsComponent, ServicesComponent, ProjectsComponent, AboutComponent, ContactComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  standalone: true
})
export class HomeComponent { }
