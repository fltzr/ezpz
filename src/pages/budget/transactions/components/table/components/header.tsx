import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Button,
  Calendar,
  Header,
  Popover,
  SpaceBetween,
} from '@cloudscape-design/components';
import { DateTime } from 'luxon';

import { useDrawer } from '@/components/drawer-provider';
import { ManualRefresh } from '@/components/manual-refresh';
import { useBudgetCategoryApi } from '@/pages/budget/hooks/use-budget-category-api';
import { useTransactionsApi } from '@/pages/budget/hooks/use-transactions-api';

import { Transaction } from '../../../types/api';
import { AddTransaction } from '../../drawers/add-transaction';

type TableHeaderProps = {
  selectedTransactions: Transaction[];
  date: DateTime<true>;
  setDate: (date: DateTime<true>) => void;
  setDeleteModalVisible: (open: boolean) => void;
};

export const TableHeader = ({
  selectedTransactions,
  date,
  setDate,
  setDeleteModalVisible,
}: TableHeaderProps) => {
  const { t, i18n } = useTranslation();
  const { openDrawer, closeDrawer } = useDrawer();
  const { data, refetch, dataUpdatedAt, isRefetching, handleAddTransaction } =
    useTransactionsApi({
      selectedDate: date,
    });
  const { data: categories } = useBudgetCategoryApi();

  const [lastRefresh, setLastRefresh] = useState<string | null>(null);

  const now = DateTime.now();
  return (
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
                width: 400,
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
  );
};
