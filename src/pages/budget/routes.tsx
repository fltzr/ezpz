/* eslint-disable react-refresh/only-export-components */
import { lazy } from 'react';
import { Outlet, type RouteObject } from 'react-router-dom';

const BudgetPage = lazy(() => import('./dashboard/page'));
const BudgetTransactionsTablePage = lazy(() => import('./transactions/page'));

export const budgetRoutes: RouteObject[] = [
  {
    path: 'budget',
    handle: { crumb: 'Budget' },

    element: <Outlet />,
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
