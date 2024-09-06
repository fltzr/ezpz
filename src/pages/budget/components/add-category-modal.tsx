import { useEffect, useRef } from 'react';
import { Category } from '../utils/types';
import { z } from 'zod';
import {
  Box,
  Button,
  Form,
  FormField,
  Input,
  Modal,
  SpaceBetween,
} from '@cloudscape-design/components';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

type AddCategoryModalProps = {
  visible: boolean;
  onClose: () => void;
  onAdd: (category: Omit<Category, 'id' | 'created_at'>) => void;
  userId: string;
};

const categorySchema = z.object({
  category_name: z.string().min(1, 'Category name is required.'),
});

type CategorySchema = z.infer<typeof categorySchema>;

export const AddCategoryModal = ({
  visible,
  onClose,
  onAdd,
  userId,
}: AddCategoryModalProps) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategorySchema>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      category_name: '',
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

  const handleOnClose = () => {
    reset();
    onClose();
  };

  const handleOnSubmit = (data: CategorySchema) => {
    onAdd({ ...data, user_id: userId });
    handleOnClose();
  };

  return (
    <Modal
      visible={visible}
      onDismiss={handleOnClose}
      header='Add category'
      footer={
        <Box float='right'>
          <SpaceBetween direction='horizontal' size='xs'>
            <Button variant='link' onClick={handleOnClose}>
              Cancel
            </Button>
            <Button variant='primary' onClick={() => handleSubmit(handleOnSubmit)()}>
              Add
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
              <FormField label='Category name' errorText={errors.category_name?.message}>
                <Input
                  {...field}
                  ref={inputRef}
                  disableBrowserAutocorrect
                  autoComplete={false}
                  placeholder='e.g., Housing, Transportation, Savings'
                  onChange={({ detail }) => field.onChange(detail.value)}
                />
              </FormField>
            )}
          />
        </SpaceBetween>
      </Form>
    </Modal>
  );
};
