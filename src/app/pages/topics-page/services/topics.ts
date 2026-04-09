import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, shareReplay } from 'rxjs';
import { Post } from '../../../shared/post/post';

export interface TopicsList {
  name: string;
  topicsId: string;
}

export interface TopicNavRes {
  id: string;
  name: string;
  items?: TopicNavRes[]; // 遞迴定義
}

@Injectable()
export class Topics {
  constructor(private http: HttpClient) {}

  /**
   * 取得主題列表
   *
   * @return {*}  {Observable<TopicsList[]>}
   * @memberof Topics
   */
  getTopicsList$(): Observable<TopicsList[]> {
    return this.http.get<{ data: TopicsList[] }>('api/topicsList.json').pipe(
      map((res) => res.data),
      shareReplay(1),
    );
  }

  /**
   * 取得主題選單
   *
   * @param {string} topicsId
   * @return {*}  {Observable<TopicNavRes[]>}
   * @memberof Topics
   */
  getTopicNavList$(topicsId: string): Observable<TopicNavRes[]> {
    return this.http.get<{ data: TopicNavRes[] }>('api/topicNav.json').pipe(
      map((res) => res.data),
      shareReplay(1),
    );
  }

  /**
   * 取得文章內容
   *
   * @param {string} articleId
   * @return {*}  {Observable<Post>}
   * @memberof Topics
   */
  getPost$(articleId: string): Observable<Post> {
    return this.http.get<{ data: Post }>('/api/post.json').pipe(map((res) => res.data));
  }
}
