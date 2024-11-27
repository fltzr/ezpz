import { createContext } from 'react';

import { SupabaseClient } from '@supabase/supabase-js';

import { Database } from '@/supabase';

export const SupabaseContext = createContext<SupabaseClient<Database> | undefined>(
  undefined
);
