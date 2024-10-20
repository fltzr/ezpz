/* eslint-disable react-refresh/only-export-components */
import { lazy } from 'react';
import { Outlet, type RouteObject } from 'react-router-dom';

import i18n from '@/i18n';

const BudgetPage = lazy(() => import('./dashboard/page'));
const BudgetTransactionsTablePage = lazy(() => import('./transactions/page'));

export const budgetRoutes: RouteObject[] = [
  {
    path: 'budget',
    handle: { crumb: i18n.t('layout.navItems.budget.title') },

    element: <Outlet />,
    children: [
      {
        index: true,
        handle: { crumb: i18n.t('layout.navItems.budget.linkDashboard') },
        element: <BudgetPage />,
      },
      {
        path: 'transactions',
        handle: { crumb: i18n.t('layout.navItems.budget.linkTransactions') },
        element: <BudgetTransactionsTablePage />,
      },
    ],
  },
];
