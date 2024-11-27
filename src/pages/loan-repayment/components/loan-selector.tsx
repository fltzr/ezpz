import { Select, type SelectProps } from '@cloudscape-design/components';

import { formatCurrency } from '@/utils/format-currency';

import type { LoanEntry } from '../utils/types';

type LoanSelectorProps = {
  loans: LoanEntry[];
  selectedLoanId?: string;
  onSelectLoan: (loan: LoanEntry) => void;
};

export const LoanSelector = ({
  loans,
  selectedLoanId,
  onSelectLoan,
}: LoanSelectorProps) => {
  const options: SelectProps['options'] = loans
    .sort((a, b) => b.interest_rate - a.interest_rate)
    .map((loan) => ({
      label: loan.loan_name,
      value: loan.id,
      labelTag: formatCurrency(loan.principal),
      tags: [`${loan.interest_rate}%`],
    }));

  const selectedOption =
    options.find((option) => option.value === selectedLoanId) || null;

  const handleLoanChange: SelectProps['onChange'] = ({ detail }) => {
    const selectedLoan = loans.find(({ id }) => id === detail.selectedOption.value);

    if (selectedLoan) {
      onSelectLoan(selectedLoan);
    }
  };

  return (
    <Select
      triggerVariant='option'
      selectedOption={selectedOption}
      options={options}
      onChange={handleLoanChange}
      placeholder='Select a loan'
      loadingText='Fetching loans...'
    />
  );
};
