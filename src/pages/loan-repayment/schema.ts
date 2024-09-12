import { z } from 'zod';

export const loanInputSchema = z.object({
  principal: z.number().min(1, 'Principal amount is required.'),
  annualInterestRate: z.number().min(1, 'Annual interest rate is required.'),
  monthlyPayment: z.number().min(1, 'Monthly payment is required.'),
});

export type LoanInputSchema = z.infer<typeof loanInputSchema>;

export type AmortizationScheduleEntry = {
  month: number;
  interestPayment: string;
  principalPayment: string;
  endingBalance: string;
  totalInterestPaid?: number;
};
export type AmortizationSchedule = AmortizationScheduleEntry[];
