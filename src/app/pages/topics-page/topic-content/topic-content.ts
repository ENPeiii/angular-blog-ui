import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  input,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import { TopicNavRes, Topics } from '../services/topics';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { Post, PostComponent } from '../../../shared/post/post';
import { GiscusComment } from '../../../shared/giscus-comment/giscus-comment';
import { Title } from '@angular/platform-browser';
import { fromEvent } from 'rxjs';

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
  imports: [RouterLink, PostComponent, GiscusComment],
  templateUrl: './topic-content.html',
  styleUrl: './topic-content.scss',
  providers: [Topics],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopicContent implements OnInit {
  topicsId = input<string>();
  articleId = input<string>();
  topicNav = signal<TopicNav[]>([]);
  private titleService = inject(Title);

  post = signal<Post | null>(null);
  sidebarLeft = signal(0);
  sidebarWidth = signal(0);
  sidebarTop = signal(0);

  private sidebarSpacer = viewChild<ElementRef>('sidebarSpacer');
  private destroyRef = inject(DestroyRef);

  constructor(private service: Topics) {
    effect(() => {
      this.loadPost();
    });

    afterNextRender(() => {
      this.updateSidebarPos();
      fromEvent(window, 'resize')
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => this.updateSidebarPos());
    });
  }

  ngOnInit(): void {
    if (this.topicsId()) {
      this.getTopicNavList(this.topicsId()!);
    }
  }

  private updateSidebarPos(): void {
    const el = this.sidebarSpacer()?.nativeElement;
    if (el) {
      const rect = el.getBoundingClientRect();
      this.sidebarLeft.set(rect.left);
      this.sidebarWidth.set(rect.width);
    }
    const header = document.querySelector('header');
    if (header) {
      this.sidebarTop.set(header.getBoundingClientRect().height);
    }
  }

  private getTopicNavList(topicsId: string): void {
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

  private loadPost(): void {
    this.service
      .getPost$(this.articleId() || 'readme')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.post.set(res);
          if (res?.title && this.articleId()) {
            this.titleService.setTitle(`${res.title}\u2002|\u2002${this.topicsId()}`);
          }
        },
        error: (error) => {
          console.error('載入文章失敗:', error);
          this.post.set(null);
        },
      });
  }
}
