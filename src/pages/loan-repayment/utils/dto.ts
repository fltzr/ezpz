import { LoanInputSchema } from '../schema';
import { LoanEntry } from './types';

export const toDatabaseSchema = (loan: LoanInputSchema) => ({
  principal: loan.principal,
  interest_rate: loan.annualInterestRate,
  monthly_payment: loan.monthlyPayment,
});

export const toZodSchema = (loan: LoanEntry) => ({
  principal: loan.principal,
  annualInterestRate: loan.interest_rate,
  monthlyPayment: loan.monthly_payment,
});
