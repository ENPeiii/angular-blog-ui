import { Component, signal } from '@angular/core';
import { APP_TITLE } from '../../core/constants/base-constant';

@Component({
  selector: 'app-footer',
  imports: [],
  template: `
    <footer class="text-center py-6 ">
      <nav class="space-x-4">
        <a
          href="https://github.com/ENPeiii"
          title="GitHub"
          target="_blank"
          class="hover:text-primary-500"
          rel="noreferrer noopener"
          ><i class="fa-brands fa-github"></i
        ></a>
        <a
          href="https://www.linkedin.com/in/enpei"
          title="LinkedIn"
          target="_blank"
          class="hover:text-primary-500"
          rel="noreferrer noopener"
          ><i class="fa-brands fa-linkedin"></i
        ></a>
      </nav>
      <p>{{ title() }} <span class="text-primary-500">&#64;</span> {{ year() }}</p>
    </footer>
  `,
  styles: ``,
})
export class Footer {
  year = signal(new Date().getFullYear());
  title = signal(APP_TITLE);
}
