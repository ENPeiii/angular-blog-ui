import { Component, OnInit, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Posts, PostsList, PostsTab } from './services/posts';
import { map } from 'rxjs';
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

  // rxResource: 當 selectedTab 變化時，自動呼叫 API 取得文章列表
  postsResource = rxResource({
    params: () => ({ tab: this.selectedTab() }),
    stream: ({ params }) =>
      this.service.getPostsList(params.tab).pipe(map((res) => res)),
  });

  postsRes = this.postsResource.value()?.data;

  constructor(private service: Posts) {}

  ngOnInit(): void {
    this.loadPostsTab();
  }

  private loadPostsTab(): void {
    this.service.getPostsTab().subscribe({
      next: (data) => {
        this.tabs.set(data.data);
      },
      error: (error) => {
        console.error('載入文章分類失敗:', error);
        this.tabs.set([]);
      },
    });
  }

  changePage(pageNumber: number): void {

  }
}
