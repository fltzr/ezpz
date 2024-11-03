import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useEffectOnce } from 'react-use';

import {
  Autosuggest,
  Box,
  Button,
  DatePicker,
  Drawer,
  Form,
  FormField,
  Header,
  Input,
  Select,
  SpaceBetween,
} from '@cloudscape-design/components';
import { zodResolver } from '@hookform/resolvers/zod';
import getUserLocale from 'get-user-locale';
import { DateTime } from 'luxon';

import { useSelectedUser } from '@/hooks/use-selected-user';
import { useTransactionsApi } from '@/pages/budget/hooks/use-transactions-api';
import { BudgetCategory } from '@/pages/budget/utils/api-types';

import { TransactionInsert } from '../../types/api';
import {
  TransactionSchema,
  transactionSchema,
} from '../../validation/transaction-schema';

type AddTransactionProps = {
  selectedDate: DateTime;
  categories?: BudgetCategory[];
  onAdd: (budgetItem: TransactionInsert) => void;
  onClose: () => void;
};

export const AddTransaction = ({
  selectedDate,
  categories,
  onAdd,
  onClose,
}: AddTransactionProps) => {
  const { t } = useTranslation(undefined, { keyPrefix: 'budgetTransactions.drawer' });
  const { selectedUser } = useSelectedUser();
  const { fetchPayeeQuery } = useTransactionsApi({ selectedDate });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    setFocus,
  } = useForm<TransactionSchema>({
    resolver: zodResolver(transactionSchema),
  });

  const startDate = selectedDate.startOf('month');
  const endDate = selectedDate.endOf('month');

  const handleOnClose = () => {
    reset();
    onClose();
  };

  const handleOnSubmit = (data: TransactionSchema) => {
    if (!selectedUser?.userId) return;
    onAdd({
      user_id: selectedUser.userId,
      budget_category_id: data.category.value,
      transaction_date: data.date,
      payee: data.payee,
      memo: data.memo,
      outflow: data.outflow,
    });
    handleOnClose();
  };

  useEffectOnce(() => {
    setFocus('date');
  });

  return (
    <Drawer header={<Header variant='h2'>{t('add.title')}</Header>}>
      <Form
        actions={
          <Box float='right'>
            <SpaceBetween direction='horizontal' size='xs'>
              <Button variant='link' onClick={handleOnClose}>
                {t('common.cancel')}
              </Button>
              <Button
                variant='primary'
                onClick={() => void handleSubmit(handleOnSubmit)()}>
                {t('common.submit')}
              </Button>
            </SpaceBetween>
          </Box>
        }>
        <SpaceBetween direction='vertical' size='l'>
          <Controller
            name='date'
            control={control}
            render={({ field }) => (
              <FormField
                label={t('add.formFields.date')}
                errorText={errors.date?.message}>
                <DatePicker
                  {...field}
                  placeholder='YYYY/MM/DD'
                  isDateEnabled={(dateObj) => {
                    const dateTime = DateTime.fromJSDate(dateObj);
                    return dateTime >= startDate && dateTime <= endDate;
                  }}
                  onChange={({ detail }) => field.onChange(detail.value)}
                />
              </FormField>
            )}
          />
          <Controller
            name='category'
            control={control}
            render={({ field }) => (
              <FormField
                label={t('add.formFields.category')}
                errorText={errors.category?.message}>
                <Select
                  {...field}
                  placeholder={t('add.formFields.categoryPlaceholder')}
                  options={categories?.map((category) => ({
                    label: category.name,
                    value: category.id,
                  }))}
                  selectedOption={field.value}
                  onChange={({ detail }) =>
                    field.onChange({
                      label: detail.selectedOption.label,
                      value: detail.selectedOption.value,
                    })
                  }
                />
              </FormField>
            )}
          />
          <Controller
            name='payee'
            control={control}
            render={({ field }) => (
              <FormField
                label={t('add.formFields.payee')}
                errorText={errors.payee?.message}>
                <Autosuggest
                  value={field.value ?? ''}
                  options={fetchPayeeQuery.data?.map((payee) => ({
                    label: payee,
                    value: payee,
                  }))}
                  onChange={(event) => field.onChange(event.detail.value)}
                  onSelect={(event) => field.onChange(event.detail.value)}
                  placeholder={t('add.formFields.payeePlaceholder')}
                  finishedText={t('add.formFields.payeeEnd')}
                />
              </FormField>
            )}
          />
          <Controller
            name='memo'
            control={control}
            render={({ field }) => (
              <FormField
                label={t('add.formFields.memo')}
                errorText={errors.memo?.message}>
                <Input
                  {...field}
                  disableBrowserAutocorrect
                  autoComplete={false}
                  placeholder={t('add.formFields.memoPlaceholder')}
                  onChange={({ detail }) => field.onChange(detail.value)}
                />
              </FormField>
            )}
          />
          <Controller
            name='outflow'
            control={control}
            render={({ field }) => (
              <FormField
                label={t('add.formFields.amount')}
                description={t('add.formFields.amountPlaceholder', {
                  currency: getUserLocale().includes('fr') ? '€' : '$',
                })}
                errorText={errors.outflow?.message}>
                <Input
                  {...field}
                  disableBrowserAutocorrect
                  autoComplete={false}
                  type='number'
                  inputMode='decimal'
                  placeholder={getUserLocale().includes('fr') ? '€0.00' : '$0.00'}
                  value={String(field.value || 0)}
                  onChange={({ detail }) => field.onChange(Number(detail.value))}
                />
              </FormField>
            )}
          />
        </SpaceBetween>
      </Form>
    </Drawer>
  );
};
