import { Component, HostListener, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, inject } from '@angular/core';
import { Header } from './header/header';
import { Footer } from './footer/footer';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, Header, Footer],
  template: `
    <app-header (height)="setHeaderHeight($event)" />
    <section
      class="flex-1 w-full max-w-[1024px] mx-auto px-4 md:px-8"
      [style.marginTop.px]="headerHeight()"
    >
      <router-outlet />
    </section>

    @if (shouldShowScrollButton()) {
    <div class="fixed bottom-20 z-50 w-full flex justify-center pointer-events-none">
      <div class="w-full max-w-[1024px] px-4 md:px-8 flex justify-end">
        <button
          (click)="scrollToTop()"
          class="border-1 border-white rounded-lg px-2 py-1 hover:border-primary-500 group transition-opacity pointer-events-auto"
          type="button"
        >
          <i class="fa-solid fa-chevron-up group-hover:text-primary-500"></i>
        </button>
      </div>
    </div>
    }

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
})
export class Layout {
  platformId = inject(PLATFORM_ID);
  isBrowser = isPlatformBrowser(this.platformId);

  headerHeight = signal<number>(0);
  scrollHeight = signal<number>(0);

  setHeaderHeight(e: number): void {
    this.headerHeight.set(e);
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    if (this.isBrowser) {
      this.scrollHeight.set(window.scrollY);
    }
  }

  shouldShowScrollButton = (): boolean => {
    return this.scrollHeight() > this.headerHeight()*2;
  };

  scrollToTop(): void {
    if (this.isBrowser) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}
