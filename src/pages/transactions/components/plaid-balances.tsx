import { Table, Header, Button, StatusIndicator } from '@cloudscape-design/components';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useAuth } from '../../../auth/hooks/use-auth';
import { useSupabase } from '../../../common/hooks/use-supabase';
import { useNotificationStore } from '../../../common/state/notifications';
import { fetchBalances } from '../api';

export const PlaidBalances = () => {
  const { user } = useAuth();
  const supabase = useSupabase();
  const { addNotification } = useNotificationStore();
  const {
    data: balances,
    error: balancesError,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ['balances', user?.id],
    queryFn: () => fetchBalances(supabase),
    enabled: false,
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
    if (!balances) return [];

    const primaryCheckings = balances.find(
      (account) => account.subtype?.toLowerCase() === 'checking'
    );
    const primarySavings = balances.find((account) =>
      account.name.toLowerCase().includes('primary savings')
    );
    const otherAccounts = balances.filter(
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
      totalItemsCount={balances?.length ?? 0}
      header={
        <Header
          variant='h2'
          actions={
            <Button
              variant='normal'
              iconName='refresh'
              onClick={() => {
                refetch().catch(console.error);
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
