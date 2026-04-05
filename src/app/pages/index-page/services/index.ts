import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';


export interface IndexArticle{
  id: number;
  title: string;
  date: string;
  tags: { name: string; id: string }[];
  summary: string;
  postUrl: string;
}

@Injectable({
  providedIn: 'root',
})
export class Index {
  constructor(private http: HttpClient) {}


  getBannerContent(): Observable<{ content: string }> {
    return this.http.get<{ content: string }>('api/banner.json').pipe(shareReplay(1));
  }

  getArticleList(): Observable<{ articles: IndexArticle[] }> {
    return this.http.get<{ articles: IndexArticle[] }>('api/index.json').pipe(shareReplay(1));
  }
}
