import {
  Container,
  Header,
  KeyValuePairs,
  SpaceBetween,
  StatusIndicator,
} from '@cloudscape-design/components';
import { LoanInput } from './components/loan-input';
import { useState } from 'react';
import { LoanInputSchema } from './schema';
import { calculateLoanRepayment } from './utils/calculations';
import { formatCurrency } from '../../common/utils/format-currency';
import { AmortizationScheduleTable } from './components/amortization-schedule-table';

const CalculatorPage = () => {
  const [loanData, setLoanData] = useState<LoanInputSchema | undefined>(undefined);

  return (
    <SpaceBetween size='xxl' direction='vertical'>
      <Header variant='h1'>Loan repayment calculator</Header>
      <Container>
        <LoanInput onSubmitLoanData={(data) => setLoanData(data)} />
      </Container>
      {loanData ? (
        <Container header={<Header variant='h2'>For this loan, it will take...</Header>}>
          <KeyValuePairs
            columns={4}
            items={[
              {
                label: 'Years',
                value: calculateLoanRepayment(loanData).payoffYears ?? 0,
              },
              {
                label: 'Months',
                value: calculateLoanRepayment(loanData).payoffMonths ?? 0,
              },
              {
                label: 'Total interest paid',
                value:
                  formatCurrency(
                    Number(calculateLoanRepayment(loanData).totalInterestPaid)
                  ) || '',
              },
              {
                label: 'With a surplus in the final month of',
                value: (
                  <StatusIndicator type='success'>
                    {formatCurrency(calculateLoanRepayment(loanData).surplus ?? 0)}
                  </StatusIndicator>
                ),
              },
            ]}
          />
        </Container>
      ) : undefined}
      <AmortizationScheduleTable
        schedule={calculateLoanRepayment(loanData).amortizationSchedule}
      />
    </SpaceBetween>
  );
};

export default CalculatorPage;
