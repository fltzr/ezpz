import { useCollection } from '@cloudscape-design/collection-hooks';
import { Button, Header, Table } from '@cloudscape-design/components';

import { useBudgetState } from './hooks/use-budget-state';
import { useModals } from './hooks/use-modals';
import { createBudgetTableColumnDefinitions } from './utils/table-configs';
import type { BudgetTableItem } from './utils/data';
import { AddCategoryModal } from './components/add-category-modal';
import { DeleteCategoryModal } from './components/delete-category-modal';

const ViewBudgetPage = () => {
  const {
    data,
    categoryToDelete,
    setCategoryToDelete,
    // budgetLineItemToDelete,
    // setBudgetLineItemToDelete,
    handleAddCategory,
    handleAddBudgetLineItem,
    handleSubmitEdit,
    handleDeleteCategory,
    // handleDeleteBudgetLineItem,
  } = useBudgetState();

  const { modals, openModal, closeModal } = useModals();

  const { items, collectionProps } = useCollection(data, {
    selection: {},
    sorting: {},
    expandableRows: {
      getId: (item) => item.id,
      getParentId: (item) => item.parentId,
    },
  });

  return (
    <>
      <Table
        enableKeyboardNavigation
        resizableColumns
        variant='container'
        selectionType='single'
        items={items}
        columnDefinitions={createBudgetTableColumnDefinitions(items, {
          handleAddBudgetLineItem: (item: BudgetTableItem) =>
            handleAddBudgetLineItem(item, ''),
          handleDeleteCategory: (item: BudgetTableItem) => {
            setCategoryToDelete(item);
            openModal('deleteCategory')();
          },
        })}
        submitEdit={handleSubmitEdit}
        header={
          <Header
            variant='h1'
            actions={
              <Button variant='primary' onClick={() => openModal('addCategory')()}>
                Add category
              </Button>
            }>
            Budget
          </Header>
        }
        {...collectionProps}
      />
      <AddCategoryModal
        visible={modals.addCategory}
        onClose={closeModal('addCategory')}
        onAdd={handleAddCategory}
      />
      <DeleteCategoryModal
        category={categoryToDelete}
        visible={modals.deleteCategory}
        onClose={closeModal('deleteCategory')}
        onDelete={handleDeleteCategory}
      />
    </>
  );
};

export const Component = ViewBudgetPage;
