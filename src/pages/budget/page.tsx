import { Grid, SpaceBetween } from '@cloudscape-design/components';
import { PageHeader } from './components/header';
import { IncomeSources } from './board-items/income-sources';
import { MonthlyBreakdown } from './board-items/monthly-breakdown';
import { BudgetTable } from './board-items/budget-table';
import { MonthlyOverview } from './board-items/monthly-overview';
import { UserSelector } from './components/user-selector';

const BudgetPage = () => {
  return (
    <SpaceBetween direction='vertical' size='m'>
      <PageHeader actions={<UserSelector />} />
      <Grid
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
      </Grid>
    </SpaceBetween>
  );
};

export default BudgetPage;
