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
  /**
   * 其餘路由（首頁、/posts、/tags、/about）改用 Server，每次請求都即時渲染。
   * 這些頁面的內容（最新文章、文章列表、標籤、banner）都是後台可隨時編輯的資料，
   * 用 Prerender 會把內容凍結在 build 當下，後台改了東西要等下次前端部署才會反映。
   */
  {
    path: '**',
    renderMode: RenderMode.Server,
  },
];
