import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { TopicNavRes, Topics } from '../services/topics';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';


export interface TopicNavItem extends TopicNavRes {
  isActive: boolean;
}

interface TopicNav {
  id: string;
  name: string;
  items?: TopicNavItem[];
}

@Component({
  selector: 'app-topic-content',
  imports: [RouterLink],
  templateUrl: './topic-content.html',
  styleUrl: './topic-content.scss',
  providers: [Topics],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopicContent implements OnInit {
  topicsId = input<string>();
  articleId = input<string>();
  topicNav = signal<TopicNav[]>([]);

  private destroyRef = inject(DestroyRef);
  constructor(private service: Topics) {}

  ngOnInit(): void {
    if (this.topicsId()) {
      this.getTopicNavList(this.topicsId()!);
    }
  }

  getTopicNavList(topicsId: string): void {
    this.service
      .getTopicNavList(topicsId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          // 將資料轉換的 items 轉為 TopicNavItem 並預設 isActive 為 false
          const navWithActive = data.map((nav) => ({
            ...nav,
            items: nav.items?.map((item) => ({
              ...item,
              isActive: item.id === this.articleId(), // 根據 articleId 判斷是否為 active 項目
            })),
          }));
          this.topicNav.set(navWithActive);

        },
        error: (error) => {
          console.error('Error fetching topic navigation:', error);
        },
      });
  }
}
