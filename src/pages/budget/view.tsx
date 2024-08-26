import { useCollection } from '@cloudscape-design/collection-hooks';
import { Box, Button, Header, Modal, Table, TableProps } from '@cloudscape-design/components';

import data, { BudgetTableItem } from './data';
import {
  calculateCategoryTotals,
  createBudgetTableColumnDefinitions,
} from './table-configs';
import { useState } from 'react';

const ViewBudgetPage = () => {
  const [syntheticData, setSyntheticData] = useState(calculateCategoryTotals(data));
  const [isDeleteCategoryModalVisible, setIsDeleteCategoryModalVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<BudgetTableItem | null>(null);

  const resetDeleteCategory = () => {
    setIsDeleteCategoryModalVisible(false);
    setItemToDelete(null);
  }

  const handleDeleteCategory = (item: BudgetTableItem) => {
    setItemToDelete(item);
    setIsDeleteCategoryModalVisible(true);
  };

  const confirmDeleteCategory = () => {
    if (!itemToDelete) {
      return;
    }

    setSyntheticData(prev => prev.filter(item => item.id !== itemToDelete.id));
    resetDeleteCategory();
  }

  const handleSubmitEdit: TableProps.SubmitEditFunction<BudgetTableItem> = (item, column, newValue) => {
    const updatedItem = { ...item, [String(column.id)]: newValue };
    setSyntheticData((prev) => prev.map((i) => (i.id === updatedItem.id ? updatedItem : i)));
  };

  const { collectionProps, items } = useCollection(syntheticData, {
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
        variant="container"
        selectionType='single'
        items={items}
        columnDefinitions={createBudgetTableColumnDefinitions(items, { handleDeleteCategory })}
        expandableRows={collectionProps.expandableRows}
        submitEdit={handleSubmitEdit}
        header={
          <Header
            variant="h1"
            actions={
              <Button
                variant="primary"
              >
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
        header='Delete category?'
        footer={
          <Box>
            <Button onClick={resetDeleteCategory}>Cancel</Button>
            <Button onClick={confirmDeleteCategory}>Delete</Button>
          </Box>
        }
      />
    </>

  );
};

export const Component = ViewBudgetPage;
