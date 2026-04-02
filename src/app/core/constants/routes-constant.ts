import { APP_TITLE } from './base-constant';

/**基礎路由介面 */
export interface IBaseRoute {
  base?: string;
  url: string;
  title: string;
}

/**動態路由介面（帶單一參數） */
export interface IDynamicRoute extends IBaseRoute {
  paramName: string;
}

/**帶子路由的路由介面 */
export interface IRouteWithChildren extends IBaseRoute {
  children?: { [key: string]: IDynamicRoute };
}

/**巢狀主題路由介面 */
export interface INestedTopicRoute extends IBaseRoute {
  children?: {
    TOPICS_CONTENT?: IDynamicRoute & {
      children?: {
        TOPICS_ARTICLE?: IDynamicRoute;
      };
    };
  };
}

export const ROUTES_CONSTANT: {
  INDEX: IBaseRoute;
  POSTS: IBaseRoute;
  BLOG: IDynamicRoute;
  TOPICS: INestedTopicRoute;
  TAGS: IRouteWithChildren;
  ABOUT: IBaseRoute;
} = {
  /**首頁 */
  INDEX: { base: '', url: '', title: `${APP_TITLE}` },
  /**所有文章 */
  POSTS: { base: 'posts', url: 'posts', title: `所有文章 - ${APP_TITLE}` },
  /**單篇文章 */
  BLOG: {
    base: 'blog',
    url: 'blog/:blogId',
    title: '動態生成',
    paramName: 'blogId',
  },
  /**主題 */
  TOPICS: {
    base: 'topics',
    url: 'topics',
    title: `主題列表 - ${APP_TITLE}`,

    children: {
      /** /topics/:topicsId - 主題首頁 */
      TOPICS_CONTENT: {
        url: ':topicsId',
        title: '動態生成',
        paramName: 'topicsId',
        children: {
          /** /topics/:topicsId/:articleId - 主題文章 */
          TOPICS_ARTICLE: {
            url: ':articleId',
            title: '動態生成',
            paramName: 'articleId',
          },
        },
      },
    },
  },
  /**標籤列表 */
  TAGS: {
    base: 'tags',
    url: 'tags',
    title: `標籤列表 - ${APP_TITLE}`,
    children: {
      /** /tags/:tagId - 單一標籤 */
      TAG_CONTENT: {
        url: ':tagId',
        title: '動態生成',
        paramName: 'tagId',
      },
    },
  },
  /**關於我 */
  ABOUT: { base: 'about', url: 'about', title: `關於我 - ${APP_TITLE}` },
};
