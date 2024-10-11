import { useLocalStorage } from 'react-use';

import { Board, BoardItem } from '@cloudscape-design/board-components';
import { Header, SpaceBetween } from '@cloudscape-design/components';

import { StoredWidgetPlacement } from '../utils/widget-types';

import { exportLayout, getBoardWidgets } from './components/board-items/config';
import { PageHeader } from './components/header';
import { NewDashboardAlert } from './components/new-dashboard-alert';
import { boardI18nStrings, boardItemI18nStrings } from './i18n-strings';

const BudgetPage = () => {
  const [layout, setLayout] =
    useLocalStorage<ReadonlyArray<StoredWidgetPlacement> | null>(
      'Budget-Dashboard-Layout',
      null
    );

  return (
    <SpaceBetween direction='vertical' size='m'>
      <NewDashboardAlert />
      <PageHeader />
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
