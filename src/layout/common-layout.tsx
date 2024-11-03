import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useLocation } from 'react-router-dom';

import {
  AppLayout,
  Box,
  ContentLayout,
  Header,
  SpaceBetween,
} from '@cloudscape-design/components';
import { nanoid } from 'nanoid';

import { useDrawer } from '@/components/drawer-provider';
import { SelectedUserProvider } from '@/components/selected-user-provider';
import { SuspenseLoadingBar } from '@/components/suspense-loading-bar';
import { useAuth } from '@/pages/auth/hooks/use-auth';
import { useLayoutState } from '@/state/layout';
import { useNotificationStore } from '@/state/notifications';

import { Breadcrumbs } from './components/breadcrumbs';
import { Navigation } from './components/navigation';
import { Notifications } from './components/notifications';
import { GlobalHeader } from './global-header';

type LocationState = {
  reason?: string;
};

const CommonLayout = () => {
  const { t } = useTranslation();
  const { contentType } = useLayoutState();
  const { activeDrawerId, drawerContent, closeDrawer, panelWidth } = useDrawer();

  const { addNotification } = useNotificationStore();
  const { user, isLoading: isAuthLoading } = useAuth();
  const location = useLocation();
  const isAuthRoute = location.pathname.includes('/auth');

  const [navigationOpen, setNavigationOpen] = useState(true);

  useEffect(() => {
    const state = location.state as LocationState;

    if (state && state.reason === 'sign-out') {
      addNotification({
        id: nanoid(5),
        type: 'info',
        message: t('auth.api.signOutSuccess'),
      });
    }
  }, [location, addNotification, t]);

  useEffect(() => {
    closeDrawer();
  }, [location.pathname, closeDrawer]);

  if (isAuthLoading) {
    return <SuspenseLoadingBar />;
  }

  return (
    <>
      <GlobalHeader />
      <div id='c'>
        {location.pathname.includes('auth') ? (
          <ContentLayout
            defaultPadding
            headerVariant='high-contrast'
            maxContentWidth={800}
            notifications={<Notifications />}
            header={
              <Box padding={{ vertical: 'xxxl' }}>
                <SpaceBetween direction='vertical' size='xl' alignItems='center'>
                  <Header variant='h1'>{t('auth.welcome')}</Header>
                </SpaceBetween>
              </Box>
            }>
            <Outlet />
          </ContentLayout>
        ) : (
          <SelectedUserProvider>
            <AppLayout
              stickyNotifications
              toolsHide
              contentType={contentType}
              headerSelector='#h'
              notifications={<Notifications />}
              breadcrumbs={!isAuthRoute ? <Breadcrumbs /> : undefined}
              navigation={<Navigation />}
              navigationOpen={navigationOpen}
              navigationHide={!user || isAuthRoute}
              navigationWidth={250}
              onNavigationChange={({ detail }) => setNavigationOpen(detail.open)}
              content={
                <SuspenseLoadingBar>
                  <Outlet />
                </SuspenseLoadingBar>
              }
              drawers={drawerContent ? [drawerContent] : undefined}
              toolsWidth={panelWidth}
              onDrawerChange={() => {
                closeDrawer();
              }}
              activeDrawerId={activeDrawerId}
            />
          </SelectedUserProvider>
        )}
      </div>
    </>
  );
};

export default CommonLayout;
