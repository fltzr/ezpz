import { LoanInputSchema } from '../schema';
import { LoanEntry } from './types';

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

/*
        "created_at": "2024-09-09T23:20:28.526914+00:00",
        "loan_name": "[PRIVATE] Sallie Mae",
        "principal": 950022,
        "interest_rate": 9.875,
        "monthly_payment": 950,
        "additional_payment": 950,
        "user_id": "2fd9daac-d6a3-478a-8fb9-0ae29752a4af",
        "id": "9774f8f9-6310-46db-8032-438a7652431f"
*/
