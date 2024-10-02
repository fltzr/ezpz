import { useEffectOnce } from 'react-use';
import { useTranslation } from 'react-i18next';
import { Controller, useForm } from 'react-hook-form';
import getUserLocale from 'get-user-locale';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Box,
  Button,
  Checkbox,
  Drawer,
  Form,
  FormField,
  Header,
  Input,
  SpaceBetween,
} from '@cloudscape-design/components';

import type { IncomeSourceInsert } from '../utils/types';

type AddIncomeSource = {
  selectedUserId: string;
  onAdd: (IncomeSource: IncomeSourceInsert) => void;
  onClose: () => void;
};

const addIncomeSourceSchema = z.object({
  income_source_name: z.string({ required_error: 'Name of income source is required.' }),
  projected_amount: z
    .number({ required_error: 'Estimated amount of income source is required.' })
    .nonnegative('Income source must be a non-negative value.'),
  is_recurring: z.boolean().default(false),
});

type AddIncomeSourceSchema = z.infer<typeof addIncomeSourceSchema>;

export const AddIncomeSource = ({ selectedUserId, onAdd, onClose }: AddIncomeSource) => {
  const { t } = useTranslation(undefined, { keyPrefix: 'budget.drawers' });
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    setFocus,
  } = useForm<AddIncomeSourceSchema>({
    resolver: zodResolver(addIncomeSourceSchema),
  });

  const handleOnClose = () => {
    reset();
    onClose();
  };

  const handleOnSubmit = (data: AddIncomeSourceSchema) => {
    onAdd({ ...data, user_id: selectedUserId });
    handleOnClose();
  };
  useEffectOnce(() => {
    setFocus('income_source_name');
  });

  return (
    <Drawer header={<Header variant='h2'>{t('addIncomeSource.title')}</Header>}>
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
        <Form>
          <SpaceBetween direction='vertical' size='l'>
            <Controller
              control={control}
              name='income_source_name'
              render={({ field }) => (
                <FormField
                  label={t('addIncomeSource.fields.incomeSourceName')}
                  errorText={errors.income_source_name?.message}>
                  <Input
                    {...field}
                    disableBrowserAutocorrect
                    autoComplete={false}
                    placeholder={t('addIncomeSource.fields.incomeSourceExample')}
                    onChange={(event) => field.onChange(event.detail.value)}
                  />
                </FormField>
              )}
            />
            <Controller
              control={control}
              name='projected_amount'
              render={({ field }) => (
                <FormField
                  label={t('addIncomeSource.fields.projectedAmount')}
                  description={t('addIncomeSource.fields.projectedAmountDescription', {
                    currency: getUserLocale().includes('fr') ? '€' : '$',
                  })}
                  errorText={errors.projected_amount?.message}>
                  <Input
                    {...field}
                    disableBrowserAutocorrect
                    autoComplete={false}
                    type='number'
                    inputMode='decimal'
                    value={String(field.value)}
                    onChange={(event) => field.onChange(Number(event.detail.value))}
                  />
                </FormField>
              )}
            />
            <Controller
              name='is_recurring'
              control={control}
              render={({ field }) => (
                <FormField
                  label={t('common.fields.isRecurring')}
                  description={t('common.fields.isRecurringDescription')}
                  errorText={errors.is_recurring?.message}>
                  <Checkbox
                    {...field}
                    checked={field.value}
                    onChange={({ detail }) => field.onChange(detail.checked)}
                  />
                </FormField>
              )}
            />
          </SpaceBetween>
        </Form>
      </Form>
    </Drawer>
  );
};
