import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MdViewer } from '../../shared/tui-editor/md-viewer/md-viewer';
import { Index, IndexArticle } from './services';
import { DatePipe } from '@angular/common';
import { ROUTES_CONSTANT } from '../../core/constants/routes-constant';
import { RouterLink } from '@angular/router';
import { manageResource } from '../../core/utilities/resource.utils';

@Component({
  selector: 'app-index-page',
  imports: [MdViewer, DatePipe, RouterLink],
  templateUrl: './index-page.html',
  styleUrl: './index-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IndexPage implements OnInit {
  private readonly service = inject(Index);
  private readonly destroyRef = inject(DestroyRef);

  private readonly bannerResource = manageResource(
    this.service.getBannerContent$(),
    { errorContext: '載入橫幅失敗' },
  );

  banner = computed(() => this.bannerResource.value()?.data ?? null);
  bannerContent = computed(() => this.banner()?.content || '');

  articleList = signal<IndexArticle[]>([]);
  ROUTES_CONSTANT = ROUTES_CONSTANT;

  ngOnInit(): void {
    this.loadArticleList();
  }

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

