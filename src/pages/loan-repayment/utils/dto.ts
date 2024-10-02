import type { LoanInputSchema } from '../schema';
import type { LoanEntry } from './types';

export const toDatabaseSchema = (loan: LoanInputSchema) => ({
  id: loan.id,
  loan_name: loan.loanName,
  principal: loan.principal,
  interest_rate: loan.annualInterestRate,
  monthly_payment: loan.monthlyPayment,
});

export const toZodSchema = (loan: LoanEntry) => ({
  id: loan.id,
  loanName: loan.loan_name,
  principal: loan.principal,
  annualInterestRate: loan.interest_rate,
  monthlyPayment: loan.monthly_payment,
  userId: loan.user_id,
  createdAt: loan.created_at,
});
