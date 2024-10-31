import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useCollection } from '@cloudscape-design/collection-hooks';
import { StatusIndicator, Table } from '@cloudscape-design/components';
import { DateTime } from 'luxon';

import { useBudgetCategoryApi } from '@/pages/budget/hooks/use-budget-category-api';
import { useTransactionsApi } from '@/pages/budget/hooks/use-transactions-api';

import { useBudgetProvider } from '../../../../hooks/use-budget-provider';
import { type BudgetCategory } from '../../../../utils/api-types';
import { DeleteItemModal } from '../../../components/modals/delete-item';

import { createBudgetTableColumnDefinitions } from './table-configs';

export const BudgetTable = () => {
  const { t } = useTranslation(undefined, { keyPrefix: 'budget.budgetTable' });
  const { budgetEntry } = useBudgetProvider();

  const {
    data: budgetItems,
    isFetching,
    handleUpdateBudgetCategory,
    handleDeleteBudgetCategory,
  } = useBudgetCategoryApi();

  const { data: transactions } = useTransactionsApi({
    selectedDate: DateTime.fromFormat(budgetEntry, 'yyyy-MM'),
  });

  const { items, collectionProps } = useCollection(budgetItems ?? [], {
    selection: {},
    sorting: {},
  });

  const [deleteItemProps, setDeleteItemProps] = useState<{
    visible: boolean;
    item?: BudgetCategory;
  }>({ visible: false });

  const progressData = () => {
    const categoryTotals = new Map<string, number>();

    transactions?.map((tx) => {
      const { outflow, budget_category_id } = tx;

      if (!budget_category_id || !outflow) return;

      if (categoryTotals.has(budget_category_id)) {
        categoryTotals.set(
          budget_category_id,
          categoryTotals.get(budget_category_id)! + outflow
        );
      } else {
        categoryTotals.set(budget_category_id, outflow);
      }
    });

    const result = items?.map((c) => {
      const total = categoryTotals.get(c.id) || 0;
      return { title: c.id, value: total };
    });

    return result;
  };

  const onCloseDeleteModal = () => {
    setDeleteItemProps({
      visible: false,
      item: undefined,
    });
  };

  return (
    <>
      <Table
        {...collectionProps}
        enableKeyboardNavigation
        variant='embedded'
        loading={isFetching}
        items={items ?? []}
        columnDefinitions={createBudgetTableColumnDefinitions(
          {
            progressData: progressData(),
          },
          {
            handleDeleteItem: (item) => {
              setDeleteItemProps({ visible: true, item });
            },
          }
        )}
        empty={<StatusIndicator type='info'>{t('empty')}</StatusIndicator>}
        submitEdit={(item, column, newValue) => {
          if (column.id?.includes('category')) {
            column.id = 'budget_category_id';
          }

          const payload = {
            id: item.id,
            [column.id!]: newValue,
          };

          handleUpdateBudgetCategory(payload);
        }}
      />

      <DeleteItemModal
        visible={deleteItemProps.visible}
        item={deleteItemProps.item}
        onDelete={(item) => {
          handleDeleteBudgetCategory(item);
          onCloseDeleteModal();
        }}
        onClose={onCloseDeleteModal}
      />
    </>
  );
};
