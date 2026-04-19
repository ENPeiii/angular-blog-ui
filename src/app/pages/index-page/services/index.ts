import { httpResource, HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';
import { ApiConfiguration } from '../../../api/api-configuration';
import { getPublicBanner } from '../../../api/fn/public-banner/get-public-banner';
import { ApiResponseBannerOrUndefined } from '../../../api/models/api-response-banner-or-undefined';

export interface IndexArticle {
  id: number;
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
    return httpResource<ApiResponseBannerOrUndefined>(
      () => `${this.apiConfig.rootUrl}${getPublicBanner.PATH}`,
    );
  }

  getArticleList$(): Observable<{ articles: IndexArticle[] }> {
    return this.http.get<{ articles: IndexArticle[] }>('api/index.json').pipe(shareReplay(1));
  }
}
