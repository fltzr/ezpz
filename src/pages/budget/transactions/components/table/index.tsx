import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useCollection } from '@cloudscape-design/collection-hooks';
import {
  Box,
  Button,
  Calendar,
  CollectionPreferences,
  CollectionPreferencesProps,
  Header,
  Pagination,
  Popover,
  PropertyFilter,
  SpaceBetween,
  Table,
} from '@cloudscape-design/components';
import { DateTime } from 'luxon';

import { useDrawer } from '@/components/drawer-provider';
import { ManualRefresh } from '@/components/manual-refresh';
import useLocalStorage from '@/hooks/use-local-storage';
import { useBudgetCategoryApi } from '@/pages/budget/hooks/use-budget-category-api';

import { useTransactionsApi } from '../../../hooks/use-transactions-api';
import type { Transaction } from '../../types/api';
import { AddTransaction } from '../drawers/add-transaction';
import { DeleteTransactionModal } from '../modals/delete-transaction';

import { getColumnDefintions } from './config';
import { FILTERING_PROPERTIES } from './configs/property-filter-config';

export const TransactionsTable = () => {
  const { t, i18n } = useTranslation();

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
        pageSize: 10,
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
  const { data: categories } = useBudgetCategoryApi();

  const handleConfirmDeleteTransactions = () => {
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

  const { items, collectionProps, propertyFilterProps, paginationProps } = useCollection(
    data ?? [],
    {
      propertyFiltering: {
        filteringProperties: FILTERING_PROPERTIES,
        noMatch: <Box>No match!</Box>,
        empty: <Box>Empty!</Box>,
      },
      pagination: {
        pageSize: preferences.pageSize,
      },
      selection: {},
    }
  );

  useEffect(() => {
    console.log(`items.length: ${items.length}`);
  }, [items.length]);

  return (
    <>
      <Table
        {...collectionProps}
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
        items={items}
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
                <Button
                  variant='normal'
                  disabled={selectedTransactions.length <= 0}
                  onClick={() => {
                    setDeleteModalVisible(true);
                  }}>
                  {t('budgetTransactions.table.headerActions.delete', {
                    count: selectedTransactions.length,
                  })}
                </Button>
                <Button
                  variant='primary'
                  iconName='add-plus'
                  onClick={() => {
                    openDrawer({
                      drawerName: 'add-transaction',
                      content: (
                        <AddTransaction
                          selectedDate={date}
                          categories={categories}
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
        pagination={<Pagination {...paginationProps} />}
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
                {
                  value: 30,
                  label: t('budgetTransactions.table.pageSizeOption', { count: 30 }),
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
        filter={
          <PropertyFilter
            {...propertyFilterProps}
            countText={
              propertyFilterProps.query
                ? `${items.length} transaction${items.length > 1 ? 's' : ''}`
                : ''
            }
          />
        }
        submitEdit={(item, column, newValue) => {
          if (column.id?.includes('category')) {
            column.id = 'budget_category_id';
          }

          const payload = {
            id: item.id,
            [column.id!]: newValue,
          };

          handleUpdateTransaction(payload);
        }}
        onSelectionChange={(event) => {
          setSelectedTransactions(event.detail.selectedItems);
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
