import { createContext, PropsWithChildren } from 'react';

import { SupabaseClient } from '@supabase/supabase-js';

import { supabase } from '@/utils/supabase';

import type { Database } from '../../supabase';

export const SupabaseContext = createContext<SupabaseClient<Database> | undefined>(
  undefined
);

const SupabaseProvider = ({ children }: PropsWithChildren) => (
  <SupabaseContext.Provider value={supabase}>{children}</SupabaseContext.Provider>
);

export default SupabaseProvider;
