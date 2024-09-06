import { Outlet, useLocation } from 'react-router-dom';
import {
  AppLayout,
  BreadcrumbGroup,
  SideNavigation,
} from '@cloudscape-design/components';
import I18nProvider from '@cloudscape-design/components/i18n';
import messages from '@cloudscape-design/components/i18n/messages/all.en';

import { GlobalHeader } from './global-header';
import { Notifications } from '../common/components/notifications';
import { useNotificationStore } from '../common/state/notifications';
import { nanoid } from 'nanoid';
import { useEffect } from 'react';

const CommonLayout = () => {
  const { addNotification } = useNotificationStore();
  const location = useLocation();
  const isAuthRoute = location.pathname.includes('/auth');
  const breadcrumbs = [''];
  const activeHref = '';

  useEffect(() => {
    if (location.state?.reason === 'sign-out') {
      addNotification({
        id: nanoid(5),
        type: 'info',
        message: 'Successfully signed out!',
      });
    }
  }, [location]);

  return (
    <I18nProvider locale='en' messages={[messages]}>
      <GlobalHeader />
      <div id='c'>
        <AppLayout
          stickyNotifications
          headerSelector='#h'
          notifications={<Notifications />}
          breadcrumbs={
            isAuthRoute && breadcrumbs ? <BreadcrumbGroup items={[]} /> : undefined
          }
          navigation={<SideNavigation activeHref={activeHref} />}
          navigationHide
          toolsHide
          content={<Outlet />}
        />
      </div>
    </I18nProvider>
  );
};

export const Component = CommonLayout;
