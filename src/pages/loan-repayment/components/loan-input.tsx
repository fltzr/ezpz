import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Button,
  Form,
  FormField,
  Header,
  Input,
  SpaceBetween,
} from '@cloudscape-design/components';

import { loanInputSchema, type LoanInputSchema } from '../schema';

type LoanInputProps = {
  onSubmitLoanData: (loan: LoanInputSchema) => void;
};

export const LoanInput = ({ onSubmitLoanData }: LoanInputProps) => {
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<LoanInputSchema>({
    resolver: zodResolver(loanInputSchema),
  });

  return (
    <Form
      header={<Header variant='h2'>Loan details</Header>}
      actions={
        <Button variant='primary' onClick={() => void handleSubmit(onSubmitLoanData)()}>
          Calculate payoff
        </Button>
      }>
      <SpaceBetween size='m' direction='vertical'>
        <Controller
          control={control}
          name='principal'
          render={({ field }) => (
            <FormField label='Principal amount' errorText={errors.principal?.message}>
              <Input
                {...field}
                type='number'
                inputMode='decimal'
                onChange={(event) => field.onChange(Number(event.detail.value))}
                value={String(field.value)}
              />
            </FormField>
          )}
        />
        <Controller
          control={control}
          name='annualInterestRate'
          render={({ field }) => (
            <FormField
              label='Annual interest rate'
              errorText={errors.annualInterestRate?.message}>
              <Input
                {...field}
                type='number'
                inputMode='decimal'
                onChange={(event) => field.onChange(Number(event.detail.value))}
                value={String(field.value)}
              />
            </FormField>
          )}
        />
        <Controller
          control={control}
          name='monthlyPayment'
          render={({ field }) => (
            <FormField label='Monthly payment' errorText={errors.monthlyPayment?.message}>
              <Input
                {...field}
                type='number'
                inputMode='decimal'
                onChange={(event) => field.onChange(Number(event.detail.value))}
                value={String(field.value)}
              />
            </FormField>
          )}
        />
      </SpaceBetween>
    </Form>
  );
};
