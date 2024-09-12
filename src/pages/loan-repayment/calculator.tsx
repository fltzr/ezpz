import { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Header,
  KeyValuePairs,
  KeyValuePairsProps,
  SpaceBetween,
} from '@cloudscape-design/components';

import { formatCurrency } from '../../common/utils/format-currency';
import type { LoanInputSchema } from './schema';
import { AmortizationScheduleTable } from './components/amortization-schedule-table';
import { LoanSelector } from './components/loan-selector';
import { createAmortizationSchedule } from './utils/calculations';
import { toZodSchema } from './utils/dto';
import { addMonths } from './utils/add-months';
import { LoanEntry } from './utils/types';

const CalculatorPage = () => {
  const [loanRepayment, setLoanRepayment] = useState<
    ReturnType<typeof createAmortizationSchedule> | undefined
  >(undefined);
  const [selectedLoan, setSelectedLoan] = useState<LoanInputSchema | undefined>(
    undefined
  );

  useEffect(() => {
    setLoanRepayment(createAmortizationSchedule(selectedLoan));
  }, [selectedLoan]);

  const handleSelectLoan = (loan: LoanEntry) => {
    setSelectedLoan(toZodSchema(loan));
  };

  const loanSummaryItems: KeyValuePairsProps['items'] = loanRepayment
    ? [
        {
          label: 'Months',
          value: loanRepayment[loanRepayment.length - 1].month,
        },
        {
          label: 'Total interest paid',
          value: formatCurrency(
            loanRepayment[loanRepayment.length - 1].totalInterestPaid
          ),
        },
        {
          label: 'Total cost of loan',
          value: formatCurrency(
            (selectedLoan?.principal ?? 0) +
              loanRepayment[loanRepayment.length - 1].totalInterestPaid!
          ),
        },
        {
          label: 'Payoff date',
          value: addMonths(loanRepayment[loanRepayment.length - 1].month),
        },
      ]
    : [];

  return (
    <Box padding={{ vertical: 'xl' }}>
      <SpaceBetween size='xxl' direction='vertical'>
        <Header
          variant='h1'
          description='Add or select a loan and view an amortization table.'>
          Loan repayment calculator
        </Header>

        <LoanSelector onSelectLoan={handleSelectLoan} />

        {loanRepayment ? (
          <SpaceBetween size='l' direction='vertical'>
            {/* Loan Summary */}
            <Container header={<Header variant='h2'>Loan summary</Header>}>
              <KeyValuePairs columns={5} items={loanSummaryItems} />
            </Container>

            {/* Amortization Schedule Table */}
            <AmortizationScheduleTable schedule={loanRepayment} />
          </SpaceBetween>
        ) : (
          <Box variant='h2' textAlign='center'>
            Select a loan to get started!
          </Box>
        )}
      </SpaceBetween>
    </Box>
  );
};

export default CalculatorPage;
