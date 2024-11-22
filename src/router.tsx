import { lazy } from 'react';
import {
  createBrowserRouter,
  Navigate,
  type RouteObject,
  RouterProvider,
  type RouterProviderProps,
} from 'react-router-dom';

import { ErrorPage } from '@/components/error-page/error-page';
import ProtectedRoute from '@/pages/auth/components/protected-route';
import { authRoutes } from '@/pages/auth/routes';
import { budgetRoutes } from '@/pages/budget/routes';
import { loanRepaymentRoutes } from '@/pages/loan-repayment/routes';
import { profileRoutes } from '@/pages/profile/routes';
import { transactionsRoutes } from '@/pages/transactions/routes';

const Layout = lazy(() => import('./layout/common-layout'));

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Layout />,
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

const router: RouterProviderProps['router'] = createBrowserRouter(routes, {
  future: {
    v7_fetcherPersist: true,
    v7_normalizeFormMethod: true,
    v7_relativeSplatPath: true,
    v7_skipActionErrorRevalidation: true,
    v7_partialHydration: true,
  },
});

const Router = () => (
  <RouterProvider router={router} future={{ v7_startTransition: true }} />
);

export default Router;

if (import.meta.hot) {
  import.meta.hot.dispose(() => router.dispose());
}
