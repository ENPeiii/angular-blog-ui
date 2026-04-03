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
        loadComponent: () => import('./pages/posts-page/blog-content/blog-content').then((m) => m.BlogContent),
      },
      /** 主題相關路由（巢狀） */
      {
        path: ROUTES_CONSTANT['TOPICS'].url,
        children: [
          /** /topics - 主題列表 */
          {
            path: '',
            title: ROUTES_CONSTANT['TOPICS'].title,
            loadComponent: () =>
              import('./pages/topics-page/topics-page').then((m) => m.TopicsPage),
          },
          {
            path: ROUTES_CONSTANT['TOPICS'].children?.TOPICS_CONTENT?.url,
            children: [
              /** /topics/:topicsId - 主題首頁 */
              {
                path: '',
                title: '這裡到時候要動態生成',
                loadComponent: () =>
                  import('./pages/topics-page/topic-content/topic-content').then(
                    (m) => m.TopicContent,
                  ),
              },
              /** /topics/:topicsId/:articleId - 主題下的文章 */
              {
                path: ROUTES_CONSTANT['TOPICS'].children?.TOPICS_CONTENT?.children?.TOPICS_ARTICLE
                  ?.url,
                title: '內文也是動態生成',
                loadComponent: () =>
                  import('./pages/topics-page/topic-content/topic-content').then(
                    (m) => m.TopicContent,
                  ),
              },
            ],
          },
        ],
      },
      /** 標籤相關路由（巢狀） */
      {
        path: ROUTES_CONSTANT['TAGS'].url,
        children: [
          /** /tags - 標籤列表 */
          {
            path: '',
            title: ROUTES_CONSTANT['TAGS'].title,
            loadComponent: () => import('./pages/tags-page/tags-page').then((m) => m.TagsPage),
          },
          /** /tags/:tagId - 單一標籤（動態路由） */
          {
            path: ROUTES_CONSTANT['TAGS'].children?.['TAG_CONTENT']?.url,
            title: '動態生成',
            loadComponent: () =>
              import('./pages/tags-page/tag-content/tag-content').then((m) => m.TagContent),
          },
        ],
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
