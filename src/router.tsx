import {
  type RouteObject,
  type RouterProviderProps,
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from 'react-router-dom';

import ProtectedRoute from '@/pages/auth/components/protected-route';
import { ErrorPage } from '@/components/error-page/error-page';
import { SuspenseLoadingBar } from '@/components/suspense-loading-bar';

import { authRoutes } from '@/pages/auth/routes';
import { profileRoutes } from '@/pages/profile/routes';
import { budgetRoutes } from '@/pages/budget/routes';
import { loanRepaymentRoutes } from '@/pages/loan-repayment/routes';
import { transactionsRoutes } from '@/pages/transactions/routes';
import { stepsRoutes } from './pages/steps/routes';

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
          ...stepsRoutes,
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
