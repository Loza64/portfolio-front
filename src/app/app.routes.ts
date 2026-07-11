import { Routes } from '@angular/router';
import { HomeComponent } from './components/screens/home/home.component';
import { ContactComponent } from './components/screens/contact/contact.component';
import { ServicesComponent } from './components/screens/services/services.component';
import { AboutComponent } from './components/screens/about/about.component';
import { ProjectsComponent } from './components/screens/projects/projects.component';
import { SkillsComponent } from './components/screens/skills/skills.component';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
    },
    {
        path: 'contact',
        component: ContactComponent
    },
    {
        path: 'services',
        component: ServicesComponent
    },

    {
        path: 'skills',
        component: SkillsComponent
    },
    {
        path: 'about',
        component: AboutComponent
    },
    {
        path: 'projects',
        component: ProjectsComponent
    }
];
