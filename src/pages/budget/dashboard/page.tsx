import { useState } from 'react';
import { useLocalStorage } from 'react-use';

import { Board, BoardItem } from '@cloudscape-design/board-components';
import { Header, SpaceBetween } from '@cloudscape-design/components';
import { useQueryClient } from '@tanstack/react-query';
import { DateTime } from 'luxon';

import { ManualRefresh } from '@/components/manual-refresh';

import { StoredWidgetPlacement } from '../utils/widget-types';

import { exportLayout, getBoardWidgets } from './components/board-items/config';
import { PageHeader } from './components/header';
import { NewDashboardAlert } from './components/new-dashboard-alert';
import { boardI18nStrings, boardItemI18nStrings } from './i18n-strings';

const BudgetPage = () => {
  const queryKeys = ['budget-categories', 'income-sources', 'transactions'];
  const [layout, setLayout] =
    useLocalStorage<ReadonlyArray<StoredWidgetPlacement> | null>(
      'Budget-Dashboard-Layout',
      null
    );

  const [lastRefresh, setLastRefresh] = useState<string | null>(null);

  const queryClient = useQueryClient();

  return (
    <SpaceBetween direction='vertical' size='m'>
      <NewDashboardAlert />
      <PageHeader
        actions={
          <ManualRefresh
            loading={queryClient.isFetching({ queryKey: queryKeys }) > 0}
            lastRefresh={lastRefresh}
            onRefresh={() => {
              queryClient
                .refetchQueries({
                  queryKey: queryKeys,
                })
                .then(() => {
                  setLastRefresh(DateTime.now().toISO());
                })
                .catch(console.error);
            }}
          />
        }
      />
      <Board
        i18nStrings={boardI18nStrings}
        empty={<></>}
        items={getBoardWidgets(
          layout ?? [
            { id: 'monthlyOverviewWidget' },
            { id: 'incomeSourcesWidget' },
            { id: 'monthlyBreakdownWidget' },
            { id: 'budgetTableWidget' },
          ]
        )}
        onItemsChange={(event) => {
          setLayout(exportLayout(event.detail.items));
        }}
        renderItem={(item) => (
          <BoardItem
            i18nStrings={boardItemI18nStrings}
            header={
              <Header variant='h2' actions={item.data.actions}>
                {item.data.title}
              </Header>
            }>
            {item.data.content}
          </BoardItem>
        )}
      />
    </SpaceBetween>
  );
};

export default BudgetPage;
