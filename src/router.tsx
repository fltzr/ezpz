import {
  createBrowserRouter,
  Navigate,
  type RouteObject,
  RouterProvider,
  type RouterProviderProps,
} from 'react-router-dom';

import { ErrorPage } from '@/components/error-page/error-page';
import { SuspenseLoadingBar } from '@/components/suspense-loading-bar';
import ProtectedRoute from '@/pages/auth/components/protected-route';
import { authRoutes } from '@/pages/auth/routes';
import { budgetRoutes } from '@/pages/budget/routes';
import { loanRepaymentRoutes } from '@/pages/loan-repayment/routes';
import { profileRoutes } from '@/pages/profile/routes';
import { transactionsRoutes } from '@/pages/transactions/routes';

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

const router: RouterProviderProps['router'] = createBrowserRouter(routes);
const Router = () => (
  <RouterProvider router={router} fallbackElement={<SuspenseLoadingBar />} />
);

export default Router;

if (import.meta.hot) {
  import.meta.hot.dispose(() => router.dispose());
}
