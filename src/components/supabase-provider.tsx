import { createContext, PropsWithChildren } from 'react';
import { SupabaseClient } from '@supabase/supabase-js';

import { supabase } from '../utils/supabase';
import { Database } from '../../supabase';

export const SupabaseContext = createContext<SupabaseClient<Database> | undefined>(
  undefined
);

export const SupabaseProvider = ({ children }: PropsWithChildren) => (
  <SupabaseContext.Provider value={supabase}>{children}</SupabaseContext.Provider>
);
