import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useEffectOnce } from 'react-use';

import {
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

import { useSelectedUser } from '@/hooks/use-selected-user';

import { useCategoriesApi } from '../../hooks/use-categories-api';
import { TransactionInsert } from '../../types/api';
import {
  TransactionSchema,
  transactionSchema,
} from '../../validation/transaction-schema';

type AddTransactionProps = {
  onAdd: (budgetItem: TransactionInsert) => void;
  onClose: () => void;
};

export const AddTransaction = ({ onAdd, onClose }: AddTransactionProps) => {
  const { t } = useTranslation(undefined, { keyPrefix: 'budget.drawers' });
  const { selectedUser } = useSelectedUser();
  const { data } = useCategoriesApi();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    setFocus,
  } = useForm<TransactionSchema>({
    resolver: zodResolver(transactionSchema),
  });

  const handleOnClose = () => {
    reset();
    onClose();
  };

  const handleOnSubmit = (data: TransactionSchema) => {
    if (!selectedUser?.userId) return;
    onAdd({
      user_id: selectedUser.userId,
      category_id: data.category.value,
      transaction_date: data.date,
      memo: data.memo,
      outflow: data.outflow,
    });
    handleOnClose();
  };

  useEffectOnce(() => {
    setFocus('date');
  });

  return (
    <Drawer header={<Header variant='h2'>{t('addTransaction.title')}</Header>}>
      <Form
        actions={
          <Box float='right'>
            <SpaceBetween direction='horizontal' size='xs'>
              <Button variant='link' onClick={handleOnClose}>
                {t('common.cancelButton')}
              </Button>
              <Button
                variant='primary'
                onClick={() => void handleSubmit(handleOnSubmit)()}>
                {t('common.addButton')}
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
                label={t('common.fields.transactionDate')}
                errorText={errors.date?.message}>
                <DatePicker
                  {...field}
                  placeholder='YYYY/MM/DD'
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
                label={t('addTransaction.fields.categoryName')}
                errorText={errors.category?.message}>
                <Select
                  {...field}
                  placeholder={t('addTransaction.fields.categoryPlaceholder')}
                  options={data?.map((category) => ({
                    label: category.category_name,
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
            name='memo'
            control={control}
            render={({ field }) => (
              <FormField
                label={t('addTransaction.fields.memo')}
                errorText={errors.memo?.message}>
                <Input
                  {...field}
                  disableBrowserAutocorrect
                  autoComplete={false}
                  placeholder={t('addTransaction.fields.itemNameExample')}
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
                label={t('addTransaction.fields.projectedAmount')}
                description={t('addTransaction.fields.projectedAmountDescription', {
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
