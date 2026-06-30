import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { MdViewer } from '../../shared/tui-editor/md-viewer/md-viewer';
import { Index } from './services';
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
export class IndexPage {
  private readonly service = inject(Index);

  readonly bannerResource = manageResource(
    this.service.getBannerContent$(),
    { errorContext: '載入橫幅失敗' },
  );

  banner = computed(() => this.bannerResource.value()?.data ?? null);
  bannerContent = computed(() => this.banner()?.content || '');

  readonly articleResource = rxResource({
    stream: () => this.service.getArticleList$(),
  });

  articleList = computed(() => this.articleResource.value()?.articles ?? []);
  ROUTES_CONSTANT = ROUTES_CONSTANT;
}

