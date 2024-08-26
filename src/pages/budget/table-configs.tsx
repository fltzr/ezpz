import getUserLocale from 'get-user-locale';
import { ButtonDropdown, Input, StatusIndicator, type TableProps } from '@cloudscape-design/components';
import _ from 'lodash-es';
import { type BudgetTableItem } from './data';

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

const formatCurrency = (amount?: number) => {
  const currency = getUserLocale() === 'fr-FR' ? 'EUR' : 'USD';
  if (amount === undefined) return '-';

  return new Intl.NumberFormat(getUserLocale(), {
    style: 'currency',
    currency,
  }).format(amount);
};

const getBudgetStatus = (amount: number, budget: number) => {
  const difference = amount - budget;
  const differenceFormatted = formatCurrency(Math.abs(difference));

  if (difference < 0) return <StatusIndicator type="success">{differenceFormatted} under budget</StatusIndicator>
  if (difference > 0) return <StatusIndicator type="error">{differenceFormatted} over budget</StatusIndicator>
  return <StatusIndicator type="info">On budget</StatusIndicator>
}

export const createBudgetTableColumnDefinitions = (
  items: ReadonlyArray<BudgetTableItem>,
  actions: {
    handleAddBudgetLineItem: (item: BudgetTableItem) => void;
    handleDeleteCategory: (item: BudgetTableItem) => void;
  }
): TableProps.ColumnDefinition<BudgetTableItem>[] => {
  const isRootRow = items.some(item => item.parentId === null);

  const columns: TableProps.ColumnDefinition<BudgetTableItem>[] = [
    {
      id: 'category',
      header: 'Category',
      cell: (item) => item.name,
      width: 300,
      editConfig: {
        editingCell: (item, { currentValue, setValue }) => (
          <Input
            value={currentValue ?? item.budget}
            onChange={(event) => setValue(event.detail.value)}
          />
        ),
      }
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
    {
      id: 'budget',
      header: 'Budget amount',
      cell: (item) => formatCurrency(item.budget),
      ...(isRootRow && {
        editConfig: {
          editingCell: (item, { currentValue, setValue }) => item.parentId === null && (
            <Input
              type='number'
              inputMode='decimal'
              value={currentValue ?? item.budget}
              onChange={(event) => setValue(event.detail.value)}
            />
          ),
        }
      })
    },
    {
      id: 'budget-status',
      header: 'Budget status',
      cell: (item) => item.parentId === null ? getBudgetStatus(item.amount || 0, item.budget || 0) : '-',
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: item => (


        <ButtonDropdown
          expandToViewport
          variant='inline-icon'
          items={item.parentId === null ? [
            { id: 'rename-category', text: 'Rename category', iconName: 'edit' },
            { id: 'delete-category', text: 'Delete category', iconName: 'delete-marker' },
            { id: 'add-budget-line-item', text: 'Add budget line item', iconName: 'add-plus' }
          ] : [
            { id: 'edit', text: 'Edit', iconName: 'edit' },
            { id: 'delete', text: 'Delete', iconName: 'delete-marker' },
            { id: 'change-category', text: 'Change category', iconName: 'add-plus' },
          ]}
          onItemClick={({ detail }) => {
            switch (detail.id) {
              case 'delete-category':
                actions.handleDeleteCategory(item);
                break;
              case 'add-budget-line-item':
                actions.handleAddBudgetLineItem(item);
                break;
              default:
                break;
            }
          }}
        />

      )
    }
  ];





  return columns;
}
