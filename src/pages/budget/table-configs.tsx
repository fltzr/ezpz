import getUserLocale from 'get-user-locale';
import { type TableProps } from '@cloudscape-design/components';
import _ from 'lodash-es';
import { type BudgetTableItem } from './data';

const formatCurrency = (amount?: number) => {
  const currency = getUserLocale() === 'fr-FR' ? 'EUR' : 'USD';
  if (amount === undefined) return '-';

  return new Intl.NumberFormat(getUserLocale(), {
    style: 'currency',
    currency,
  }).format(amount);
};

export const budgetTableColumnDefinitions: TableProps.ColumnDefinition<BudgetTableItem>[] =
  [
    {
      id: 'category',
      header: 'Category',
      cell: (item) => item.name,
      width: 300,
    },
    {
      id: 'amount',
      header: 'Amount',
      cell: (item) =>
        item.parentId === null ? (
          <b>{formatCurrency(item.amount)}</b>
        ) : (
          formatCurrency(item.amount)
        ),
    },
  ];

export const calculateCategoryTotals = (
  items: ReadonlyArray<BudgetTableItem>
) => {
  const grouped = _.groupBy(items, 'parentId');
  const totals = _.mapValues(grouped, (children) =>
    _.sumBy(children, 'amount')
  );

  return items.map((item) => {
    if (item.parentId === null) {
      return { ...item, amount: totals[item.id] || 0 };
    }
    return item;
  });
};
