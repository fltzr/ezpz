import type { Tables, TablesInsert, TablesUpdate } from '@/supabase';

export type IncomeSource = Tables<'income_sources'>;
export type IncomeSourceInsert = Omit<
  TablesInsert<'income_sources'>,
  'id' | 'created_at'
>;
export type IncomeSourceUpdate = TablesUpdate<'income_sources'>;

export type Category = Tables<'categories'> & {
  total?: number;
};
export type CategoryInsert = TablesInsert<'categories'>;
export type CategoryUpdate = TablesUpdate<'categories'>;

export type BudgetItem = Tables<'budget_items'>;
export type BudgetItemInsert = TablesInsert<'budget_items'>;
export type BudgetItemUpdate = TablesUpdate<'budget_items'>;

export type BudgetCategory = Tables<'budget_category'>;
export type BudgetCategoryInsert = TablesInsert<'budget_category'>;
export type BudgetCategoryUpdate = Omit<TablesUpdate<'budget_category'>, 'id'> & {
  id: string;
};

export type BudgetTableItem = Category | BudgetItem;
