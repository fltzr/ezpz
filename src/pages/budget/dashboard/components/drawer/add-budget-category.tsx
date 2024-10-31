import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useEffectOnce } from 'react-use';

import {
  Box,
  Button,
  Checkbox,
  Drawer,
  Form,
  FormField,
  Grid,
  Header,
  Input,
  SpaceBetween,
} from '@cloudscape-design/components';
import { zodResolver } from '@hookform/resolvers/zod';
import getUserLocale from 'get-user-locale';
import { z } from 'zod';

import { BudgetCategoryInsert } from '@/pages/budget/utils/api-types';

const budgetCategorySchema = z.object({
  name: z.string().min(1, 'Item name is required.'),
  budgeted: z.number().nonnegative('Budgeted must be a non-negative number.'),
  is_recurring: z.boolean().default(false),
});

type BudgetCategorySchema = z.infer<typeof budgetCategorySchema>;

type AddBudgetCategoryProps = {
  onAdd: (budgetCategory: Omit<BudgetCategoryInsert, 'user_id' | 'budget_entry'>) => void;
  onCancel: () => void;
};

export const AddBudgetCategory = ({ onAdd, onCancel }: AddBudgetCategoryProps) => {
  const { t } = useTranslation(undefined, { keyPrefix: 'budget.drawers' });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    setFocus,
  } = useForm<BudgetCategorySchema>({
    resolver: zodResolver(budgetCategorySchema),
  });

  const handleOnAdd = (data: BudgetCategorySchema) => {
    onAdd(data);
    handleOnClose();
  };

  const handleOnClose = () => {
    onCancel();
    reset();
  };

  useEffectOnce(() => {
    setFocus('name');
  });

  return (
    <Drawer header={<Header variant='h2'>Add budget category</Header>}>
      <Form
        actions={
          <Box float='right'>
            <SpaceBetween direction='horizontal' size='xs'>
              <Button variant='link' onClick={handleOnClose}>
                {t('common.cancelButton')}
              </Button>
              <Button variant='primary' onClick={() => void handleSubmit(handleOnAdd)()}>
                {t('common.addButton')}
              </Button>
            </SpaceBetween>
          </Box>
        }>
        <SpaceBetween direction='vertical' size='l'>
          <Controller
            control={control}
            name='name'
            render={({ field }) => (
              <FormField
                label={t('addBudgetItem.fields.itemName')}
                errorText={errors.name?.message}>
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
            name='budgeted'
            control={control}
            render={({ field }) => (
              <FormField
                label={t('addBudgetItem.fields.projectedAmount')}
                description={t('addBudgetItem.fields.projectedAmountDescription', {
                  currency: getUserLocale().includes('fr') ? '€' : '$',
                })}
                errorText={errors.budgeted?.message}>
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
            name='is_recurring'
            control={control}
            render={({ field }) => (
              <FormField
                label={t('common.fields.isRecurring')}
                description={t('common.fields.isRecurringDescription')}
                errorText={errors.is_recurring?.message}>
                <Checkbox
                  {...field}
                  checked={field.value ?? true}
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
