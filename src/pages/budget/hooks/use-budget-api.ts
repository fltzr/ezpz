import { nanoid } from 'nanoid';
import type { TableProps } from '@cloudscape-design/components';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useSupabase } from '../../../common/hooks/use-supabase';
import { useNotificationStore } from '../../../common/state/notifications';
import * as api from '../api/budget-queries';
import { calculateCategoryTotals } from '../utils/table-configs';
import {
  type BudgetTableItem,
  type CategoryInsert,
  type BudgetItemInsert,
  type BudgetItemUpdate,
  isCategoryItem,
  isBudgetItem,
} from '../utils/types';

export const useBudgetApi = (userId: string) => {
  const supabase = useSupabase();
  const queryClient = useQueryClient();
  const { addNotification } = useNotificationStore();

  const { data, isLoading, error } = useQuery({
    queryKey: ['budget-items', userId],
    queryFn: () => api.fetchBudgetData(supabase, userId),
    enabled: !!userId,
    select: calculateCategoryTotals,
  });
  const addCategoryMutation = useMutation({
    mutationFn: (newCategory: CategoryInsert) => api.addCategory(supabase, newCategory),
    onSuccess: (newCategory) => {
      queryClient.setQueryData<BudgetTableItem[]>(['budget-items', userId], (old) =>
        calculateCategoryTotals(old ? [...old, newCategory] : [newCategory])
      );
      addNotification({
        id: nanoid(5),
        type: 'success',
        message: `Added category: ${newCategory.category_name}`,
      });
    },
    onError: (error: Error) => {
      addNotification({
        id: nanoid(5),
        type: 'error',
        message: error.message,
      });
    },
  });
  const addBudgetItemMutation = useMutation({
    mutationFn: (item: BudgetItemInsert) => api.addBudgetItem(supabase, item),
    onSuccess: (newItem) => {
      queryClient.setQueryData<BudgetTableItem[]>(['budget-items', userId], (old) => {
        if (!old) return [newItem];
        const updatedItems = [...old];
        const categoryIndex = updatedItems.findIndex(
          (item) => isCategoryItem(item) && item.id === newItem.category_id
        );

        if (categoryIndex !== -1) {
          updatedItems.splice(categoryIndex + 1, 0, newItem);
        } else {
          updatedItems.push(newItem);
        }

        return calculateCategoryTotals(updatedItems);
      });
      addNotification({
        id: nanoid(5),
        type: 'success',
        message: `Added budget item: ${newItem.budget_item_name}`,
      });
    },
    onError: (error: Error) => {
      addNotification({
        id: nanoid(5),
        type: 'error',
        message: error.message,
      });
    },
  });

  const updateItemMutation = useMutation({
    mutationFn: async (item: BudgetItemUpdate) => {
      await api.updateBudgetItem(supabase, item.id!, {
        budget_item_name: item.budget_item_name,
        projected_amount: item.projected_amount,
        category_id: item.category_id,
      });
    },
    onSuccess: (_, updatedItem) => {
      queryClient.refetchQueries({ queryKey: ['budget-items', userId] });

      addNotification({
        id: nanoid(5),
        type: 'success',
        message: `Updated budget item: ${updatedItem.budget_item_name}`,
      });
    },
    onError: (error: Error) => {
      addNotification({
        id: nanoid(5),
        type: 'error',
        message: error.message,
      });
    },
  });

  const deleteItemMutation = useMutation({
    mutationFn: async (item: BudgetTableItem) => {
      if (isCategoryItem(item)) {
        await api.deleteCategory(supabase, item.id);
      } else if (isBudgetItem(item)) {
        await api.deleteBudgetItem(supabase, item.id);
      }
    },
    onSuccess: (_, deletedItem) => {
      queryClient.refetchQueries({ queryKey: ['budget-items', userId] });

      addNotification({
        id: nanoid(5),
        type: 'success',
        message: `Deleted ${isCategoryItem(deletedItem) ? 'category' : 'budget item'}: ${
          isCategoryItem(deletedItem)
            ? deletedItem.category_name
            : deletedItem.budget_item_name
        }`,
      });
    },
    onError: (error: Error) => {
      addNotification({
        id: nanoid(5),
        type: 'error',
        message: error.message,
      });
    },
  });

  const handleAddCategory = (category: CategoryInsert) => {
    addCategoryMutation.mutate(category);
  };
  const handleAddBudgetItem = (item: BudgetItemInsert) => {
    addBudgetItemMutation.mutate(item);
  };

  const handleUpdateBudgetItem = (item: BudgetItemUpdate) => {
    console.log('Updating budget item: ', item);
    updateItemMutation.mutate(item);
  };

  const handleSubmitInlineEdit: TableProps.SubmitEditFunction<BudgetTableItem> = (
    item,
    column,
    newValue
  ) => {
    const updatedItem = { ...item, [String(column.id)]: newValue };
    updateItemMutation.mutate(updatedItem);
  };
  const handleDeleteItem = (item: BudgetTableItem) => {
    deleteItemMutation.mutate(item);
  };

  return {
    data,
    isLoading,
    error,
    handleAddCategory,
    handleAddBudgetItem,
    handleUpdateBudgetItem,
    handleSubmitInlineEdit,
    handleDeleteItem,
  };
};
