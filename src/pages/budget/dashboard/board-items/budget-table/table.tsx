import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useCollection } from '@cloudscape-design/collection-hooks';
import { StatusIndicator, Table } from '@cloudscape-design/components';

import { useDrawer } from '@/components/drawer-provider';
import { useSelectedUser } from '@/hooks/use-selected-user';

import { useBudgetApi } from '../../../hooks/use-budget-api';
import { useBudgetProvider } from '../../../hooks/use-budget-provider';
import { type BudgetTableItem, isCategoryItem } from '../../../utils/api-types';
import { AddBudgetItem } from '../../drawer/add-budget-item';
import { EditBudgetItem } from '../../drawer/edit-budget-item';
import { EditCategory } from '../../drawer/edit-category';
import { DeleteItemModal } from '../../modals/delete-item';

import { createBudgetTableColumnDefinitions } from './table-configs';

export const BudgetTable = () => {
  const { t } = useTranslation(undefined, { keyPrefix: 'budget.budgetTable' });
  const { openDrawer, closeDrawer } = useDrawer();
  const { selectedUser } = useSelectedUser();
  const { budgetEntry } = useBudgetProvider();

  const {
    data: budgetItems,
    isFetching,
    refetch,
    handleAddBudgetItem,
    handleUpdateBudgetItem,
    handleDeleteItem,
  } = useBudgetApi();

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
                  selectedUserId={selectedUser?.userId}
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
                  budgetEntry={budgetEntry}
                  selectedUserId={selectedUser?.userId}
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
                  selectedUserId={selectedUser?.userId}
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
