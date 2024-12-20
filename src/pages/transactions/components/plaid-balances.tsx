import { useEffect, useState } from 'react';

import { Header, StatusIndicator, Table } from '@cloudscape-design/components';
import { useQuery } from '@tanstack/react-query';

import { ManualRefresh } from '@/components/manual-refresh';
import { useSupabase } from '@/hooks/use-supabase';
import { useAuth } from '@/pages/auth/hooks/use-auth';
import { useNotificationStore } from '@/state/notifications';

import { fetchBalances } from '../api';

export const PlaidBalances = () => {
  const { user } = useAuth();
  const supabase = useSupabase();
  const { addNotification } = useNotificationStore();

  const [refreshParams, setRefreshParams] = useState(false);
  const {
    data,
    error: balancesError,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ['balances', user?.id],
    queryFn: () => fetchBalances(supabase, refreshParams),
  });

  useEffect(() => {
    if (balancesError) {
      addNotification({
        type: 'warning',
        message: `Error fetching balances. Please try again later | Error: ${balancesError?.message}`,
      });
    }
  }, [balancesError, addNotification]);

  const sortedBalances = () => {
    if (!data?.accounts) return [];

    const primaryCheckings = data.accounts.find(
      (account) => account.subtype?.toLowerCase() === 'checking'
    );
    const primarySavings = data.accounts.find((account) =>
      account.name.toLowerCase().includes('primary savings')
    );
    const otherAccounts = data.accounts.filter(
      (account) => account !== primaryCheckings && account !== primarySavings
    );

    const sorted = [];

    if (primaryCheckings) sorted.push(primaryCheckings);
    if (primarySavings) sorted.push(primarySavings);
    sorted.push(...otherAccounts);

    return [...sorted].map((account) => ({
      ...account,
      name: account.name.charAt(0).toUpperCase() + account.name.slice(1).toLowerCase(),
      balances: {
        ...account.balances,
        available:
          account.balances.available! < 0
            ? `$ (${Math.abs(account.balances.available ?? 0)})`
            : `$ ${account.balances.available}`,
      },
      subtype: account.subtype?.toUpperCase(),
    }));
  };

  return (
    <Table
      contentDensity='compact'
      items={sortedBalances() ?? []}
      loading={isFetching}
      loadingText='Fetching balances'
      totalItemsCount={sortedBalances().length ?? 0}
      header={
        <Header
          variant='h2'
          actions={
            <ManualRefresh
              lastRefresh={data?.updated_at.split('.')[0]}
              onRefresh={() => {
                setRefreshParams(true);
                void refetch();
              }}
            />
          }>
          Balances
        </Header>
      }
      columnDefinitions={[
        {
          id: 'account-name',
          header: 'Account',
          cell: (item) => item.name,
        },
        {
          id: 'account-balance',
          header: 'Balance',
          cell: (item) => item.balances.available,
        },
        {
          id: 'account-type',
          header: 'Type',
          cell: (item) => item.subtype,
        },
      ]}
      empty={
        <StatusIndicator type='info'>
          Click the refresh button to fetch balances.
        </StatusIndicator>
      }
    />
  );
};
