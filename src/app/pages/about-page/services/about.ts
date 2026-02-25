import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface AboutContent {
  content: string;
}

@Injectable({
  providedIn: 'root',
})
export class About {
  private apiUrl = 'api/about.json';

  constructor(private http: HttpClient) {}

  /**
   * 獲取關於我的內容
   * @returns 返回包含 markdown 內容的 Observable
   */
  getAboutContent(): Observable<AboutContent> {
    return this.http.get<AboutContent>(this.apiUrl);
  }
}
