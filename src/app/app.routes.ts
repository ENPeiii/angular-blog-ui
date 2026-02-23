import { Routes } from '@angular/router';
import { Layout } from './layouts/layout';
import { ROUTES_CONSTANT } from './core/constants/routes-constant';

export const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      {
        path: ROUTES_CONSTANT['INDEX'].url,
        title: ROUTES_CONSTANT['INDEX'].title,
        loadComponent: () => import('./pages/index-page/index-page').then((m) => m.IndexPage),
      },
    ],
  },
];
