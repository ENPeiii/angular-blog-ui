import { APP_TITLE } from './base-constant';

interface IRoute {
  base: string;
  url: string;
  title: string;
}
export const ROUTES_CONSTANT: { [key: string]: IRoute } = {
  INDEX: { base: '', url: '', title: `${APP_TITLE}` },
};
