import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  input,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import { TopicNavRes, Topics } from '../services/topics';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Post, PostComponent } from '../../../shared/post/post';
import { GiscusComment } from '../../../shared/giscus-comment/giscus-comment';
import { Title } from '@angular/platform-browser';
import { fromEvent, switchMap } from 'rxjs';
import { LayoutConfig } from '../../../core/services/layout-config';

export interface TopicNavItem extends TopicNavRes {
  isActive: boolean;
}

interface TopicNav {
  id: string;
  name: string;
  items?: TopicNavItem[];
}

@Component({
  selector: 'app-topic-content',
  imports: [RouterLink, NgClass, PostComponent, GiscusComment],
  templateUrl: './topic-content.html',
  styleUrl: './topic-content.scss',
  providers: [Topics],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopicContent implements OnInit {
  topicsId = input<string>();
  articleId = input<string>();
  topicNav = signal<TopicNav[]>([]);

  post = signal<Post | null>(null);
  sidebarLeft = signal(0);
  sidebarWidth = signal(0);
  sidebarTop = signal(0);

  private readonly titleService = inject(Title);
  private readonly layoutConfig = inject(LayoutConfig);
  private readonly sidebarSpacer = viewChild<ElementRef>('sidebarSpacer');
  private readonly destroyRef = inject(DestroyRef);

  constructor(private service: Topics) {
    // switchMap 確保 articleId 變更時自動取消前一個 HTTP 請求，避免訂閱累積與資料競爭
    toObservable(this.articleId)
      .pipe(
        switchMap((id) => this.service.getPost$(id || 'readme')),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (res) => {
          this.post.set(res);
          if (res?.title && this.articleId()) {
            this.titleService.setTitle(`${res.title}\u2002|\u2002${this.topicsId()}`);
          }
        },
        error: (error) => {
          console.error('載入文章失敗:', error);
          this.post.set(null);
        },
      });

    afterNextRender(() => {
      this.updateSidebarPos();
      fromEvent(window, 'resize')
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => this.updateSidebarPos());
    });
  }

  ngOnInit(): void {
    if (this.topicsId()) {
      this.getTopicNavList(this.topicsId()!);
    }
  }

  /**
   * 更新側邊欄位置與尺寸，根據 `sidebarSpacer` 的位置和尺寸動態調整 `sidebarLeft`、`sidebarWidth` 和 `sidebarTop` 的值，以確保側邊欄在視窗大小變化時保持正確的位置和尺寸。
   *
   * @private
   * @memberof TopicContent
   */
  private updateSidebarPos(): void {
    const el = this.sidebarSpacer()?.nativeElement;
    if (el) {
      const rect = el.getBoundingClientRect();
      this.sidebarLeft.set(rect.left);
      this.sidebarWidth.set(rect.width);
    }
    // 從 LayoutConfig 取得 header 高度，取代脆弱的 document.querySelector
    this.sidebarTop.set(this.layoutConfig.headerHeight());
  }

  /**
   * 根據 `topicsId` 從服務獲取主題導航列表，並更新 `topicNav` 信號。成功時將導航項目標記為活動狀態，失敗時在控制台輸出錯誤訊息。
   *
   * @private
   * @param {string} topicsId
   * @memberof TopicContent
   */
  private getTopicNavList(topicsId: string): void {
    this.service
      .getTopicNavList$(topicsId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          const navWithActive = data.map((nav) => ({
            ...nav,
            items: nav.items?.map((item) => ({
              ...item,
              isActive: item.id === this.articleId(),
            })),
          }));
          this.topicNav.set(navWithActive);
        },
        error: (error) => {
          console.error('Error fetching topic navigation:', error);
        },
      });
  }
}
