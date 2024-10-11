import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';

// eslint-disable-next-line react-refresh/only-export-components
const CalculatorPage = lazy(() => import('./calculator'));

export const loanRepaymentRoutes: RouteObject[] = [
  {
    path: 'loan-calculator',
    element: <CalculatorPage />,
  },
];
