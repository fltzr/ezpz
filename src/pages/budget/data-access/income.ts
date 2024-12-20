import { useSupabase } from '@/hooks/use-supabase';

import { IncomeSourceInsert, IncomeSourceUpdate } from '../utils/api-types';

export const fetchIncomeSources = async (
  budgetEntry: string,
  supabase: ReturnType<typeof useSupabase>,
  userId?: string
) => {
  if (!userId) throw new Error('No User ID provided!');
  const orCondition = `budget_entry.eq.${budgetEntry},and(is_recurring.eq.true,budget_entry.lte.${budgetEntry})`;

  const { data, error } = await supabase
    .from('income_sources')
    .select('*')
    .eq('user_id', userId)
    .or(orCondition);

  if (error) throw new Error(`Failed to fetch income sources: ${error.message}`);

  return data;
};

export const addIncomeSource = async (
  supabase: ReturnType<typeof useSupabase>,
  newIncomeSource: IncomeSourceInsert
) => {
  const { data, error } = await supabase
    .from('income_sources')
    .insert(newIncomeSource)
    .select()
    .single();

  if (error) throw new Error(`Failed to insert income source: ${error.message}`);

  return data;
};

export const updateIncomeSource = async (
  supabase: ReturnType<typeof useSupabase>,
  id: string,
  updates: IncomeSourceUpdate
) => {
  const { error } = await supabase.from('income_sources').update(updates).eq('id', id);

  if (error) throw new Error(`Failed to update income source: ${error.message}`);
};

export const deleteIncomeSource = async (
  supabase: ReturnType<typeof useSupabase>,
  id: string
) => {
  const { error } = await supabase.from('income_sources').delete().eq('id', id);

  if (error) throw new Error(`Failed to delete income source: ${error.message}`);
};
