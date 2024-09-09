import { z } from 'zod';

export const loanInputSchema = z.object({
  principal: z.number().min(1, 'Principal amount is required.'),
  annualInterestRate: z.number().min(1, 'Annual interest rate is required.'),
  monthlyPayment: z.number().min(1, 'Monthly payment is required.'),
  additionalPayment: z.number().optional(),
});

export type LoanInputSchema = z.infer<typeof loanInputSchema>;

export type AmortizationScheduleEntry = {
  month: number;
  balance: string;
  interestForMonth: string;
  totalInterestPaid: string;
};
export type AmortizationSchedule = AmortizationScheduleEntry[];
