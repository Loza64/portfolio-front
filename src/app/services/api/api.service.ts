import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { About, Message, Professional, Project, Technical } from '../ModelsInterface';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {

  private readonly domain = environment.apiUrl;

  private readonly noCacheHeaders = new HttpHeaders({
    'Cache-Control': 'no-cache, no-store, must-revalidate',
  });

  constructor(private http: HttpClient) { }

  private get<T>(url: string): Observable<T> {
    return this.http
      .get<T>(`${this.domain}/${url}`, { headers: this.noCacheHeaders })
      .pipe(catchError(this.handleError));
  }

  private post<T>(url: string, body: unknown): Observable<T> {
    return this.http
      .post<T>(`${this.domain}/${url}`, body)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any) {
    const message = error?.error?.message ?? error?.message ?? 'Error inesperado al contactar el servidor';
    console.error('[ApiService] Error:', error);
    return throwError(() => new Error(message));
  }

  getProjects(): Observable<Project[]> {
    return this.get<Project[]>('api/projects');
  }

  newMessage(message: Message): Observable<Message> {
    return this.post<Message>('api/messages', message);
  }

  getProfessionalSkills(): Observable<Professional[]> {
    return this.get<Professional[]>('api/skills/professional');
  }

  getTechnicalSkills(): Observable<Technical[]> {
    return this.get<Technical[]>('api/skills/technical');
  }

  getAboutInfo(): Observable<About[]> {
    return this.get<About[]>('api/about');
  }
}