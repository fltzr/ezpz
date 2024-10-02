import {
  Container,
  DatePicker,
  FormField,
  Header,
  KeyValuePairs,
  StatusIndicator,
} from '@cloudscape-design/components';
import { useTranslation } from 'react-i18next';
import { formatCurrency } from '../../../common/utils/format-currency';
import { isBudgetItem } from '../utils/types';
import { useBudgetProvider } from '../hooks/use-budget-provider';
import { useIncomeApi } from '../hooks/use-income-api';
import { useBudgetApi } from '../hooks/use-budget-api';
import { TFunction } from 'i18next';

const getBudgetStatus = (t: TFunction, amountSpent: number, budgetAmount?: number) => {
  if (!budgetAmount) {
    return <StatusIndicator type='warning'>{t('status.noIncomeSet')}</StatusIndicator>;
  }

  const difference = amountSpent - budgetAmount;
  const differenceFormatted = formatCurrency(Math.abs(difference));

  if (difference < 0)
    return (
      <StatusIndicator type='success'>
        {t('status.underBudget', { amount: differenceFormatted })}
      </StatusIndicator>
    );
  if (difference > 0)
    return (
      <StatusIndicator type='error'>
        {t('status.overBudget', { amount: differenceFormatted })}
      </StatusIndicator>
    );
  return <StatusIndicator type='info'>{t('status.onBudget')}</StatusIndicator>;
};

export const MonthlyOverview = () => {
  const { t } = useTranslation(undefined, { keyPrefix: 'budget.monthlyOverview' });
  const { selectedUser, budgetEntry, setBudgetEntry } = useBudgetProvider();
  const { data: incomeSources } = useIncomeApi(selectedUser.userId, budgetEntry);
  const { data: budgetItems } = useBudgetApi(selectedUser.userId, budgetEntry);

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
    <Container header={<Header variant='h2'>{t('title')}</Header>}>
      <KeyValuePairs
        columns={4}
        items={[
          {
            label: '',
            value: (
              <FormField label={t('budgetPeriod')}>
                <DatePicker
                  value={budgetEntry}
                  onChange={(e) => {
                    console.log(e.detail.value);
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
    </Container>
  );
};