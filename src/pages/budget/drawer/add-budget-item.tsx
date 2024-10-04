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
  DatePicker,
  Drawer,
  Form,
  FormField,
  Grid,
  Header,
  Input,
  SpaceBetween,
} from '@cloudscape-design/components';

import type { BudgetItemInsert } from '../utils/api-types';
import { DateTime } from 'luxon';

type AddBudgetItemProps = {
  selectedUserId: string;
  budgetEntry: string;
  categoryId: string;
  onAdd: (budgetItem: BudgetItemInsert) => void;
  onClose: () => void;
};

const budgetItemSchema = z.object({
  budget_item_name: z.string().min(1, 'Item name is required.'),
  projected_amount: z
    .number()
    .nonnegative('Projected value must be a non-negative number.'),
  transaction_date: z.string().date('Date of transaction is required.'),
  is_recurring: z.boolean().default(false),
});

type BudgetItemSchema = z.infer<typeof budgetItemSchema>;

export const AddBudgetItem = ({
  selectedUserId,
  budgetEntry,
  categoryId,
  onAdd,
  onClose,
}: AddBudgetItemProps) => {
  const { t } = useTranslation(undefined, { keyPrefix: 'budget.drawers' });
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    setFocus,
  } = useForm<BudgetItemSchema>({
    resolver: zodResolver(budgetItemSchema),
  });

  const referenceDate = DateTime.fromFormat(`${budgetEntry}-01`, 'yyyy-MM-dd');

  const handleOnClose = () => {
    reset();
    onClose();
  };

  const handleOnSubmit = (data: BudgetItemSchema) => {
    onAdd({
      ...data,
      user_id: selectedUserId,
      category_id: categoryId,
    });
    handleOnClose();
  };

  useEffectOnce(() => {
    setFocus('budget_item_name');
  });

  return (
    <Drawer header={<Header variant='h2'>{t('addBudgetItem.title')}</Header>}>
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
            name='budget_item_name'
            control={control}
            render={({ field }) => (
              <FormField
                label={t('addBudgetItem.fields.itemName')}
                errorText={errors.budget_item_name?.message}>
                <Input
                  {...field}
                  disableBrowserAutocorrect
                  autoComplete={false}
                  placeholder={t('addBudgetItem.fields.itemNameExample')}
                  onChange={({ detail }) => field.onChange(detail.value)}
                />
              </FormField>
            )}
          />
          <Controller
            name='projected_amount'
            control={control}
            render={({ field }) => (
              <FormField
                label={t('addBudgetItem.fields.projectedAmount')}
                description={t('addBudgetItem.fields.projectedAmountDescription', {
                  currency: getUserLocale().includes('fr') ? '€' : '$',
                })}
                errorText={errors.projected_amount?.message}>
                <Grid gridDefinition={[{ colspan: 1 }, { colspan: 11 }]}>
                  <Box
                    variant='code'
                    textAlign='center'
                    float='right'
                    padding={{ vertical: 'xs' }}>
                    {getUserLocale().includes('fr') ? '€' : '$'}
                  </Box>
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
                </Grid>
              </FormField>
            )}
          />
          <Controller
            control={control}
            name='transaction_date'
            render={({ field }) => (
              <FormField
                label={t('addBudgetItem.fields.transactionDate')}
                description={t('addBudgetItem.fields.transactionDateDescription')}
                errorText={errors.transaction_date?.message}>
                <DatePicker
                  {...field}
                  placeholder='YYYY/MM/DD'
                  value={field.value?.toString()}
                  onChange={({ detail }) => field.onChange(detail.value)}
                  isDateEnabled={(date) => {
                    const selectedDate = DateTime.fromJSDate(date);
                    return selectedDate.hasSame(referenceDate, 'month');
                  }}
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
                errorText={errors.budget_item_name?.message}>
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
    </Drawer>
  );
};
