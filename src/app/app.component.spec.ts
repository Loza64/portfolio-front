import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { routes } from './app.routes';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent, routes]
    }).compileComponents();
  });
});
