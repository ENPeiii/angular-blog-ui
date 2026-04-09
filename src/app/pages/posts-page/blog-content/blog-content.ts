import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  input,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Posts } from '../services/posts';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { LayoutConfig } from '../../../core/services/layout-config';
import { Post, PostComponent } from '../../../shared/post/post';
import { GiscusComment } from '../../../shared/giscus-comment/giscus-comment';
import { filter, switchMap } from 'rxjs';

@Component({
  selector: 'app-blog-content',
  imports: [PostComponent, GiscusComment],
  templateUrl: './blog-content.html',
  styleUrl: './blog-content.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogContent implements OnInit, OnDestroy {
  blogId = input<string>();
  post = signal<Post | null>(null);

  private readonly destroyRef = inject(DestroyRef);
  private readonly layoutConfig = inject(LayoutConfig);
  private readonly titleService = inject(Title);

  constructor(private service: Posts) {
    // switchMap 確保 blogId 變更時自動取消前一個 HTTP 請求，避免訂閱累積與資料競爭
    toObservable(this.blogId)
      .pipe(
        filter((id): id is string => !!id),
        switchMap((id) => this.service.getPost$(id)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (res) => {
          this.post.set(res);
          if (res?.title) {
            this.titleService.setTitle(res.title);
          }
        },
        error: (error) => {
          console.error('載入文章失敗:', error);
          this.post.set(null);
        },
      });
  }

  ngOnInit(): void {
    this.layoutConfig.maxW.set('785px');
  }

  ngOnDestroy(): void {
    this.layoutConfig.maxW.set('1024px');
  }
}
