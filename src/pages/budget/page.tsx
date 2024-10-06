import { useLocalStorage } from 'react-use';

import { Board, BoardItem } from '@cloudscape-design/board-components';
import { Header, SpaceBetween } from '@cloudscape-design/components';

import { exportLayout,getBoardWidgets } from './board-items/config';
import { EmptyBoard } from './components/empty';
import { PageHeader } from './components/header';
import { NewDashboardAlert } from './components/new-dashboard-alert';
import { UserSelector } from './components/user-selector';
import { boardI18nStrings, boardItemI18nStrings } from './utils/i18n-strings';
import { StoredWidgetPlacement } from './utils/widget-types';

const BudgetPage = () => {
  const [layout, setLayout] =
    useLocalStorage<ReadonlyArray<StoredWidgetPlacement> | null>(
      'Budget-Dashboard-Layout',
      null
    );

  return (
    <SpaceBetween direction='vertical' size='m'>
      <NewDashboardAlert />
      <PageHeader actions={<UserSelector />} />
      <Board
        i18nStrings={boardI18nStrings}
        empty={<EmptyBoard />}
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
