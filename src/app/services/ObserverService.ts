import { Injectable, NgZone } from "@angular/core";

@Injectable({
    providedIn: 'root'
})

export class ObserverService {
    private observer: IntersectionObserver | null = null;

    constructor(private ngZone: NgZone) {

        this.ngZone.runOutsideAngular(() => {
            if (typeof IntersectionObserver !== 'undefined') {
                this.observer = new IntersectionObserver(
                    (entries) => {
                        entries.forEach(entry => {
                            const target = entry.target as HTMLElement;
                            if (entry.isIntersecting) {
                                target.dispatchEvent(new CustomEvent('intersect'));
                            } else {
                                target.dispatchEvent(new CustomEvent('notintersect'));
                            }
                        });
                    },
                    {
                        root: null,
                        rootMargin: '0px',
                        threshold: 0.3
                    }
                );
            }
        });
    }

    observe(element: Element) {
        if (this.observer) {
            this.observer.observe(element);
        }
    }

    unobserve(element: Element) {
        if (this.observer) {
            this.observer.unobserve(element);
        }
    }
}  