import { FormField, Select, SelectProps } from '@cloudscape-design/components';
import { LoanEntry } from '../utils/types';
import { useState } from 'react';
import { useLoansApi } from '../hooks/use-loans-api';
import { formatCurrency } from '../../../common/utils/format-currency';

type LoanSelectorProps = {
  onSelectLoan: (loan: LoanEntry) => void;
};

export const LoanSelector = ({ onSelectLoan }: LoanSelectorProps) => {
  const { data: loans, isLoading, error } = useLoansApi();
  const [selectedLoan, setSelectedLoan] = useState<SelectProps.Option | null>(null);

  const options: SelectProps['options'] = loans
    ?.sort((a, b) => b.interest_rate - a.interest_rate)
    .map((loan) => ({
      label: loan.loan_name,
      value: loan.id,
      labelTag: formatCurrency(loan.principal),
      tags: [`${loan.interest_rate}%`],
    }));

  const handleLoanChange: SelectProps['onChange'] = ({ detail }) => {
    setSelectedLoan(detail.selectedOption);
    onSelectLoan(loans!.find((loan) => loan.id === detail.selectedOption.value)!);
  };

  return (
    <FormField>
      <Select
        triggerVariant='option'
        selectedOption={selectedLoan}
        options={options}
        statusType={isLoading ? 'loading' : error ? 'error' : 'finished'}
        onChange={handleLoanChange}
        placeholder='Select a loan'
        loadingText='Fetching loans...'
      />
    </FormField>
  );
};
