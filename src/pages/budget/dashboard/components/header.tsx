import type { ReactNode } from 'react';
import { getI18n, useTranslation } from 'react-i18next';

import { Box, Header } from '@cloudscape-design/components';
import { DateTime } from 'luxon';

import { useSelectedUser } from '@/hooks/use-selected-user';

import { useBudgetProvider } from '../../hooks/use-budget-provider';

type PageHeaderProps = {
  actions?: ReactNode;
};

export const PageHeader = ({ actions }: PageHeaderProps) => {
  const { t } = useTranslation(['budget/dashboard']);
  const locale = getI18n().language;

  const { selectedUser } = useSelectedUser();
  const { budgetEntry } = useBudgetProvider();

  const formatedDate = DateTime.fromFormat(budgetEntry, 'yyyy-MM')
    .setLocale(locale)
    .toFormat('LLLL yyyy');

  return (
    <Header
      variant='awsui-h1-sticky'
      info={<Box variant='span'>{formatedDate}</Box>}
      actions={actions}>
      {t('common.title', { name: selectedUser?.name })}
    </Header>
  );
};
