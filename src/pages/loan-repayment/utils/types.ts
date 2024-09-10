import { Database } from '../../../supabase';

export type LoanEntry = Database['public']['Tables']['loans']['Row'];
export type LoanEntryInsert = Database['public']['Tables']['loans']['Insert'];
export type LoanEntryUpdate = Database['public']['Tables']['loans']['Update'];
