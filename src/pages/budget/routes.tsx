/* eslint-disable react-refresh/only-export-components */
import { lazy } from 'react';
import { Outlet, type RouteObject } from 'react-router-dom';

import BudgetProvider from './components/budget-provider';

const BudgetPage = lazy(() => import('./dashboard/page'));
const BudgetTransactionsTablePage = lazy(() => import('./transactions/page'));

export const budgetRoutes: RouteObject[] = [
  {
    path: 'budget',
    handle: { crumb: 'Budget' },

    element: (
      <BudgetProvider>
        <Outlet />
      </BudgetProvider>
    ),
    children: [
      {
        index: true,
        handle: { crumb: 'Dashboard' },
        element: <BudgetPage />,
      },
      {
        path: 'transactions',
        handle: { crumb: 'Transactions' },
        element: <BudgetTransactionsTablePage />,
      },
    ],
  },
];
