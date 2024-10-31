import {
  Box,
  Button,
  Input,
  ProgressBar,
  type TableProps,
} from '@cloudscape-design/components';

import i18n from '@/i18n';
import { formatCurrency } from '@/utils/format-currency';

import { type BudgetCategory } from '../../../../utils/api-types';

export const createBudgetTableColumnDefinitions = (
  data: {
    progressData: { title: string; value: number }[];
  },
  actions: {
    handleDeleteItem: (item: BudgetCategory) => void;
  }
): TableProps.ColumnDefinition<BudgetCategory>[] => {
  const columns: TableProps.ColumnDefinition<BudgetCategory>[] = [
    {
      id: '',
      header: '',
      cell: () => '',
    },
    {
      id: 'category',
      header: i18n.t('budget.budgetTable.columns.category'),
      cell: (item) => item.name,
      width: 200,
      editConfig: {
        editingCell: (item, ctx) => (
          <Input
            value={(ctx.currentValue as string) ?? item.name}
            onChange={(event) => ctx.setValue(event.detail.value)}
          />
        ),
      },
    },
    {
      id: 'progress',
      header: '',
      cell: (item) => {
        const budgeted = item.budgeted;
        const actual = data.progressData.find((c) => c.title === item.id)?.value ?? 1;
        const progress = (actual / budgeted) * 100;

        return (
          <ProgressBar
            value={progress}
            status={
              progress >= 110
                ? 'error'
                : 100 < progress && progress <= 110
                  ? 'success'
                  : 'in-progress'
            }
            additionalInfo={
              progress >= 110
                ? 'Over budget!'
                : 100 < progress && progress <= 110
                  ? 'On budget! No more spending!'
                  : ''
            }
          />
        );
      },
      hasDynamicContent: true,
      width: '25%',
    },
    {
      id: 'budgeted',
      header: i18n.t('budget.budgetTable.columns.budgeted'),
      cell: (item) => <Box textAlign='center'>{formatCurrency(item.budgeted)}</Box>,
      width: '15%',
      editConfig: {
        editingCell: (item, ctx) => (
          <Input
            value={(ctx.currentValue as string) ?? item.budgeted}
            onChange={(event) => ctx.setValue(event.detail.value)}
          />
        ),
      },
    },
    {
      id: 'actual',
      header: i18n.t('budget.budgetTable.columns.actual'),
      cell: (item) => {
        const actual = data.progressData.find((c) => c.title === item.id)?.value ?? 1;

        return <Box textAlign='center'>{formatCurrency(actual)}</Box>;
      },
      width: '15%',
    },
    {
      id: 'remaining',
      header: i18n.t('budget.budgetTable.columns.remaining'),
      cell: (item) => {
        const budgeted = item.budgeted;
        const actual = data.progressData.find((c) => c.title === item.id)?.value ?? 1;
        const remaining = budgeted - actual;

        return (
          <Box
            textAlign='center'
            color={remaining > 0 ? 'text-status-success' : 'text-label'}>
            {formatCurrency(remaining)}
          </Box>
        );
      },
      width: '15%',
    },
    {
      id: 'actions',
      header: '',
      cell: (item) => (
        <Button
          variant='inline-icon'
          iconName='remove'
          onClick={() => {
            actions.handleDeleteItem(item);
          }}
        />
      ),
    },
  ];

  return columns;
};
