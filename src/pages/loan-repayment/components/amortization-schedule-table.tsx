import { Table } from '@cloudscape-design/components';
import { AmortizationSchedule } from '../schema';

export const AmortizationScheduleTable = ({
  schedule,
}: {
  schedule?: AmortizationSchedule;
}) => (
  <Table
    variant='stacked'
    items={schedule ?? []}
    columnDefinitions={[
      {
        id: 'month',
        header: 'Month',
        cell: (item) => item.month,
        width: 75,
      },
      {
        id: 'balance',
        header: 'Balance',
        cell: (item) => item.balance,
      },
      {
        id: 'monthly_interest',
        header: 'Interest',
        cell: (item) => item.interestForMonth,
        width: 250,
      },
      {
        id: 'total_interest_paid',
        header: 'Total interest paid',
        cell: (item) => item.totalInterestPaid,
        width: 250,
      },
    ]}
  />
);
