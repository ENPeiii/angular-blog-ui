import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { filter, map, Observable } from 'rxjs';
import { ApiConfiguration } from '../../../api/api-configuration';
import { getTags } from '../../../api/fn/public-tags/get-tags';
import { getPosts } from '../../../api/fn/public-posts/get-posts';

export interface TagsList {
  name: string;
  tagId: string;
  amount: number;
}

export interface ArticleList {
  id: string;
  title: string;
  date: string;
  tags: { name: string; tagId: string }[];
  summary: string;
  postUrl: string;
}

const TAG_ARTICLES_PAGE_SIZE = 100;

@Injectable({ providedIn: 'root' })
export class Tags {
  private readonly http = inject(HttpClient);
  private readonly apiConfig = inject(ApiConfiguration);

  /**
   * 取得標籤列表
   *
   * @return {*}  {Observable<TagsList[]>}
   * @memberof Tags
   */
  getTagsList$(): Observable<TagsList[]> {
    return getTags(this.http, this.apiConfig.rootUrl, { pageSize: TAG_ARTICLES_PAGE_SIZE }).pipe(
      filter((r) => r.ok),
      map((r) => r.body!.data.map((tag) => ({ name: tag.name, tagId: tag.id, amount: tag.postCount }))),
    );
  }

  /**
   * 取得標籤文章列表
   *
   * @param {string} tagId
   * @return {*}  {Observable<ArticleList[]>}
   * @memberof Tags
   */
  getTagArticleList$(tagId: string): Observable<ArticleList[]> {
    return getPosts(this.http, this.apiConfig.rootUrl, { tagId, pageSize: TAG_ARTICLES_PAGE_SIZE }).pipe(
      filter((r) => r.ok),
      map((r) =>
        r.body!.data.map((post) => ({
          id: post.id,
          title: post.title,
          date: post.createdAt,
          tags: post.tags.map((t) => ({ name: t.name, tagId: t.id })),
          summary: '',
          postUrl: `blog/${post.id}`,
        })),
      ),
    );
  }
}
