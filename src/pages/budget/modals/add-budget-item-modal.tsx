import { useEffect, useRef } from 'react';
import getUserLocale from 'get-user-locale';
import { z } from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Button,
  Form,
  FormField,
  Grid,
  Input,
  Modal,
  SpaceBetween,
} from '@cloudscape-design/components';
import type { BudgetItem, Category } from '../utils/types';

type AddBudgetItemModalProps = {
  visible: boolean;
  onClose: () => void;
  onAdd: (budgetItem: Omit<BudgetItem, 'id' | 'created_at'>) => void;
  category?: Category;
  userId: string;
};

const budgetItemSchema = z.object({
  budget_item_name: z.string().min(1, 'Item name is required.'),
  projected_amount: z
    .number()
    .nonnegative('Projected value must be a non-negative number.'),
});

type BudgetItemSchema = z.infer<typeof budgetItemSchema>;

export const AddBudgetItemModal = ({
  visible,
  onClose,
  onAdd,
  category,
  userId,
}: AddBudgetItemModalProps) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BudgetItemSchema>({
    resolver: zodResolver(budgetItemSchema),
    defaultValues: {
      budget_item_name: '',
    },
  });

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (visible && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  }, [visible]);

  const handleOnSubmit = (data: BudgetItemSchema) => {
    onAdd({ ...data, category_id: category?.id ?? '', user_id: userId });
    handleClose();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      onDismiss={handleClose}
      header={`Add budget item to ${category?.category_name}`}
      footer={
        <Box float='right'>
          <SpaceBetween direction='horizontal' size='xs'>
            <Button variant='link' onClick={handleClose}>
              Cancel
            </Button>
            <Button variant='primary' onClick={() => void handleSubmit(handleOnSubmit)()}>
              Add
            </Button>
          </SpaceBetween>
        </Box>
      }>
      <Form>
        <SpaceBetween direction='vertical' size='l'>
          <Controller
            name='budget_item_name'
            control={control}
            render={({ field }) => (
              <FormField label='Item name' errorText={errors.budget_item_name?.message}>
                <Input
                  {...field}
                  ref={inputRef}
                  disableBrowserAutocorrect
                  autoComplete={false}
                  placeholder='e.g., Groceries, Rent, Utilities'
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
                label='Projected value'
                description={`The projected value you plan to spend on this item. Current currency: ${
                  getUserLocale().includes('US') ? '$' : '€'
                }`}
                errorText={errors.projected_amount?.message}>
                <Grid gridDefinition={[{ colspan: 1 }, { colspan: 11 }]}>
                  <Box
                    variant='code'
                    textAlign='center'
                    float='right'
                    padding={{ vertical: 'xs' }}>
                    $
                  </Box>
                  <Input
                    {...field}
                    disableBrowserAutocorrect
                    autoComplete={false}
                    type='number'
                    inputMode='decimal'
                    placeholder='$0.00'
                    value={String(field.value || 0)}
                    onChange={({ detail }) => field.onChange(Number(detail.value))}
                  />
                </Grid>
              </FormField>
            )}
          />
        </SpaceBetween>
      </Form>
    </Modal>
  );
};
