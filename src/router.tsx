import {
  type RouteObject,
  type RouterProviderProps,
  createBrowserRouter,
} from 'react-router-dom';

const routes: RouteObject[] = [
  {
    path: '/',
    lazy: () => import('./layout/common-layout'),
    children: [
      {
        index: true,
        lazy: () => import('./pages/budget/view'),
      },
    ],
  },
];

export const router: RouterProviderProps['router'] = createBrowserRouter(routes);
