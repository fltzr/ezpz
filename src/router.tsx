/* eslint-disable react-refresh/only-export-components */
import {
  Navigate,
  type RouteObject,
  type RouterProviderProps,
  createBrowserRouter,
} from 'react-router-dom';
import { ErrorPage } from './components/error-page/error-page';
import { lazy } from 'react';
import ProtectedRoute from './pages/auth/components/protected-route';
import { SuspenseLoadingBar } from './components/suspense-loading-bar';
import { BudgetProvider } from './pages/budget/components/budget-provider';

const ProfileOverviewPage = lazy(() => import('./pages/profile/overview'));
const BudgetPage = lazy(() => import('./pages/budget/page'));
const CalculatorPage = lazy(() => import('./pages/loan-repayment/calculator'));
const TransactionsOverview = lazy(() => import('./pages/transactions/overview'));

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
        lazy: () => import('./pages/auth/sign-in'),
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: 'profile',
            element: (
              <SuspenseLoadingBar>
                <ProfileOverviewPage />
              </SuspenseLoadingBar>
            ),
          },
          {
            path: 'budget',
            element: (
              <SuspenseLoadingBar>
                <BudgetProvider>
                  <BudgetPage />
                </BudgetProvider>
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
          {
            path: 'transactions',
            element: (
              <SuspenseLoadingBar>
                <TransactionsOverview />
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
