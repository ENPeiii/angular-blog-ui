import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  OnDestroy,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';
import { Post as PostData } from '../../pages/posts-page/services/posts';
import { MdViewer } from '../tui-editor/md-viewer/md-viewer';
import { RouterLink } from '@angular/router';
import { fromEvent, Subscription } from 'rxjs';
import { throttleTime } from 'rxjs/operators';

@Component({
  selector: 'app-post',
  imports: [MdViewer, RouterLink],
  templateUrl: './post.html',
  styleUrl: './post.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostComponent implements OnDestroy {
  post = input<PostData | null>(null);

  title = computed(() => this.post()?.title || '');
  date = computed(() => this.post()?.date || '');
  content = computed(() => this.post()?.content || '');
  tags = computed(() => this.post()?.tags || []);
  toc = computed(() => this.post()?.toc || []);
  tocOpen = signal(false);
  activeHeading = signal<string>('');

  private document = inject(DOCUMENT);
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);
  private scrollSpySub?: Subscription;
  private spyTimeout?: ReturnType<typeof setTimeout>;

  constructor() {
    effect(() => {
      if (this.toc().length > 0 && this.isBrowser) {
        clearTimeout(this.spyTimeout);
        this.spyTimeout = setTimeout(() => this.setupScrollSpy(), 300);
      }
    });
  }

  ngOnDestroy(): void {
    this.scrollSpySub?.unsubscribe();
    clearTimeout(this.spyTimeout);
  }

  scrollToHeading(heading: string): void {
    const h2Elements = this.document.querySelectorAll('h2');
    for (const el of Array.from(h2Elements)) {
      if (el.textContent?.trim() === heading) {
        const headerHeight =
          this.document.querySelector('app-header header')?.getBoundingClientRect().height ?? 64;
        const top = el.getBoundingClientRect().top + window.scrollY - headerHeight - 16;
        window.scrollTo({ top, behavior: 'smooth' });
        break;
      }
    }
  }

  private setupScrollSpy(): void {
    this.scrollSpySub?.unsubscribe();
    const h2s = Array.from(this.document.querySelectorAll('h2'));
    if (h2s.length === 0) return;

    const threshold =
      (this.document.querySelector('app-header header')?.getBoundingClientRect().height ?? 64) + 16;

    const check = () => {
      let active = '';
      for (const h2 of h2s) {
        if (h2.getBoundingClientRect().top <= threshold) {
          active = h2.textContent?.trim() || '';
        }
      }
      this.activeHeading.set(active);
    };

    this.scrollSpySub = fromEvent(window, 'scroll')
      .pipe(throttleTime(100, undefined, { leading: true, trailing: true }))
      .subscribe(check);

    requestAnimationFrame(check);
  }
}
