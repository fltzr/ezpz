import { useTranslation } from 'react-i18next';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { DateTime } from 'luxon';

import { useNotifiedMutation } from '@/hooks/use-notified-mutation';
import { useSelectedUser } from '@/hooks/use-selected-user';
import { useSupabase } from '@/hooks/use-supabase';

import type { Transaction, TransactionInsert, TransactionUpdate } from '../types/api';

const transactionJoinStatement = `
id,
transaction_date,
memo,
outflow,
created_at,
category_id,
user_id,
category:categories (
  id,
  category_name
)
`;

const fetchTransactions = async (
  supabase: ReturnType<typeof useSupabase>,
  userId: string,
  startDate: string,
  endDate: string
) => {
  const { data: transactions, error } = await supabase
    .from('transactions')
    .select(transactionJoinStatement)
    .gte('transaction_date', startDate)
    .lte('transaction_date', endDate)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(`Failed to fetch transactions: ${error.message}`);

  return transactions;
};

const createTransaction = async (
  supabase: ReturnType<typeof useSupabase>,
  tx: TransactionInsert
) => {
  const { data, error } = await supabase
    .from('transactions')
    .insert(tx)
    .select(transactionJoinStatement)
    .limit(1)
    .single();

  if (error)
    throw new Error(
      `Error creating transaction entry: ${JSON.stringify(error, null, 2)}`
    );

  return data as Transaction;
};

const updateTransaction = async (
  supabase: ReturnType<typeof useSupabase>,
  tx: TransactionUpdate
) => {
  const { data, error } = await supabase
    .from('transactions')
    .update(tx)
    .eq('id', tx.id)
    .select(transactionJoinStatement)
    .single();

  if (error)
    throw new Error(
      `Error updating transaction entry: ${JSON.stringify(error, null, 2)}`
    );

  return data;
};

const deleteTransaction = async (
  supabase: ReturnType<typeof useSupabase>,
  transactionIds: string[]
) => {
  const response = await supabase.from('transactions').delete().in('id', transactionIds);

  if (response.error)
    throw new Error(`Error deleting transactions. ${response.error.message}`);

  return transactionIds;
};

export const useTransactionsApi = ({ selectedDate }: { selectedDate: DateTime }) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const supabase = useSupabase();

  const { selectedUser } = useSelectedUser();

  const startDate = selectedDate.startOf('month').toISODate()!;
  const endDate = selectedDate.endOf('month').toISODate()!;

  const { data, error, refetch, isFetching, isRefetching, dataUpdatedAt } = useQuery({
    queryKey: ['transactions', selectedUser?.userId, startDate, endDate],
    queryFn: () =>
      fetchTransactions(supabase, selectedUser?.userId ?? '', startDate, endDate),
    enabled: !!(selectedDate || startDate || endDate),
  });

  const addTransactionMutation = useNotifiedMutation({
    mutationFn: (item: TransactionInsert) => createTransaction(supabase, item),
    onSuccess: (newItem) => {
      queryClient.setQueryData<Transaction[]>(
        ['transactions', selectedUser?.userId, startDate, endDate],
        (old = []) => [newItem, ...old]
      );
    },
    successMessage: () => t('api.success.create', { item: 'transaction' }),
    errorMessage: (error) =>
      t('api.error.create', { item: 'transaction', message: error.message }),
  });

  const updateTransactionInlineMutation = useNotifiedMutation({
    mutationFn: (tx: TransactionUpdate) => updateTransaction(supabase, tx),
    onSuccess: () => {
      queryClient
        .refetchQueries({
          queryKey: ['transactions', selectedUser?.userId, startDate, endDate],
        })
        .catch(console.error);
    },
    successMessage: () => t('api.success.update', { item: 'transaction' }),
    errorMessage: (error) =>
      t('api.error.update', { item: 'transaction', message: error.message }),
  });

  const deleteTransactionMutation = useNotifiedMutation({
    mutationFn: (ids: string[]) => deleteTransaction(supabase, ids),
    onSuccess: (ids) => {
      queryClient.setQueryData<Transaction[]>(
        ['transactions', selectedUser?.userId, startDate, endDate],
        (old) => {
          if (!old) return [];

          const filteredItems = old.filter((item) => !ids.includes(item.id));
          return filteredItems;
        }
      );
    },
    successMessage: (ids) =>
      t('api.success.delete', {
        item: 'transaction',
        item_plural: 'transactions',
        count: ids.length,
      }),
    errorMessage: (error) =>
      t('api.success.delete', {
        item: 'transaction',
        item_plural: 'transactions',
        message: error.message,
      }),
  });

  const handleAddTransaction = (transaction: TransactionInsert) => {
    addTransactionMutation.mutate({ ...transaction });
  };

  const handleUpdateTransaction = (transaction: TransactionUpdate) => {
    updateTransactionInlineMutation.mutate({ ...transaction });
  };

  const handleDeleteTransactions = async (ids: string[]) => {
    await deleteTransactionMutation.mutateAsync(ids);
  };

  return {
    data,
    error,
    refetch,
    isFetching,
    isRefetching,
    dataUpdatedAt,
    handleAddTransaction,
    handleUpdateTransaction,
    handleDeleteTransactions,
  };
};
