import { Routes } from '@angular/router';
import { Layout } from './layouts/layout';
import { ROUTES_CONSTANT } from './core/constants/routes-constant';

export const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      /** 首頁 */
      {
        path: ROUTES_CONSTANT['INDEX'].url,
        title: ROUTES_CONSTANT['INDEX'].title,
        loadComponent: () => import('./pages/index-page/index-page').then((m) => m.IndexPage),
      },
      /** 所有文章列表 */
      {
        path: ROUTES_CONSTANT['POSTS'].url,
        title: ROUTES_CONSTANT['POSTS'].title,
        loadComponent: () => import('./pages/posts-page/posts-page').then((m) => m.PostsPage),
      },
      /** 單篇文章（動態路由） */
      {
        path: ROUTES_CONSTANT['BLOG'].url,
        title: ROUTES_CONSTANT['BLOG'].title,
        loadComponent: () => import('./pages/posts-page/blog/blog').then((m) => m.Blog),
      },
      /** 主題列表 */
      {
        path: ROUTES_CONSTANT['TOPIC'].url,
        title: ROUTES_CONSTANT['TOPIC'].title,
        loadComponent: () => import('./pages/topic-page/topic-page').then((m) => m.TopicPage),
      },
      /** 單一主題（動態路由） */
      {
        path: ROUTES_CONSTANT['TOPIC_DETAIL'].url,
        title: ROUTES_CONSTANT['TOPIC_DETAIL'].title,
        loadComponent: () => import('./pages/topic-page/topic/topic').then((m) => m.Topic),
      },
      /** 標籤列表 */
      {
        path: ROUTES_CONSTANT['TAGS'].url,
        title: ROUTES_CONSTANT['TAGS'].title,
        loadComponent: () => import('./pages/tags-page/tags-page').then((m) => m.TagsPage),
      },
      /** 單一標籤（動態路由） */
      {
        path: ROUTES_CONSTANT['TAG_DETAIL'].url,
        title: ROUTES_CONSTANT['TAG_DETAIL'].title,
        loadComponent: () => import('./pages/tags-page/tag/tag').then((m) => m.Tag),
      },
      /** 關於我 */
      {
        path: ROUTES_CONSTANT['ABOUT'].url,
        title: ROUTES_CONSTANT['ABOUT'].title,
        loadComponent: () => import('./pages/about-page/about-page').then((m) => m.AboutPage),
      },
    ],
  },
];
