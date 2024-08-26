import { useCollection } from '@cloudscape-design/collection-hooks';
import { Table } from '@cloudscape-design/components';

import data from './data';
import {
  budgetTableColumnDefinitions,
  calculateCategoryTotals,
} from './table-configs';

const ViewBudgetPage = () => {
  const synData = calculateCategoryTotals(data);

  const { collectionProps, items } = useCollection(synData, {
    selection: {},
    sorting: {},
    expandableRows: {
      getId: (item) => item.id,
      getParentId: (item) => item.parentId,
    },
  });

  return (
    <Table
      variant="container"
      items={items}
      columnDefinitions={budgetTableColumnDefinitions}
      expandableRows={collectionProps.expandableRows}
      {...collectionProps}
    />
  );
};

export const Component = ViewBudgetPage;
