import { ChangeDetectionStrategy, Component, DestroyRef, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import { rxResource, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Posts, PostsRes, PostsTab } from './services/posts';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LayoutConfig } from '../../core/services/layout-config';

@Component({
  selector: 'app-posts-page',
  imports: [DatePipe,RouterLink],
  templateUrl: './posts-page.html',
  styleUrl: './posts-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostsPage implements OnInit, OnDestroy {

  tabs = signal<PostsTab[]>([]);
  selectedTab = signal<string>('all');
  page = signal<number>(1);


  /**
   * 使用 rxResource 來管理文章列表的取得，當 selectedTab 或 page 的值改變時，會自動重新取得對應的文章列表
   *
   * @memberof PostsPage
   */
  postsResource = rxResource<PostsRes, { tab: string; page: number }>({
    params: () => ({ tab: this.selectedTab(), page: this.page() }),
    stream: ({ params }) => this.service.getPostsList$(params.tab, params.page),
  });

  postsRes = computed(() => this.postsResource.value());
  
  private layoutConfig = inject(LayoutConfig);
  private destroyRef = inject(DestroyRef);

  constructor(private service: Posts) {}

  ngOnInit(): void {
    this.loadPostsTab();
    this.layoutConfig.maxW.set('785px');
  }
  ngOnDestroy(): void {
    this.layoutConfig.maxW.set('1024px');
  }

  /**
   * 載入文章分類列表，並設定到 tabs signal 中
   *
   * @private
   * @memberof PostsPage
   */
  private loadPostsTab(): void {
    this.service.getPostsTab$().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.tabs.set(res);
      },
      error: (error) => {
        console.error('載入文章分類失敗:', error);
        this.tabs.set([]);
      },
    });
  }

  /**
   * 分頁切換，當使用者點擊下一頁或上一頁按鈕時，更新 page signal 的值，觸發 postsResource 重新取得文章列表
   *
   * @param {number} pageNumber
   * @memberof PostsPage
   */
  changePage(pageNumber: number): void {
    this.page.set(this.page() + pageNumber);
  }

  /**
   * 分類切換，當使用者點擊不同的分類 tab 時，更新 selectedTab signal 的值，觸發 postsResource 重新取得該分類的文章列表，並將 page signal 重置為 1
   *
   * @param {string} tab
   * @memberof PostsPage
   */
  changeTab(tab: string): void {
    this.selectedTab.set(tab);
    this.page.set(1);
  }
}
