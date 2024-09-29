import {
  Box,
  Button,
  Drawer,
  Form,
  FormField,
  Grid,
  Header,
  Input,
  Select,
  SpaceBetween,
} from '@cloudscape-design/components';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffectOnce } from 'react-use';
import { useTranslation } from 'react-i18next';
import { BudgetItem, BudgetItemUpdate, Category, isCategoryItem } from '../utils/types';
import { z } from 'zod';
import getUserLocale from 'get-user-locale';
import { useBudgetApi } from '../hooks/use-budget-api';

type EditCategoryNameProps = {
  selectedUserId: string;
  budgetEntry: string;
  item: BudgetItem;
  onEdit: (budgetItem: BudgetItemUpdate) => void;
  onClose: () => void;
};

const budgetItemSchema = z.object({
  budget_item_name: z.string().min(1, 'Item name is required.'),
  projected_amount: z
    .number()
    .nonnegative('Projected value must be a non-negative number.'),
  category_id: z.string({
    required_error: 'This budget item must be associated to a category.',
  }),
});

type BudgetItemSchema = z.infer<typeof budgetItemSchema>;

export const EditCategoryName = ({
  selectedUserId,
  budgetEntry,
  item,
  onEdit,
  onClose,
}: EditCategoryNameProps) => {
  const { t } = useTranslation(undefined, { keyPrefix: 'budget.drawers' });

  const { data } = useBudgetApi(selectedUserId, budgetEntry);
  const categories = (data?.filter(isCategoryItem) as Category[]) ?? [];

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    setFocus,
  } = useForm<BudgetItemSchema>({
    resolver: zodResolver(budgetItemSchema),
    defaultValues: {
      budget_item_name: item?.budget_item_name ?? '',
      projected_amount: item?.projected_amount ?? 0,
      category_id: item?.category_id,
    },
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleOnSubmit = (data: BudgetItemSchema) => {
    const updates: BudgetItemUpdate = {
      id: item.id,
      ...Object.fromEntries(
        Object.entries(data).filter(
          ([key, value]) => value !== item[key as keyof BudgetItem]
        )
      ),
    };
    onEdit(updates);
    handleClose();
  };

  useEffectOnce(() => {
    setFocus('budget_item_name');
  });

  return (
    <Drawer header={<Header variant='h2'>{t('editBudgetItem.title')}</Header>}>
      <Form
        actions={
          <Box float='right'>
            <SpaceBetween direction='horizontal' size='xs'>
              <Button variant='link' onClick={handleClose}>
                {t('common.cancelButton')}
              </Button>
              <Button
                variant='primary'
                onClick={() => void handleSubmit(handleOnSubmit)()}>
                {t('common.updateButton')}
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
            name='category_id'
            render={({ field }) => (
              <FormField
                label={t('common.category')}
                errorText={errors.category_id?.message}>
                <Select
                  {...field}
                  options={categories.map((category) => ({
                    label: category.category_name,
                    value: category.id,
                  }))}
                  selectedOption={
                    field.value
                      ? {
                          label: categories.find(
                            (category) => category.id === field.value
                          )?.category_name,
                          value: field.value,
                        }
                      : null
                  }
                  onChange={({ detail }) => field.onChange(detail.selectedOption.value)}
                />
              </FormField>
            )}
          />
        </SpaceBetween>
      </Form>
    </Drawer>
  );
};
