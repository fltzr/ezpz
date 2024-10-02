import {
  Alert,
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
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffectOnce } from 'react-use';
import { useTranslation } from 'react-i18next';
import { CategoryInsert } from '../utils/types';
import { z } from 'zod';

type AddCategoryProps = {
  selectedUserId: string;
  onAdd: (category: CategoryInsert) => void;
  onClose: () => void;
};

const addCategorySchema = z.object({
  category_name: z.string().min(1, 'Category name is required.'),
  is_recurring: z.boolean().default(false),
});

type AddCategorySchema = z.infer<typeof addCategorySchema>;

export const AddCategory = ({ selectedUserId, onAdd, onClose }: AddCategoryProps) => {
  const { t } = useTranslation(undefined, { keyPrefix: 'budget.drawers' });
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    setFocus,
  } = useForm<AddCategorySchema>({
    resolver: zodResolver(addCategorySchema),
  });

  const handleOnClose = () => {
    reset();
    onClose();
  };

  const handleOnSubmit = (data: AddCategorySchema) => {
    onAdd({ ...data, user_id: selectedUserId });
    handleOnClose();
  };
  useEffectOnce(() => {
    setFocus('category_name');
  });

  return (
    <Drawer header={<Header variant='h2'>{t('addCategory.title')}</Header>}>
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
            control={control}
            name='category_name'
            render={({ field }) => (
              <FormField
                label={t('addCategory.fields.categoryName')}
                errorText={errors.category_name?.message}>
                <Input
                  {...field}
                  disableBrowserAutocorrect
                  autoComplete={false}
                  placeholder={t('addCategory.fields.categoryExample')}
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

          <Alert type='warning'>{t('addCategory.warning')}</Alert>
        </SpaceBetween>
      </Form>
    </Drawer>
  );
};
