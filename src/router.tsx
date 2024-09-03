import {
  type RouteObject,
  type RouterProviderProps,
  createBrowserRouter,
} from 'react-router-dom';
import { ErrorPage } from './common/components/error-page/error-page';

const routes: RouteObject[] = [
  {
    path: '/',
    lazy: () => import('./layout/common-layout'),
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        lazy: () => import('./pages/budget/view'),
      },
    ],
  },
];

export const router: RouterProviderProps['router'] = createBrowserRouter(routes);
