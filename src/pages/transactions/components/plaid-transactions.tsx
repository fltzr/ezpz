import {
  Table,
  Header,
  Button,
  StatusIndicator,
  Pagination,
} from '@cloudscape-design/components';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useAuth } from '../../../auth/hooks/use-auth';
import { useSupabase } from '../../../common/hooks/use-supabase';
import { useNotificationStore } from '../../../common/state/notifications';
import { fetchTransactions } from '../api';
import { useCollection } from '@cloudscape-design/collection-hooks';

export const PlaidTransactions = () => {
  const { user } = useAuth();
  const supabase = useSupabase();
  const { addNotification } = useNotificationStore();
  const {
    data: transactions,
    error: transactionsError,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ['transactions', user?.id],
    queryFn: () => fetchTransactions(supabase),
    enabled: false,
  });

  useEffect(() => {
    if (transactionsError) {
      addNotification({
        type: 'warning',
        message: `Error fetching transactions. Please try again later | Error: ${transactionsError?.message}`,
      });
    }
  }, [transactionsError, addNotification]);

  const filteredTransactions = () => {
    if (!transactions?.added) return [];

    console.log(transactions.added);

    return [...transactions.added]
      .filter((tx) => !tx.name.includes('From Share') || !tx.name.includes('From Share'))
      .map((tx) => ({
        ...tx,
        amount: tx.amount > 0 ? `$ (${tx.amount})` : `$ ${Math.abs(tx.amount)}`,
      }));
  };

  const { items, collectionProps, paginationProps } = useCollection(
    filteredTransactions(),
    {
      pagination: {
        pageSize: 20,
      },
    }
  );

  return (
    <Table
      {...collectionProps}
      contentDensity='compact'
      variant='stacked'
      items={items ?? []}
      loading={isFetching}
      loadingText='Fetching transactions'
      totalItemsCount={transactions?.added.length ?? 0}
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
          Transactions
        </Header>
      }
      pagination={<Pagination {...paginationProps} />}
      columnDefinitions={[
        {
          id: 'transaction-date',
          header: 'Date',
          cell: (item) => item.date,
          width: 150,
          minWidth: 150,
          maxWidth: 150,
        },
        {
          id: 'transaction-name',
          header: 'Transaction',
          cell: (item) => item.name,
        },
        {
          id: 'transaction-type',
          header: 'Cost',
          cell: (item) => item.amount,
        },
        {
          id: 'transaction-category',
          header: 'Category',
          cell: (item) => item.personal_finance_category?.detailed,
        },
      ]}
      empty={
        <StatusIndicator type='info'>
          Click the refresh button to fetch transactions.
        </StatusIndicator>
      }
    />
  );
};
