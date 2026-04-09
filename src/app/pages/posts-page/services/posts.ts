import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, shareReplay } from 'rxjs';
import { Post } from '../../../shared/post/post';

export interface PostsTab {
  name: string;
  value: string;
}
export interface PostsRes {
  tab: string;
  page: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
  dateRange: string;
  articles: PostsList[];
}

export interface PostsList {
  month: string;
  posts: {
    id: number;
    title: string;
    date: string;
    topics: string;
    summary: string;
    postUrl: string;
  }[];
}


@Injectable({
  providedIn: 'root',
})
export class Posts {
  constructor(private http: HttpClient) {}

  /**
   *  * 取得文章分類選單
   *
   * @return {*}  {Observable<PostsTab[]>}
   * @memberof Posts
   */
  getPostsTab$(): Observable<PostsTab[]> {
    return this.http.get<{ data: PostsTab[] }>('/api/postsTab.json').pipe(
      map((res) => res.data),
      shareReplay(1),
    );
  }

  /**
   * 取得文章列表
   *
   * @param {string} tab
   * @param {number} page
   * @return {*}  {Observable<PostsRes>}
   * @memberof Posts
   */
  getPostsList$(tab: string, page: number): Observable<PostsRes> {
    return this.http
      .get<Record<string, Record<string, PostsRes>>>('/api/postsList.json')
      .pipe(map((res) => res[tab][String(page)]), shareReplay(1));
  }

  /**
   * 取得文章內容
   *
   * @param {string} blogId
   * @return {*}  {Observable<Post>}
   * @memberof Posts
   */
  getPost$(blogId: string): Observable<Post> {
    return this.http
      .get<{ data: Post }>('/api/post.json')
      .pipe(map((res) => res.data));
  }
}
