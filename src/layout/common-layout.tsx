import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  AppLayout,
  Box,
  BreadcrumbGroup,
  ContentLayout,
  Header,
  SideNavigation,
  SpaceBetween,
} from '@cloudscape-design/components';
import I18nProvider from '@cloudscape-design/components/i18n';
import messages from '@cloudscape-design/components/i18n/messages/all.en';

import { GlobalHeader } from './global-header';
import { Notifications } from '../common/components/notifications';
import { useNotificationStore } from '../common/state/notifications';
import { nanoid } from 'nanoid';
import { useEffect, useState } from 'react';
import { useAuth } from '../auth/hooks/use-auth';
import { useDrawer } from '../common/components/drawer-provider';

type LocationState = {
  reason?: string;
};

const CommonLayout = () => {
  const { activeDrawerId, drawerContent, closeDrawer, panelWidth } = useDrawer();

  const { addNotification } = useNotificationStore();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthRoute = location.pathname.includes('/auth');
  const activeHref = location.pathname;
  const breadcrumbs = [''];

  const [navigationOpen, setNavigationOpen] = useState(false);

  useEffect(() => {
    const state = location.state as LocationState;

    if (state && state.reason === 'sign-out') {
      addNotification({
        id: nanoid(5),
        type: 'info',
        message: 'Successfully signed out!',
      });
    }
  }, [location, addNotification]);

  return (
    <I18nProvider locale='en' messages={[messages]}>
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
                  <Header variant='h1'>Welcome to Ezpz!</Header>
                </SpaceBetween>
              </Box>
            }>
            <Outlet />
          </ContentLayout>
        ) : (
          <AppLayout
            stickyNotifications
            toolsHide
            headerSelector='#h'
            notifications={<Notifications />}
            breadcrumbs={
              isAuthRoute && breadcrumbs ? <BreadcrumbGroup items={[]} /> : undefined
            }
            navigation={
              <SideNavigation
                activeHref={activeHref}
                items={[
                  {
                    type: 'link',
                    text: 'Budgets',
                    href: '/budget',
                  },
                  {
                    type: 'link',
                    text: 'Loan calculator',
                    href: '/loan-calculator',
                  },
                  {
                    type: 'link',
                    text: 'Transactions',
                    href: '/transactions',
                  },
                ]}
                onFollow={(event) => {
                  event.preventDefault();
                  navigate(event.detail.href);
                }}
              />
            }
            navigationOpen={navigationOpen}
            navigationHide={!user || isAuthRoute}
            navigationWidth={200}
            onNavigationChange={({ detail }) => setNavigationOpen(detail.open)}
            content={<Outlet />}
            drawers={drawerContent ? [drawerContent] : undefined}
            toolsWidth={panelWidth}
            onDrawerChange={() => {
              closeDrawer();
            }}
            activeDrawerId={activeDrawerId}
          />
        )}
      </div>
    </I18nProvider>
  );
};

export const Component = CommonLayout;
