import type { AccountBase, TransactionsSyncResponse } from 'plaid';
import { useSupabase } from '@/hooks/use-supabase';

export const fetchLinkToken = async (supabase: ReturnType<typeof useSupabase>) => {
  const response = await supabase.functions.invoke<string>('plaid-create_link_token', {
    method: 'POST',
  });

  if (response.data === null && response.error) {
    console.error('Error retrieving link token:', (response.error as Error).message);
    throw new Error('Error retrieving link token. Please try again later.');
  }

  return JSON.parse(typeof response.data === 'string' ? response.data : '') as {
    link_token?: string;
  };
};

export const exchangePublicToken = async (supabase: ReturnType<typeof useSupabase>) => {
  const response = await supabase.functions.invoke<string>(
    'plaid-exchange_public_token',
    {
      method: 'POST',
    }
  );

  if (response.data === null && response.error) {
    console.error('Error exchanging public token:', (response.error as Error).message);
    throw new Error('Error exchanging public token. Please try again later.');
  }

  return JSON.parse(typeof response.data === 'string' ? response.data : '') as {
    status?: string;
  };
};

export const fetchBalances = async (
  supabase: ReturnType<typeof useSupabase>,
  refresh?: boolean
) => {
  const response = await supabase.functions.invoke<string>('plaid-retrieve_balances', {
    method: 'POST',
    body: { refresh },
  });

  if (response.data === null && response.error) {
    console.error('Error fetching balances:', (response.error as Error).message);
    throw new Error('Error fetching balances. Please try again later.');
  }

  return JSON.parse(typeof response.data === 'string' ? response.data : '') as {
    accounts: AccountBase[];
    updated_at: string;
  };
};

export const fetchTransactions = async (supabase: ReturnType<typeof useSupabase>) => {
  const response = await supabase.functions.invoke<string>(
    'plaid-retrieve_transactions',
    {
      method: 'GET',
    }
  );

  if (response.data === null && response.error) {
    console.error('Error fetching transactions:', (response.error as Error).message);
    throw new Error('Error fetching transactions. Please try again later.');
  }

  return JSON.parse(
    typeof response.data === 'string' ? response.data : ''
  ) as TransactionsSyncResponse;
};
