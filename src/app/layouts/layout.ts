import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { Header } from './header/header';
import { Footer } from './footer/footer';
import { fromEvent, Subscription } from 'rxjs';
import { throttleTime } from 'rxjs/operators';
import { LayoutConfig } from '../core/services/layout-config';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, Header, Footer],
  template: `
    <app-header (height)="setHeaderHeight($event)" />
    <section
      class="flex-1 w-full mx-auto px-4 md:px-8"
      [style.maxWidth]="layoutConfig.maxW()"
      [style.--blog-max-w]="layoutConfig.maxW()"
      [style.marginTop.px]="headerHeight()"
    >
      <router-outlet />
    </section>

    <!-- @if (shouldShowScrollButton()) {
    <div class="fixed bottom-40 z-50 w-full flex justify-center pointer-events-none">
      <div class="w-full px-4 md:px-8 flex justify-end" [style.maxWidth]="layoutConfig.maxW()">
        <button
          (click)="scrollToTop()"
          class="border-1 border-white rounded-lg px-2 py-1 hover:border-primary-500 group transition-opacity pointer-events-auto"
          type="button"
        >
          <i class="fa-solid fa-chevron-up group-hover:text-primary-500"></i>
        </button>
      </div>
    </div>
    } -->

    <app-footer />
  `,
  styles: `
    :host {
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      min-height: 100vh;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Layout implements OnInit, OnDestroy {
  layoutConfig = inject(LayoutConfig);
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);
  private scrollSub?: Subscription;

  headerHeight = signal<number>(0);
  scrollHeight = signal<number>(0);
  shouldShowScrollButton = computed(() => this.scrollHeight() > this.headerHeight() * 2);

  setHeaderHeight(e: number): void {
    this.headerHeight.set(e);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      this.scrollSub = fromEvent(window, 'scroll')
        .pipe(throttleTime(100, undefined, { leading: true, trailing: true }))
        .subscribe(() => this.scrollHeight.set(window.scrollY));
    }
  }

  ngOnDestroy(): void {
    this.scrollSub?.unsubscribe();
  }

  scrollToTop(): void {
    if (this.isBrowser) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}
