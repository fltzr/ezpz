import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button, SpaceBetween } from '@cloudscape-design/components';
import { DateTime } from 'luxon';

import { useDrawer } from '@/components/drawer-provider';
import { ManualRefresh } from '@/components/manual-refresh';
import { useBudgetCategoryApi } from '@/pages/budget/hooks/use-budget-category-api';

import { AddBudgetCategory } from '../../drawer/add-budget-category';

export const BudgetTableActions = () => {
  const { t } = useTranslation(undefined, { keyPrefix: 'budget.budgetTable' });

  const { openDrawer, closeDrawer } = useDrawer();
  const { isFetching, dataUpdatedAt, refetch, handleAddBudgetCategory } =
    useBudgetCategoryApi();
  const [lastRefresh, setLastRefresh] = useState<string | null>(null);

  const onClickAddCategoryDrawer = () => {
    openDrawer({
      drawerName: 'add-category',
      width: 350,
      content: (
        <AddBudgetCategory onAdd={handleAddBudgetCategory} onCancel={closeDrawer} />
      ),
    });
  };

  return (
    <SpaceBetween size='xs' direction='horizontal'>
      <ManualRefresh
        lastRefresh={lastRefresh}
        loading={isFetching}
        onRefresh={() => {
          setLastRefresh(DateTime.fromMillis(dataUpdatedAt).toISO());
          refetch().catch(console.error);
        }}
      />
      <Button variant='primary' iconName='add-plus' onClick={onClickAddCategoryDrawer}>
        {t('addCategory')}
      </Button>
    </SpaceBetween>
  );
};
