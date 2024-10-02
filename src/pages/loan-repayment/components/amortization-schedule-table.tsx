import { Table } from '@cloudscape-design/components';
import type { AmortizationSchedule } from '../schema';

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
        id: 'interest_payment',
        header: 'Interest',
        cell: (item) => item.interestPayment,
        width: 125,
      },
      {
        id: 'principal_payment',
        header: 'Principal',
        cell: (item) => item.principalPayment,
        width: 125,
      },
      {
        id: 'ending_balance',
        header: 'Ending balance',
        cell: (item) => item.endingBalance,
        width: 150,
      },
    ]}
  />
);
