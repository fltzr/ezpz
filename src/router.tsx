import {
  type RouteObject,
  type RouterProviderProps,
  createBrowserRouter,
  Navigate,
} from 'react-router-dom';

import ProtectedRoute from '@/pages/auth/components/protected-route';
import { ErrorPage } from '@/components/error-page/error-page';

import { authRoutes } from '@/pages/auth/routes';
import { profileRoutes } from '@/pages/profile/routes';
import { budgetRoutes } from '@/pages/budget/routes';
import { loanRepaymentRoutes } from '@/pages/loan-repayment/routes';
import { transactionsRoutes } from './pages/transactions/routes';

const routes: RouteObject[] = [
  {
    path: '/',
    lazy: () => import('./layout/common-layout'),
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Navigate to='/budget' replace />,
      },
      ...authRoutes,
      {
        element: <ProtectedRoute />,
        children: [
          ...profileRoutes,
          ...budgetRoutes,
          ...loanRepaymentRoutes,
          ...transactionsRoutes,
        ],
      },
    ],
  },
];

export const router: RouterProviderProps['router'] = createBrowserRouter(routes);

if (import.meta.hot) {
  import.meta.hot.dispose(() => router.dispose());
}
