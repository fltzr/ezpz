import { formatCurrency } from '../../../utils/format-currency';
import { AmortizationSchedule, LoanInputSchema } from '../schema';

export const createAmortizationSchedule = (
  loan?: LoanInputSchema
): AmortizationSchedule => {
  if (!loan) {
    return [
      {
        month: 0,
        interestPayment: '$0',
        principalPayment: '$0',
        endingBalance: '$0',
      },
    ];
  }

  let month = 0;
  let loanBalance = loan.principal;
  const monthlyPayment = loan.monthlyPayment;
  const interestRate = loan.annualInterestRate;

  let totalInterestPaid = 0;

  const amortizationSchedule: AmortizationSchedule = [];

  while (loanBalance > 0) {
    month++;

    const monthlyInterestRate = interestRate / 100 / 12;
    const monthlyInterestPayment = monthlyInterestRate * loanBalance;
    totalInterestPaid += monthlyInterestPayment;

    const principalPayment = monthlyPayment - monthlyInterestPayment;
    const endingBalance = loanBalance - principalPayment;

    if (endingBalance < 0) {
      amortizationSchedule.push({
        month,
        interestPayment: formatCurrency(monthlyInterestPayment),
        principalPayment: formatCurrency(loanBalance - monthlyInterestPayment),
        endingBalance: formatCurrency(0),
        totalInterestPaid,
      });

      break;
    }

    amortizationSchedule.push({
      month,
      interestPayment: formatCurrency(monthlyInterestPayment),
      principalPayment: formatCurrency(principalPayment),
      endingBalance: formatCurrency(endingBalance),
      totalInterestPaid,
    });

    loanBalance -= principalPayment;
  }

  return amortizationSchedule;
};
