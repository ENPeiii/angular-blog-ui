import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

export interface PostsTab {
  name: string;
  value: string;
}

export interface PostsList {
  month: string;
  posts: {
    id: number;
    title: string;
    date: string;
    tags: { name: string; id: string }[];
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
    console.log(tab);
    return this.http.get<{ articles: PostsList[] }>('/api/posts.json');
  }
}
