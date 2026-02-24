import { APP_TITLE } from './base-constant';

interface IRoute {
  base: string;
  url: string;
  title: string;
}
export const ROUTES_CONSTANT: { [key: string]: IRoute } = {
  /**首頁 */
  INDEX: { base: '', url: '', title: `${APP_TITLE}` },
  /**所有文章 */
  POSTS: { base: 'posts', url: 'posts', title: `所有文章 - ${APP_TITLE}` },
  /**主題列表 */
  TOPIC: { base: 'topic', url: 'topic', title: `主題列表 - ${APP_TITLE}` },
  /**標籤列表 */
  TAGS: { base: 'tags', url: 'tags', title: `標籤列表 - ${APP_TITLE}` },
  /**關於我 */
  ABOUT: { base: 'about', url: 'about', title: `關於我 - ${APP_TITLE}` },
};
