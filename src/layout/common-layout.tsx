import { Outlet } from 'react-router-dom';
import {
  AppLayout,
  BreadcrumbGroup,
  SideNavigation,
} from '@cloudscape-design/components';
import I18nProvider from '@cloudscape-design/components/i18n';
import messages from '@cloudscape-design/components/i18n/messages/all.en';

import { GlobalHeader } from './header';
import { Notifications } from '../common/components/notifications';

const CommonLayout = () => {
  const breadcrumbs = [''];
  const activeHref = '';

  return (
    <I18nProvider locale='en' messages={[messages]}>
      <GlobalHeader />
      <div id='c'>
        <AppLayout
          stickyNotifications
          headerSelector='#h'
          notifications={<Notifications />}
          breadcrumbs={breadcrumbs ? <BreadcrumbGroup items={[]} /> : undefined}
          navigation={<SideNavigation activeHref={activeHref} />}
          navigationOpen={false}
          content={<Outlet />}
        />
      </div>
    </I18nProvider>
  );
};

export const Component = CommonLayout;
