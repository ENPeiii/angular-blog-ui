import { Component, ElementRef, inject, output, Renderer2, signal, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { APP_TITLE } from '../../core/constants/base-constant';
import { RouterLink } from '@angular/router';
import { ROUTES_CONSTANT } from '../../core/constants/routes-constant';
import { MatMenuModule } from '@angular/material/menu';
@Component({
  selector: 'app-header',
  imports: [RouterLink, CommonModule, MatMenuModule],
  template: `
    <header class="fixed w-full top-0 left-0 z-50" #header>
      <section class="max-w-[1440px] mx-auto p-4 flex items-center justify-between bg-dark-500 ">
        <a
          class="flex items-center group hover:text-primary-500  mr-auto md:mr-0"
          [routerLink]="['/']"
        >
          <!-- logo -->
          <img
            class="w-8 border bg-white rounded-full p-1 mr-1 shake wait-0"
            src="images/logo/logo-s.png"
            alt="logo"
          />
          <!-- 動態字母 -->
          @for (word of title().split(' '); track $index) {
            <span
              class="shake px-0.5 font-bold hidden sm:inline"
              [class]="'wait-' + ($index + 1)"
              >{{ word }}</span
            >
          }
        </a>
        <div class="flex items-center space-x-6">
          <div class="hidden md:block">
            <ng-container *ngTemplateOutlet="navMenu"></ng-container>
          </div>

          <div class="flex items-center space-x-4">
            <!-- Search -->
            <button class="text-white hover:text-primary-500">
              <i class="fa-solid fa-magnifying-glass"></i>
            </button>
            <!-- GitHub -->
            <a
              href="https://github.com/ENPeiii"
              title="GitHub"
              target="_blank"
              rel="noreferrer noopener"
              class="hover:text-primary-500"
            >
              <i class="fa-brands fa-github"></i>
            </a>
            <!-- LinkedIn -->
            <a
              href="https://www.linkedin.com/in/enpei"
              title="LinkedIn"
              target="_blank"
              rel="noreferrer noopener"
              class="hover:text-primary-500"
            >
              <i class="fa-brands fa-linkedin"></i>
            </a>
          </div>
        </div>
        <button
          [matMenuTriggerFor]="menu"
          class="inline-block md:hidden text-white hover:text-primary-500 ml-4"
        >
          <i class="fa-solid fa-bars text-xl"></i>
        </button>
        <mat-menu #menu="matMenu">
          <ng-container *ngTemplateOutlet="navMenu"></ng-container>
        </mat-menu>
      </section>
    </header>

    <ng-template #navMenu>
      <nav>
        <ul class="md:flex space-x-4 space-y-4 md:space-y-0 py-3 md:p-0">
          <li>
            <a
              class="hover:text-primary-500 px-5 py-3 md:p-0"
              [routerLink]="[ROUTES_CONSTANT['POSTS'].url]"
              >Posts</a
            >
          </li>
          <li>
            <a
              class="hover:text-primary-500 px-5 py-3 md:p-0"
              [routerLink]="[ROUTES_CONSTANT['TOPIC'].url]"
              >Topic</a
            >
          </li>
          <li>
            <a
              class="hover:text-primary-500 px-5 py-3 md:p-0"
              [routerLink]="[ROUTES_CONSTANT['TAGS'].url]"
              >Tags</a
            >
          </li>
          <li>
            <a
              class="hover:text-primary-500 px-5 py-3 md:p-0"
              [routerLink]="[ROUTES_CONSTANT['ABOUT'].url]"
              >About</a
            >
          </li>
        </ul>
      </nav>
    </ng-template>
  `,
  styles: ``,
})
export class Header {
  headerEl = viewChild.required<ElementRef>('header');
  height = output<number>();
  title = signal(APP_TITLE);
  ROUTES_CONSTANT = ROUTES_CONSTANT;

  ngAfterViewInit() {
    this.height.emit(this.headerEl().nativeElement.offsetHeight);
  }
}
