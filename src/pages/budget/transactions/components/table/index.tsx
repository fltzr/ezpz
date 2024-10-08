import {
  Button,
  Header,
  SpaceBetween,
  Table,
  TextFilter,
} from '@cloudscape-design/components';

import { getColumnDefintions, type Transaction } from './config';

const transactions: Transaction[] = [
  {
    id: '667e6087-1b51-4901-bb50-80c01d4826bd',
    date: '2024-09-01',
    category: 'Rent',
    memo: 'Possible read weight knowledge expect.',
    outflow: 502.5,
  },
  {
    id: '13c747e5-286b-4920-ae88-dcd9fdaf922d',
    date: '2024-09-17',
    category: 'Investment',
    memo: 'Table government important once.',
    outflow: 526.03,
  },
  {
    id: '045ce05f-15c2-4724-88db-41cc349d86f9',
    date: '2024-04-12',
    category: 'Salary',
    memo: 'Ok would nearly benefit business or.',
    inflow: 2381.61,
  },
  {
    id: '670208e9-5bae-4906-aa60-fed7b3eecde6',
    date: '2024-03-21',
    category: 'Rent',
    memo: 'Yeah whatever picture daughter coach next.',
    outflow: 618.37,
  },
  {
    id: 'ae4cfa22-d25d-4fc9-a051-2172507f259a',
    date: '2024-03-22',
    category: 'Entertainment',
    memo: 'About be somebody.',
    inflow: 4738.1,
  },
];

export const TransactionsTable = () => {
  return (
    <Table
      stripedRows
      contentDensity='compact'
      variant='container'
      items={transactions}
      columnDefinitions={getColumnDefintions()}
      header={
        <Header
          variant='h1'
          actions={
            <SpaceBetween size='l' direction='horizontal'>
              <Button variant='primary' iconName='add-plus'>
                Add transaction
              </Button>
            </SpaceBetween>
          }>
          Transactions (WORK IN PROGRESS | DO NOT USE)
        </Header>
      }
      filter={<TextFilter filteringText='' />}
      onColumnWidthsChange={(event) => {
        console.log(event.detail.widths);
      }}
    />
  );
};
