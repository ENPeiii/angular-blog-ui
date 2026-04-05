import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, shareReplay } from 'rxjs';

export interface TopicsList {
  name: string;
  topicsId: string;
}

@Injectable({ providedIn: 'root' })
export class Topics {
  constructor(private http: HttpClient) {}

  getTopicsList(): Observable<TopicsList[]> {
    return this.http
      .get<{ data: TopicsList[] }>('api/topicsList.json')
      .pipe(map((res) => res.data), shareReplay(1));
  }
}
