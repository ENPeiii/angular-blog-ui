import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  /** 含動態參數的路由改用 Client 渲染 */
  {
    path: 'blog/:blogId',
    renderMode: RenderMode.Client,
  },
  {
    path: 'topics/:topicsId/:articleId',
    renderMode: RenderMode.Client,
  },
  {
    path: 'topics/:topicsId',
    renderMode: RenderMode.Client,
  },
  {
    path: 'tags/:tagId',
    renderMode: RenderMode.Client,
  },
  /** 其餘靜態路由維持 Prerender */
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
