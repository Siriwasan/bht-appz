import { Injectable, OnDestroy } from '@angular/core';
import { fromEvent, Subject, Observable, Subscription } from 'rxjs';
import { throttleTime } from 'rxjs/operators';
import { animationFrame } from 'rxjs/internal/scheduler/animationFrame';

const TOP_OFFSET = 64; // estimate number

interface ScrollSpy {
  elements: HTMLElement[];
  currentSectionId: string;
  subject: Subject<string>;
}

interface ScrollSpies {
  [scrollSpyId: string]: ScrollSpy;
}

@Injectable()
export class ScrollSpyService implements OnDestroy {
  private readonly defaultId: string = 'default';
  private scrollTarget: Element;
  private scrollSpies: ScrollSpies = {};
  private scrollSubscription: Subscription;

  constructor() {}

  public ngOnDestroy(): void {
    this.scrollSubscription.unsubscribe();
  }

  public setScrollTarget(container: Element) {
    this.scrollTarget = container;
  }

  public getCurrentSection$(scrollSpyId: string = this.defaultId): Observable<string> {
    return this.scrollSpies[scrollSpyId].subject.asObservable();
  }

  public addElement(element: HTMLElement, scrollSpyId: string = this.defaultId): void {
    if (!this.scrollSpies[scrollSpyId]) {
      this.scrollSpies[scrollSpyId] = {
        elements: [],
        subject: new Subject(),
      } as ScrollSpy;
    }

    if (this.hasElement(element.id, scrollSpyId)) {
      return;
    }

    const elements: HTMLElement[] = this.scrollSpies[scrollSpyId].elements;
    elements.push(element);
    elements.sort(
      (a: HTMLElement, b: HTMLElement): number =>
        b.getBoundingClientRect().top - a.getBoundingClientRect().top
    );

    this.scrollSpies[scrollSpyId].elements = elements;
  }

  public removeElement(element: HTMLElement, scrollSpyId: string = this.defaultId): void {
    const elements: HTMLElement[] = this.scrollSpies[scrollSpyId].elements.filter(
      (el: HTMLElement): boolean => el.id !== element.id
    );

    if (!elements.length) {
      delete this.scrollSpies[scrollSpyId];
      return;
    }

    this.scrollSpies[scrollSpyId].elements = elements;
  }

  private hasElement(elementId: string, scrollSpyId: string): boolean {
    return this.scrollSpies[scrollSpyId].elements.some(
      (element: HTMLElement): boolean => element.id === elementId
    );
  }

  public subscribeScroll(): void {
    this.scrollSubscription = fromEvent(this.scrollTarget, 'scroll')
      .pipe(throttleTime(0, animationFrame))
      .subscribe((): void => {
        Object.keys(this.scrollSpies).forEach((key: string): void => {
          const { currentSectionId, elements, subject } = this.scrollSpies[key];
          const topElementInView: HTMLElement = elements.filter(
            (element: HTMLElement): boolean => element.getBoundingClientRect().top <= TOP_OFFSET + 1
          )[0];

          if (!topElementInView) {
            this.scrollSpies[key].currentSectionId = undefined;
            subject.next('');
            return;
          }

          const topElementId: string = topElementInView.id;

          if (topElementId !== currentSectionId) {
            this.scrollSpies[key].currentSectionId = topElementId;
            subject.next(topElementId);

            // scroll TOC to current section
            const tocTarget = document.getElementById(topElementId + 'TOC');
            if (tocTarget !== null) {
              tocTarget.scrollIntoView({ block: 'nearest' });
            }
          }
        });
      });
  }

  scrollTo(section: string) {
    document.getElementById(section).scrollIntoView(true);
  }
}
