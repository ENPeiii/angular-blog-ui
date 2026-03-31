import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

export interface PostsTab {
  name: string;
  value: string;
}
export interface PostsRes {
  page: number;
  articles: PostsList[];
}

export interface PostsList {
  month: string;
  posts: {
    id: number;
    title: string;
    date: string;
    topic: string;
    summary: string;
    postUrl: string;
  }[];
}
@Injectable({
  providedIn: 'root',
})
export class Posts {
  constructor(private http: HttpClient) {}


  getPostsTab() {
    return this.http.get<{ data: PostsTab[] }>('/api/postsTab.json');
  }

  getPostsList(tab:string) {
    return this.http.get<{ data: PostsRes }>('/api/posts.json');
  }
}
