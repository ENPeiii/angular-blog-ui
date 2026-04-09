import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Topics, TopicsList } from './services/topics';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-topics-page',
  imports: [RouterLink],
  templateUrl: './topics-page.html',
  styleUrl: './topics-page.scss',
  providers: [Topics],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopicsPage implements OnInit {
  topicsList = signal<TopicsList[]>([]);

  private destroyRef = inject(DestroyRef);

  constructor(private service: Topics) {}

  ngOnInit(): void {
    this.loadTopicList();
  }

  /**
   * 載入主題列表，成功時更新 `topicsList`，失敗時清空列表並在控制台輸出錯誤訊息。
   *
   * @private
   * @memberof TopicsPage
   */
  private loadTopicList(): void {
    this.service.getTopicsList$().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (data) => {
        this.topicsList.set(data);
      },
      error: (error) => {
        console.error('載入主題列表失敗:', error);
        this.topicsList.set([]);
      },
    });
  }
}
