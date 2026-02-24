import { Component, signal } from '@angular/core';
import { APP_TITLE } from '../../core/constants/base-constant';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
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
        <nav>
          <ul class="flex space-x-4">
            <li>
              <a class="hover:text-primary-500" [routerLink]="['/about']">Posts</a>
            </li>
            <li>
              <a class="hover:text-primary-500" [routerLink]="['/services']">Topic</a>
            </li>
            <li>
              <a class="hover:text-primary-500" [routerLink]="['/contact']">Tags</a>
            </li>
            <li>
              <a class="hover:text-primary-500" [routerLink]="['/contact']">About</a>
            </li>
          </ul>
        </nav>
        <div class="flex items-center space-x-4">
          <button class="text-white hover:text-primary-500">
            <i class="fa-solid fa-magnifying-glass"></i>
          </button>
          <a href="https://github.com/ENPeiii" target="_blank" rel="noreferrer noopener" class="text-white hover:text-primary-500">
            <i class="fa-brands fa-github"></i>
          </a>
          <a href="https://www.linkedin.com/in/enpei" target="_blank" rel="noreferrer noopener" class="text-white hover:text-primary-500">
            <i class="fa-brands fa-linkedin"></i>
          </a>
        </div>
      </div>
    </header>
  `,
  styles: ``,
})
export class Header {
  title = signal(APP_TITLE);
}
