import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Box,
  Button,
  ButtonDropdown,
  CollectionPreferences,
  CollectionPreferencesProps,
  Header,
  SpaceBetween,
  Table,
  TextFilter,
} from '@cloudscape-design/components';
import { DateTime } from 'luxon';

import { useDrawer } from '@/components/drawer-provider';
import { ManualRefresh } from '@/components/manual-refresh';
import useLocalStorage from '@/hooks/use-local-storage';

import { useCategoriesApi } from '../../hooks/use-categories-api';
import { useTransactionsApi } from '../../hooks/use-transactions-api';
import type { Transaction } from '../../types/api';
import { AddTransaction } from '../drawers/add-transaction';
import { DeleteTransactionModal } from '../modals/delete-transaction';

import { getColumnDefintions } from './config';

export const TransactionsTable = () => {
  const { t } = useTranslation(undefined, { keyPrefix: 'budget-transactions' });
  const [preferences, setPreferences] =
    useLocalStorage<CollectionPreferencesProps.Preferences>(
      'Transaction-Table-Preferences',
      {
        contentDensity: 'compact',
        stripedRows: true,
        pageSize: 30,
        wrapLines: false,
      }
    );
  const { openDrawer, closeDrawer } = useDrawer();

  const {
    data,
    error,
    refetch,
    isFetching,
    dataUpdatedAt,
    isRefetching,
    handleAddTransaction,
    handleDeleteTransactions,
  } = useTransactionsApi();
  const { data: categories } = useCategoriesApi();

  const [lastRefresh, setLastRefresh] = useState<string | null>(null);
  const [selectedTransactions, setSelectedTransactions] = useState<Transaction[]>([]);

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const handleConfirmDeleteTransactions = () => {
    console.log('handling');
    const ids = selectedTransactions.map((item) => item.id);

    handleDeleteTransactions(ids)
      .then(() => {
        setSelectedTransactions([]);
      })
      .catch(() => {})
      .finally(() => {
        setDeleteModalVisible(false);
      });
  };

  return (
    <>
      <Table
        {...preferences}
        variant='container'
        selectionType='multi'
        loadingText='Fetching transactions...'
        loading={isFetching}
        selectedItems={selectedTransactions}
        items={data as Transaction[]}
        columnDefinitions={getColumnDefintions(categories)}
        header={
          <Header
            variant='h1'
            actions={
              <SpaceBetween size='xs' direction='horizontal'>
                <ManualRefresh
                  loading={isRefetching}
                  lastRefresh={lastRefresh}
                  onRefresh={() => {
                    setLastRefresh(DateTime.fromMillis(dataUpdatedAt).toISO());
                    refetch().catch(console.error);
                  }}
                />
                <ButtonDropdown
                  items={[
                    {
                      id: 'delete-transactions',
                      text: 'Delete transactions',
                      disabled: selectedTransactions?.length <= 0,
                    },
                  ]}
                  onItemClick={(event) => {
                    const eventId = event.detail.id;

                    switch (eventId) {
                      case 'delete-transactions':
                        setDeleteModalVisible(true);
                        break;
                      default:
                        break;
                    }
                  }}>
                  Actions
                </ButtonDropdown>
                <Button
                  variant='primary'
                  iconName='add-plus'
                  onClick={() => {
                    openDrawer({
                      drawerName: 'add-transaction',
                      content: (
                        <AddTransaction
                          onAdd={handleAddTransaction}
                          onClose={closeDrawer}
                        />
                      ),
                    });
                  }}>
                  Add transaction
                </Button>
              </SpaceBetween>
            }>
            {t('table.header')}
          </Header>
        }
        preferences={
          <CollectionPreferences
            preferences={preferences}
            onConfirm={({ detail }) => setPreferences?.(detail)}
            wrapLinesPreference={{}}
            stripedRowsPreference={{}}
            contentDensityPreference={{}}
            stickyColumnsPreference={{
              firstColumns: {
                title: 'Stick first column(s)',
                description:
                  'Keep the first column(s) visible while horizontally scrolling the table content.',
                options: [
                  { label: 'None', value: 0 },
                  { label: 'First column', value: 1 },
                  { label: 'First two columns', value: 2 },
                ],
              },
            }}
          />
        }
        empty={
          error ? (
            <SpaceBetween size='m' direction='vertical'>
              <Box variant='span'>
                There was an issue loading transactions. Try again?
              </Box>
              <Button variant='primary' iconName='refresh' onClick={() => void refetch()}>
                Retry
              </Button>
            </SpaceBetween>
          ) : (
            <Box variant='span'>No transactions added!</Box>
          )
        }
        filter={<TextFilter filteringText='' />}
        submitEdit={(item, column, newValue) => {
          console.log('Raw data:');
          console.log(JSON.stringify(item, null, 2));
          console.log(JSON.stringify(column, null, 2));
          console.log(JSON.stringify(newValue, null, 2));
          console.log('--------');

          const payload = {
            id: item.id,
            [column.id!]: newValue,
          };

          console.log('Payload: ', payload);
        }}
        onSelectionChange={(event) => {
          setSelectedTransactions(event.detail.selectedItems);
        }}
        onColumnWidthsChange={(event) => {
          console.log(event.detail.widths);
        }}
      />
      <DeleteTransactionModal
        visible={deleteModalVisible}
        transactions={selectedTransactions}
        onConfirmDelete={handleConfirmDeleteTransactions}
        onDismiss={() => {
          setDeleteModalVisible(false);
        }}
      />
    </>
  );
};
