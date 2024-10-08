import { DatePicker, Input, Select, TableProps } from '@cloudscape-design/components';

import i18n from '@/i18n';
import { formatCurrency } from '@/utils/format-currency';

export type Transaction = {
  id: string;
  date: string;
  category: string;
  memo: string;
  outflow?: number;
  inflow?: number;
};

export const getColumnDefintions = (): TableProps<Transaction>['columnDefinitions'] => {
  const resolvedCurrencySymbol = i18n.resolvedLanguage === 'fr' ? '€' : '$';

  return [
    {
      id: 'date',
      header: 'Date',
      cell: (item) => item.date,
      width: 216,
      editConfig: {
        editingCell: (
          item,
          ctx: {
            currentValue: string | undefined;
            setValue: (value: string | undefined) => void;
          }
        ) => (
          <DatePicker
            expandToViewport
            value={ctx.currentValue ?? item.date}
            onChange={(event) => {
              ctx.setValue(event.detail.value);
            }}
          />
        ),
      },
    },
    {
      id: 'category',
      header: 'Category',
      cell: (item) => item.category,
      editConfig: {
        editingCell: (
          item,
          ctx: {
            currentValue: string | undefined;
            setValue: (value: string | undefined) => void;
          }
        ) => <Select selectedOption={null} />,
      },
    },
    {
      id: 'memo',
      header: 'Memo',
      cell: (item) => item.memo,
      width: '35%',
      editConfig: {
        editingCell: (
          item,
          ctx: {
            currentValue: string | undefined;
            setValue: (value: string | undefined) => void;
          }
        ) => (
          <Input
            value={ctx.currentValue ?? item.memo}
            onChange={(event) => {
              ctx.setValue(event.detail.value);
            }}
          />
        ),
      },
    },
    {
      id: 'outflow',
      header: 'Outflow',
      cell: (item) => formatCurrency(item.outflow),
      width: 176,
      editConfig: {
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
            autoComplete={false}
            placeholder={`${resolvedCurrencySymbol} ${item?.outflow ?? ''}`}
            value={ctx.currentValue ?? String(item.outflow || 0)}
            onChange={({ detail }) => ctx.setValue(detail.value)}
          />
        ),
      },
    },
    {
      id: 'inflow',
      header: 'Inflow',
      cell: (item) => formatCurrency(item.inflow),
      width: 176,
      editConfig: {
        editingCell: (
          item,
          ctx: {
            currentValue: string | undefined;
            setValue: (value: string | undefined) => void;
          }
        ) => (
          <Input
            autoFocus
            type='number'
            autoComplete={false}
            placeholder={`${resolvedCurrencySymbol} ${item?.inflow ?? ''}`}
            value={ctx.currentValue ?? String(item?.inflow)}
            onChange={({ detail }) => {
              ctx.setValue(detail.value);
            }}
          />
        ),
      },
    },
  ];
};
