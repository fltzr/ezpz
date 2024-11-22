import { UseSupabase } from '@/hooks/use-supabase';

import { BudgetCategoryInsert, BudgetCategoryUpdate } from '../utils/api-types';

export const fetchBudgetCategories = async (
  supabase: UseSupabase,
  budgetEntry: string,
  userId?: string
) => {
  if (!userId) return;

  const orCondition = `budget_entry.eq.${budgetEntry},and(is_recurring.eq.true,budget_entry.lte.${budgetEntry})`;

  const { data, error } = await supabase
    .from('budget_category')
    .select('*')
    .eq('user_id', userId)
    .or(orCondition)
    .order('created_at', { ascending: false });

  if (error) throw new Error(`Error fetching budget categories. Error: ${error.message}`);

  return data;
};

export const addCategory = async (
  supabase: UseSupabase,
  record: BudgetCategoryInsert
) => {
  const { data, error } = await supabase
    .from('budget_category')
    .insert(record)
    .select()
    .single();

  if (error) throw new Error(`Error adding budget category. Error: ${error.message}`);

  return data;
};

export const updateCategory = async (
  supabase: UseSupabase,
  updates: BudgetCategoryUpdate
) => {
  const { error } = await supabase
    .from('budget_category')
    .update(updates)
    .eq('id', updates.id);

  if (error) throw new Error(`Error updating budget category. Error: ${error.message}`);
};

export const deleteCategory = async (supabase: UseSupabase, id: string) => {
  const { error } = await supabase.from('budget_category').delete().eq('id', id);

  if (error) throw new Error(`Error deleting budget category. Error: ${error.message}`);
};
