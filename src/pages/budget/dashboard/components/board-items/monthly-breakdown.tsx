import { useTranslation } from 'react-i18next';

import { PieChart, PieChartProps, StatusIndicator } from '@cloudscape-design/components';
import getUserLocale from 'get-user-locale';
import { DateTime } from 'luxon';

import i18n from '@/i18n';
import { useBudgetCategoryApi } from '@/pages/budget/hooks/use-budget-category-api';
import { useBudgetProvider } from '@/pages/budget/hooks/use-budget-provider';
import { useTransactionsApi } from '@/pages/budget/hooks/use-transactions-api';
import { formatCurrency } from '@/utils/format-currency';

import { useIncomeApi } from '../../../hooks/use-income-api';
import { WidgetConfig } from '../../../utils/widget-types';

// eslint-disable-next-line react-refresh/only-export-components
const MonthlyBreakdown = () => {
  const { t } = useTranslation(undefined, { keyPrefix: 'budget.monthlyBreakdown' });

  const { budgetEntry } = useBudgetProvider();

  const { data: incomeSources } = useIncomeApi();
  const { data: transactions, isFetching: isFetchingTransactions } = useTransactionsApi({
    selectedDate: DateTime.fromFormat(budgetEntry, 'yyyy-MM'),
  });
  const { data, isFetching } = useBudgetCategoryApi();

  const currencySymbol = getUserLocale().includes('US') ? '$' : '€';

  const amountToBudget = incomeSources?.reduce(
    (acc, curr) => acc + curr.projected_amount,
    0
  );

  const chartData = (): PieChartProps.Datum[] | undefined => {
    const categoryTotals = new Map<string, number>();

    transactions?.map((tx) => {
      const { category, outflow } = tx;

      if (!category || !category?.name || !outflow) return;

      if (categoryTotals.has(category.name)) {
        categoryTotals.set(category.name, categoryTotals.get(category.name)! + outflow);
      } else {
        categoryTotals.set(category.name, outflow);
      }
    });

    const result = data?.map((c) => {
      const total = categoryTotals.get(c.name) || 0;
      return { title: c.name, value: total };
    });

    return result;
  };

  return (
    <PieChart
      fitHeight
      hideDescriptions
      variant='donut'
      size='small'
      data={chartData() ?? []}
      statusType={isFetching || isFetchingTransactions ? 'loading' : 'finished'}
      detailPopoverContent={(datum) => [
        { key: t('chart.popover.keyCategory'), value: datum.title },
        { key: t('chart.popover.keyAmount'), value: formatCurrency(datum.value) },
        amountToBudget
          ? {
              key: t('chart.popover.keyPercentageTotal'),
              value: `${((datum.value / amountToBudget) * 100).toFixed(2)}%`,
            }
          : { key: '', value: '' },
      ]}
      segmentDescription={(datum, sum) =>
        `${datum.title}: ${currencySymbol}${datum.value.toFixed(2)} (${(
          (datum.value / sum) *
          100
        ).toFixed()}%)`
      }
      hideFilter
      empty={<StatusIndicator type='info'>{t('chart.empty')}</StatusIndicator>}
    />
  );
};

export const monthlyBreakdownWidget: WidgetConfig = {
  columnOffset: { 4: 2 },
  definition: { defaultRowSpan: 4, defaultColumnSpan: 2 },
  data: {
    title: i18n.t('budget.monthlyBreakdown.title'),
    description: 'Monthly breakdown description',
    content: <MonthlyBreakdown />,
  },
};
