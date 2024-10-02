import {
  Button,
  Header,
  SpaceBetween,
  StatusIndicator,
  Table,
} from '@cloudscape-design/components';
import { useTranslation } from 'react-i18next';
import { useBudgetProvider } from '../hooks/use-budget-provider';
import { BudgetTableItem, isCategoryItem } from '../utils/types';
import { useCollection } from '@cloudscape-design/collection-hooks';
import { createBudgetTableColumnDefinitions } from '../utils/table-configs';
import { useBudgetApi } from '../hooks/use-budget-api';
import { useDrawer } from '../../../common/components/drawer-provider';
import { AddCategory } from '../drawer/add-category';
import { AddBudgetItem } from '../drawer/add-budget-item';
import { DeleteItemModal } from '../modals/delete-item';
import { useEffect, useState } from 'react';
import { EditBudgetItem } from '../drawer/edit-budget-item';
import { EditCategory } from '../drawer/edit-category';
import { ManualRefresh } from '../../../common/components/manual-refresh';
import { DateTime } from 'luxon';

export const BudgetTable = () => {
  const { t } = useTranslation(undefined, { keyPrefix: 'budget.budgetTable' });
  const { openDrawer, closeDrawer } = useDrawer();
  const { selectedUser, budgetEntry } = useBudgetProvider();

  const {
    data: budgetItems,
    isFetching,
    dataUpdatedAt,
    refetch,
    handleAddCategory,
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

  const [lastRefresh, setLastRefresh] = useState<string | null>(null);

  const [deleteItemProps, setDeleteItemProps] = useState<{
    visible: boolean;
    item?: BudgetTableItem;
  }>({ visible: false });

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
        loading={isFetching}
        variant='container'
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
        header={
          <Header
            variant='h2'
            actions={
              <SpaceBetween size='xs' direction='horizontal'>
                <ManualRefresh
                  lastRefresh={lastRefresh}
                  loading={isFetching}
                  onRefresh={() => {
                    setLastRefresh(DateTime.fromMillis(dataUpdatedAt).toISO());
                    refetch().catch(console.error);
                  }}
                />
                <Button
                  variant='primary'
                  iconName='add-plus'
                  onClick={onClickAddCategoryDrawer}>
                  {t('addCategory')}
                </Button>
              </SpaceBetween>
            }>
            {t('title')}
          </Header>
        }
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
