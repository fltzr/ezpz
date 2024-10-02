import getUserLocale from 'get-user-locale';
import { useTranslation } from 'react-i18next';
import {
  Container,
  Header,
  PieChart,
  PieChartProps,
  StatusIndicator,
} from '@cloudscape-design/components';
import { isBudgetItem, isCategoryItem } from '../utils/types';
import { formatCurrency } from '../../../common/utils/format-currency';
import { useBudgetApi } from '../hooks/use-budget-api';
import { useBudgetProvider } from '../hooks/use-budget-provider';
import { useIncomeApi } from '../hooks/use-income-api';

export const MonthlyBreakdown = () => {
  const { t } = useTranslation(undefined, { keyPrefix: 'budget.monthlyBreakdown' });
  const { selectedUser, budgetEntry } = useBudgetProvider();
  const { data: incomeSources } = useIncomeApi(selectedUser.userId, budgetEntry);
  const { data, isFetching } = useBudgetApi(selectedUser.userId, budgetEntry);

  const currencySymbol = getUserLocale().includes('US') ? '$' : '€';

  const amountToBudget = incomeSources?.reduce(
    (acc, curr) => acc + curr.projected_amount,
    0
  );

  const chartData = (): PieChartProps.Datum[] | undefined => {
    const categoryTotals = new Map<string, number>();

    data?.forEach((item) => {
      if (isBudgetItem(item)) {
        const currentTotal = categoryTotals.get(item.category_id) || 0;
        categoryTotals.set(item.category_id, currentTotal + item.projected_amount);
      }
    });

    return data
      ?.filter((item) => isCategoryItem(item))
      .map((category) => ({
        title: category.category_name,
        value: categoryTotals.get(category.id) || 0,
      }))
      .filter((item) => item.value > 0);
  };

  return (
    <Container header={<Header variant='h2'>{t('title')}</Header>}>
      <PieChart
        hideDescriptions
        variant='donut'
        data={chartData() ?? []}
        statusType={isFetching ? 'loading' : 'finished'}
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
        size='medium'
        empty={<StatusIndicator type='info'>{t('chart.empty')}</StatusIndicator>}
      />
    </Container>
  );
};
