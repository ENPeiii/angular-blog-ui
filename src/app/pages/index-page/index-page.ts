import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MdViewer } from '../../shared/tui-editor/md-viewer/md-viewer';
import { Index, IndexArticle, PublicBanner } from './services';
import { DatePipe } from '@angular/common';
import { ROUTES_CONSTANT } from '../../core/constants/routes-constant';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-index-page',
  imports: [MdViewer, DatePipe,RouterLink],
  templateUrl: './index-page.html',
  styleUrl: './index-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IndexPage implements OnInit {

  banner = signal<PublicBanner | null>(null);
  bannerContent = computed(()=> this.banner()?.content || '');

  articleList = signal<IndexArticle[]>([]);

  ROUTES_CONSTANT = ROUTES_CONSTANT;

  private destroyRef = inject(DestroyRef);

  constructor(private service: Index) {}

  ngOnInit(): void {
    this.loadBannerContent();
    this.loadArticleList();
  }


  /**
   * 載入橫幅內容
   *
   * @private
   * @memberof IndexPage
   */
  private loadBannerContent(): void {
    this.service.getBannerContent$().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (data) => {
        this.banner.set(data);
      },
      error: (error) => {
        console.error('載入橫幅內容失敗:', error);
        this.banner.set(null);
      },
    });
  }

  /**
   * 載入文章列表
   *
   * @private
   * @memberof IndexPage
   */
  private loadArticleList(): void {
    this.service.getArticleList$().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (data) => {
        this.articleList.set(data.articles);
      },
      error: (error) => {
        console.error('載入文章列表失敗:', error);
        this.articleList.set([]);
      },
    });
  }
}

