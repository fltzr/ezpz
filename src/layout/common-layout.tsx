import { Outlet } from 'react-router-dom';
import {
  AppLayout,
  BreadcrumbGroup,
  Flashbar,
  SideNavigation,
} from '@cloudscape-design/components';
import I18nProvider from '@cloudscape-design/components/i18n';
import messages from '@cloudscape-design/components/i18n/messages/all.en';

import { GlobalHeader } from './header';

const CommonLayout = () => {
  const breadcrumbs = [''];
  const activeHref = '';

  return (
    <I18nProvider locale="en" messages={[messages]}>
      <GlobalHeader />
      <div id="c">
        <AppLayout
          headerSelector="#h"
          notifications={<Flashbar items={[]} />}
          breadcrumbs={breadcrumbs ? <BreadcrumbGroup items={[]} /> : undefined}
          navigation={<SideNavigation activeHref={activeHref} />}
          content={<Outlet />}
        />
      </div>
    </I18nProvider>
  );
};

export const Component = CommonLayout;
