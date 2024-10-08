import type { Database } from '@/supabase';

export type IncomeSource = Database['public']['Tables']['income_sources']['Row'];
export type IncomeSourceInsert = Omit<
  Database['public']['Tables']['income_sources']['Insert'],
  'id' | 'created_at'
>;
export type IncomeSourceUpdate = Database['public']['Tables']['income_sources']['Update'];

export type Category = Database['public']['Tables']['categories']['Row'] & {
  total?: number;
};
export type CategoryInsert = Database['public']['Tables']['categories']['Insert'];
export type CategoryUpdate = Database['public']['Tables']['categories']['Update'];

export type BudgetItem = Database['public']['Tables']['budget_items']['Row'];
export type BudgetItemInsert = Database['public']['Tables']['budget_items']['Insert'];
export type BudgetItemUpdate = Database['public']['Tables']['budget_items']['Update'];

export type BudgetTableItem = Category | BudgetItem;

export const isCategoryItem = (item: BudgetTableItem): item is Category => {
  return (item as Category).category_name !== undefined;
};

export const isBudgetItem = (item: BudgetTableItem): item is BudgetItem => {
  return (item as BudgetItem)?.category_id !== undefined;
};

export const getItemName = (item: BudgetTableItem) => {
  return isCategoryItem(item) ? item.category_name : (item?.budget_item_name ?? 'Item');
};
