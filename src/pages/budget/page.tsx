import { Header, SpaceBetween } from '@cloudscape-design/components';

import { PageHeader } from './components/header';
import { UserSelector } from './components/user-selector';
import { useLocalStorage } from 'react-use';
import { StoredWidgetPlacement } from './utils/widget-types';
import { Board, BoardItem } from '@cloudscape-design/board-components';
import { boardI18nStrings, boardItemI18nStrings } from '../steps/i18n-strings';
import { getBoardWidgets, exportLayout } from './board-items/config';
import { EmptyBoard } from './components/empty';
import { NewDashboardAlert } from './components/new-dashboard-alert';

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
      {/* <Grid
        gridDefinition={[
          { colspan: { s: 12, default: 12 } },
          { colspan: { s: 7, default: 12 } },
          { colspan: { s: 5, default: 12 } },
          { colspan: { s: 12, default: 12 } },
        ]}>
        <MonthlyOverview />
        <IncomeSources />
        <MonthlyBreakdown />
        <BudgetTable />
      </Grid> */}
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
