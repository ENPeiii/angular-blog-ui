import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  input,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import { TopicNavSection, Topics } from '../services/topics';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Post, PostComponent } from '../../../shared/post/post';
import { GiscusComment } from '../../../shared/giscus-comment/giscus-comment';
import { MdViewer } from '../../../shared/tui-editor/md-viewer/md-viewer';
import { Title } from '@angular/platform-browser';
import { APP_TITLE } from '../../../core/constants/base-constant';
import { filter, fromEvent, switchMap } from 'rxjs';
import { LayoutConfig } from '../../../core/services/layout-config';

@Component({
  selector: 'app-topic-content',
  imports: [RouterLink, NgClass, PostComponent, GiscusComment, MdViewer],
  templateUrl: './topic-content.html',
  styleUrl: './topic-content.scss',
  providers: [Topics],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopicContent implements OnInit {
  topicsId = input<string>();
  articleId = input<string>();
  topicNav = signal<TopicNavSection[]>([]);
  topicName = signal<string>('');
  topicDescription = signal<string>('');
  isOverview = computed(() => !this.articleId());

  post = signal<Post | null>(null);
  sidebarLeft = signal(0);
  sidebarWidth = signal(0);
  sidebarTop = signal(0);

  private readonly titleService = inject(Title);
  private readonly layoutConfig = inject(LayoutConfig);
  private readonly sidebarSpacer = viewChild<ElementRef>('sidebarSpacer');
  private readonly destroyRef = inject(DestroyRef);
  private readonly service = inject(Topics);

  constructor() {
    // switchMap 確保 articleId 變更時自動取消前一個 HTTP 請求，避免訂閱累積與資料競爭
    toObservable(this.articleId)
      .pipe(
        filter((id): id is string => !!id),
        switchMap((id) => this.service.getPost$(id)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (res) => {
          this.post.set(res);
          if (res?.title && this.articleId()) {
            this.titleService.setTitle(`${res.title} | ${this.topicName() || this.topicsId()}`);
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
    const id = this.topicsId();
    if (id) {
      this.getTopicNavList(id);
      this.service.getTopic$(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (topic) => {
          this.topicName.set(topic.name);
          this.topicDescription.set(topic.description ?? '');
          if (this.isOverview()) {
            this.titleService.setTitle(`${topic.name} - ${APP_TITLE}`);
          }
        },
        error: () => {
          this.topicName.set(id);
        },
      });
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
   * 根據 `topicsId` 從服務獲取主題導航列表，並更新 `topicNav` 信號。
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
          this.topicNav.set(data);
        },
        error: (error) => {
          console.error('Error fetching topic navigation:', error);
        },
      });
  }
}
