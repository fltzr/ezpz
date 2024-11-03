import { z } from 'zod';

const selectSchema = z.object({
  label: z.string(),
  value: z.string(),
});

export const transactionSchema = z
  .object({
    date: z.string().date('A valid date is required.'),
    category: selectSchema,
    payee: z.string(),
    memo: z.string(),
    outflow: z.coerce.number({ message: 'A valid numer is required.' }),
  })
  .required({ date: true });

export type TransactionSchema = z.infer<typeof transactionSchema>;
