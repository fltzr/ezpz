import { formatCurrency } from '../../../common/utils/format-currency';
import { AmortizationSchedule, LoanInputSchema } from '../schema';

export const calculateLoanRepayment = (loan: LoanInputSchema | undefined) => {
  if (!loan) {
    return {};
  }

  const monthlyInterestRate = loan.annualInterestRate / 100 / 12;

  let currentMonth = 0;
  let balance = loan.principal;
  let totalInterestPaid = 0;
  let surplus = 0;

  const amortizationSchedule: AmortizationSchedule = [];

  while (balance > 0) {
    // Calculate interest for the month
    const interestForMonth = balance * monthlyInterestRate;

    // Apply payment to balance
    const principalPayment =
      loan.monthlyPayment + (loan.additionalPayment || 0) - interestForMonth;

    // Update total interest paid
    totalInterestPaid += interestForMonth;

    if (balance < principalPayment) {
      surplus = principalPayment - balance;
    }

    // Update balance of loan
    balance -= principalPayment;

    // Increment month
    currentMonth += 1;

    // If payment exceed balance, 0 it out.
    if (balance < 0) {
      break;
    }

    amortizationSchedule.push({
      month: currentMonth,
      balance: formatCurrency(balance),
      interestForMonth: formatCurrency(interestForMonth),
      totalInterestPaid: formatCurrency(totalInterestPaid),
    });
  }

  // Calculate payoff years/months
  const payoffYears = Math.floor(currentMonth / 12);
  const payoffMonths = currentMonth % 12;

  return {
    payoffYears,
    payoffMonths,
    totalInterestPaid: totalInterestPaid.toPrecision(3),
    surplus,
    amortizationSchedule,
  };
};
