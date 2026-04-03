import { Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { rxResource, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Posts, PostsRes, PostsTab } from './services/posts';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-posts-page',
  imports: [DatePipe,RouterLink],
  templateUrl: './posts-page.html',
  styleUrl: './posts-page.scss',
})
export class PostsPage implements OnInit {

  tabs = signal<PostsTab[]>([]);
  selectedTab = signal<string>('all');
  page = signal<number>(1);

  // rxResource: 當 selectedTab 變化時，自動呼叫 API 取得文章列表
  postsResource = rxResource<PostsRes, { tab: string; page: number }>({
    params: () => ({ tab: this.selectedTab(), page: this.page() }),
    stream: ({ params }) => this.service.getPostsList(params.tab, params.page),
  });

  postsRes = computed(() => this.postsResource.value());

  private destroyRef = inject(DestroyRef);

  constructor(private service: Posts) {}

  ngOnInit(): void {
    this.loadPostsTab();
  }

  private loadPostsTab(): void {
    this.service.getPostsTab().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.tabs.set(res);
      },
      error: (error) => {
        console.error('載入文章分類失敗:', error);
        this.tabs.set([]);
      },
    });
  }

  changePage(pageNumber: number): void {
    this.page.set(this.page() + pageNumber);
  }

  changeTab(tab: string): void {
    this.selectedTab.set(tab);
    this.page.set(1);
  }
}
