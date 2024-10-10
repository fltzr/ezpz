import { useQuery } from '@tanstack/react-query';

import { useSelectedUser } from '@/hooks/use-selected-user';
import { useSupabase } from '@/hooks/use-supabase';

const fetchTransactions = async (supabase: ReturnType<typeof useSupabase>) => {
  const { data: transactions, error } = await supabase
    .from('transactions')
    .select(
      `
    id,
    transaction_date,
    memo,
    outflow,
    created_at,
    category:categories (
      id,
      category_name
    )
    `
    )
    .order('transaction_date', { ascending: true });

  if (error) throw new Error(`Failed to fetch transactions: ${error.message}`);

  return transactions;
};

export const useTransactionsApi = () => {
  const supabase = useSupabase();
  const { selectedUser } = useSelectedUser();

  const { data, error, refetch, isFetching } = useQuery({
    queryKey: ['transactions', selectedUser?.userId],
    queryFn: () => fetchTransactions(supabase),
  });

  return {
    data,
    error,
    refetch,
    isFetching,
  };
};
