import getUserLocale from 'get-user-locale';
import {
  Box,
  PieChart,
  PieChartProps,
  StatusIndicator,
} from '@cloudscape-design/components';
import { BudgetTableItem, isBudgetItem, isCategoryItem } from '../utils/types';
import { formatCurrency } from '../../../common/utils/format-currency';

type BudgetPercentageChartProps = {
  isLoading: boolean;
  data?: BudgetTableItem[];
  totalBudget: number | undefined;
};

export const BudgetPercentageChart = ({
  isLoading = true,
  data,
  totalBudget,
}: BudgetPercentageChartProps) => {
  const currencySymbol = getUserLocale().includes('US') ? '$' : '€';
  const chartData = (): PieChartProps.Datum[] | undefined => {
    const categoryTotals = new Map<string, number>();

    data?.forEach((item) => {
      if (isBudgetItem(item)) {
        const currentTotal = categoryTotals.get(item.category_id) || 0;
        categoryTotals.set(item.category_id, currentTotal + item.projected_amount);
      }
    });

    return data
      ?.filter(isCategoryItem)
      .map((category) => ({
        title: category.category_name,
        value: categoryTotals.get(category.id) || 0,
      }))
      .filter((item) => item.value > 0);
  };

  return (
    <PieChart
      data={chartData() ?? []}
      statusType={isLoading ? 'loading' : 'finished'}
      detailPopoverContent={(datum) => [
        { key: 'Category', value: datum.title },
        { key: 'Amount', value: formatCurrency(datum.value) },
        totalBudget
          ? {
              key: 'Percentage of total budget',
              value: `${((datum.value / totalBudget) * 100).toFixed(2)}%`,
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
      empty={
        <Box padding={{ horizontal: 'xl' }}>
          <StatusIndicator type='info'>
            Add income sources and budget items to see this chart!
          </StatusIndicator>
        </Box>
      }
    />
  );
};
