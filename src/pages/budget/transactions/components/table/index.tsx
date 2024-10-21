import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Box,
  Button,
  ButtonDropdown,
  Calendar,
  CollectionPreferences,
  CollectionPreferencesProps,
  Header,
  Popover,
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
  const { t, i18n } = useTranslation(undefined);

  const now = DateTime.now();
  const [date, setDate] = useState(now);
  const [lastRefresh, setLastRefresh] = useState<string | null>(null);
  const [selectedTransactions, setSelectedTransactions] = useState<Transaction[]>([]);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
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
    handleUpdateTransaction,
    handleDeleteTransactions,
  } = useTransactionsApi({ selectedDate: date });
  const { data: categories } = useCategoriesApi();

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
        loadingText={t('budgetTransactions.table.fetchingItem', { item: 'transactions' })}
        ariaLabels={{
          selectionGroupLabel: 'Items selection',
          allItemsSelectionLabel: () => 'select all',
        }}
        loading={isFetching}
        selectedItems={selectedTransactions}
        items={data as Transaction[]}
        columnDefinitions={getColumnDefintions(categories)}
        columnDisplay={preferences.contentDisplay}
        header={
          <Header
            variant='h1'
            counter={
              selectedTransactions && selectedTransactions.length > 0
                ? `(${selectedTransactions.length}/${data?.length})`
                : typeof data?.length !== 'undefined'
                  ? `(${data.length})`
                  : ''
            }
            info={
              <Popover
                renderWithPortal
                dismissButton={false}
                position='bottom'
                content={
                  <Calendar
                    locale={i18n.language}
                    granularity='month'
                    isDateEnabled={(dateObj) => {
                      const dateTime = DateTime.fromJSDate(dateObj).endOf('month');
                      return dateTime <= now.endOf('month');
                    }}
                    value={date.toFormat('yyyy-MM')}
                    onChange={({ detail }) => {
                      closeDrawer();
                      const newDate = DateTime.fromFormat(detail.value, 'yyyy-MM');
                      setDate(newDate as DateTime<true>);
                    }}
                  />
                }>
                {date.setLocale(i18n.language).toFormat('MMMM yyyy')}
              </Popover>
            }
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
                      text: t('budgetTransactions.table.headerActions.delete'),
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
                          selectedDate={date}
                          onAdd={handleAddTransaction}
                          onClose={closeDrawer}
                        />
                      ),
                    });
                  }}>
                  {t('budgetTransactions.table.headerActions.add')}
                </Button>
              </SpaceBetween>
            }>
            {t('budgetTransactions.table.header')}
          </Header>
        }
        preferences={
          <CollectionPreferences
            onConfirm={({ detail }) => setPreferences(detail)}
            preferences={preferences}
            pageSizePreference={{
              options: [
                {
                  value: 10,
                  label: t('budgetTransactions.table.pageSizeOption', { count: 10 }),
                },
                {
                  value: 20,
                  label: t('budgetTransactions.table.pageSizeOption', { count: 20 }),
                },
              ],
            }}
            wrapLinesPreference={{}}
            stripedRowsPreference={{}}
            contentDensityPreference={{}}
            contentDisplayPreference={{
              options: [
                {
                  id: 'transaction_date',
                  label: t('budgetTransactions.common.columns.date'),
                  alwaysVisible: true,
                },
                {
                  id: 'category',
                  label: t('budgetTransactions.common.columns.category'),
                },
                {
                  id: 'memo',
                  label: t('budgetTransactions.common.columns.memo'),
                },
                { id: 'outflow', label: t('budgetTransactions.common.columns.outflow') },
              ],
            }}
          />
        }
        empty={
          error ? (
            <SpaceBetween size='m' direction='vertical'>
              <Box variant='span'>{t('budgetTransactions.table.loadingError')}</Box>
              <Button variant='primary' iconName='refresh' onClick={() => void refetch()}>
                {t('api.common.retry')}
              </Button>
            </SpaceBetween>
          ) : (
            <Box variant='span'>{t('budgetTransactions.table.empty')}</Box>
          )
        }
        filter={<TextFilter filteringText='' />}
        submitEdit={(item, column, newValue) => {
          console.log('Raw data:');
          console.log(JSON.stringify(item, null, 2));
          console.log(JSON.stringify(column, null, 2));
          console.log(JSON.stringify(newValue, null, 2));
          console.log('--------');

          if (column.id?.includes('category')) {
            column.id = 'category_id';
          }

          const payload = {
            id: item.id,
            [column.id!]: newValue,
          };

          console.log('Payload: ', payload);

          handleUpdateTransaction(payload);
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
