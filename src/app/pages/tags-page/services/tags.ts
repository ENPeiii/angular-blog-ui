import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
export interface TagsList {
  name: string;
  tagId: string;
  amount: number;
}
@Injectable()
export class Tags {
  constructor(private http: HttpClient) {}

  getTagsList(): Observable<TagsList[]> {
    return this.http.get<{ data: TagsList[] }>('api/tagsList.json').pipe(map((res) => res.data));
  }
}
