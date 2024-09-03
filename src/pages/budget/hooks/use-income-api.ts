import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as api from '../api/income';
import { useNotificationStore } from '../../../common/state/notifications';
import { IncomeSource, IncomeSourceInsert, IncomeSourceUpdate } from '../utils/types';
import { nanoid } from 'nanoid';

export const useIncomeApi = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useNotificationStore();

  const { data, isLoading, error } = useQuery({
    queryKey: ['income-sources'],
    queryFn: api.fetchIncomeSources,
  });

  const addIncomeSourceMutation = useMutation({
    mutationFn: api.addIncomeSource,
    onSuccess: (newIncomeSource) => {
      queryClient.setQueryData<IncomeSource[]>(['income-sources'], (old) =>
        old ? [...old, newIncomeSource] : [newIncomeSource]
      );

      addNotification({
        id: nanoid(5),
        type: 'success',
        message: `Added income source: ${newIncomeSource.income_source_name}`,
      });
    },
    onError: (error) => {
      addNotification({
        id: nanoid(5),
        type: 'error',
        message: `Failed to add income source: ${error.message}`,
      });
    },
  });

  const updateIncomeSourceMutation = useMutation({
    mutationFn: async (incomeSource: IncomeSourceUpdate) => {
      await api.updateIncomeSource(incomeSource.id!, {
        income_source_name: incomeSource.income_source_name,
        projected_amount: incomeSource.projected_amount,
      });
    },
    onSuccess: (_, updatedIncomeSource) => {
      queryClient.refetchQueries({ queryKey: ['income-sources'] });

      addNotification({
        id: nanoid(5),
        type: 'success',
        message: `Updated income source: ${updatedIncomeSource.income_source_name}`,
      });
    },
    onError: (error) => {
      addNotification({
        id: nanoid(5),
        type: 'error',
        message: error.message,
      });
    },
  });

  const deleteIncomeSourceMutation = useMutation({
    mutationFn: async (incomeSource: IncomeSource) => {
      await api.deleteIncomeSource(incomeSource.id);
    },
    onSuccess: (_, deletedIncomeSource) => {
      queryClient.refetchQueries({ queryKey: ['income-sources'] });

      addNotification({
        id: nanoid(5),
        type: 'success',
        message: `Deleted income source: ${deletedIncomeSource.income_source_name}`,
      });
    },
    onError: (error) => {
      addNotification({
        id: nanoid(5),
        type: 'error',
        message: `Failed to delete income source: ${error.message}`,
      });
    },
  });

  const handleAddIncomeSource = (incomeSource: IncomeSourceInsert) => {
    addIncomeSourceMutation.mutate(incomeSource);
  };
  const handleUpdateIncomeSource = (incomeSourceUpdates: IncomeSourceUpdate) => {
    updateIncomeSourceMutation.mutate(incomeSourceUpdates);
  };
  const handleDeleteIncomeSource = (incomeSource: IncomeSource) => {
    deleteIncomeSourceMutation.mutate(incomeSource);
  };

  return {
    data,
    isLoading,
    error,
    handleAddIncomeSource,
    handleUpdateIncomeSource,
    handleDeleteIncomeSource,
  };
};
