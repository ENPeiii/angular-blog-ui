import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, filter, forkJoin, map, of } from 'rxjs';
import { ApiConfiguration } from '../../../api/api-configuration';
import { getPosts } from '../../../api/fn/public-posts/get-posts';
import { getPost } from '../../../api/fn/public-posts/get-post';
import { getTopics } from '../../../api/fn/public-topics/get-topics';
import { Post } from '../../../shared/post/post';

export interface PostsTab {
  name: string;
  value: string;
}

/** 文章分類 Tab：對應後端固定的 CategoriesType enum（tech / life），不需要打 API */
const POSTS_TABS: PostsTab[] = [
  { name: '全部', value: 'all' },
  { name: '技術', value: 'tech' },
  { name: '生活', value: 'life' },
];

export interface PostsRes {
  page: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
  articles: PostsList[];
}

export interface PostsList {
  month: string;
  posts: {
    id: string;
    title: string;
    date: string;
    topicName: string | null;
    postUrl: string;
  }[];
}

const PAGE_SIZE = 10;

@Injectable({
  providedIn: 'root',
})
export class Posts {
  private readonly http = inject(HttpClient);
  private readonly apiConfig = inject(ApiConfiguration);

  /**
   * 取得文章分類選單（前端固定常數，不需要打 API）
   *
   * @return {*}  {Observable<PostsTab[]>}
   * @memberof Posts
   */
  getPostsTab$(): Observable<PostsTab[]> {
    return of(POSTS_TABS);
  }

  /**
   * 取得文章列表，依月份分組
   *
   * @param {string} tab
   * @param {number} page
   * @return {*}  {Observable<PostsRes>}
   * @memberof Posts
   */
  getPostsList$(tab: string, page: number): Observable<PostsRes> {
    return forkJoin({
      posts: getPosts(this.http, this.apiConfig.rootUrl, {
        page,
        pageSize: PAGE_SIZE,
        categories: tab === 'all' ? undefined : tab,
      }).pipe(filter((r) => r.ok)),
      topics: getTopics(this.http, this.apiConfig.rootUrl, { pageSize: 100 }).pipe(
        filter((r) => r.ok),
      ),
    }).pipe(
      map(({ posts, topics }) => {
        const { data, totalPages } = posts.body!;
        const topicMap = new Map(topics.body!.data.map((t) => [t.id, t.name]));
        return {
          page,
          totalPages,
          hasNext: page < totalPages,
          hasPrevious: page > 1,
          articles: groupByMonth(data, topicMap),
        };
      }),
    );
  }

  /**
   * 取得文章內容
   *
   * @param {string} blogId
   * @return {*}  {Observable<Post>}
   * @memberof Posts
   */
  getPost$(blogId: string): Observable<Post> {
    return getPost(this.http, this.apiConfig.rootUrl, { id: blogId }).pipe(
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

function groupByMonth(
  items: { id: string; title: string; createdAt: string; topicId: string | null }[],
  topicMap: Map<string, string>,
): PostsList[] {
  const groups = new Map<string, PostsList>();
  for (const item of items) {
    const date = new Date(item.createdAt);
    const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-01`;
    if (!groups.has(month)) {
      groups.set(month, { month, posts: [] });
    }
    groups.get(month)!.posts.push({
      id: item.id,
      title: item.title,
      date: item.createdAt,
      topicName: item.topicId ? (topicMap.get(item.topicId) ?? null) : null,
      postUrl: item.topicId ? `topics/${item.topicId}/${item.id}` : `blog/${item.id}`,
    });
  }
  return Array.from(groups.values());
}
