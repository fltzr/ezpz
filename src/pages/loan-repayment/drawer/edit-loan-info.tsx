import { Controller, useForm } from 'react-hook-form';
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

import { loanInputSchema, LoanInputSchema } from '../schema';

type EditLoanInfoProps = {
  loanDetails?: LoanInputSchema;
  onSubmitEdit: (loan: LoanInputSchema) => void;
  onDismiss: () => void;
};

export const EditLoanInfo = ({
  loanDetails,
  onSubmitEdit,
  onDismiss,
}: EditLoanInfoProps) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoanInputSchema>({
    resolver: zodResolver(loanInputSchema),
    defaultValues: loanDetails,
  });

  const handleOnDismiss = () => {
    reset();
    onDismiss();
  };

  return (
    <Drawer
      header={
        <Header variant='h2'>
          Edit loan details for{' '}
          <Box display='inline-block' fontSize='heading-m' color='text-status-info'>
            {loanDetails?.loanName}
          </Box>
        </Header>
      }>
      <Form
        actions={
          <Box float='right'>
            <SpaceBetween size='xs' direction='horizontal'>
              <Button variant='link' onClick={handleOnDismiss}>
                Cancel
              </Button>
              <Button variant='primary' onClick={() => void handleSubmit(onSubmitEdit)()}>
                Update
              </Button>
            </SpaceBetween>
          </Box>
        }>
        <SpaceBetween direction='vertical' size='m'>
          {/* Loan ID (read-only) */}
          <Controller
            control={control}
            name='id'
            render={({ field }) => (
              <FormField label='Loan ID'>
                <Input readOnly value={field.value} />
              </FormField>
            )}
          />

          {/* Loan Name */}
          <Controller
            control={control}
            name='loanName'
            render={({ field }) => (
              <FormField label='Loan Name' errorText={errors.loanName?.message}>
                <Input
                  value={field.value}
                  onChange={(event) => field.onChange(event.detail.value)}
                />
              </FormField>
            )}
          />

          {/* Principal */}
          <Controller
            control={control}
            name='principal'
            render={({ field }) => (
              <FormField label='Principal ($)' errorText={errors.principal?.message}>
                <Input
                  type='number'
                  inputMode='decimal'
                  value={field.value !== undefined ? String(field.value) : ''}
                  onChange={(event) =>
                    field.onChange(event.detail.value ? Number(event.detail.value) : '')
                  }
                />
              </FormField>
            )}
          />

          {/* Annual Interest Rate */}
          <Controller
            control={control}
            name='annualInterestRate'
            render={({ field }) => (
              <FormField
                label='Annual Interest Rate (%)'
                errorText={errors.annualInterestRate?.message}>
                <Input
                  type='number'
                  inputMode='decimal'
                  value={field.value !== undefined ? String(field.value) : ''}
                  onChange={(event) =>
                    field.onChange(event.detail.value ? Number(event.detail.value) : '')
                  }
                />
              </FormField>
            )}
          />

          {/* Monthly Payment */}
          <Controller
            control={control}
            name='monthlyPayment'
            render={({ field }) => (
              <FormField
                label='Monthly Payment ($)'
                errorText={errors.monthlyPayment?.message}>
                <Input
                  type='number'
                  inputMode='decimal'
                  value={field.value !== undefined ? String(field.value) : ''}
                  onChange={(event) =>
                    field.onChange(event.detail.value ? Number(event.detail.value) : '')
                  }
                />
              </FormField>
            )}
          />
        </SpaceBetween>
      </Form>
    </Drawer>
  );
};
