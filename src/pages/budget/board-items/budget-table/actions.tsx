import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DateTime } from 'luxon';

import { Button, SpaceBetween } from '@cloudscape-design/components';

import { useDrawer } from '@/components/drawer-provider';
import { ManualRefresh } from '@/components/manual-refresh';

import { useBudgetProvider } from '../../hooks/use-budget-provider';
import { useBudgetApi } from '../../hooks/use-budget-api';

import { AddCategory } from '../../drawer/add-category';
import { AddBudgetItem } from '../../drawer/add-budget-item';

export const BudgetTableActions = () => {
  const { t } = useTranslation(undefined, { keyPrefix: 'budget.budgetTable' });

  const { openDrawer, closeDrawer } = useDrawer();
  const { selectedUser, budgetEntry } = useBudgetProvider();
  const { isFetching, dataUpdatedAt, refetch, handleAddCategory, handleAddBudgetItem } =
    useBudgetApi(selectedUser.userId, budgetEntry);
  const [lastRefresh, setLastRefresh] = useState<string | null>(null);

  const onClickAddCategoryDrawer = () => {
    openDrawer({
      drawerName: 'add-category',
      width: 350,
      content: (
        <AddCategory
          selectedUserId={selectedUser.userId}
          onAdd={handleAddCategory}
          onClose={closeDrawer}
        />
      ),
    });
  };

  const onClickAddBudgetItemDrawer = () => {
    openDrawer({
      drawerName: 'add-budget-item',
      width: 350,
      content: (
        <AddBudgetItem
          budgetEntry={budgetEntry}
          selectedUserId={selectedUser.userId}
          onAdd={handleAddBudgetItem}
          onClose={closeDrawer}
        />
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

      <Button variant='normal' iconName='add-plus' onClick={onClickAddBudgetItemDrawer}>
        {t('addBudgetItem')}
      </Button>
    </SpaceBetween>
  );
};
