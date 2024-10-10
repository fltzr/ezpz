import {
  Button,
  Header,
  SpaceBetween,
  Table,
  TextFilter,
} from '@cloudscape-design/components';

import { useCategoriesApi } from '../../hooks/use-categories-api';
import { useTransactionsApi } from '../../hooks/use-transactions-api';
import { Transaction } from '../../types/api';

import { getColumnDefintions } from './config';

export const TransactionsTable = () => {
  const { data, error, isFetching } = useTransactionsApi();

  const {
    data: categories,
    error: categoriesError,
    isFetching: isFetchingCategories,
  } = useCategoriesApi();

  console.log(`TT Categories: ${JSON.stringify(categories, null, 2)}`);

  return (
    <Table
      stripedRows
      contentDensity='compact'
      variant='container'
      items={data as Transaction[]}
      columnDefinitions={getColumnDefintions(categories)}
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
      submitEdit={(item, column, newValue) => {
        console.log('Raw data:');
        console.log(JSON.stringify(item, null, 2));
        console.log(JSON.stringify(column, null, 2));
        console.log(JSON.stringify(newValue, null, 2));
        console.log('--------');

        const payload = {
          id: item.id,
          [column.id!]: newValue,
        };

        console.log('Payload: ', payload);
      }}
    />
  );
};
