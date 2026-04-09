import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, shareReplay } from 'rxjs';
export interface TagsList {
  name: string;
  tagId: string;
  amount: number;
}

export interface ArticleList{
  id: number;
  title: string;
  date: string;
  tags: { name: string; tagId: string }[];
  summary: string;
  postUrl: string;
}

@Injectable({ providedIn: 'root' })
export class Tags {
  constructor(private http: HttpClient) {}


  /**
   * 取得標籤列表
   *
   * @return {*}  {Observable<TagsList[]>}
   * @memberof Tags
   */
  getTagsList$(): Observable<TagsList[]> {
    return this.http
      .get<{ data: TagsList[] }>('api/tagsList.json')
      .pipe(map((res) => res.data), shareReplay(1));
  }

  /**
   * 取得標籤文章列表
   *
   * @param {string} tagId
   * @return {*}  {Observable<ArticleList[]>}
   * @memberof Tags
   */
  getTagArticleList$(tagId:string): Observable<ArticleList[]>{
    return this.http.get<{data:ArticleList[]}>('api/tag.json')
    .pipe(map((res) => res.data), shareReplay(1));
  }
}
