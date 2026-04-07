import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  input,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';
import { Post, Posts } from '../services/posts';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MdViewer } from '../../../shared/tui-editor/md-viewer/md-viewer';
import { RouterLink } from '@angular/router';
import { fromEvent, Subscription } from 'rxjs';
import { throttleTime } from 'rxjs/operators';
import { LayoutConfig } from '../../../core/services/layout-config';

@Component({
  selector: 'app-blog-content',
  imports: [MdViewer, RouterLink],
  templateUrl: './blog-content.html',
  styleUrl: './blog-content.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogContent implements OnInit, OnDestroy {
  blogId = input<string>();

  post = signal<Post | null>(null);
  title = computed(() => this.post()?.title || '');
  date = computed(() => this.post()?.date || '');
  content = computed(() => this.post()?.content || '');
  tags = computed(() => this.post()?.tags || []);
  toc = computed(() => this.post()?.toc || []);
  tocOpen = signal(false);
  activeHeading = signal<string>('');

  private destroyRef = inject(DestroyRef);
  private document = inject(DOCUMENT);
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);
  private scrollSpySub?: Subscription;
  private spyTimeout?: ReturnType<typeof setTimeout>;
  private layoutConfig = inject(LayoutConfig);

  constructor(private service: Posts) {
    effect(() => {
      if (this.toc().length > 0 && this.isBrowser) {
        clearTimeout(this.spyTimeout);
        // 等待 MdViewer 非同步渲染完成
        this.spyTimeout = setTimeout(() => this.setupScrollSpy(), 300);
      }
    });
  }

  ngOnInit(): void {
    this.loadPost();
    this.layoutConfig.maxW.set('785px');
  }

  ngOnDestroy(): void {
    this.scrollSpySub?.unsubscribe();
    clearTimeout(this.spyTimeout);
    this.layoutConfig.maxW.set('1024px');
  }

  scrollToHeading(heading: string): void {
    const h2Elements = this.document.querySelectorAll('h2');
    for (const el of Array.from(h2Elements)) {
      if (el.textContent?.trim() === heading) {
        const headerHeight = this.document.querySelector('app-header header')?.getBoundingClientRect().height ?? 64;
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

    // 等瀏覽器完成佈局後做初始檢查，避免 h2 位置尚未計算完畢
    requestAnimationFrame(check);
  }

  private loadPost(): void {
    this.service
      .getPost$(this.blogId()!)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => this.post.set(res),
        error: (error) => {
          console.error('載入文章失敗:', error);
          this.post.set(null);
        },
      });
  }
}
