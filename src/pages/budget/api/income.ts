import { supabase } from '../../../lib/supabase';
import { IncomeSourceInsert, IncomeSourceUpdate } from '../utils/types';

export const fetchIncomeSources = async () => {
  const { data, error } = await supabase.from('income_sources').select('*');

  if (error) throw new Error(`Failed to fetch income sources: ${error.message}`);

  return data;
};

export const addIncomeSource = async (newIncomeSource: IncomeSourceInsert) => {
  const { data, error } = await supabase
    .from('income_sources')
    .insert(newIncomeSource)
    .select()
    .single();

  if (error) throw new Error(`Failed to insert income source: ${error.message}`);

  return data;
};

export const updateIncomeSource = async (id: string, updates: IncomeSourceUpdate) => {
  const { error } = await supabase.from('income_sources').update(updates).eq('id', id);

  if (error) throw new Error(`Failed to update income source: ${error.message}`);
};

export const deleteIncomeSource = async (id: string) => {
  const { error } = await supabase.from('income_sources').delete().eq('id', id);

  if (error) throw new Error(`Failed to delete income source: ${error.message}`);
};
