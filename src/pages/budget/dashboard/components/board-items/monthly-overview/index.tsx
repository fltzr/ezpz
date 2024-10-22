import { useTranslation } from 'react-i18next';

import {
  DatePicker,
  FormField,
  KeyValuePairs,
  StatusIndicator,
} from '@cloudscape-design/components';
import getUserLocale from 'get-user-locale';
import type { TFunction } from 'i18next';
import { DateTime } from 'luxon';

import i18n from '@/i18n';
import { formatCurrency } from '@/utils/format-currency';

import { useBudgetApi } from '../../../../hooks/use-budget-api';
import { useBudgetProvider } from '../../../../hooks/use-budget-provider';
import { useIncomeApi } from '../../../../hooks/use-income-api';
import { isBudgetItem } from '../../../../utils/api-types';
import { WidgetConfig } from '../../../../utils/widget-types';

import styles from './styles.module.scss';

const getBudgetStatus = (t: TFunction, amountSpent: number, budgetAmount?: number) => {
  if (!budgetAmount) {
    return (
      <StatusIndicator type='warning' wrapText={true}>
        <div className={styles['no-word-break']}>{t('status.noIncomeSet')}</div>
      </StatusIndicator>
    );
  }

  const difference = amountSpent - budgetAmount;
  const differenceFormatted = formatCurrency(Math.abs(difference));

  if (difference < 0)
    return (
      <div className={styles['no-word-break']}>
        <StatusIndicator type='success'>
          {t('status.underBudget', { amount: differenceFormatted })}
        </StatusIndicator>
      </div>
    );
  if (difference > 0)
    return (
      <StatusIndicator type='error'>
        <div className={styles['no-word-break']}>
          {t('status.overBudget', { amount: differenceFormatted })}
        </div>
      </StatusIndicator>
    );
  return (
    <StatusIndicator type='info' wrapText={true}>
      {t('status.onBudget')}
    </StatusIndicator>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
const MonthlyOverview = () => {
  const { t } = useTranslation(undefined, { keyPrefix: 'budget.monthlyOverview' });
  const locale = getUserLocale();
  const { budgetEntry, setBudgetEntry } = useBudgetProvider();
  const { data: incomeSources } = useIncomeApi();
  const { data: budgetItems } = useBudgetApi();

  const now = DateTime.now();

  const amountToBudget = incomeSources?.reduce(
    (acc, curr) => (acc = acc + curr.projected_amount),
    0
  );

  const amountSpent =
    budgetItems?.reduce(
      (acc, curr) => (isBudgetItem(curr) ? acc + curr.projected_amount : acc),
      0
    ) ?? 0;

  return (
    <KeyValuePairs
      columns={4}
      items={[
        {
          label: '',
          value: (
            <FormField label={t('budgetPeriod')}>
              <DatePicker
                expandToViewport
                locale={locale}
                value={budgetEntry}
                isDateEnabled={(dateObj) => {
                  const dateTime = DateTime.fromJSDate(dateObj).endOf('month');
                  return dateTime <= now.endOf('month');
                }}
                onChange={(e) => {
                  setBudgetEntry(e.detail.value);
                }}
                granularity='month'
                placeholder='YYYY/MM'
              />
            </FormField>
          ),
        },
        {
          label: t('amountToBudget'),
          value: formatCurrency(amountToBudget),
        },
        {
          label: t('amountSpent'),
          value: formatCurrency(amountSpent),
        },
        {
          label: t('amountLeft'),
          value: getBudgetStatus(t, amountSpent, amountToBudget),
        },
      ]}
    />
  );
};

export const monthlyOverviewWidget: WidgetConfig = {
  columnOffset: { 4: 0 },
  definition: { defaultRowSpan: 2, defaultColumnSpan: 2 },
  data: {
    title: i18n.t('budget.monthlyOverview.title'),
    description: 'Monthly overview description',
    content: <MonthlyOverview />,
  },
};
