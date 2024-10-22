import {
  DatePicker,
  Input,
  Select,
  SelectProps,
  TableProps,
} from '@cloudscape-design/components';

import i18n from '@/i18n';
import { formatCurrency } from '@/utils/format-currency';

import { Transaction } from '../../types/api';

export const getColumnDefintions = (
  categories?: { id: string; category_name: string }[]
): TableProps<Transaction>['columnDefinitions'] => {
  const convertedCategories: SelectProps['options'] =
    categories?.map((c) => ({
      label: c.category_name,
      value: c.id,
    })) ?? [];

  const resolvedCurrencySymbol = i18n.resolvedLanguage === 'fr' ? '€' : '$';

  return [
    {
      id: 'transaction_date',
      header: i18n.t('budgetTransactions.common.columns.date'),
      cell: (item) => item.transaction_date,
      width: 215,
      editConfig: {
        ariaLabel: 'Edit transaction date',
        constraintText: 'The date follows `YYYY/MM/DD` format.',
        editingCell: (
          item,
          ctx: {
            currentValue: string | undefined;
            setValue: (value: string | undefined) => void;
          }
        ) => (
          <DatePicker
            expandToViewport
            value={ctx.currentValue ?? item.transaction_date}
            onChange={(event) => {
              ctx.setValue(event.detail.value);
            }}
          />
        ),
      },
    },
    {
      id: 'category',
      header: i18n.t('budgetTransactions.common.columns.category'),
      cell: (item) => item.category?.category_name,
      editConfig: {
        ariaLabel: 'Edit category',
        editingCell: (
          item,
          ctx: {
            currentValue: string | undefined;
            setValue: (value: string) => void;
          }
        ) => (
          <Select
            expandToViewport
            virtualScroll
            inlineLabelText='Select a category'
            options={convertedCategories}
            selectedOption={
              ctx.currentValue
                ? {
                    value: ctx.currentValue,
                    label: categories?.find((c) => c.id === ctx.currentValue)
                      ?.category_name,
                  }
                : { value: item.category?.id, label: item.category?.category_name }
            }
            onChange={(event) => {
              ctx.setValue(event.detail.selectedOption.value!);
            }}
          />
        ),
      },
    },
    {
      id: 'memo',
      header: i18n.t('budgetTransactions.common.columns.memo'),
      cell: (item) => item.memo,
      width: '35%',
      editConfig: {
        ariaLabel: 'Edit transaction memo',
        editingCell: (
          item,
          ctx: {
            currentValue: string | undefined;
            setValue: (value: string | undefined) => void;
          }
        ) => (
          <Input
            value={ctx.currentValue ?? item.memo ?? ''}
            onChange={(event) => {
              ctx.setValue(event.detail.value);
            }}
          />
        ),
      },
    },
    {
      id: 'outflow',
      header: i18n.t('budgetTransactions.common.columns.outflow'),
      cell: (item) => formatCurrency(item.outflow),
      width: 176,
      editConfig: {
        ariaLabel: 'Edit outflow amount',
        editingCell: (
          item,
          ctx: {
            currentValue: string | undefined;
            setValue: (value: string | undefined) => void;
          }
        ) => (
          <Input
            autoFocus
            disableBrowserAutocorrect
            type='number'
            step={0.01}
            autoComplete={false}
            placeholder={`${resolvedCurrencySymbol} ${item?.outflow ?? ''}`}
            value={ctx.currentValue ?? String(item.outflow || 0)}
            onChange={({ detail }) => ctx.setValue(detail.value)}
          />
        ),
      },
    },
  ];
};
