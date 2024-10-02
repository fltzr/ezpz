import type { useSupabase } from '../../../hooks/use-supabase';
import { LoanEntryInsert, LoanEntryUpdate } from '../utils/types';

export const fetchLoans = async (
  supabase: ReturnType<typeof useSupabase>,
  userId: string
) => {
  const { data, error } = await supabase.from('loans').select('*').eq('user_id', userId);

  if (error) throw new Error(`Error fetching loans: ${error.message}`);

  return data;
};

export const addLoan = async (
  supabase: ReturnType<typeof useSupabase>,
  loanData: LoanEntryInsert
) => {
  const { data, error } = await supabase.from('loans').insert(loanData).select().single();

  if (error) throw new Error(`Error adding loan: ${error.message}`);

  return data;
};

export const updateLoan = async (
  supabase: ReturnType<typeof useSupabase>,
  updates: LoanEntryUpdate
) => {
  const { error } = await supabase.from('loans').update(updates).eq('id', updates.id!);

  if (error) throw new Error(`Error updating loan: ${error.message}`);
};

export const deleteLoan = async (
  supabase: ReturnType<typeof useSupabase>,
  loanId: string
) => {
  const { error } = await supabase.from('loans').delete().eq('id', loanId);

  if (error) throw new Error(`Error deleting loan: ${error.message}`);
};
