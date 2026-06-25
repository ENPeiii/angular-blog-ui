import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { filter, map, Observable } from 'rxjs';
import { ApiConfiguration } from '../../../api/api-configuration';
import { getTopics } from '../../../api/fn/public-topics/get-topics';
import { getTopic } from '../../../api/fn/public-topics/get-topic';
import { getTopicNav } from '../../../api/fn/public-topics/get-topic-nav';
import { getPost } from '../../../api/fn/public-posts/get-post';
import { Post } from '../../../shared/post/post';

export type { PublicTopic } from '../../../api/models/public-topic';
export type { TopicNavSection } from '../../../api/models/topic-nav-section';

@Injectable()
export class Topics {
  private readonly http = inject(HttpClient);
  private readonly config = inject(ApiConfiguration);

  /**
   * 取得主題列表
   */
  getTopicsList$() {
    return getTopics(this.http, this.config.rootUrl, { pageSize: 100 }).pipe(
      filter((r) => r.ok),
      map((r) => r.body!.data),
    );
  }

  /**
   * 取得單一主題（含說明）
   */
  getTopic$(topicId: string) {
    return getTopic(this.http, this.config.rootUrl, { id: topicId }).pipe(
      filter((r) => r.ok),
      map((r) => r.body!.data),
    );
  }

  /**
   * 取得主題導航列表
   */
  getTopicNavList$(topicId: string) {
    return getTopicNav(this.http, this.config.rootUrl, { id: topicId }).pipe(
      filter((r) => r.ok),
      map((r) => r.body!.data),
    );
  }

  /**
   * 取得文章內容，並映射為 PostComponent 所需的 Post 介面
   */
  getPost$(articleId: string): Observable<Post> {
    return getPost(this.http, this.config.rootUrl, { id: articleId }).pipe(
      filter((r) => r.ok),
      map((r) => {
        const p = r.body!.data;
        return {
          id: p.id,
          title: p.title,
          date: p.createdAt,
          content: p.content,
          categoryId: p.categories,
          topicId: p.topicId,
          tags: p.tags.map((t) => ({ tagId: t.id, name: t.name })),
          changePag: {},
        } as Post;
      }),
    );
  }
}
