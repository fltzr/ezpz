import { createContext, PropsWithChildren } from 'react';
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../../../supabase';
import { supabase } from '../../lib/supabase';

export const SupabaseContext = createContext<SupabaseClient<Database> | undefined>(
  undefined
);

export const SupabaseProvider = ({ children }: PropsWithChildren) => (
  <SupabaseContext.Provider value={supabase}>{children}</SupabaseContext.Provider>
);
