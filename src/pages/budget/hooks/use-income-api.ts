import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as api from '../api/income';
import { useNotificationStore } from '../../../common/state/notifications';
import { IncomeSource, IncomeSourceInsert, IncomeSourceUpdate } from '../utils/types';
import { nanoid } from 'nanoid';

export const useIncomeApi = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useNotificationStore();

  const { data, refetch, isLoading, error } = useQuery({
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
      const data = queryClient.getQueryData<IncomeSource[]>(['income-sources']);

      addNotification({
        id: nanoid(5),
        type: 'success',
        message: `Updated income source: ${
          data?.find((source) => source.id === updatedIncomeSource.id)?.income_source_name
        }`,
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
    mutationFn: async (incomeSources: IncomeSource[]) => {
      await Promise.all(incomeSources.map((source) => api.deleteIncomeSource(source.id)));
    },
    onSuccess: (_, deletedIncomeSources) => {
      queryClient.refetchQueries({ queryKey: ['income-sources'] });

      addNotification({
        id: nanoid(5),
        type: 'success',
        message: `Deleted ${deletedIncomeSources.length} income source${
          deletedIncomeSources.length > 1 ? 's' : ''
        }`,
      });
    },
    onError: (error) => {
      addNotification({
        id: nanoid(5),
        type: 'error',
        message: `Failed to delete income source(s): ${error.message}`,
      });
    },
  });

  const handleAddIncomeSource = (incomeSource: IncomeSourceInsert) => {
    addIncomeSourceMutation.mutate(incomeSource);
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
    isLoading,
    error,
    handleAddIncomeSource,
    handleUpdateIncomeSource,
    handleDeleteIncomeSource,
  };
};
