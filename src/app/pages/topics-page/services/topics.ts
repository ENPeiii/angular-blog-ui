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

  getTopicsList(): Observable<TopicsList[]> {
    return this.http.get<{ data: TopicsList[] }>('api/topicsList.json').pipe(
      map((res) => res.data),
      shareReplay(1),
    );
  }

  getTopicNavList(topicsId: string): Observable<TopicNavRes[]> {
    return this.http.get<{ data: TopicNavRes[] }>('api/topicNav.json').pipe(
      map((res) => res.data),
      shareReplay(1),
    );
  }

    getPost$(articleId: string): Observable<Post> {
      return this.http
        .get<{ data: Post }>('/api/post.json')
        .pipe(map((res) => res.data));
    }
  
}
