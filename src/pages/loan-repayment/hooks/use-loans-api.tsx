import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { nanoid } from 'nanoid';
import { useSupabase } from '../../../common/hooks/use-supabase';
import { useNotificationStore } from '../../../common/state/notifications';
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
      await api.updateLoan(supabase, {
        loan_name: loanEntry.loan_name,
        principal: loanEntry.principal,
        interest_rate: loanEntry.interest_rate,
        monthly_payment: loanEntry.monthly_payment,
        additional_payment: loanEntry.additional_payment,
        user_id: loanEntry.user_id,
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

      const data = queryClient.getQueryData<LoanEntry[]>(['loans']);

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
    mutationFn: async (loans: LoanEntry[]) => {
      await Promise.all(loans.map((source) => api.deleteLoan(supabase, source.id)));
    },
    onSuccess: (_, deletedLoans) => {
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
        message: `Deleted ${deletedLoans.length} loan${
          deletedLoans.length > 1 ? 's' : ''
        }`,
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
  const handleDeleteLoan = (loans: LoanEntry[]) => {
    deleteLoanMutation.mutate(loans);
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
