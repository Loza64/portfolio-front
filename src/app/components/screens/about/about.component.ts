import {
  AfterViewInit,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  QueryList,
  ViewChild,
  ViewChildren,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { About } from '../../../services/ModelsInterface';
import { ApiService } from '../../../services/api/api.service';
import { ObserverService } from '../../../services/ObserverService';

@Component({
  selector: 'app-about',
  imports: [MatIcon, CommonModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css',
  standalone: true
})
export class AboutComponent implements OnInit, AfterViewInit, OnDestroy {

  /**
   * Cuántas experiencias se ven al entrar. El resto queda detrás del botón
   * "Ver experiencia anterior". Sube el número para mostrar más, o ponlo en
   * Infinity para desactivar el botón.
   */
  readonly INITIAL_VISIBLE = 4;

  private readonly items = signal<About[]>([]);
  private readonly showAll = signal(false);
  private readonly expandedIds = signal<ReadonlySet<string>>(new Set());
  /** Ids cuya descripción realmente se corta (se mide en el navegador). */
  private readonly collapsibleIds = signal<ReadonlySet<string>>(new Set());

  readonly visibleItems = computed(() =>
    this.showAll() ? this.items() : this.items().slice(0, this.INITIAL_VISIBLE)
  );
  readonly hasMore = computed(() => this.items().length > this.INITIAL_VISIBLE);
  readonly hiddenCount = computed(() =>
    this.showAll() ? 0 : Math.max(0, this.items().length - this.INITIAL_VISIBLE)
  );
  readonly listExpanded = this.showAll.asReadonly();

  readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  @ViewChildren('article') articles!: QueryList<ElementRef<HTMLElement>>;
  @ViewChildren('desc') descriptions!: QueryList<ElementRef<HTMLElement>>;
  @ViewChild('section') section!: ElementRef<HTMLElement>;

  private resizeObserver: ResizeObserver | null = null;
  private readonly boundArticles = new WeakSet<Element>();
  private readonly boundDescriptions = new WeakSet<Element>();
  private subscriptions: { unsubscribe(): void }[] = [];

  constructor(
    private api: ApiService,
    private observer: ObserverService,
    private zone: NgZone,
  ) { }

  ngOnInit() {
    this.api.getAboutInfo().subscribe((data) => {
      // Más reciente primero, ordenado por la fecha que se muestra en pantalla.
      this.items.set([...data].sort((a, b) => this.time(b) - this.time(a)));
    });
  }

  ngAfterViewInit() {
    // Los datos llegan después de la primera vista: hay que enganchar los
    // elementos cada vez que la lista cambia, no solo una vez.
    this.subscriptions.push(
      this.articles.changes.subscribe(() => this.bindArticles()),
      this.descriptions.changes.subscribe(() => this.bindDescriptions()),
    );
    this.bindArticles();
    this.bindDescriptions();

    // Resalta "Sobre mí" en la barra de navegación mientras la sección está visible.
    const sectionEl = this.section.nativeElement;
    this.observer.observe(sectionEl);
    sectionEl.addEventListener('intersect', () => {
      document.getElementById('/about')?.classList.add('active');
    });
    sectionEl.addEventListener('notintersect', () => {
      document.getElementById('/about')?.classList.remove('active');
    });
  }

  ngOnDestroy() {
    this.resizeObserver?.disconnect();
    this.subscriptions.forEach((s) => s.unsubscribe());
    this.articles?.forEach((a) => this.observer.unobserve(a.nativeElement));
    if (this.section) this.observer.unobserve(this.section.nativeElement);
  }

  /* ---------- Presentación ---------- */

  formatDate(value: string): string {
    const date = new Date(value);
    if (isNaN(date.getTime())) return value;

    const text = new Intl.DateTimeFormat('es', { month: 'short', year: 'numeric' })
      .format(date)
      .replace(/\./g, '')
      .replace(' de ', ' ');

    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  /** Icono segun el tipo de experiencia, solo para dar variedad visual. */
  getIcon(title: string): string {
    const normalized = title.toLowerCase();

    if (normalized.includes('instructor')) return 'school';
    if (normalized.includes('fundacion') || normalized.includes('fundación')) return 'volunteer_activism';
    if (normalized.includes('chat') || normalized.includes('dashboard')) return 'dashboard';

    return 'work_history';
  }

  /* ---------- "Ver más" por experiencia ---------- */

  isExpanded(id: string): boolean {
    return this.expandedIds().has(id);
  }

  isCollapsible(id: string): boolean {
    return this.collapsibleIds().has(id);
  }

  toggleExpand(id: string, desc: HTMLElement, article: HTMLElement): void {
    const opening = !this.isExpanded(id);

    if (opening) {
      // El alto real se guarda para poder animar la apertura con CSS.
      desc.style.setProperty('--full-h', `${desc.scrollHeight}px`);
    } else if (article.getBoundingClientRect().top < 0) {
      // Al cerrar una tarjeta larga, no dejar al usuario perdido más abajo.
      article.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    this.expandedIds.set(this.withToggled(this.expandedIds(), id));
  }

  /* ---------- "Ver experiencia anterior" (toda la lista) ---------- */

  toggleList(): void {
    const collapsing = this.showAll();
    this.showAll.set(!collapsing);

    if (collapsing) {
      this.section.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  /* ---------- Internos ---------- */

  private time(item: About): number {
    const t = new Date(item.date).getTime();
    return isNaN(t) ? new Date(item.createdAt).getTime() : t;
  }

  private withToggled(set: ReadonlySet<string>, id: string): Set<string> {
    const next = new Set(set);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  }

  private bindArticles() {
    this.articles.forEach((ref) => {
      const el = ref.nativeElement;
      if (this.boundArticles.has(el)) return;
      this.boundArticles.add(el);

      // Aparece una sola vez: evita el parpadeo de ocultarse al salir de pantalla.
      el.addEventListener('intersect', () => {
        el.classList.add('is-visible');
        this.observer.unobserve(el);
      }, { once: true });

      this.observer.observe(el);
    });
  }

  private bindDescriptions() {
    if (!this.isBrowser || typeof ResizeObserver === 'undefined') return;

    // Mide el texto real: cambia con el ancho de pantalla y al cargar la fuente.
    this.resizeObserver ??= new ResizeObserver((entries) => {
      this.zone.run(() => entries.forEach((e) => this.measure(e.target as HTMLElement)));
    });

    this.descriptions.forEach((ref) => {
      const el = ref.nativeElement;
      if (this.boundDescriptions.has(el)) return;
      this.boundDescriptions.add(el);
      this.resizeObserver!.observe(el);
    });
  }

  private measure(el: HTMLElement) {
    const id = el.dataset['id'];
    if (!id) return;

    if (this.isExpanded(id)) {
      // Abierta: mantener el alto actualizado si cambia el ancho.
      el.style.setProperty('--full-h', `${el.scrollHeight}px`);
      return;
    }

    const cut = el.scrollHeight - el.clientHeight > 1;
    if (cut === this.isCollapsible(id)) return;

    const next = new Set(this.collapsibleIds());
    cut ? next.add(id) : next.delete(id);
    this.collapsibleIds.set(next);
  }
}
