import { Component, OnInit, signal } from '@angular/core';
import { MdViewer } from '../../shared/tui-editor/md-viewer/md-viewer';
import { Index, IndexArticle } from './services';
import { DatePipe } from '@angular/common';
import { ROUTES_CONSTANT } from '../../core/constants/routes-constant';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-index-page',
  imports: [MdViewer, DatePipe,RouterLink],
  templateUrl: './index-page.html',
  styleUrl: './index-page.scss',
})
export class IndexPage implements OnInit {
  mdViewerContent = signal<string>('');
  articleList = signal<IndexArticle[]>([]);

  ROUTES_CONSTANT = ROUTES_CONSTANT;

  constructor(private service: Index) {}

  ngOnInit(): void {
    this.loadBannerContent();
    this.loadArticleList();
  }

  private loadBannerContent(): void {
    this.service.getBannerContent().subscribe({
      next: (data) => {
        this.mdViewerContent.set(data.content);
      },
      error: (error) => {
        console.error('載入橫幅內容失敗:', error);
        // 若加載失敗，設置預設內容
        this.mdViewerContent.set('# 橫幅\n加載內容失敗，請稍後重試。');
      },
    });
  }

  private loadArticleList(): void {
    this.service.getArticleList().subscribe({
      next: (data) => {
        this.articleList.set(data.articles);
      },
      error: (error) => {
        console.error('載入文章列表失敗:', error);
        // 若加載失敗，設置預設內容
        this.articleList.set([]);
      },
    });
  }
}

