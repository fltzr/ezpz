/* eslint-disable react-refresh/only-export-components */
import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import { SuspenseLoadingBar } from '@/components/suspense-loading-bar';

const BudgetProvider = lazy(() => import('./components/budget-provider'));
const BudgetPage = lazy(() => import('./page'));

export const budgetRoutes: RouteObject[] = [
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
];
