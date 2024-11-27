import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

import { SideNavigation } from '@cloudscape-design/components';

import { UserSelector } from '@/components/user-selector';

export const Navigation = () => {
  const { t } = useTranslation();

  const location = useLocation();
  const navigate = useNavigate();
  const activeHref = location.pathname;

  return (
    <SideNavigation
      header={
        location.pathname.includes('budget')
          ? { text: 'Budget', href: '/budget' }
          : { href: '' }
      }
      activeHref={activeHref}
      itemsControl={<UserSelector />}
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
              href: '/budget/transactions',
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
        void navigate(event.detail.href);
      }}
    />
  );
};
