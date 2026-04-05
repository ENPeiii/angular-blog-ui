import { ChangeDetectionStrategy, Component, DestroyRef, computed, effect, inject, input, signal } from '@angular/core';
import { Tags, TagsList, ArticleList } from '../services/tags';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { DatePipe, NgClass } from '@angular/common';

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
    this.tagsList().map((item) => ({ ...item, active: item.tagId === this.tagId() }))
  );
  private destroyRef = inject(DestroyRef);
  constructor(private service: Tags) {
    this.loadTagList();
    effect(() => {
      const id = this.tagId();
      if (id) this.loadTagArticleList(id);
    });
  }

  private loadTagList(): void {
    this.service.getTagsList().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (data) => this.tagsList.set(data),
      error: (error) => console.error('載入標籤列表失敗:', error),
    });
  }

  private loadTagArticleList(tagId: string): void {
    this.service.getTagArticleList(tagId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (data) => this.articleList.set(data),
      error: (error) => console.error('載入標籤文章失敗:', error),
    });
  }
}
