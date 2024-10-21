import type { Database } from '../../../../../supabase';

export type TransactionDB = Database['public']['Tables']['transactions']['Row'];
export type TransactionDBInsert = Database['public']['Tables']['transactions']['Insert'];
export type TransactionDBUpdate = Database['public']['Tables']['transactions']['Update'];

type CategoriesDB = Database['public']['Tables']['categories']['Row'];

export type Transaction = TransactionDB & {
  category?: Pick<CategoriesDB, 'id' | 'category_name'>;
};

export type TransactionInsert = TransactionDBInsert;
export type TransactionUpdate = { id: string } & Omit<TransactionDBUpdate, 'id'>;
