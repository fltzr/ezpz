import { useSupabase } from '../../../common/hooks/use-supabase';
import {
  BudgetItemInsert,
  BudgetItemUpdate,
  CategoryInsert,
  CategoryUpdate,
} from '../utils/types';

export const fetchBudgetData = async (
  userId: string,
  budgetEntry: string,
  supabase: ReturnType<typeof useSupabase>
) => {
  const [
    { data: categories, error: categoriesError },
    { data: budgetItems, error: budgetItemsError },
  ] = await Promise.all([
    supabase
      .from('categories')
      .select('*')
      .eq('user_id', userId)
      .eq('budget_entry', budgetEntry),
    supabase
      .from('budget_items')
      .select('*')
      .eq('user_id', userId)
      .eq('budget_entry', budgetEntry),
  ]);

  if (categoriesError)
    throw new Error(`Failed to fetch categories: ${categoriesError.message}`);
  if (budgetItemsError)
    throw new Error(`Failed to fetch budget items: ${budgetItemsError.message}`);

  return [...categories, ...budgetItems];
};

export const addCategory = async (
  supabase: ReturnType<typeof useSupabase>,
  category: CategoryInsert
) => {
  const { data, error } = await supabase
    .from('categories')
    .insert(category)
    .select()
    .single();

  if (error) throw new Error(`Failed to add category: ${error.message}`);

  return data;
};

export const addBudgetItem = async (
  supabase: ReturnType<typeof useSupabase>,
  item: BudgetItemInsert
) => {
  const { data, error } = await supabase
    .from('budget_items')
    .insert(item)
    .select()
    .single();

  if (error) throw new Error(`Failed to add budget item: ${error.message}`);

  return data;
};

export const updateCategory = async (
  supabase: ReturnType<typeof useSupabase>,
  id: string,
  updates: CategoryUpdate
) => {
  const { error } = await supabase.from('categories').update(updates).eq('id', id);

  if (error) throw new Error(`Failed to update category: ${error.message}`);
};

export const updateBudgetItem = async (
  supabase: ReturnType<typeof useSupabase>,
  id: string,
  updates: BudgetItemUpdate
) => {
  const { error } = await supabase.from('budget_items').update(updates).eq('id', id);

  if (error) throw new Error(`Failed to update budget item: ${error.message}`);
};

export const deleteCategory = async (
  supabase: ReturnType<typeof useSupabase>,
  id: string
) => {
  const { error } = await supabase.from('categories').delete().eq('id', id);

  if (error) throw new Error(`Failed to delete category: ${error.message}`);
};

export const deleteBudgetItem = async (
  supabase: ReturnType<typeof useSupabase>,
  id: string
) => {
  const { error } = await supabase.from('budget_items').delete().eq('id', id);

  if (error) throw new Error(`Failed to delete budget item: ${error.message}`);
};