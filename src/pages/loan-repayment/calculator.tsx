import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Container,
  FormField,
  Header,
  KeyValuePairs,
  KeyValuePairsProps,
  SpaceBetween,
} from '@cloudscape-design/components';

import type { LoanInputSchema } from './schema';
import { useLoansApi } from './hooks/use-loans-api';
import { AmortizationScheduleTable } from './components/amortization-schedule-table';
import { LoanSelector } from './components/loan-selector';
import { formatCurrency } from '../../common/utils/format-currency';
import { createAmortizationSchedule } from './utils/calculations';
import { toDatabaseSchema, toZodSchema } from './utils/dto';
import { addMonths } from './utils/add-months';
import { DeleteLoanModal } from './modals/delete-loan-modal';
import { AddLoanInfo } from './drawer/add-loan-info';
import { useDrawer } from '../../common/components/drawer-provider';
import { EditLoanInfo } from './drawer/edit-loan-info';

const CalculatorPage = () => {
  const {
    data: loans = [],
    handleAddLoan,
    handleUpdateLoan,
    handleDeleteLoan,
  } = useLoansApi();

  const { openDrawer, closeDrawer } = useDrawer();

  const [selectedLoan, setSelectedLoan] = useState<LoanInputSchema | undefined>(
    undefined
  );

  const [showDeleteLoanModal, setShowDeleteLoanModal] = useState(false);

  useEffect(() => {
    if (loans.length === 0) {
      setSelectedLoan(undefined);
      return;
    }

    const currentLoan = selectedLoan
      ? loans.find((loan) => loan.id === selectedLoan.id)
      : loans[0];

    if (currentLoan) {
      const updatedLoan = toZodSchema(currentLoan);
      if (JSON.stringify(selectedLoan) !== JSON.stringify(updatedLoan)) {
        setSelectedLoan(updatedLoan);
      }
    }
  }, [loans, selectedLoan]);

  const loanRepayment = selectedLoan
    ? createAmortizationSchedule(selectedLoan)
    : undefined;

  const handleSubmitAdd = (data: LoanInputSchema) => {
    handleAddLoan(toDatabaseSchema(data));
    closeDrawer();
    resetLoanSelection();
  };

  const handleSubmitEdit = (data: LoanInputSchema) => {
    handleUpdateLoan(toDatabaseSchema(data));
    closeDrawer();
    resetLoanSelection();
  };

  const handleSubmitDelete = (loanId: string) => {
    handleDeleteLoan(loanId);
    setShowDeleteLoanModal(false);
    resetLoanSelection();
  };

  const resetLoanSelection = () => {
    setSelectedLoan(undefined);
  };

  const loanSummaryItems = (): KeyValuePairsProps['items'] => {
    if (!loanRepayment || !selectedLoan) return [];

    const { month, totalInterestPaid = 0 } = loanRepayment[loanRepayment.length - 1];
    const totalCostOfLoan = (selectedLoan?.principal ?? 0) + totalInterestPaid;

    return [
      { label: 'Months', value: month },
      { label: 'Total interest paid', value: formatCurrency(totalInterestPaid) },
      { label: 'Total cost of loan', value: formatCurrency(totalCostOfLoan) },
      { label: 'Payoff date', value: addMonths(month) },
    ];
  };

  useEffect(() => {
    return () => {
      closeDrawer();
    };
  }, [closeDrawer]);

  return (
    <Box padding={{ vertical: 'xl' }}>
      <SpaceBetween size='xxl' direction='vertical'>
        <Header
          variant='h1'
          description='Add or select a loan and view an amortization table.'
          actions={
            <Box padding={{ vertical: 's' }}>
              <Button
                variant='primary'
                onClick={() => {
                  openDrawer(
                    'add-loan-info',
                    <AddLoanInfo onSubmit={handleSubmitAdd} onDismiss={closeDrawer} />,
                    350
                  );
                }}>
                Add loan
              </Button>
            </Box>
          }>
          Loan repayment calculator
        </Header>

        <FormField
          secondaryControl={
            <Box padding={{ top: 's' }}>
              <SpaceBetween direction='horizontal' size='m'>
                <Button
                  variant='inline-icon'
                  iconName='edit'
                  disabled={!selectedLoan}
                  onClick={() => {
                    openDrawer(
                      'edit-loan-info',
                      <EditLoanInfo
                        loanDetails={selectedLoan}
                        onSubmitEdit={handleSubmitEdit}
                        onDismiss={closeDrawer}
                      />,
                      350
                    );
                  }}
                />
                <Button
                  variant='inline-icon'
                  iconName='remove'
                  disabled={!selectedLoan}
                  onClick={() => setShowDeleteLoanModal(true)}
                />
              </SpaceBetween>
            </Box>
          }>
          <LoanSelector
            loans={loans}
            selectedLoanId={selectedLoan?.id ?? undefined}
            onSelectLoan={(loan) => setSelectedLoan(toZodSchema(loan))}
          />
        </FormField>

        {loanRepayment ? (
          <SpaceBetween size='l' direction='vertical'>
            {/* Loan Summary */}
            <Container header={<Header variant='h2'>Loan summary</Header>}>
              <KeyValuePairs columns={5} items={loanSummaryItems()} />
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
      <DeleteLoanModal
        visible={showDeleteLoanModal}
        loanDetails={selectedLoan}
        onSubmitDelete={handleSubmitDelete}
        onDismiss={() => setShowDeleteLoanModal(false)}
      />
    </Box>
  );
};

export default CalculatorPage;
