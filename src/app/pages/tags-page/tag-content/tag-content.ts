import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  signal,
} from '@angular/core';
import { Tags, TagsList, ArticleList } from '../services/tags';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { DatePipe, NgClass } from '@angular/common';
import { filter, switchMap } from 'rxjs';

@Component({
  selector: 'app-tag-content',
  imports: [RouterLink, DatePipe, NgClass],
  templateUrl: './tag-content.html',
  styleUrl: './tag-content.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagContent {
  tagId = input<string>();
  private tagsList = signal<TagsList[]>([]);
  articleList = signal<ArticleList[]>([]);
  mobileMenuOpen = signal(false);
  activeTagName = computed(() => this.activeTagsList().find((t) => t.active)?.name ?? 'Tags');
  activeTagsList = computed(() =>
    this.tagsList().map((item) => ({ ...item, active: item.tagId === this.tagId() })),
  );
  private readonly destroyRef = inject(DestroyRef);

  constructor(private service: Tags) {
    this.loadTagList();

    // switchMap 確保 tagId 變更時自動取消前一個 HTTP 請求，避免訂閱累積與資料競爭
    toObservable(this.tagId)
      .pipe(
        filter((id): id is string => !!id),
        switchMap((id) => this.service.getTagArticleList(id)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (data) => this.articleList.set(data),
        error: (error) => console.error('載入標籤文章失敗:', error),
      });
  }

  private loadTagList(): void {
    this.service
      .getTagsList()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => this.tagsList.set(data),
        error: (error) => console.error('載入標籤列表失敗:', error),
      });
  }
}
