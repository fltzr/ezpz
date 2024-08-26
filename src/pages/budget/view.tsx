import { useState } from 'react';
import { useCollection } from '@cloudscape-design/collection-hooks';
import { Box, Button, Header, Input, Modal, SpaceBetween, Table, TableProps } from '@cloudscape-design/components';
import data, { BudgetTableItem } from './data';
import { calculateCategoryTotals, createBudgetTableColumnDefinitions } from './table-configs';
import { useNotificationStore } from '../../common/state/notifications';
import { uniqueId } from 'lodash-es';

const ViewBudgetPage = () => {
  const [syntheticData, setSyntheticData] = useState(calculateCategoryTotals(data));
  const [isAddCategoryModalVisible, setIsAddCategoryModalVisible] = useState(false);
  const [categoryToAdd, setCategoryToAdd] = useState<BudgetTableItem | null>(null);
  const [isAddBudgetLineItemModalVisible, setIsAddBudgetLineItemModalVisible] = useState(false);
  const [budgetLineItemToAdd, setBudgetLineItemToAdd] = useState<BudgetTableItem | null>(null);
  const [isDeleteCategoryModalVisible, setIsDeleteCategoryModalVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<BudgetTableItem | null>(null);
  const { addNotification } = useNotificationStore();

  const resetAddCategory = () => {
    setIsAddCategoryModalVisible(false);
    setCategoryToAdd(null);
  };

  const handleAddCategory = () => {
    if (!categoryToAdd) return;
    setSyntheticData(prev => [...prev, categoryToAdd]);
    addNotification({ type: 'success', message: `Added category: ${categoryToAdd.name}` });
    resetAddCategory();
  };

  const handleAddBudgetLineItem = (item: BudgetTableItem) => {
    setBudgetLineItemToAdd({ ...item, id: uniqueId(), parentId: item.id });
    setIsAddBudgetLineItemModalVisible(true);
  };

  const confirmAddBudgetLineItem = () => {
    if (!budgetLineItemToAdd) return;
    setSyntheticData(prev => [...prev, budgetLineItemToAdd]);
    addNotification({ type: 'success', message: `Added budget line item: ${budgetLineItemToAdd.name}` });
    setIsAddBudgetLineItemModalVisible(false);
    setBudgetLineItemToAdd(null);
  };

  const resetDeleteCategory = () => {
    setIsDeleteCategoryModalVisible(false);
    setItemToDelete(null);
  };

  const handleDeleteCategory = (item: BudgetTableItem) => {
    setItemToDelete(item);
    setIsDeleteCategoryModalVisible(true);
  };

  const confirmDeleteCategory = () => {
    if (!itemToDelete) return;
    setSyntheticData(prev => prev.filter(item => item.id !== itemToDelete.id));
    addNotification({ type: 'success', message: `Deleted item: ${itemToDelete.name}` });
    resetDeleteCategory();
  };

  const handleSubmitEdit: TableProps.SubmitEditFunction<BudgetTableItem> = (item, column, newValue) => {
    const updatedItem = { ...item, [String(column.id)]: newValue };
    setSyntheticData(prev => prev.map(i => (i.id === updatedItem.id ? updatedItem : i)));
  };

  const { collectionProps, items } = useCollection(syntheticData, {
    selection: {},
    sorting: {},
    expandableRows: {
      getId: item => item.id,
      getParentId: item => item.parentId,
    },
  });

  return (
    <>
      <Table
        enableKeyboardNavigation
        resizableColumns
        variant="container"
        selectionType="single"
        items={items}
        columnDefinitions={createBudgetTableColumnDefinitions(items, { handleDeleteCategory, handleAddBudgetLineItem })}
        expandableRows={collectionProps.expandableRows}
        submitEdit={handleSubmitEdit}
        header={
          <Header
            variant="h1"
            actions={
              <Button variant="primary" onClick={() => setIsAddCategoryModalVisible(true)}>
                Add category
              </Button>
            }
          >
            Budget
          </Header>
        }
        {...collectionProps}
      />
      <Modal
        visible={isDeleteCategoryModalVisible}
        onDismiss={resetDeleteCategory}
        header="Delete category?"
        footer={
          <Box float="right">
            <SpaceBetween direction="horizontal" size="xs">
              <Button onClick={resetDeleteCategory}>Cancel</Button>
              <Button onClick={confirmDeleteCategory}>Delete</Button>
            </SpaceBetween>
          </Box>
        }
      >
        <Box variant="span">
          Are you sure you want to delete <Box variant="code" color="text-status-info">{itemToDelete?.name}</Box>? <Box fontWeight="bold">This action can't be undone.</Box>
        </Box>
      </Modal>

      <Modal
        visible={isAddCategoryModalVisible}
        onDismiss={() => setIsAddCategoryModalVisible(false)}
        header="Add category"
        footer={
          <Box float="right">
            <Button onClick={resetAddCategory}>Cancel</Button>
            <Button variant="primary" onClick={handleAddCategory}>Add</Button>
          </Box>
        }
      >
        <Input
          placeholder="Category name"
          value={categoryToAdd?.name ?? ''}
          onChange={event => setCategoryToAdd({ ...categoryToAdd, name: event.detail.value, id: uniqueId(event.detail.value), parentId: null })}
        />
        <Input
          placeholder="Budget"
          value={categoryToAdd?.budget?.toString() ?? ''}
          onChange={event => setCategoryToAdd({
            ...categoryToAdd,
            budget: Number(event.detail.value),
            id: categoryToAdd?.id ?? '',
            parentId: null,
            name: categoryToAdd?.name ?? '' // Ensure name is always defined
          })}
        />
      </Modal>

      <Modal
        visible={isAddBudgetLineItemModalVisible}
        onDismiss={() => setIsAddBudgetLineItemModalVisible(false)}
        header="Add budget line item"
        footer={
          <Box float="right">
            <Button onClick={() => setIsAddBudgetLineItemModalVisible(false)}>Cancel</Button>
            <Button variant="primary" onClick={confirmAddBudgetLineItem}>Add</Button>
          </Box>
        }
      >
        <Input
          disabled
          placeholder="Category name"
          value={budgetLineItemToAdd?.name ?? ''}
        />
        <Input
          placeholder="Line item name"
          value={budgetLineItemToAdd?.name ?? ''}
          onChange={event => setBudgetLineItemToAdd({ ...budgetLineItemToAdd, name: event.detail.value, id: uniqueId(event.detail.value), parentId: budgetLineItemToAdd?.id ?? '' })}
        />
        <Input
          placeholder="Amount"
          value={budgetLineItemToAdd?.amount?.toString() ?? ''}
          onChange={event => setBudgetLineItemToAdd({ ...budgetLineItemToAdd, amount: Number(event.detail.value), id: budgetLineItemToAdd?.id ?? '', name: budgetLineItemToAdd?.name ?? '', parentId: budgetLineItemToAdd?.parentId ?? '' })}
        />
      </Modal>
    </>
  );
};

export const Component = ViewBudgetPage;