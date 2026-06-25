import { httpResource, HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, filter, map } from 'rxjs';
import { ApiConfiguration } from '../../../api/api-configuration';
import { getPublicBanner } from '../../../api/fn/public-banner/get-public-banner';
import { getLatestPosts } from '../../../api/fn/public-posts/get-latest-posts';
import { ApiResponsePublicBannerOrUndefined } from '../../../api/models';

export interface IndexArticle {
  id: string;
  title: string;
  date: string;
  tags: { name: string; tagId: string }[];
  summary: string;
  postUrl: string;
}

@Injectable({
  providedIn: 'root',
})
export class Index {
  private readonly http = inject(HttpClient);
  private readonly apiConfig = inject(ApiConfiguration);

  getBannerContent$() {
    return httpResource<ApiResponsePublicBannerOrUndefined>(
      () => `${this.apiConfig.rootUrl}${getPublicBanner.PATH}`,
    );
  }

  getArticleList$(): Observable<{ articles: IndexArticle[] }> {
    return getLatestPosts(this.http, this.apiConfig.rootUrl).pipe(
      filter((r) => r.ok),
      map((r) => ({
        articles: r.body!.data.map((post) => ({
          id: post.id,
          title: post.title,
          date: post.createdAt,
          tags: post.tags.map((t) => ({ name: t.name, tagId: t.id })),
          summary: post.content,
          postUrl: `/blog/${post.id}`,
        })),
      })),
    );
  }
}
