import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  ButtonGroup,
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
import { useTranslation } from 'react-i18next';

const CalculatorPage = () => {
  const { t } = useTranslation(undefined, { keyPrefix: 'pages.loanRepayment' });
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
      { label: t('summary.months'), value: month },
      { label: t('summary.totalInterest'), value: formatCurrency(totalInterestPaid) },
      { label: t('summary.totalCost'), value: formatCurrency(totalCostOfLoan) },
      { label: t('summary.payoffDate'), value: addMonths(month) },
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
          description={t('description')}
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
                {t('actions.addLoan')}
              </Button>
            </Box>
          }>
          {t('title')}
        </Header>

        <FormField
          secondaryControl={
            <Box padding={{ top: 's' }}>
              <ButtonGroup
                i18nIsDynamicList
                ariaLabel='Loan actions'
                variant='icon'
                items={[
                  {
                    type: 'icon-button',
                    id: 'edit',
                    iconName: 'edit',
                    text: t('actions.edit'),
                  },
                  {
                    type: 'icon-button',
                    id: 'delete',
                    iconName: 'remove',
                    text: t('actions.delete'),
                  },
                ]}
                onItemClick={({ detail }) => {
                  switch (detail.id) {
                    case 'edit':
                      openDrawer(
                        'edit-loan-info',
                        <EditLoanInfo
                          loanDetails={selectedLoan}
                          onSubmitEdit={handleSubmitEdit}
                          onDismiss={closeDrawer}
                        />,
                        350
                      );
                      break;
                    case 'delete':
                      setShowDeleteLoanModal(true);
                      break;
                    default:
                      break;
                  }
                }}
              />
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
