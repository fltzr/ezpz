import { SupabaseClient } from '@supabase/supabase-js';
import { createContext, PropsWithChildren, useContext } from 'react';
import { Database } from '../../supabase';
import { supabase } from '../../lib/supabase';

const SupabaseContext = createContext<SupabaseClient<Database> | undefined>(undefined);

export const SupabaseProvider = ({ children }: PropsWithChildren) => (
  <SupabaseContext.Provider value={supabase}>{children}</SupabaseContext.Provider>
);

export const useSupabase = () => {
  const context = useContext(SupabaseContext);

  if (context === undefined) {
    throw new Error('useSupabase must be used within a SupabaseProvider.');
  }

  return context;
};
