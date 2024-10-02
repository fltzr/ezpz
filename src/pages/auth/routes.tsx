import { RouteObject } from 'react-router-dom';

export const authRoutes: RouteObject[] = [
  {
    path: 'auth',
    lazy: () => import('@/pages/auth/sign-in'),
  },
];
