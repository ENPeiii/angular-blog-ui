import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Index {
  private apiUrl = 'api/banner.json';
  constructor(private http: HttpClient) {}


  getBannerContent() {
    return this.http.get<{ content: string }>(this.apiUrl);
  }
}
