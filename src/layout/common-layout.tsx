import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { nanoid } from 'nanoid';
import {
  AppLayout,
  Box,
  BreadcrumbGroup,
  ContentLayout,
  Header,
  SideNavigation,
  SpaceBetween,
} from '@cloudscape-design/components';

import { useAuth } from '@/pages/auth/hooks/use-auth';

import { Notifications } from '@/components/notifications';
import { useNotificationStore } from '@/state/notifications';
import { useDrawer } from '@/components/drawer-provider';
import { LocaleProvider } from '@/components/locale-provider';

import { GlobalHeader } from './global-header';

type LocationState = {
  reason?: string;
};

const CommonLayout = () => {
  const { t } = useTranslation();
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
        message: t('auth.api.signOutSuccess'),
      });
    }
  }, [location, addNotification, t]);

  return (
    <LocaleProvider>
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
                    text: t('layout.navItems.budgets'),
                    href: '/budget',
                  },
                  {
                    type: 'link',
                    text: t('layout.navItems.loanCalculator'),
                    href: '/loan-calculator',
                  },
                  {
                    type: 'link',
                    text: t('layout.navItems.transactions'),
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
    </LocaleProvider>
  );
};

export const Component = CommonLayout;
