import type { Tables, TablesInsert, TablesUpdate } from '@/supabase';

export type TransactionDB = Tables<'transactions'>;
export type TransactionDBInsert = TablesInsert<'transactions'>;
export type TransactionDBUpdate = TablesUpdate<'transactions'>;

export type Transaction = TransactionDB & {
  category?: { id: string; name: string };
};

export type TransactionInsert = TransactionDBInsert;
export type TransactionUpdate = { id: string } & Omit<TransactionDBUpdate, 'id'>;
