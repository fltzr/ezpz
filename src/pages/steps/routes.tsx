/* eslint-disable react-refresh/only-export-components */
import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

const StepsPage = lazy(() => import('./base'));

export const stepsRoutes: RouteObject[] = [
  {
    path: 'steps',
    element: <StepsPage />,
  },
];
