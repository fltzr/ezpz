/* eslint-disable react-refresh/only-export-components */
import {
  Navigate,
  type RouteObject,
  type RouterProviderProps,
  createBrowserRouter,
} from 'react-router-dom';
import { ErrorPage } from './common/components/error-page/error-page';
import { lazy, Suspense } from 'react';
import { Spinner } from '@cloudscape-design/components';
import ProtectedRoute from './auth/components/protected-route';

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
              <Suspense fallback={<Spinner size='large' />}>
                <BudgetPage />
              </Suspense>
            ),
          },
          {
            path: 'loan-calculator',
            element: (
              <Suspense fallback={<Spinner size='large' />}>
                <CalculatorPage />
              </Suspense>
            ),
          },
        ],
      },
    ],
  },
];

export const router: RouterProviderProps['router'] = createBrowserRouter(routes);
