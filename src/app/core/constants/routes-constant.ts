import { APP_TITLE } from './base-constant';

interface IRoute {
  base: string;
  url: string;
  title: string;
}

interface IDynamicRoute extends IRoute {
  paramName: string;
}

export const ROUTES_CONSTANT: { [key: string]: IRoute | IDynamicRoute } = {
  /**首頁 */
  INDEX: { base: '', url: '', title: `${APP_TITLE}` },
  /**所有文章 */
  POSTS: { base: 'posts', url: 'posts', title: `所有文章 - ${APP_TITLE}` },
  /**單篇文章 */
  BLOG: {
    base: 'blog',
    url: 'blog/:blogId',
    title: `文章 - ${APP_TITLE}`,
    paramName: 'blogId',
  } as IDynamicRoute,
  /**主題列表 */
  TOPIC: { base: 'topic', url: 'topic', title: `主題列表 - ${APP_TITLE}` },
  /**單一主題 */
  TOPIC_DETAIL: {
    base: 'topic',
    url: 'topic/:topicId',
    title: `主題 - ${APP_TITLE}`,
    paramName: 'topicId',
  } as IDynamicRoute,
  /**標籤列表 */
  TAGS: { base: 'tags', url: 'tags', title: `標籤列表 - ${APP_TITLE}` },
  /**單一標籤 */
  TAG_DETAIL: {
    base: 'tags',
    url: 'tags/:tagId',
    title: `標籤 - ${APP_TITLE}`,
    paramName: 'tagId',
  } as IDynamicRoute,
  /**關於我 */
  ABOUT: { base: 'about', url: 'about', title: `關於我 - ${APP_TITLE}` },
};
