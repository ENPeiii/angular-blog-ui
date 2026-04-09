import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Tags, TagsList } from './services/tags';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-tags-page',
  imports: [RouterLink],
  templateUrl: './tags-page.html',
  styleUrl: './tags-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagsPage implements OnInit {
  tagsList = signal<TagsList[]>([]);

  private destroyRef = inject(DestroyRef);

  constructor(private service: Tags) {}

  ngOnInit(): void {
    this.loadTagList();
  }

  /**
   * 載入標籤列表
   *
   * @private
   * @memberof TagsPage
   */
  private loadTagList(): void {
    this.service.getTagsList$().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (data) => {
        this.tagsList.set(data);
      },
      error: (error) => {
        console.error('載入標籤列表失敗:', error);
        this.tagsList.set([]);
      },
    });
  }
}


