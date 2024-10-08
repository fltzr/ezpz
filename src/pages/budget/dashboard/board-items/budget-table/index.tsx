import i18n from '@/i18n';

import { WidgetConfig } from '../../../utils/widget-types';

import { BudgetTableActions } from './actions';
import { BudgetTable } from './table';

export const budgetTableWidget: WidgetConfig = {
  columnOffset: { 4: 0 },
  definition: { defaultRowSpan: 3, defaultColumnSpan: 4 },
  data: {
    title: i18n.t('budget.budgetTable.title'),
    description: 'Budget description',
    content: <BudgetTable />,
    actions: <BudgetTableActions />,
  },
};
