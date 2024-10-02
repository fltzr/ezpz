import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { nanoid } from 'nanoid';
import { useSupabase } from '../../../hooks/use-supabase';
import { useNotificationStore } from '../../../state/notifications';
import * as api from '../api/loans';
import type { LoanEntry, LoanEntryInsert, LoanEntryUpdate } from '../utils/types';
import { useAuth } from '../../../auth/hooks/use-auth';

export const useLoansApi = () => {
  const supabase = useSupabase();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { addNotification } = useNotificationStore();

  const { data, refetch, isLoading, error } = useQuery({
    queryKey: ['loans', user!.id],
    queryFn: () => api.fetchLoans(supabase, user!.id),
    enabled: !!user!.id,
  });
  const addLoanMutation = useMutation({
    mutationFn: (newLoan: LoanEntryInsert) =>
      api.addLoan(supabase, { ...newLoan, user_id: user!.id }),
    onSuccess: (newLoan) => {
      queryClient.setQueryData<LoanEntry[]>(['loans', user!.id], (old) =>
        old ? [...old, newLoan] : [newLoan]
      );

      addNotification({
        id: nanoid(5),
        type: 'success',
        message: `Added loan: ${newLoan.loan_name}`,
      });
    },
    onError: (error) => {
      addNotification({
        id: nanoid(5),
        type: 'error',
        message: `Failed to add loan: ${error.message}`,
      });
    },
  });

  const updateLoanMutation = useMutation({
    mutationFn: async (loanEntry: LoanEntryUpdate) => {
      if (!user?.id) {
        throw new Error('No user ID found. Aborting...');
      }

      await api.updateLoan(supabase, {
        id: loanEntry.id,
        loan_name: loanEntry.loan_name,
        principal: loanEntry.principal,
        interest_rate: loanEntry.interest_rate,
        monthly_payment: loanEntry.monthly_payment,
        user_id: user.id,
      });
    },
    onSuccess: (_, updatedLoan) => {
      queryClient
        .refetchQueries({ queryKey: ['loans', user!.id] })
        .catch((error: Error) => {
          addNotification({
            type: 'error',
            message: `Error refetching loans: ${error.message}`,
          });
        });

      const data = queryClient.getQueryData<LoanEntry[]>(['loans', user?.id]);

      addNotification({
        id: nanoid(5),
        type: 'success',
        message: `Updated loan: ${
          data?.find((source) => source.id === updatedLoan.id)?.loan_name
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

  const deleteLoanMutation = useMutation({
    mutationFn: async (loanId: string) => {
      await api.deleteLoan(supabase, loanId);
    },
    onSuccess: (_, deletedLoan) => {
      queryClient
        .refetchQueries({ queryKey: ['loans', user!.id] })
        .catch((error: Error) => {
          addNotification({
            type: 'error',
            message: `Error refetching loans: ${error.message}`,
          });
        });

      addNotification({
        id: nanoid(5),
        type: 'success',
        message: `Successfully deleted loan ID ${deletedLoan}`,
      });
    },
    onError: (error) => {
      addNotification({
        id: nanoid(5),
        type: 'error',
        message: `Failed to delete loan(s): ${error.message}`,
      });
    },
  });

  const handleAddLoan = (loan: LoanEntryInsert) => {
    addLoanMutation.mutate(loan);
  };
  const handleUpdateLoan = (loanUpdates: LoanEntryUpdate) => {
    updateLoanMutation.mutate(loanUpdates);
  };
  const handleDeleteLoan = (loanId: string) => {
    deleteLoanMutation.mutate(loanId);
  };

  return {
    data,
    refetch,
    isLoading,
    error,
    handleAddLoan,
    handleUpdateLoan,
    handleDeleteLoan,
  };
};
