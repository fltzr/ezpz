import { useTranslation } from 'react-i18next';

import { TableProps } from '@cloudscape-design/components';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { useNotifiedMutation } from '@/hooks/use-notified-mutation';
import { useSelectedUser } from '@/hooks/use-selected-user';
import { useSupabase } from '@/hooks/use-supabase';
import { useNotificationStore } from '@/state/notifications';

import {
  addCategory,
  deleteCategory,
  fetchBudgetCategories,
  updateCategory,
} from '../data-access/budget-categories';
import {
  BudgetCategory,
  BudgetCategoryInsert,
  BudgetCategoryUpdate,
} from '../utils/api-types';

import { useBudgetProvider } from './use-budget-provider';

export const useBudgetCategoryApi = () => {
  const { t } = useTranslation();
  const supabase = useSupabase();
  const queryClient = useQueryClient();

  const { addNotification } = useNotificationStore();
  const { budgetEntry } = useBudgetProvider();
  const { selectedUser } = useSelectedUser();
  const userId = selectedUser?.userId;

  const { data, isFetching, error, refetch, dataUpdatedAt } = useQuery({
    queryKey: ['budget-categories', budgetEntry, userId],
    queryFn: () => fetchBudgetCategories(supabase, budgetEntry, userId),
    enabled: !!selectedUser?.userId,
  });

  const addBudgetCategoryMutation = useNotifiedMutation({
    mutationFn: (item: BudgetCategoryInsert) => addCategory(supabase, item),
    successMessage: (newItem) => t('addBudgetItemSuccess', { budgetItem: newItem.name }),
    errorMessage: (error) => t('addBudgetItemError', { message: error.message }),
    onSuccess: (newItem) => {
      queryClient.setQueryData<BudgetCategory[]>(
        ['budget-categories', budgetEntry, userId],
        (old) => {
          if (!old) return [newItem];

          return [newItem, ...old];
        }
      );
    },
  });

  const updateBudgetCategoryMutation = useNotifiedMutation({
    mutationFn: (item: BudgetCategoryUpdate) => updateCategory(supabase, item),
    onSuccess: () => {
      queryClient
        .refetchQueries({ queryKey: ['budget-categories', budgetEntry, userId] })
        .catch((error: Error) => {
          addNotification({
            type: 'error',
            message: t('refetchBudgetItemError', { message: error.message }),
          });
        });
    },
    successMessage: () => t('api.success.update', { item: 'category' }),
    errorMessage: (error) =>
      t('api.error.update', { item: 'category', message: error.message }),
  });

  const deleteBudgetCategoryMutation = useNotifiedMutation({
    mutationFn: (item: BudgetCategoryUpdate) => deleteCategory(supabase, item.id),
    errorMessage: (error: Error) =>
      t('deleteBudgetItemError', { message: error.message }),
    successMessage: () => t('deleteBudgetItemSuccess'),
    onSuccess: () => {
      queryClient
        .refetchQueries({ queryKey: ['budget-categories', budgetEntry, userId] })
        .catch((error: Error) => {
          addNotification({
            type: 'error',
            message: t('refetchBudgetItemError', { message: error.message }),
          });
        });
    },
  });

  const handleAddBudgetCategory = (
    item: Omit<BudgetCategoryInsert, 'user_id' | 'budget_entry'>
  ) => {
    const itemWithMeta = { ...item, user_id: userId!, budget_entry: budgetEntry };
    addBudgetCategoryMutation.mutate(itemWithMeta);
  };
  const handleUpdateBudgetCategory = (item: BudgetCategoryUpdate) => {
    updateBudgetCategoryMutation.mutate(item);
  };
  const handleSubmitInlineEdit: TableProps.SubmitEditFunction<BudgetCategoryUpdate> = (
    item,
    column,
    newValue
  ) => {
    const updatedItem = { ...item, [String(column.id)]: newValue };
    updateBudgetCategoryMutation.mutate(updatedItem);
  };

  const handleDeleteBudgetCategory = (item: BudgetCategory) => {
    deleteBudgetCategoryMutation.mutate(item);
  };

  return {
    data,
    isFetching,
    error,
    refetch,
    dataUpdatedAt,
    handleSubmitInlineEdit,
    handleAddBudgetCategory,
    handleUpdateBudgetCategory,
    handleDeleteBudgetCategory,
  };
};
