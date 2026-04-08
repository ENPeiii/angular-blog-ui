import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  inject,
  input,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Posts } from '../services/posts';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LayoutConfig } from '../../../core/services/layout-config';
import { Post, PostComponent } from '../../../shared/post/post';
import { GiscusComment } from '../../../shared/giscus-comment/giscus-comment';

@Component({
  selector: 'app-blog-content',
  imports: [PostComponent,GiscusComment],
  templateUrl: './blog-content.html',
  styleUrl: './blog-content.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogContent implements OnInit, OnDestroy {
  blogId = input<string>();
  post = signal<Post | null>(null);

  private destroyRef = inject(DestroyRef);
  private layoutConfig = inject(LayoutConfig);
  private titleService = inject(Title);

  constructor(private service: Posts) {
    effect(() => {
      const id = this.blogId();
      if (id) this.loadPost();
    });
  }

  ngOnInit(): void {
    this.layoutConfig.maxW.set('785px');
  }

  ngOnDestroy(): void {
    this.layoutConfig.maxW.set('1024px');
  }

  private loadPost(): void {
    this.service
      .getPost$(this.blogId()!)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.post.set(res);
          if (res?.title) {
            this.titleService.setTitle(`${res.title}`);
          }
        },
        error: (error) => {
          console.error('載入文章失敗:', error);
          this.post.set(null);
        },
      });
  }
}
