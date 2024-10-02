import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { nanoid } from 'nanoid';
import { useSupabase } from '../../../hooks/use-supabase';
import { useNotificationStore } from '../../../state/notifications';

import * as api from '../data-access/income';
import { IncomeSource, IncomeSourceInsert, IncomeSourceUpdate } from '../utils/types';
import { useTranslation } from 'react-i18next';

export const useIncomeApi = (userId: string, budgetEntry: string) => {
  const { t } = useTranslation(undefined, { keyPrefix: 'budget.api.income' });
  const supabase = useSupabase();
  const queryClient = useQueryClient();
  const { addNotification } = useNotificationStore();

  const { data, refetch, isFetching, isLoading, error } = useQuery({
    queryKey: ['income-sources', budgetEntry, userId],
    queryFn: () => api.fetchIncomeSources(userId, budgetEntry, supabase),
    enabled: !!userId,
  });

  const addIncomeSourceMutation = useMutation({
    mutationFn: (newIncomeSource: IncomeSourceInsert) =>
      api.addIncomeSource(supabase, { ...newIncomeSource, user_id: userId }),
    onSuccess: (newIncomeSource) => {
      queryClient.setQueryData<IncomeSource[]>(
        ['income-sources', budgetEntry, userId],
        (old) => (old ? [...old, newIncomeSource] : [newIncomeSource])
      );

      addNotification({
        id: nanoid(5),
        type: 'success',
        message: t('addIncomeSourceSuccess', {
          name: newIncomeSource.income_source_name,
        }),
      });
    },
    onError: (error) => {
      addNotification({
        id: nanoid(5),
        type: 'error',
        message: t('addIncomeSourceError', { message: error.message }),
      });
    },
  });

  const updateIncomeSourceMutation = useMutation({
    mutationFn: async (incomeSource: IncomeSourceUpdate) => {
      await api.updateIncomeSource(supabase, incomeSource.id!, {
        income_source_name: incomeSource.income_source_name,
        projected_amount: incomeSource.projected_amount,
      });
    },
    onSuccess: (_, updatedIncomeSource) => {
      queryClient
        .refetchQueries({ queryKey: ['income-sources', budgetEntry, userId] })
        .catch((error: Error) => {
          addNotification({
            type: 'error',
            message: t('refetchIncomeSourceError', { message: error.message }),
          });
        });

      const data = queryClient.getQueryData<IncomeSource[]>(['income-sources']);

      addNotification({
        id: nanoid(5),
        type: 'success',
        message: t('updateIncomeSourceSuccess', {
          name: data?.find((source) => source.id === updatedIncomeSource.id)
            ?.income_source_name,
        }),
      });
    },
    onError: (error) => {
      addNotification({
        id: nanoid(5),
        type: 'error',
        message: t('updateIncomeSourceError', { message: error.message }),
      });
    },
  });

  const deleteIncomeSourceMutation = useMutation({
    mutationFn: async (incomeSources: IncomeSource[]) => {
      await Promise.all(
        incomeSources.map((source) => api.deleteIncomeSource(supabase, source.id))
      );
    },
    onSuccess: (_, deletedIncomeSources) => {
      queryClient
        .refetchQueries({ queryKey: ['income-sources', budgetEntry, userId] })
        .catch((error: Error) => {
          addNotification({
            type: 'error',
            message: t('refetchIncomeSourceError', { message: error.message }),
          });
        });

      addNotification({
        id: nanoid(5),
        type: 'success',
        message: t('deleteIncomeSourceSuccess', {
          count: deletedIncomeSources.length,
          s: deletedIncomeSources.length > 1 ? 's' : '',
        }),
      });
    },
    onError: (error) => {
      addNotification({
        id: nanoid(5),
        type: 'error',
        message: t('deleteIncomeSourceError', { message: error.message }),
      });
    },
  });

  const handleAddIncomeSource = (incomeSource: IncomeSourceInsert) => {
    addIncomeSourceMutation.mutate({ ...incomeSource, budget_entry: budgetEntry });
  };
  const handleUpdateIncomeSource = (incomeSourceUpdates: IncomeSourceUpdate) => {
    updateIncomeSourceMutation.mutate(incomeSourceUpdates);
  };
  const handleDeleteIncomeSource = (incomeSources: IncomeSource[]) => {
    deleteIncomeSourceMutation.mutate(incomeSources);
  };

  return {
    data,
    refetch,
    isFetching,
    isLoading,
    error,
    handleAddIncomeSource,
    handleUpdateIncomeSource,
    handleDeleteIncomeSource,
  };
};
