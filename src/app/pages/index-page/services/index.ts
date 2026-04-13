import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, shareReplay } from 'rxjs';

export interface IndexArticle {
  id: number;
  title: string;
  date: string;
  tags: { name: string; tagId: string }[];
  summary: string;
  postUrl: string;
}

/** 前台公開 banner 物件（不含後台管理欄位） */
export interface PublicBanner {
  /** 唯一識別碼（UUID，由後端自動產生） @example "a1b2c3d4-e5f6-7890-abcd-ef1234567890" */
  id: string;
  /** banner 名稱 @example "logo+文字" */
  title: string;
  /** banner 類型 @example "圖文|圖" */
  type: string;
  /** 圖片網址 */
  img: string;
  /** 內容 */
  content?: string;
}

@Injectable({
  providedIn: 'root',
})
export class Index {
  constructor(private http: HttpClient) {}

  /**
   * 載入橫幅內容
   *
   * @return {*}  {Observable<{ content: string }>}
   * @memberof Index
   */
  getBannerContent$(): Observable<PublicBanner> {
    return this.http.get<{ data: PublicBanner }>('http://localhost:3000/api/public/banner').pipe(
      map((res) => res.data),
      shareReplay(1),
    );
  }

  /**
   * 載入文章列表
   *
   * @return {*}  {Observable<{ articles: IndexArticle[] }>}
   * @memberof Index
   */
  getArticleList$(): Observable<{ articles: IndexArticle[] }> {
    return this.http.get<{ articles: IndexArticle[] }>('api/index.json').pipe(shareReplay(1));
  }
}
