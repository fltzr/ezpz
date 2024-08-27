import { useState } from 'react';
import { nanoid } from 'nanoid';
import { TableProps } from '@cloudscape-design/components';
import { useNotificationStore } from '../../../common/state/notifications';
import data, { type BudgetTableItem } from '../utils/data';
import { calculateCategoryTotals } from '../utils/table-configs';

export const useBudgetState = () => {
  const [syntheticData, setSyntheticData] = useState<ReadonlyArray<BudgetTableItem>>(
    calculateCategoryTotals(data)
  );
  const [categoryToDelete, setCategoryToDelete] = useState<BudgetTableItem | null>(null);
  const [budgetLineItemToDelete, setBudgetLineItemToDelete] =
    useState<BudgetTableItem | null>(null);

  const { addNotification } = useNotificationStore();

  const handleAddCategory = (category: BudgetTableItem) => {
    setSyntheticData((prev) => [...prev, category]);
    addNotification({
      id: nanoid(5),
      type: 'success',
      message: `Added category: ${category.name}`,
    });
  };

  const handleAddBudgetLineItem = (item: BudgetTableItem, categoryName: string) => {
    if (!item.parentId) return;

    const newItem = { ...item, id: nanoid(5), parentId: item.parentId ?? null };
    setSyntheticData((prev) => [...prev, newItem]);
    addNotification({
      id: nanoid(5),
      type: 'success',
      message: `Added budget line item ${newItem.name} to ${categoryName}`,
    });
  };

  const handleSubmitEdit: TableProps.SubmitEditFunction<BudgetTableItem> = (
    item,
    column,
    newValue
  ) => {
    const updatedItem = { ...item, [String(column.id)]: newValue };
    setSyntheticData((prev) =>
      prev.map((i) => (i.id === updatedItem.id ? updatedItem : i))
    );
    addNotification({
      id: nanoid(5),
      type: 'success',
      message: `Updated budget line item ${updatedItem.name} to ${newValue}`,
    });
  };

  const handleDeleteCategory = () => {
    if (!categoryToDelete) return;

    setSyntheticData((prev) =>
      prev.filter((category) => category.id !== categoryToDelete.parentId)
    );
    addNotification({
      id: nanoid(5),
      type: 'success',
      message: `Deleted category ${categoryToDelete.name}`,
    });
    setCategoryToDelete(null);
  };

  const handleDeleteBudgetLineItem = () => {
    if (!budgetLineItemToDelete) return;

    setSyntheticData((prev) =>
      prev.filter((item) => item.id !== budgetLineItemToDelete.id)
    );
    addNotification({
      id: nanoid(5),
      type: 'success',
      message: `Deleted budget line item ${budgetLineItemToDelete.name}`,
    });
    setBudgetLineItemToDelete(null);
  };

  return {
    data: syntheticData,
    categoryToDelete,
    setCategoryToDelete,
    budgetLineItemToDelete,
    setBudgetLineItemToDelete,
    handleAddCategory,
    handleAddBudgetLineItem,
    handleSubmitEdit,
    handleDeleteCategory,
    handleDeleteBudgetLineItem,
  };
};
