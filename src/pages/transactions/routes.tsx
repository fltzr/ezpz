/* eslint-disable react-refresh/only-export-components */
import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';

const TransactionsOverview = lazy(() => import('@/pages/transactions/overview'));

export const transactionsRoutes: RouteObject[] = [
  {
    path: 'transactions',
    element: <TransactionsOverview />,
  },
];
