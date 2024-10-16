import { useTranslation } from 'react-i18next';

import { useQuery, useQueryClient } from '@tanstack/react-query';

import { useNotifiedMutation } from '@/hooks/use-notified-mutation';
import { useSelectedUser } from '@/hooks/use-selected-user';
import { useSupabase } from '@/hooks/use-supabase';

import type { Transaction, TransactionDBUpdate, TransactionInsert } from '../types/api';

const transactionJoinStatement = `
id,
transaction_date,
memo,
outflow,
created_at,
category:categories (
  id,
  category_name
)
`;

const fetchTransactions = async (
  supabase: ReturnType<typeof useSupabase>,
  userId: string
) => {
  const { data: transactions, error } = await supabase
    .from('transactions')
    .select(transactionJoinStatement)
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

const updateTransactionInline = async (
  supabase: ReturnType<typeof useSupabase>,
  id: string,
  updates: { [key: string]: string }
) => {
  const { data, error } = await supabase
    .from('transactions')
    .update(updates)
    .eq('category_id', id);

  if (error)
    throw new Error(
      `Error updating transaction. Please try again later. ${JSON.stringify(error, null, 2)}`
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

export const useTransactionsApi = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const supabase = useSupabase();
  const { selectedUser } = useSelectedUser();

  const { data, error, refetch, isFetching, isRefetching, dataUpdatedAt } = useQuery({
    queryKey: ['transactions', selectedUser?.userId],
    queryFn: () => fetchTransactions(supabase, selectedUser?.userId ?? ''),
  });

  const addTransactionMutation = useNotifiedMutation({
    mutationFn: (item: TransactionInsert) => createTransaction(supabase, item),
    onSuccess: (newItem) => {
      queryClient.setQueryData<Transaction[]>(
        ['transactions', selectedUser?.userId],
        (old = []) => [newItem, ...old]
      );
    },
    successMessage: () => t('api.success.create', { item: 'transaction' }),
    errorMessage: (error) =>
      t('api.error.create', { item: 'transaction', message: error.message }),
  });

  const updateTransactionInlineMutation = useNotifiedMutation({
    mutationFn: (item: TransactionDBUpdate) =>
      updateTransactionInline(supabase, item.id!, { ...item }),
  });

  const deleteTransactionMutation = useNotifiedMutation({
    mutationFn: (ids: string[]) => deleteTransaction(supabase, ids),
    onSuccess: (ids) => {
      queryClient.setQueryData<Transaction[]>(
        ['transactions', selectedUser?.userId],
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
    handleDeleteTransactions,
  };
};
