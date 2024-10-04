import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DateTime } from 'luxon';

import {
  Button,
  SpaceBetween,
  StatusIndicator,
  Table,
} from '@cloudscape-design/components';
import { useCollection } from '@cloudscape-design/collection-hooks';

import { useDrawer } from '@/components/drawer-provider';
import { ManualRefresh } from '@/components/manual-refresh';

import { useBudgetProvider } from '../hooks/use-budget-provider';
import { useBudgetApi } from '../hooks/use-budget-api';

import { AddCategory } from '../drawer/add-category';
import { AddBudgetItem } from '../drawer/add-budget-item';
import { DeleteItemModal } from '../modals/delete-item';
import { EditBudgetItem } from '../drawer/edit-budget-item';
import { EditCategory } from '../drawer/edit-category';

import { type BudgetTableItem, isCategoryItem } from '../utils/api-types';
import { createBudgetTableColumnDefinitions } from '../utils/table-configs';
import { WidgetConfig } from '../utils/widget-types';
import i18n from '../../../i18n';

// eslint-disable-next-line react-refresh/only-export-components
const BudgetTableActions = () => {
  const { t } = useTranslation(undefined, { keyPrefix: 'budget.budgetTable' });

  const { openDrawer, closeDrawer } = useDrawer();
  const { selectedUser, budgetEntry } = useBudgetProvider();
  const { isFetching, dataUpdatedAt, refetch, handleAddCategory } = useBudgetApi(
    selectedUser.userId,
    budgetEntry
  );
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

// eslint-disable-next-line react-refresh/only-export-components
const BudgetTable = () => {
  const { t } = useTranslation(undefined, { keyPrefix: 'budget.budgetTable' });
  const { openDrawer, closeDrawer } = useDrawer();
  const { selectedUser, budgetEntry } = useBudgetProvider();

  const {
    data: budgetItems,
    isFetching,
    refetch,
    handleAddBudgetItem,
    handleUpdateBudgetItem,
    handleDeleteItem,
  } = useBudgetApi(selectedUser.userId, budgetEntry);

  const { items, collectionProps } = useCollection(budgetItems ?? [], {
    selection: {},
    sorting: {},
    expandableRows: {
      getId: (item: BudgetTableItem) => item.id,
      getParentId: (item: BudgetTableItem) =>
        isCategoryItem(item) ? null : String(item.category_id),
    },
  });

  const [deleteItemProps, setDeleteItemProps] = useState<{
    visible: boolean;
    item?: BudgetTableItem;
  }>({ visible: false });

  const onCloseDeleteModal = () => {
    setDeleteItemProps({
      visible: false,
      item: undefined,
    });
  };

  useEffect(() => {
    refetch().catch(console.error);
    // eslint-disable-next-line react-compiler/react-compiler
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [budgetEntry]);

  return (
    <>
      <Table
        {...collectionProps}
        enableKeyboardNavigation
        variant='embedded'
        loading={isFetching}
        items={items ?? []}
        columnDefinitions={createBudgetTableColumnDefinitions(t, {
          handleEditCategory: (item) => {
            openDrawer({
              drawerName: 'edit-category-item',
              width: 300,
              content: (
                <EditCategory
                  selectedUserId={selectedUser.userId}
                  category={item}
                  onEdit={handleUpdateBudgetItem}
                  onClose={closeDrawer}
                />
              ),
            });
          },
          handleAddBudgetLineItem: (item) => {
            openDrawer({
              drawerName: 'add-budget-item',
              width: 300,
              content: (
                <AddBudgetItem
                  selectedUserId={selectedUser.userId}
                  budgetEntry={budgetEntry}
                  categoryId={item.id}
                  onAdd={handleAddBudgetItem}
                  onClose={closeDrawer}
                />
              ),
            });
          },
          handleEditBudgetItem: (item) => {
            openDrawer({
              drawerName: 'edit-budget-item',
              width: 300,
              content: (
                <EditBudgetItem
                  item={item}
                  budgetEntry={budgetEntry}
                  selectedUserId={selectedUser.userId}
                  onEdit={handleUpdateBudgetItem}
                  onClose={closeDrawer}
                />
              ),
            });
          },
          handleDeleteItem: (item) => {
            setDeleteItemProps({
              visible: true,
              item,
            });
          },
        })}
        empty={<StatusIndicator type='info'>{t('empty')}</StatusIndicator>}
      />
      <DeleteItemModal
        visible={deleteItemProps.visible}
        item={deleteItemProps.item}
        onDelete={(item) => {
          handleDeleteItem(item);
          onCloseDeleteModal();
        }}
        onClose={onCloseDeleteModal}
      />
    </>
  );
};

export const budgetTableWidget: WidgetConfig = {
  columnOffset: { 4: 0 },
  definition: { defaultRowSpan: 3, defaultColumnSpan: 4 },
  data: {
    title: i18n.t('budget.budgetTable.title'),
    description: 'Budget description',
    content: <BudgetTable />,
    actions: <BudgetTableActions />,
  },
};
