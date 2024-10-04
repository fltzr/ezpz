import { useEffectOnce } from 'react-use';
import { useTranslation } from 'react-i18next';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Box,
  Button,
  Drawer,
  Form,
  FormField,
  Header,
  Input,
  SpaceBetween,
} from '@cloudscape-design/components';

import type { IncomeSourceInsert } from '../utils/api-types';

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
});

type AddIncomeSourceSchema = z.infer<typeof addIncomeSourceSchema>;

export const AddIncomeSource = ({ selectedUserId, onAdd, onClose }: AddIncomeSource) => {
  const { t } = useTranslation(undefined, { keyPrefix: 'pages.budget.modals' });
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
    <Drawer header={<Header variant='h2'>Add loan</Header>}>
      <Form
        actions={
          <Box float='right'>
            <SpaceBetween direction='horizontal' size='xs'>
              <Button variant='link' onClick={handleOnClose}>
                {t('cancelButton')}
              </Button>
              <Button
                variant='primary'
                onClick={() => void handleSubmit(handleOnSubmit)()}>
                {t('addButton')}
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
                  label={t('incomeSourceName')}
                  errorText={errors.income_source_name?.message}>
                  <Input
                    {...field}
                    disableBrowserAutocorrect
                    autoComplete={false}
                    placeholder={t('incomeSourceExample')}
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
                  label={t('projectedAmount')}
                  description={t('common.fields.isRecurringDescription')}
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
          </SpaceBetween>
        </Form>
      </Form>
    </Drawer>
  );
};
