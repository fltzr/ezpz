import { TableProps } from '@cloudscape-design/components';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useSupabase } from '../../../common/hooks/use-supabase';
import { useNotificationStore } from '../../../common/state/notifications';

import * as api from '../data-access/budget-queries';
import { calculateCategoryTotals } from '../utils/table-configs';
import { useNotifiedMutation } from '../../../common/hooks/use-notified-mutation';
import {
  BudgetItemInsert,
  BudgetItemUpdate,
  BudgetTableItem,
  CategoryInsert,
  isBudgetItem,
  isCategoryItem,
} from '../utils/types';
import { useTranslation } from 'react-i18next';

export const useBudgetApi = (userId: string, budgetEntry: string) => {
  const { t } = useTranslation(undefined, { keyPrefix: 'budget.api.budget' });
  const supabase = useSupabase();
  const queryClient = useQueryClient();
  const { addNotification } = useNotificationStore();

  const { data, isLoading, error } = useQuery({
    queryKey: ['budget-items', budgetEntry, userId],
    queryFn: () => api.fetchBudgetData(userId, budgetEntry, supabase),
    enabled: !!userId,
    select: calculateCategoryTotals,
  });

  const addCategoryMutation = useNotifiedMutation({
    mutationFn: (newCategory: CategoryInsert) => api.addCategory(supabase, newCategory),
    onSuccess: (newCategory) => {
      queryClient.setQueryData<BudgetTableItem[]>(
        ['budget-items', budgetEntry, userId],
        (old) => calculateCategoryTotals(old ? [...old, newCategory] : [newCategory])
      );
    },
    successMessage: (newCategory) =>
      t('addCategorySuccess', { category: newCategory.category_name }),
    errorMessage: (error: unknown) =>
      error instanceof Error ? error.message : t('unknownError'),
  });
  const addBudgetItemMutation = useNotifiedMutation({
    mutationFn: (item: BudgetItemInsert) => api.addBudgetItem(supabase, item),
    onSuccess: (newItem) => {
      queryClient.setQueryData<BudgetTableItem[]>(
        ['budget-items', budgetEntry, userId],
        (old) => {
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
        }
      );
    },
    successMessage: (newItem) =>
      t('addBudgetItemSuccess', { budgetItem: newItem.budget_item_name }),
    errorMessage: (error) => t('addBudgetItemError', { message: error.message }),
  });

  const updateItemMutation = useNotifiedMutation({
    mutationFn: async (item: BudgetItemUpdate) => {
      await api.updateBudgetItem(supabase, item.id!, {
        budget_item_name: item.budget_item_name,
        projected_amount: item.projected_amount,
        category_id: item.category_id,
      });
    },
    onSuccess: () => {
      queryClient
        .refetchQueries({ queryKey: ['budget-items', budgetEntry, userId] })
        .catch((error: Error) => {
          addNotification({
            type: 'error',
            message: t('refetchBudgetItemError', { message: error.message }),
          });
        });
    },
    successMessage: () => t('updateBudgetItemSuccess'),
    errorMessage: (error) => t('updateBudgetItemError', { message: error.message }),
  });

  const deleteItemMutation = useNotifiedMutation({
    mutationFn: async (item: BudgetTableItem) => {
      if (isCategoryItem(item)) {
        await api.deleteCategory(supabase, item.id);
      } else if (isBudgetItem(item)) {
        await api.deleteBudgetItem(supabase, item.id);
      }
    },
    onSuccess: () => {
      queryClient
        .refetchQueries({ queryKey: ['budget-items', budgetEntry, userId] })
        .catch((error: Error) => {
          addNotification({
            type: 'error',
            message: t('refetchBudgetItemError', { message: error.message }),
          });
        });
    },
    errorMessage: (error: Error) =>
      t('deleteBudgetItemError', { message: error.message }),
    successMessage: () => t('deleteBudgetItemSuccess'),
  });

  const handleAddCategory = (category: CategoryInsert) => {
    addCategoryMutation.mutate({ ...category, budget_entry: budgetEntry });
  };
  const handleAddBudgetItem = (item: BudgetItemInsert) => {
    addBudgetItemMutation.mutate({ ...item, budget_entry: budgetEntry });
  };

  const handleUpdateBudgetItem = (item: BudgetItemUpdate) => {
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
