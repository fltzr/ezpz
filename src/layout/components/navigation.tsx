import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

import { SideNavigation } from '@cloudscape-design/components';

export const Navigation = () => {
  const { t } = useTranslation();

  const location = useLocation();
  const navigate = useNavigate();
  const activeHref = location.pathname;

  return (
    <SideNavigation
      activeHref={activeHref}
      items={[
        {
          type: 'section',
          text: t('layout.navItems.budget.title'),
          items: [
            {
              type: 'link',
              text: t('layout.navItems.budget.linkDashboard'),
              href: '/budget',
            },
            {
              type: 'link',
              text: t('layout.navItems.budget.linkTransactions'),
              href: '/budget?',
            },
            {
              type: 'link',
              text: t('layout.navItems.budget.linkAccounts'),
              href: '/budget?',
            },
          ],
        },
        { type: 'divider' },
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
  );
};