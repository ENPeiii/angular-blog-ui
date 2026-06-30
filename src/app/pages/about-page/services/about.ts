import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ApiConfiguration } from '../../../api/api-configuration';

interface AboutContent {
  id: string;
  content: string;
  updatedAt: string;
}

@Injectable({
  providedIn: 'root',
})
export class About {
  private http = inject(HttpClient);
  private apiConfig = inject(ApiConfiguration);

  getAboutContent() {
    return this.http
      .get<{ data: AboutContent }>(`${this.apiConfig.rootUrl}/public/about`)
      .pipe(map(r => r.data));
  }
}
