import {
  Box,
  Button,
  Container,
  Header,
  KeyValuePairs,
  SpaceBetween,
  StatusIndicator,
} from '@cloudscape-design/components';
import { calculateLoanRepayment } from './utils/calculations';
import { formatCurrency } from '../../common/utils/format-currency';
import { AmortizationScheduleTable } from './components/amortization-schedule-table';
import { toZodSchema } from './utils/dto';
import { useEffect, useState } from 'react';
import { LoanInputSchema } from './schema';
import { LoanSelector } from './components/loan-selector';
import { ExtraPaymentOption } from './components/extra-payment-option';

const CalculatorPage = () => {
  const [loanRepayment, setLoanRepayment] = useState<
    ReturnType<typeof calculateLoanRepayment> | undefined
  >(undefined);
  const [selectedLoan, setSelectedLoan] = useState<LoanInputSchema | undefined>(
    undefined
  );

  useEffect(() => {
    setLoanRepayment(calculateLoanRepayment(selectedLoan));
  }, [selectedLoan]);

  return (
    <Box padding={{ vertical: 'xl' }}>
      <SpaceBetween size='xxl' direction='vertical'>
        <Header
          variant='h1'
          actions={
            <SpaceBetween direction='horizontal' size='m'>
              <Button variant='primary'>Add loan</Button>
            </SpaceBetween>
          }>
          Loan repayment calculator
        </Header>

        <LoanSelector onSelectLoan={(loan) => setSelectedLoan(toZodSchema(loan))} />

        {/* <Container>
        <LoanInput onSubmitLoanData={(data) => setLoanData(data)} />
      </Container> */}
        {selectedLoan ? (
          <SpaceBetween direction='vertical' size='l'>
            <ExtraPaymentOption
              isDisabled={!selectedLoan}
              onAddExtraPayment={(payment) => {
                setSelectedLoan((prev) => {
                  if (!prev) return prev;

                  return {
                    ...prev,
                    principal: prev.principal - payment,
                  };
                });
              }}
              onRemoveExtraPayment={(payment) => {
                setSelectedLoan((prev) => {
                  if (!prev) return prev;

                  return {
                    ...prev,
                    principal: prev.principal + payment,
                  };
                });
              }}
            />
            <Container
              header={<Header variant='h2'>For this loan, it will take...</Header>}>
              <KeyValuePairs
                columns={4}
                items={[
                  {
                    label: 'Years',
                    value: loanRepayment?.payoffYears ?? 0,
                  },
                  {
                    label: 'Months',
                    value: loanRepayment?.payoffMonths ?? 0,
                  },
                  {
                    label: 'Total interest paid',
                    value: formatCurrency(Number(loanRepayment?.totalInterestPaid)) || '',
                  },
                  {
                    label: 'With a surplus in the final month of',
                    value: (
                      <StatusIndicator type='success'>
                        {formatCurrency(loanRepayment?.surplus ?? 0)}
                      </StatusIndicator>
                    ),
                  },
                ]}
              />
            </Container>
            <AmortizationScheduleTable schedule={loanRepayment?.amortizationSchedule} />
          </SpaceBetween>
        ) : (
          <Box variant='h3' textAlign='center'>
            Select a loan to get started!
          </Box>
        )}
      </SpaceBetween>
    </Box>
  );
};

export default CalculatorPage;
