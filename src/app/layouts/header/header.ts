import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { APP_TITLE } from '../../core/constants/base-constant';
import { RouterLink } from '@angular/router';
import { ROUTES_CONSTANT } from '../../core/constants/routes-constant';
import { MatMenuModule } from '@angular/material/menu';
@Component({
  selector: 'app-header',
  imports: [RouterLink, CommonModule, MatMenuModule],
  template: `
    <header class="max-w-[1440px] mx-auto py-4 px-3 flex items-center justify-between">
      <a class="flex items-center group hover:text-primary-500" [routerLink]="['/']">
        <!-- logo -->
        <img
          class="w-8 border bg-white rounded-full p-1 mr-1 shake wait-0"
          src="images/logo/logo-s.png"
          alt="logo"
        />
        <!-- 動態字母 -->
        @for (word of title().split(' '); track $index) {
          <span class="shake px-0.5 font-bold hidden sm:inline" [class]="'wait-' + ($index + 1)">{{
            word
          }}</span>
        }
      </a>
      <div class="flex items-center space-x-6">
        <ng-container *ngTemplateOutlet="navMenu"></ng-container>
        <div class="flex items-center space-x-4">
          <button class="text-white hover:text-primary-500">
            <i class="fa-solid fa-magnifying-glass"></i>
          </button>
          <!-- GitHub -->
          <a
            href="https://github.com/ENPeiii"
            title="GitHub"
            target="_blank"
            rel="noreferrer noopener"
            class="text-white hover:text-primary-500"
          >
            <i class="fa-brands fa-github"></i>
          </a>
          <!-- LinkedIn -->
          <a
            href="https://www.linkedin.com/in/enpei"
            title="LinkedIn"
            target="_blank"
            rel="noreferrer noopener"
            class="text-white hover:text-primary-500"
          >
            <i class="fa-brands fa-linkedin"></i>
          </a>
        </div>
      </div>
      <button [matMenuTriggerFor]="menu">
        <i class="fa-solid fa-bars text-xl"></i>
      </button>
      <mat-menu #menu="matMenu">
        <ng-container *ngTemplateOutlet="navMenu"></ng-container>
      </mat-menu>
    </header>

    <ng-template #navMenu>
      <nav>
        <ul class="md:flex space-x-4">
          <li>
            <a class="hover:text-primary-500" [routerLink]="[ROUTES_CONSTANT['POSTS'].url]"
              >Posts</a
            >
          </li>
          <li>
            <a class="hover:text-primary-500" [routerLink]="[ROUTES_CONSTANT['TOPIC'].url]"
              >Topic</a
            >
          </li>
          <li>
            <a class="hover:text-primary-500" [routerLink]="[ROUTES_CONSTANT['TAGS'].url]">Tags</a>
          </li>
          <li>
            <a class="hover:text-primary-500" [routerLink]="[ROUTES_CONSTANT['ABOUT'].url]"
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
  title = signal(APP_TITLE);

  ROUTES_CONSTANT = ROUTES_CONSTANT;
}
