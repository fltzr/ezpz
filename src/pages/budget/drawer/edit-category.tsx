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
  Header,
  Input,
  SpaceBetween,
} from '@cloudscape-design/components';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import type { Category, CategoryInsert } from '../utils/api-types';

type EditCategoryProps = {
  selectedUserId: string;
  category: Category;
  onEdit: (category: CategoryInsert) => void;
  onClose: () => void;
};

const editCategorySchema = z.object({
  id: z.string().optional(),
  category_name: z.string().min(1, 'Category name is required.'),
  is_recurring: z.boolean().default(false),
});

type EditCategorySchema = z.infer<typeof editCategorySchema>;

export const EditCategory = ({
  selectedUserId,
  category,
  onEdit,
  onClose,
}: EditCategoryProps) => {
  const { t } = useTranslation(undefined, { keyPrefix: 'budget.drawers' });
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    setFocus,
  } = useForm<EditCategorySchema>({
    resolver: zodResolver(editCategorySchema),
    defaultValues: {
      id: category.id,
      category_name: category.category_name,
      is_recurring: category.is_recurring,
    },
  });

  const handleOnClose = () => {
    reset();
    onClose();
  };

  const handleOnSubmit = (data: EditCategorySchema) => {
    onEdit({ ...data, user_id: selectedUserId });
    handleOnClose();
  };
  useEffectOnce(() => {
    setFocus('category_name');
  });

  return (
    <Drawer header={<Header variant='h2'>{t('editCategory.title')}</Header>}>
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
              name='category_name'
              render={({ field }) => (
                <FormField
                  label={t('editCategory.fields.categoryName')}
                  errorText={errors.category_name?.message}>
                  <Input
                    {...field}
                    disableBrowserAutocorrect
                    autoComplete={false}
                    placeholder={t('editCategory.fields.categoryExample')}
                    onChange={(event) => field.onChange(event.detail.value)}
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
