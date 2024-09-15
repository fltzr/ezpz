/* eslint-disable react-refresh/only-export-components */
import {
  Navigate,
  type RouteObject,
  type RouterProviderProps,
  createBrowserRouter,
} from 'react-router-dom';
import { ErrorPage } from './common/components/error-page/error-page';
import { lazy } from 'react';
import ProtectedRoute from './auth/components/protected-route';
import { SuspenseLoadingBar } from './common/components/suspense-loading-bar';

const BudgetPage = lazy(() => import('./pages/budget/budget'));
const CalculatorPage = lazy(() => import('./pages/loan-repayment/calculator'));

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
      {
        path: 'auth',
        lazy: () => import('./auth/sign-in'),
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: 'budget',
            element: (
              <SuspenseLoadingBar>
                <BudgetPage />
              </SuspenseLoadingBar>
            ),
          },
          {
            path: 'loan-calculator',
            element: (
              <SuspenseLoadingBar>
                <CalculatorPage />
              </SuspenseLoadingBar>
            ),
          },
        ],
      },
    ],
  },
];

export const router: RouterProviderProps['router'] = createBrowserRouter(routes);

if (import.meta.hot) {
  import.meta.hot.dispose(() => router.dispose());
}
