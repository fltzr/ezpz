/* eslint-disable react-refresh/only-export-components */
import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import { SuspenseLoadingBar } from '@/components/suspense-loading-bar';

const ProfileOverviewPage = lazy(() => import('./overview'));

export const profileRoutes: RouteObject[] = [
  {
    path: 'profile',
    element: (
      <SuspenseLoadingBar>
        <ProfileOverviewPage />
      </SuspenseLoadingBar>
    ),
  },
];
