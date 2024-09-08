import { Controller, useForm } from 'react-hook-form';
import { IncomeSourceInsert } from '../utils/types';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useRef } from 'react';
import {
  Box,
  Button,
  Form,
  FormField,
  Header,
  Input,
  Modal,
  SpaceBetween,
} from '@cloudscape-design/components';

type AddIncomeSourceModalProps = {
  visible: boolean;
  onAdd: (IncomeSource: IncomeSourceInsert) => void;
  onClose: () => void;
  userId: string;
};

const addIncomeSourceSchema = z.object({
  income_source_name: z.string({ required_error: 'Name of income source is required.' }),
  projected_amount: z
    .number({ required_error: 'Estimated amount of income source is required.' })
    .nonnegative('Income source must be a non-negative value.'),
});

type AddIncomeSourceSchema = z.infer<typeof addIncomeSourceSchema>;

export const AddIncomeSourceModal = ({
  visible,
  onAdd,
  onClose,
  userId,
}: AddIncomeSourceModalProps) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddIncomeSourceSchema>({
    resolver: zodResolver(addIncomeSourceSchema),
  });

  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (visible && inputRef.current) {
      inputRef.current.focus();
    }
  }, [visible]);

  const handleOnClose = () => {
    reset();
    onClose();
  };

  const handleOnSubmit = (data: AddIncomeSourceSchema) => {
    onAdd({ ...data, user_id: userId });
    handleOnClose();
  };

  return (
    <Modal
      visible={visible}
      onDismiss={handleOnClose}
      header={<Header variant='h1'>Add income source</Header>}
      footer={
        <Box float='right'>
          <SpaceBetween direction='horizontal' size='xs'>
            <Button variant='link' onClick={handleOnClose}>
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
            control={control}
            name='income_source_name'
            render={({ field }) => (
              <FormField
                label='Name of income source'
                errorText={errors.income_source_name?.message}>
                <Input
                  {...field}
                  ref={inputRef}
                  disableBrowserAutocorrect
                  autoComplete={false}
                  placeholder='Paycheck, Investments, Babysitting'
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
                label='Projected amount'
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
    </Modal>
  );
};
